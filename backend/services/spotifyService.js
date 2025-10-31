const axios = require('axios');

// Validate environment variables
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing required Spotify API credentials');
}

// Spotify API credentials from environment
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Rate limiting variables
let requestCount = 0;
let lastReset = Date.now();
const REQUEST_LIMIT = 100; // per minute

function checkRateLimit() {
  const now = Date.now();
  if (now - lastReset > 60000) {
    requestCount = 0;
    lastReset = now;
  }
  if (requestCount >= REQUEST_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  requestCount++;
}

// Cache for access token
let accessToken = null;
let tokenExpiry = null;

// Get Spotify Access Token
async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('Failed to authenticate with Spotify');
  }
}

// Search for songs by mood keywords
async function searchSongsByMood(mood, limit = 10) {
  // Input validation
  const validMoods = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Peaceful', 'Calm', 'Energetic'
  ];
  if (!validMoods.includes(mood)) {
    throw new Error(`Invalid mood. Must be one of: ${validMoods.join(', ')}`);
  }
  checkRateLimit();

  try {
    const token = await getAccessToken();
    
    // Map moods to search keywords
    const moodKeywords = {
      Happy: 'happy upbeat joyful dance',
      Sad: 'sad melancholy emotional',
      Angry: 'angry aggressive intense metal',
      Anxious: 'anxious tense stressed edgy',
      Peaceful: 'peaceful ambient meditation',
      Calm: 'calm relaxing soothing',
      Energetic: 'energetic workout pump motivation'
    };

    const searchQuery = moodKeywords[mood] || 'music';

    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        params: {
          q: searchQuery,
          type: 'track',
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Format the response
    return response.data.tracks.items.map(track => ({
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify,
      albumImage: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      spotifyId: track.id
    }));
  } catch (error) {
    console.error('Error searching songs:', error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('Failed to search songs on Spotify');
  }
}

// Get song recommendations based on mood
async function getRecommendationsByMood(mood) {
  // Input validation
  const validMoods = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Peaceful', 'Calm', 'Energetic'
  ];
  if (!validMoods.includes(mood)) {
    throw new Error(`Invalid mood. Must be one of: ${validMoods.join(', ')}`);
  }
  checkRateLimit();

  try {
    const token = await getAccessToken();
    
    // Seed tracks for different moods (popular track IDs)
    const seedTracks = {
      Happy: '60nZcImufyMA1MKQY3dcCH', // Happy - Pharrell Williams
      Sad: '1zwMYTA5nlNjZxYrvBB2pV', // Someone Like You - Adele
      Angry: '59WN2psjkt1tyaxjspN8fp', // Killing in the Name - RATM
      Anxious: '7LVHVU3tWfcxj5aiPFEW4Q', // Fix You - Coldplay
      Peaceful: '1prOpKYVkBw3hTNC0JsDJl', // Clair de Lune
      Calm: '57EqRSwfitXHpxfJNp5AhK', // River Flows in You - Yiruma
      Energetic: '2KH16WveTQWT6KOG9Rg6e2' // Eye of the Tiger
    };

    const seedTrack = seedTracks[mood] || seedTracks.Happy;

    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        params: {
          seed_tracks: seedTrack,
          limit: 10
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.tracks.map(track => ({
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify,
      albumImage: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      spotifyId: track.id
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error.message);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('Failed to get Spotify recommendations');
  }
}

module.exports = {
  getAccessToken,
  searchSongsByMood,
  getRecommendationsByMood
};