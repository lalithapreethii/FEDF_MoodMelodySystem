const express = require('express');
const router = express.Router();
const { getRecommendationsByMood, searchSongsByMood } = require('../services/spotifyService');

// Fallback song database (in case Spotify API fails)
const songDatabase = {
  Happy: [
    { title: "Happy", artist: "Pharrell Williams", url: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH" },
    { title: "Good Vibrations", artist: "The Beach Boys", url: "https://open.spotify.com/track/54AJq46rWDf0KSYpUsrRRZ" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves", url: "https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0" }
  ],
  Sad: [
    { title: "Someone Like You", artist: "Adele", url: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV" },
    { title: "The Night We Met", artist: "Lord Huron", url: "https://open.spotify.com/track/7qEHsqek33rTcFNT9PFqLf" },
    { title: "Fix You", artist: "Coldplay", url: "https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q" }
  ],
  Angry: [
    { title: "Break Stuff", artist: "Limp Bizkit", url: "https://open.spotify.com/track/3e2Qu1QhsfPeyBaj9brbws" },
    { title: "Killing in the Name", artist: "Rage Against the Machine", url: "https://open.spotify.com/track/59WN2psjkt1tyaxjspN8fp" },
    { title: "Enter Sandman", artist: "Metallica", url: "https://open.spotify.com/track/1hKdDCpiI9mqz4gVwR5TQ3" }
  ],
  Anxious: [
    { title: "Breathe Me", artist: "Sia", url: "https://open.spotify.com/track/5xQFCm1cyY5bEMErfxH6Dp" },
    { title: "Weightless", artist: "Marconi Union", url: "https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6" },
    { title: "Let It Be", artist: "The Beatles", url: "https://open.spotify.com/track/7iN1s7xHE4ifF5povM6A48" }
  ],
  Peaceful: [
    { title: "Clair de Lune", artist: "Debussy", url: "https://open.spotify.com/track/1prOpKYVkBw3hTNC0JsDJl" },
    { title: "Weightless", artist: "Marconi Union", url: "https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6" },
    { title: "Holocene", artist: "Bon Iver", url: "https://open.spotify.com/track/0TxqIuzh3pOMmy7h0Gkq47" }
  ],
  Calm: [
    { title: "River Flows in You", artist: "Yiruma", url: "https://open.spotify.com/track/57EqRSwfitXHpxfJNp5AhK" },
    { title: "Spiegel im Spiegel", artist: "Arvo Pärt", url: "https://open.spotify.com/track/3ZCTVFBt2Brf31RLEnCkp4" },
    { title: "Piano Man", artist: "Billy Joel", url: "https://open.spotify.com/track/70C4NyhjD5OZUMzvWZ3njJ" }
  ],
  Energetic: [
    { title: "Eye of the Tiger", artist: "Survivor", url: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2" },
    { title: "Don't Stop Me Now", artist: "Queen", url: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7" },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", url: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS" }
  ]
};

// POST /api/recommend - Process quiz and recommend song
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== 7) {
      return res.status(400).json({ error: 'Invalid quiz answers. Expected 7 answers.' });
    }

    // Initialize mood scores
    const moodScores = {
      Happy: 0,
      Sad: 0,
      Angry: 0,
      Anxious: 0,
      Peaceful: 0,
      Calm: 0,
      Energetic: 0
    };

    // Scoring logic for each question
    const scoringRules = [
      { Happy: 3, Energetic: 2, Calm: 1, Sad: 0 },
      { Energetic: 3, Happy: 2, Calm: 1, Anxious: 0 },
      { Happy: 3, Sad: 2, Angry: 1, Anxious: 0 },
      { Energetic: 3, Calm: 2, Peaceful: 1, Sad: 0 },
      { Energetic: 3, Happy: 2, Calm: 1, Sad: 0 },
      { Happy: 3, Peaceful: 2, Angry: 1, Sad: 0 },
      { Happy: 3, Calm: 2, Anxious: 1, Sad: 0 }
    ];

    // Calculate scores
    answers.forEach((answerIndex, questionIndex) => {
      const moodIndex = ['Happy', 'Sad', 'Angry', 'Anxious', 'Peaceful', 'Calm', 'Energetic'][answerIndex];
      if (moodIndex) {
        moodScores[moodIndex] += (scoringRules[questionIndex]?.[moodIndex] || 1);
      }
    });

    // Find dominant mood
    let detectedMood = 'Happy';
    let maxScore = 0;
    for (const [mood, score] of Object.entries(moodScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedMood = mood;
      }
    }

    // Try to get songs from Spotify API first
    let recommendedSong;
    let allSongs = [];
    
    try {
      const spotifySongs = await getRecommendationsByMood(detectedMood);
      if (spotifySongs && spotifySongs.length > 0) {
        // Get random song from Spotify recommendations
        recommendedSong = spotifySongs[Math.floor(Math.random() * spotifySongs.length)];
        allSongs = spotifySongs;
        console.log('✅ Using Spotify API recommendations');
      }
    } catch (spotifyError) {
      console.log('⚠️ Spotify API failed, using fallback database');
      // Fallback to hardcoded songs
      const songsForMood = songDatabase[detectedMood] || songDatabase.Happy;
      recommendedSong = songsForMood[Math.floor(Math.random() * songsForMood.length)];
      allSongs = songsForMood;
    }

    res.json({
      detectedMood,
      moodScores,
      recommendedSong,
      allSongs: allSongs.slice(0, 5), // Return top 5 songs
      source: allSongs.length > 3 ? 'spotify' : 'database'
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Error processing recommendation', details: error.message });
  }
});

// GET /api/recommend/search - Search songs by mood
router.get('/search/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const songs = await searchSongsByMood(mood, limit);
    
    res.json({
      mood,
      count: songs.length,
      songs
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Error searching songs', details: error.message });
  }
});

module.exports = router;
