import React from 'react';
import Navbar from './Navbar';

const Dashboard = ({ user }) => (
  <>
    <Navbar />
    <div className="dashboard">
      <h2>Welcome, {user?.email || "Music Lover"}!</h2>
      {/* Add buttons or links to MoodQuiz, Playlist, Journal, History, Analytics */}
      <div className="dashboard-links">
        <button>Take Mood Quiz</button>
        <button>Playlists</button>
        <button>Journal</button>
        <button>History</button>
        <button>Analytics</button>
      </div>
    </div>
  </>
);

export default Dashboard;
