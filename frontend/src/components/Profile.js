import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully! 🎉');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '👤';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberSince = () => {
    // You can store registration date in the future, for now use a default
    const date = new Date(2025, 10, 3); // November 3, 2025
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Background Elements */}
      <div className="profile-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>👤 Your Profile</h1>
        <p>Manage your account information</p>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Avatar */}
        <div className="profile-avatar">
          <div className="avatar-circle">
            {getInitials(user.name)}
          </div>
          <h2 className="profile-name">{user.name || 'User'}</h2>
          <p className="profile-email">{user.email || 'user@example.com'}</p>
        </div>

        {/* Profile Information */}
        <div className="profile-info">
          <h3>Account Information</h3>
          
          {isEditing ? (
            // Edit Mode
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="edit-actions">
                <button className="save-button" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="cancel-button" onClick={() => setIsEditing(false)}>
                  ✖ Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="info-row">
                <span className="info-label">👤 Name</span>
                <span className="info-value">{user.name || 'Not provided'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">📧 Email</span>
                <span className="info-value">{user.email || 'Not provided'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">📅 Member Since</span>
                <span className="info-value">{getMemberSince()}</span>
              </div>

              <div className="info-row">
                <span className="info-label">🎵 Account Type</span>
                <span className="info-value">Free Account</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}

        {/* Statistics Card */}
        <div className="profile-stats">
          <h3>Your Activity</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎵</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Quizzes Taken</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📔</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Journal Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">😊</div>
              <div className="stat-value">Happy</div>
              <div className="stat-label">Most Common Mood</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
