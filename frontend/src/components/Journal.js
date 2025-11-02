import React, { useState, useEffect } from 'react';
import '../styles/Journal.css';


const Journal = ({ onSave }) => {
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState('');

  const moods = [
    { type: 'happy', emoji: '😊', label: 'Happy' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'excited', emoji: '🤩', label: 'Excited' },
    { type: 'calm', emoji: '😌', label: 'Calm' },
    { type: 'anxious', emoji: '😰', label: 'Anxious' }
  ];

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(savedEntries);

    // Update date
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  };

  const submit = e => {
    e.preventDefault();
    
    if (!entry.trim()) {
      alert('Please write something in your journal! 📝');
      return;
    }

    if (!selectedMood) {
      alert('Please select a mood! 😊');
      return;
    }

    const newEntry = {
      id: Date.now(),
      text: entry,
      mood: selectedMood,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    // Call parent's onSave if provided
    onSave && onSave(newEntry);

    // Reset form
    setEntry('');
    setSelectedMood(null);
    
    showNotification('Entry saved successfully! ✨');
  };

  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      showNotification('Entry deleted');
    }
  };

  const editEntry = (id) => {
    const entryToEdit = entries.find(e => e.id === id);
    if (entryToEdit) {
      setEntry(entryToEdit.text);
      setSelectedMood(entryToEdit.mood);
      deleteEntry(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearEntry = () => {
    if (entry.trim() && !window.confirm('Are you sure you want to clear this entry?')) {
      return;
    }
    setEntry('');
    setSelectedMood(null);
  };

  const getFilteredEntries = () => {
    const now = new Date();
    
    if (filter === 'today') {
      return entries.filter(e => {
        const entryDate = new Date(e.timestamp);
        return entryDate.toDateString() === now.toDateString();
      });
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entries.filter(e => new Date(e.timestamp) >= weekAgo);
    }
    
    return entries;
  };

  const showNotification = (message) => {
    // Simple console notification - you can enhance with react-toastify
    console.log(message);
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h1>✨ My Mood Journal ✨</h1>
        <p>Express yourself, track your feelings, and reflect on your day</p>
      </div>

      <div className="journal-card card">
        <div className="mood-selector">
          {moods.map(mood => (
            <button
              key={mood.type}
              type="button"
              className={`mood-btn ${selectedMood?.type === mood.type ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood)}
              title={mood.label}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className="entry-area">
            <div className="entry-date">
              <span>📅</span>
              <span>{currentDate}</span>
            </div>
            <textarea 
              value={entry} 
              onChange={e => setEntry(e.target.value)} 
              placeholder="How are you feeling today? What's on your mind? Write freely..."
              rows={8}
            />
            <div className="char-count">
              <span>{entry.length}</span> characters
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="btn btn-save">
              💾 Save Entry
            </button>
            <button type="button" className="btn btn-clear" onClick={clearEntry}>
              🗑️ Clear
            </button>
          </div>
        </form>
      </div>

      <div className="entries-section">
        <div className="entries-header">
          <h2>📖 Past Entries</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="entries-container">
          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No entries yet</h3>
              <p>Start journaling your thoughts and feelings!</p>
            </div>
          ) : (
            filteredEntries.map(entryItem => (
              <div key={entryItem.id} className="entry-item">
                <div className="entry-header-item">
                  <div className="entry-meta">
                    <span className="entry-mood">{entryItem.mood.emoji}</span>
                    <span className="entry-timestamp">{entryItem.date}</span>
                  </div>
                  <div className="entry-actions">
                    <button 
                      className="icon-btn" 
                      onClick={() => editEntry(entryItem.id)} 
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => deleteEntry(entryItem.id)} 
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="entry-text">{entryItem.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
