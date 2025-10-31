import React, { useState } from 'react';
import './styles/App.css';
import MoodQuiz from './components/MoodQuiz';
import Journal from './components/Journal';
import { getMoodRecommendation, saveJournal } from './services/apiService';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [moodResult, setMoodResult] = useState(null);
  const [song, setSong] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);

  // Handles the mood quiz submit for recommendation
  async function handleMoodSubmit(moodData) {
    // moodData contains: { detectedMood, answers, scores }
    setMoodResult(moodData.detectedMood);
    const recommendedSong = await getRecommendedSong(moodData.detectedMood);
    setSong(recommendedSong);
  }

  // Handles saving the journal entry
  function handleJournalSave(entry) {
    saveJournal(entry);
    setJournalEntries([...journalEntries, entry]);
  }

  // Handle Login
  function handleLogin(userData) {
    setUser(userData);
  }

  // Handle Signup
  function handleSignup(userData) {
    setUser(userData);
    setShowSignup(false);
  }

  // Show Signup page if user clicks signup
  if (!user && showSignup) {
    return <Signup onSignup={handleSignup} goToLogin={() => setShowSignup(false)} />;
  }

  // Show Login page if NOT logged in
  if (!user) {
    return <Login onLogin={handleLogin} goToSignup={() => setShowSignup(true)} />;
  }

  // Main app after login
  return (
    <div className="app-container">
      <h1>Mood-Based Song Recommender</h1>
      <p>Welcome, {user.email}!</p>
      
      {!song && <MoodQuiz submitMood={handleMoodSubmit} />}
      
      {song && (
        <div>
          <h3>Recommended Song: {song}</h3>
          <Journal mood={moodResult} song={song} onSave={handleJournalSave} />
        </div>
      )}
      
      <div>
        <h3>Your Journal Entries:</h3>
        <ul>
          {journalEntries.map((entry, index) => (
            <li key={index}>
              <strong>{entry.date}: </strong>{entry.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
