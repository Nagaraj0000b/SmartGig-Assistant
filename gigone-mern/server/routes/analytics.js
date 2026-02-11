const express = require('express');
const DailyLog = require('../models/DailyLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/summary
// @desc    Get 7-day summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Calculate metrics
    const totalEarnings = logs.reduce((sum, log) => sum + log.earnings, 0);
    const avgEarnings = logs.length > 0 ? totalEarnings / logs.length : 0;

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    logs.forEach(log => {
      sentimentCounts[log.sentiment.mood]++;
    });

    const totalLogs = logs.length;
    const avgSentimentScore = logs.length > 0
      ? logs.reduce((sum, log) => sum + log.sentiment.score, 0) / logs.length
      : 0;

    // Daily breakdown
    const dailyData = logs.map(log => ({
      date: log.date,
      earnings: log.earnings,
      mood: log.sentiment.mood,
      score: log.sentiment.score
    }));

    res.json({
      success: true,
      summary: {
        totalEarnings,
        avgEarnings: Math.round(avgEarnings),
        totalLogs,
        avgSentimentScore: avgSentimentScore.toFixed(2),
        sentimentCounts,
        dailyData
      }
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get earnings and sentiment trends
// @access  Private
router.get('/trends', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: daysAgo }
    }).sort({ date: 1 });

    // Group by date
    const trendData = {};
    logs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (!trendData[dateKey]) {
        trendData[dateKey] = {
          date: dateKey,
          earnings: 0,
          sentimentScores: [],
          count: 0
        };
      }
      trendData[dateKey].earnings += log.earnings;
      trendData[dateKey].sentimentScores.push(log.sentiment.score);
      trendData[dateKey].count++;
    });

    // Calculate averages
    const trends = Object.values(trendData).map(day => ({
      date: day.date,
      earnings: day.earnings,
      avgSentiment: day.sentimentScores.reduce((a, b) => a + b, 0) / day.count,
      logsCount: day.count
    }));

    res.json({
      success: true,
      trends
    });

  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get ML-based insights and predictions
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    const insights = [];

    // Burnout detection
    const recentLogs = logs.slice(0, 7);
    const negativeDays = recentLogs.filter(log => log.sentiment.mood === 'negative').length;
    
    if (negativeDays >= 4) {
      insights.push({
        type: 'warning',
        title: 'Burnout Risk Detected',
        message: 'You\'ve had multiple negative days recently. Consider taking a break.',
        priority: 'high'
      });
    }

    // Earnings pattern
    const avgEarnings = logs.reduce((sum, log) => sum + log.earnings, 0) / logs.length;
    const lastWeekAvg = logs.slice(0, 7).reduce((sum, log) => sum + log.earnings, 0) / 7;

    if (lastWeekAvg < avgEarnings * 0.7) {
      insights.push({
        type: 'info',
        title: 'Earnings Below Average',
        message: `Your recent earnings (₹${Math.round(lastWeekAvg)}/day) are below your average (₹${Math.round(avgEarnings)}/day).`,
        priority: 'medium'
      });
    }

    // Positive streak
    let currentStreak = 0;
    for (let log of recentLogs) {
      if (log.sentiment.mood === 'positive') currentStreak++;
      else break;
    }

    if (currentStreak >= 3) {
      insights.push({
        type: 'success',
        title: 'Great Streak!',
        message: `You're on a ${currentStreak}-day positive streak! Keep it up!`,
        priority: 'low'
      });
    }

    // Best performing days
    const dayOfWeekEarnings = {};
    logs.forEach(log => {
      const day = log.date.getDay(); // 0-6
      if (!dayOfWeekEarnings[day]) dayOfWeekEarnings[day] = [];
      dayOfWeekEarnings[day].push(log.earnings);
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDay = Object.entries(dayOfWeekEarnings)
      .map(([day, earnings]) => ({
        day: dayNames[day],
        avg: earnings.reduce((a, b) => a + b, 0) / earnings.length
      }))
      .sort((a, b) => b.avg - a.avg)[0];

    if (bestDay) {
      insights.push({
        type: 'tip',
        title: 'Best Earning Day',
        message: `${bestDay.day} is your best day with avg ₹${Math.round(bestDay.avg)}`,
        priority: 'low'
      });
    }

    res.json({
      success: true,
      insights
    });

  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
