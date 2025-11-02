const axios = require('axios');

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get Access Token (Client Credentials Flow)
  async getAccessToken() {
    try {
      // Return cached token if still valid
      if (this.accessToken && this.tokenExpiry > Date.now()) {
        return this.accessToken;
      }

      // Get new token
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      console.log('✅ Spotify Access Token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Spotify Token Error:', error.response?.data || error.message);
      throw new Error('Failed to get Spotify access token');
    }
  }

  // Search for tracks
  async searchTracks(query, limit = 10) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: query,
          type: 'track',
          limit: limit
        }
      });

      return response.data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0]?.url,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms
      }));
    } catch (error) {
      console.error('❌ Spotify Search Error:', error.response?.data || error.message);
      throw new Error('Failed to search tracks');
    }
  }

  // Get recommendations based on mood
  async getRecommendationsByMood(mood, limit = 10) {
    try {
      const token = await this.getAccessToken();

      // Mood to Spotify audio features mapping
      const moodFeatures = {
        happy: { valence: 0.8, energy: 0.7, mode: 1 },
        sad: { valence: 0.3, energy: 0.4, mode: 0 },
        energetic: { valence: 0.7, energy: 0.9, mode: 1 },
        chill: { valence: 0.5, energy: 0.3, mode: 1 }
      };

      const features = moodFeatures[mood.toLowerCase()] || moodFeatures.happy;

      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          seed_genres: 'pop,indie,alternative',
          target_valence: features.valence,
          target_energy: features.energy,
          mode: features.mode,
          limit: limit
        }
      });

      return response.data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0]?.url,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms
      }));
    } catch (error) {
      console.error('❌ Spotify Recommendations Error:', error.response?.data || error.message);
      throw new Error('Failed to get recommendations');
    }
  }

  // Get track details
  async getTrackDetails(trackId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const track = response.data;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0]?.url,
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        popularity: track.popularity
      };
    } catch (error) {
      console.error('❌ Spotify Track Details Error:', error.response?.data || error.message);
      throw new Error('Failed to get track details');
    }
  }
}

module.exports = new SpotifyService();
