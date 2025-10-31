const mongoose = require('mongoose');

const songHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Angry', 'Anxious', 'Peaceful', 'Calm', 'Energetic']
  },
  song: {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    url: { type: String, required: true }
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SongHistory', songHistorySchema);
