export const moodColors = {
  Happy: '#FFD93D',
  Sad: '#6B9CE6',
  Relaxed: '#A8DADC',
  Energetic: '#FF8E53',
  default: '#F9DCC4',
};
export function getMoodColor(mood) {
  return moodColors[mood] || moodColors.default;
}
