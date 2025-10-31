import { useState } from 'react';
// Placeholder hook for Spotify
export default function useSpotify() {
  const [token, setToken] = useState('');
  // Add token fetch, playlist fetch etc
  return { token, setToken };
}
