import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MusicPlayer.css';


const MusicPlayer = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('Happy');
  const audioRef = useRef(null);

  const moods = ['Happy', 'Sad', 'Anxious', 'Angry', 'Peaceful', 'Calm', 'Energetic'];

  useEffect(() => {
    fetchPlaylistByMood(selectedMood);
  }, [selectedMood]);

  const fetchPlaylistByMood = async (mood) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/spotify/playlist/${mood}`);
      if (response.data.tracks) {
        setCurrentPlaylist(response.data);
        if (response.data.tracks.length > 0) {
          setCurrentTrack(response.data.tracks[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = (track) => {
    if (!track.previewUrl) {
      alert('Preview not available for this track. Click "Open in Spotify" to listen!');
      return;
    }

    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.play();
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    // Auto-play next track
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        const nextTrack = currentPlaylist.tracks[currentIndex + 1];
        playTrack(nextTrack);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-container">
      <div className="music-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>🎵 Your Music Player</h1>
        <p>Listen to your favorite tracks based on mood history</p>
      </div>

      {/* Mood Selector */}
      <div className="mood-selector">
        <h3>Select Your Mood</h3>
        <div className="mood-chips">
          {moods.map(mood => (
            <button
              key={mood}
              className={`mood-chip ${selectedMood === mood ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Current Playing Track */}
      {currentTrack && (
        <div className="now-playing">
          <div className="now-playing-card">
            <img src={currentTrack.image} alt={currentTrack.name} className="track-image" />
            <div className="track-info">
              <h2>{currentTrack.name}</h2>
              <p>{currentTrack.artist}</p>
              <p className="album-name">{currentTrack.album}</p>
              <div className="player-controls">
                <button 
                  className="play-button"
                  onClick={() => playTrack(currentTrack)}
                  disabled={!currentTrack.previewUrl}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play Preview'}
                </button>
                {currentTrack.spotifyUrl && (
                  <a 
                    href={currentTrack.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="spotify-button"
                  >
                    🎧 Open in Spotify
                  </a>
                )}
              </div>
              {!currentTrack.previewUrl && (
                <p className="no-preview">⚠️ Preview not available - Open in Spotify to listen</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="playlist-section">
        <h3>
          {currentPlaylist ? `${currentPlaylist.mood} Mood Playlist` : 'Loading Playlist...'}
        </h3>
        
        {loading ? (
          <div className="loading">Loading your personalized playlist... 🎵</div>
        ) : (
          <div className="track-list">
            {currentPlaylist?.tracks.map((track, index) => (
              <div 
                key={track.id} 
                className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => playTrack(track)}
              >
                <div className="track-number">{index + 1}</div>
                <img src={track.image} alt={track.name} className="track-thumbnail" />
                <div className="track-details">
                  <h4>{track.name}</h4>
                  <p>{track.artist}</p>
                </div>
                <div className="track-duration">{formatDuration(track.duration)}</div>
                <div className="track-actions">
                  {track.previewUrl ? (
                    <button className="icon-button" onClick={(e) => {
                      e.stopPropagation();
                      playTrack(track);
                    }}>
                      {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                    </button>
                  ) : (
                    <span className="no-preview-icon" title="Preview not available">🔒</span>
                  )}
                  <a 
                    href={track.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="icon-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🎧
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};

export default MusicPlayer;
