export function formatSpotifyPlaylist(apiResponse) {
  if (!apiResponse?.items) return [];
  return apiResponse.items.map(item => ({
    id: item.id,
    name: item.name,
    tracks: item.tracks,
  }));
}
