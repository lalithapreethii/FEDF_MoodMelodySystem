const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Get Spotify Access Token
async function getSpotifyToken() {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        }
      }
    );
    console.log('✅ Got Spotify token');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error getting Spotify token:', error.message);
    throw error;
  }
}

// Mood to Spotify Search Keywords
const moodKeywords = {
  Happy: 'happy upbeat energetic pop feel good',
  Sad: 'sad melancholic emotional ballad heartbreak',
  Anxious: 'calm relaxing meditation peaceful zen',
  Angry: 'rock metal aggressive intense rage',
  Peaceful: 'acoustic chill peaceful serene nature',
  Calm: 'ambient sleep calm meditation yoga',
  Energetic: 'workout motivation energetic pump hype'
};

// TEST ROUTE
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Spotify route is working!',
    clientId: CLIENT_ID ? 'Set' : 'Missing'
  });
});

// Get Playlist by Mood
router.get('/playlist/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    console.log(`🎵 Fetching playlist for mood: ${mood}`);
    
    const token = await getSpotifyToken();
    const searchQuery = moodKeywords[mood] || 'chill';
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        q: searchQuery,
        type: 'track',
        limit: 10,
        market: 'US'
      }
    });

    const tracks = response.data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      image: track.album.images[0]?.url || 'https://via.placeholder.com/300',
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
      duration: Math.floor(track.duration_ms / 1000)
    }));

    console.log(`✅ Found ${tracks.length} tracks for ${mood}`);
    res.json({ success: true, mood, tracks });
  } catch (error) {
    console.error('❌ Spotify API error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch playlist',
      error: error.message 
    });
  }
});

module.exports = router;
