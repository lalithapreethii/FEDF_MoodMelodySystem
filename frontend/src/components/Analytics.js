import React from 'react';

const Analytics = ({ stats }) => (
  <div className="card">
    <h2>Your Analytics</h2>
    <div>Mood Trends: {stats.moodTrends}</div>
    <div>Most Listened Playlist: {stats.topPlaylist}</div>
    {/* Add more stats as needed */}
  </div>
);

export default Analytics;
