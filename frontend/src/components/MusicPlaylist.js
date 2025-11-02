import React, { useState, useEffect } from 'react';
import '../styles/MusicPlaylist.css';

const MusicPlaylist = ({ mood }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mood) {
      fetchSpotifyPlaylist();
    }
  }, [mood]);

  const fetchSpotifyPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎵 Fetching playlist for mood:', mood);
      const apiUrl = `http://localhost:5000/api/spotify/playlist/${mood}`;
      console.log('📡 API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Received tracks:', data.tracks.length);
      
      setTracks(data.tracks);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="playlist-container">
        <div className="playlist-card">
          <div className="loading">
            <div className="loading-spinner"></div>
            <h2>🎵 Loading your {mood} playlist...</h2>
            <p>Connecting to Spotify...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playlist-container">
        <div className="playlist-card">
          <div className="error">
            <h2>😕 Oops! Something went wrong</h2>
            <p style={{ color: '#ff5454', fontWeight: 'bold', marginBottom: '20px' }}>
              {error}
            </p>
            <div style={{ 
              padding: '15px', 
              background: 'rgba(255,84,84,0.1)', 
              borderRadius: '12px', 
              fontSize: '14px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <strong>Debug Info:</strong>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Mood: <code>{mood}</code></li>
                <li>Backend: <code>http://localhost:5000</code></li>
                <li>Test directly: <a href={`http://localhost:5000/api/spotify/playlist/${mood}`} target="_blank" rel="noopener noreferrer">Click here</a></li>
              </ul>
            </div>
            <button className="retake-btn" onClick={() => window.location.reload()}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <div className="playlist-card">
        <h1 className="playlist-title">🎵 Your {mood} Playlist</h1>
        <p className="playlist-subtitle">
          Powered by Spotify • {tracks.length} tracks curated for your mood
        </p>
        
        <div className="songs-list">
          {tracks.map((track) => (
            <div key={track.id} className="song-card">
              <img 
                src={track.image} 
                alt={track.name}
                className="song-image"
              />
              <div className="song-info">
                <div className="song-name">{track.name}</div>
                <div className="song-artist">{track.artist}</div>
              </div>
              <a 
                href={track.spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="play-btn"
              >
                ▶️ Play
              </a>
            </div>
          ))}
        </div>

        <button 
          className="retake-btn"
          onClick={() => window.location.reload()}
        >
          🔄 Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default MusicPlaylist;
