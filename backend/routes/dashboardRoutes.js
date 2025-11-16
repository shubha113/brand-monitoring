import express from 'express';
import { getDashboardStats, getRecentActivity, getSentimentTrend, getSpikeAlerts, getTopKeywords } from '../controller/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/stats - Get overall statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/sentiment-trend - Get sentiment trend over time
router.get('/sentiment-trend', getSentimentTrend);

// GET /api/dashboard/spike-alerts - Get conversation spike alerts
router.get('/spike-alerts', getSpikeAlerts);

// GET /api/dashboard/keywords - Get top keywords
router.get('/keywords', getTopKeywords);

// GET /api/dashboard/recent - Get recent activity
router.get('/recent', getRecentActivity);

export default router;