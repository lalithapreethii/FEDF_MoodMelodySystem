import { useState, useEffect } from 'react';
export default function useAnalytics(userId) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    // Fetch analytics from server
    setStats({ topPlaylist: 'Chill Vibes', moodTrends: 'Happy, Relaxed' });
  }, [userId]);
  return stats;
}
