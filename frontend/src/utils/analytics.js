export function getMoodStats(history) {
  // Example: counts occurrence of each mood
  const stats = {};
  history.forEach(item => {
    stats[item.mood] = (stats[item.mood] || 0) + 1;
  });
  return stats;
}
