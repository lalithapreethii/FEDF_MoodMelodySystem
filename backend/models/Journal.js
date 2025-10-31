const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  detectedMood: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Angry', 'Anxious', 'Peaceful', 'Calm', 'Energetic']
  },
  moodScores: {
    Happy: { type: Number, default: 0 },
    Sad: { type: Number, default: 0 },
    Angry: { type: Number, default: 0 },
    Anxious: { type: Number, default: 0 },
    Peaceful: { type: Number, default: 0 },
    Calm: { type: Number, default: 0 },
    Energetic: { type: Number, default: 0 }
  },
  recommendedSong: {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    url: { type: String, required: true }
  },
  journalText: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journal', journalSchema);
