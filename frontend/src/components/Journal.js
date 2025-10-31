import React, { useState } from 'react';

const Journal = ({ onSave }) => {
  const [entry, setEntry] = useState('');

  const submit = e => {
    e.preventDefault();
    onSave && onSave({ date: new Date().toLocaleDateString(), text: entry });
    setEntry('');
  };

  return (
    <form className="card" onSubmit={submit}>
      <textarea 
        value={entry} 
        onChange={e=>setEntry(e.target.value)} 
        placeholder="Write your thoughts..."
        rows={4}
      />
      <button type="submit">Save Entry</button>
    </form>
  );
};
export default Journal;
