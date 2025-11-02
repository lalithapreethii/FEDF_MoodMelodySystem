require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Atlas Connected Successfully');
  console.log('🗄️  Database: mood_song_db');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Import routes
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const journalRoutes = require('./routes/journal');
const recommendRoutes = require('./routes/recommend');
const spotifyRoutes = require('./routes/spotify'); // ✅ SPOTIFY ROUTE

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/spotify', spotifyRoutes); // ✅ REGISTER SPOTIFY ROUTE

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!' 
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Mood Song App API',
    endpoints: {
      auth: '/api/auth',
      history: '/api/history',
      journal: '/api/journal',
      recommend: '/api/recommend',
      spotify: '/api/spotify/playlist/:mood',
      test: '/api/test'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/`);
  console.log(`🎵 Spotify Test: http://localhost:${PORT}/api/spotify/playlist/Happy`);
  console.log('═══════════════════════════════════════');
});
