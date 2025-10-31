import axios from 'axios';
export const getPlaylists = async token => {
  const res = await axios.get('/api/spotify/playlists', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
