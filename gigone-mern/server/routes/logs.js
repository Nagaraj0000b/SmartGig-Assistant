const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const DailyLog = require('../models/DailyLog');
const { protect } = require('../middleware/auth');
const { analyzeSentiment } = require('../utils/sentiment');
const { generateRecommendations } = require('../utils/recommendations');

const router = express.Router();

// Configure multer for audio uploads
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/logs/transcribe
// @desc    Transcribe audio using Whisper service
// @access  Private
router.post('/transcribe', protect, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Send audio to Python Whisper service
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(req.file.path));

    const whisperServiceUrl = process.env.WHISPER_SERVICE_URL || 'http://localhost:5001';
    
    const whisperResponse = await axios.post(
      `${whisperServiceUrl}/translate`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000 // 30 second timeout
      }
    );

    const englishText = whisperResponse.data.text;

    // Analyze sentiment
    const sentiment = analyzeSentiment(englishText);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      englishText,
      sentiment: {
        score: sentiment.score,
        mood: sentiment.mood,
        keywords: sentiment.keywords
      },
      earnings: sentiment.earnings
    });

  } catch (error) {
    console.error('Transcription error:', error.message);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Whisper service unavailable. Please try again later.' 
      });
    }

   res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/logs/save
// @desc    Save daily log
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const { transcript, englishText, sentiment, earnings, metadata } = req.body;

    if (!englishText) {
      return res.status(400).json({ error: 'English text is required' });
    }

    // Get recent logs for recommendations
    const recentLogs = await DailyLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    // Generate recommendations
    const recommendations = generateRecommendations(sentiment, earnings, recentLogs);

    // Create log
    const log = await DailyLog.create({
      userId: req.user._id,
      transcript: transcript || englishText,
      englishText,
      sentiment,
      earnings: earnings || 0,
      metadata: metadata || {},
      recommendations
    });

    res.status(201).json({
      success: true,
      log
    });

  } catch (error) {
    console.error('Save log error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/logs/history
// @desc    Get user's log history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { limit = 30, skip = 0 } = req.query;

    const logs = await DailyLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await DailyLog.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      logs,
      total,
      hasMore: total > (parseInt(skip) + logs.length)
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/logs/:id
// @desc    Get specific log
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const log = await DailyLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json({
      success: true,
      log
    });

  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/logs/:id
// @desc    Delete log
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await DailyLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json({
      success: true,
      message: 'Log deleted successfully'
    });

  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
