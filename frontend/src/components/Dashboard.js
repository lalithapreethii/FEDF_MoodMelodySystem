import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cards = [
    {
      icon: '😊',
      title: 'Take Mood Quiz',
      description: 'Discover music that matches your mood',
      route: '/mood-quiz',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: '0s'
    },
    {
      icon: '🎵',
      title: 'Music Player',
      description: 'Listen to your favorite tracks',
      route: '/music-player',  // ✅ CHANGED FROM /player TO /music-player
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      delay: '0.1s'
    },
    {
      icon: '📔',
      title: 'Mood Journal',
      description: 'Track your daily emotions',
      route: '/journal',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      delay: '0.2s'
    },
    {
      icon: '👤',
      title: 'Your Profile',
      description: 'View and edit your information',
      route: '/profile',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      delay: '0.3s'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎵</span>
          <span className="brand-text">MoodMelody</span>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Hi, {user?.name || 'User'}! 👋</span>
          <button onClick={handleLogout} className="logout-btn">
            <span>Logout</span>
            <span className="logout-icon">🚪</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, {user?.name || 'User'}! 🎵
          </h1>
          <p className="welcome-subtitle">How are you feeling today?</p>
        </div>

        <div className="cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => navigate(card.route)}
              style={{ animationDelay: card.delay }}
            >
              <div className="card-gradient" style={{ background: card.gradient }}></div>
              <div className="card-content">
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <div className="card-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
