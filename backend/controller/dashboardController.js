import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Mention from "../models/Mention.js";
import { detectSpikes } from "../services/dataAggregator.js";

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  const { timeRange = 7 } = req.query;

  const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);

  const totalMentions = await Mention.countDocuments({
    publishedAt: { $gte: startDate },
  });

  const sentimentStats = await Mention.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    { $group: { _id: "$sentiment", count: { $sum: 1 } } },
  ]);

  const sourceStats = await Mention.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);

  const topicStats = await Mention.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    { $group: { _id: "$topic", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalMentions,
      sentimentBreakdown: sentimentStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      sourceBreakdown: sourceStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topTopics: topicStats.map((item) => ({
        topic: item._id,
        count: item.count,
      })),
    },
  });
});


export const getSentimentTrend = catchAsyncError(async (req, res, next) => {
    const { timeRange = 7 } = req.query;
    
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
    
    const trend = await Mention.aggregate([
        { $match: { publishedAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" } },
                    sentiment: "$sentiment"
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.date": 1 } }
    ]);
    
    const formattedTrend = trend.reduce((acc, item) => {
        const date = item._id.date;
        if (!acc[date]) {
            acc[date] = { date, positive: 0, negative: 0, neutral: 0 };
        }
        acc[date][item._id.sentiment] = item.count;
        return acc;
    }, {});
    
    res.status(200).json({
        success: true,
        data: Object.values(formattedTrend)
    });
});


// Get spike alerts
export const getSpikeAlerts = catchAsyncError(async (req, res, next) => {
    const spikeData = await detectSpikes(24);
    
    res.status(200).json({
        success: true,
        data: spikeData
    });
});


// Get top keywords
export const getTopKeywords = catchAsyncError(async (req, res, next) => {
    const { timeRange = 7, limit = 20 } = req.query;
    
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
    
    const keywords = await Mention.aggregate([
        { $match: { publishedAt: { $gte: startDate } } },
        { $unwind: "$keywords" },
        { $group: { _id: "$keywords", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) }
    ]);
    
    res.status(200).json({
        success: true,
        data: keywords.map(item => ({
            keyword: item._id,
            count: item.count
        }))
    });
});


// Get recent activity timeline
export const getRecentActivity = catchAsyncError(async (req, res, next) => {
    const { limit = 10 } = req.query;
    
    const recentMentions = await Mention.find()
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit))
        .select('source content sentiment publishedAt author');
    
    res.status(200).json({
        success: true,
        data: recentMentions
    });
});
