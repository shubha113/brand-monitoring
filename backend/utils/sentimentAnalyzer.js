import Sentiment from "sentiment";

const sentiment = new Sentiment();

export const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);

  let sentimentLabel;
  if (result.score > 0) {
    sentimentLabel = "positive";
  } else if (result.score < 0) {
    sentimentLabel = "negative";
  } else {
    sentimentLabel = "neutral";
  }

  return {
    sentiment: sentimentLabel,
    score: result.score,
  };
};


export const extractKeywords = (text) => {
  const stopWords = [
    "the",
    "is",
    "at",
    "which",
    "on",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "with",
    "to",
    "for",
  ];
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];

  const keywords = words
    .filter((word) => word.length > 3 && !stopWords.includes(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};


export const categorizeTopic = (text, keywords) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('product') || lowerText.includes('feature') || lowerText.includes('launch')) {
        return 'product';
    } else if (lowerText.includes('service') || lowerText.includes('support') || lowerText.includes('help')) {
        return 'customer_service';
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive')) {
        return 'pricing';
    } else if (lowerText.includes('quality') || lowerText.includes('good') || lowerText.includes('bad')) {
        return 'quality';
    } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
        return 'delivery';
    } else {
        return 'general';
    }
};