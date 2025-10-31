import React, { useState } from 'react';

const Playlist = ({ playlists, onRate }) => (
  <div>
    <h2>Your Playlists</h2>
    {playlists.map((pl, idx) => (
      <div className="card" key={pl.id}>
        <h4>{pl.name}</h4>
        <button onClick={() => onRate(pl.id)}>Rate Playlist</button>
      </div>
    ))}
  </div>
);

export default Playlist;
