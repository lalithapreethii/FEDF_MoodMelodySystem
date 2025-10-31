import React, { useState } from 'react';

const RatingModal = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);

  const submit = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <div className="modal">
      <h3>Rate this Playlist/Song</h3>
      {[1,2,3,4,5].map(val => (
        <button key={val} onClick={() => setRating(val)}>
          {val} ⭐
        </button>
      ))}
      <button onClick={submit} disabled={!rating}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default RatingModal;
