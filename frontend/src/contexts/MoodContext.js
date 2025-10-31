import React, { createContext, useState, useContext } from 'react';
const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState('Happy');
  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
};
export const useMood = () => useContext(MoodContext);
