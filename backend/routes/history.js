const express = require('express');
const router = express.Router();
const SongHistory = require('../models/SongHistory');

// POST /api/history - Save song play history
router.post('/', async (req, res) => {
  try {
    const { userId, mood, song } = req.body;

    // Validation
    if (!userId || !mood || !song) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const history = new SongHistory({
      userId,
      mood,
      song
    });

    await history.save();

    res.status(201).json({
      message: 'Song history saved successfully',
      historyId: history._id
    });
  } catch (error) {
    console.error('History save error:', error);
    res.status(500).json({ error: 'Error saving history', details: error.message });
  }
});

// GET /api/history/:userId - Get user's song history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const history = await SongHistory.find({ userId })
      .sort({ playedAt: -1 })
      .limit(limit);

    res.json({
      count: history.length,
      history
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Error fetching history', details: error.message });
  }
});

module.exports = router;
