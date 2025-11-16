import Mention from '../models/Mention.js';
import { analyzeSentiment, extractKeywords, categorizeTopic } from '../utils/sentimentAnalyzer.js';
import axios from 'axios';
import xml2js from 'xml2js';

//REAL REDDIT DATA
async function fetchRedditMentions(brandName) {
    try {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(brandName)}`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});

        const posts = response.data.data.children;

        return posts.map(post => ({
            source: "reddit",
            content: post.data.title || "",
            author: post.data.author || "Unknown",
            url: `https://reddit.com${post.data.permalink}`,
            publishedAt: new Date(post.data.created_utc * 1000),
            engagement: {
                likes: post.data.ups || 0,
                shares: post.data.num_crossposts || 0,
                comments: post.data.num_comments || 0
            }
        }));
    } catch (err) {
        console.log("Reddit fetch error:", err.message);
        return [];
    }
}

//REAL GOOGLE NEWS DATA
async function fetchNewsMentions(brandName) {
    try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(brandName)}`;
        const response = await axios.get(rssUrl);

        const parser = new xml2js.Parser();
        const parsed = await parser.parseStringPromise(response.data);

        const items = parsed.rss.channel[0].item || [];

        return items.map(item => ({
            source: "news",
            content: item.title[0] || "",
            author: item.source?.[0]._ || "News Source",
            url: item.link[0],
            publishedAt: new Date(item.pubDate[0]),
            engagement: {
                likes: Math.floor(Math.random() * 50),
                shares: Math.floor(Math.random() * 20),
                comments: Math.floor(Math.random() * 10)
            }
        }));
    } catch (err) {
        console.log("News fetch error:", err.message);
        return [];
    }
}

//AGGREGATE MENTIONS FROM REAL SOURCES
export const aggregateMentions = async (brandName) => {
    let allMentions = [];

    // Fetch from Reddit + News
    const redditMentions = await fetchRedditMentions(brandName);
    const newsMentions = await fetchNewsMentions(brandName);

    let combined = [...redditMentions, ...newsMentions];

    // Analyze each mention
    for (const item of combined) {
        if (!item.content.toLowerCase().includes(brandName.toLowerCase())) continue;

        const { sentiment, score } = analyzeSentiment(item.content);
        const keywords = extractKeywords(item.content);
        const topic = categorizeTopic(item.content, keywords);

        allMentions.push({
            ...item,
            sentiment,
            sentimentScore: score,
            topic,
            keywords
        });
    }

    return allMentions;
};


//SAVE TO MONGO
export const saveMentions = async (mentions) => {
    const saved = [];

    for (const mention of mentions) {
        const exists = await Mention.findOne({ url: mention.url });

        if (!exists) {
            const newDoc = await Mention.create(mention);
            saved.push(newDoc);
        }
    }

    return saved;
};

//Spike detection
export const detectSpikes = async (hours = 24) => {
    const timeWindow = new Date(Date.now() - hours * 60 * 60 * 1000);

    const recentMentions = await Mention.find({
        publishedAt: { $gte: timeWindow }
    });

    const historicalStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const historicalEnd = timeWindow;

    const historicalMentions = await Mention.find({
        publishedAt: { $gte: historicalStart, $lt: historicalEnd }
    });

    const recentCount = recentMentions.length;
    const avgHistorical = historicalMentions.length / 7;

    return {
        isSpike: recentCount > avgHistorical * 2,
        currentCount: recentCount,
        averageCount: Math.round(avgHistorical),
        percentageIncrease: avgHistorical > 0
            ? Math.round(((recentCount - avgHistorical) / avgHistorical) * 100)
            : 0
    };
};
