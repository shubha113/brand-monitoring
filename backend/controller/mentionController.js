import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { aggregateMentions, saveMentions } from "../services/dataAggregator.js";
import Mention from "../models/Mention.js";

// Fetch mentions from external sources and save to DB
export const fetchAndSaveMentions = catchAsyncError(async (req, res, next) => {
  const { brandName } = req.body;

  if (!brandName) {
    return next(new ErrorHandler("Brand name is required", 400));
  }

  const mentions = await aggregateMentions(brandName);

  const savedMentions = await saveMentions(mentions);

  res.status(200).json({
    success: true,
    message: `Fetched ${mentions.length} mentions, saved ${savedMentions.length} new mentions`,
    data: savedMentions,
  });
});

// Get all mentions with filters
export const getMentions = catchAsyncError(async (req, res, next) => {
  const {
    source,
    sentiment,
    topic,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (source) query.source = source;
  if (sentiment) query.sentiment = sentiment;
  if (topic) query.topic = topic;
  if (startDate || endDate) {
    query.publishedAt = {};
    if (startDate) query.publishedAt.$gte = new Date(startDate);
    if (endDate) query.publishedAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const mentions = await Mention.find(query)
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Mention.countDocuments(query);

  res.status(200).json({
    success: true,
    data: mentions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

// Get single mention by ID
export const getMentionById = catchAsyncError(async (req, res, next) => {
  const mention = await Mention.findById(req.params.id);

  if (!mention) {
    return next(new ErrorHandler("Mention not found", 404));
  }

  res.status(200).json({
    success: true,
    data: mention,
  });
});

// Delete mention
export const deleteMention = catchAsyncError(async (req, res, next) => {
  const mention = await Mention.findById(req.params.id);

  if (!mention) {
    return next(new ErrorHandler("Mention not found", 404));
  }

  await mention.deleteOne();

  res.status(200).json({
    success: true,
    message: "Mention deleted successfully",
  });
});
