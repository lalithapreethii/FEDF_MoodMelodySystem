const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// POST /api/journal - Save journal entry
router.post('/', async (req, res) => {
  try {
    const { userId, detectedMood, moodScores, recommendedSong, journalText } = req.body;

    // Validation
    if (!userId || !detectedMood || !recommendedSong) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const journal = new Journal({
      userId,
      detectedMood,
      moodScores,
      recommendedSong,
      journalText: journalText || ''
    });

    await journal.save();

    res.status(201).json({
      message: 'Journal entry saved successfully',
      journalId: journal._id,
      entry: journal
    });
  } catch (error) {
    console.error('Journal save error:', error);
    res.status(500).json({ error: 'Error saving journal', details: error.message });
  }
});

// GET /api/journal/:userId - Get user's journal entries
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const journals = await Journal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      count: journals.length,
      journals
    });
  } catch (error) {
    console.error('Journal fetch error:', error);
    res.status(500).json({ error: 'Error fetching journals', details: error.message });
  }
});

module.exports = router;
