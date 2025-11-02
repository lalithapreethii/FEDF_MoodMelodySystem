import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Playlist from './components/MusicPlaylist';
import MoodQuiz from './components/MoodQuiz';
import MusicPlayer from './components/MusicPlayer';  // ✅ NEW IMPORT
import Journal from './components/Journal';
import Profile from './components/Profile';
import './styles/App.css';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== '';
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/playlist" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
          <Route path="/mood-quiz" element={<ProtectedRoute><MoodQuiz /></ProtectedRoute>} />
          <Route path="/music-player" element={<ProtectedRoute><MusicPlayer /></ProtectedRoute>} />  {/* ✅ NEW ROUTE */}
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="*" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
