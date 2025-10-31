import React from 'react';

const History = ({ history }) => (
  <div className="card">
    <h2>Quiz & Playlist History</h2>
    <ul>
      {history.map((item, idx) => (
        <li key={idx}>
          <strong>{item.date}:</strong> {item.mood} - {item.playlist}
        </li>
      ))}
    </ul>
  </div>
);

export default History;
