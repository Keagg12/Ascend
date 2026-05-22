export const getMoodColor = (score) => {
  if (score > 80) return '#10b981'; // Green
  if (score > 50) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

export const getMoodEmoji = (score) => {
  if (score > 80) return '🔥';
  if (score > 50) return '😐';
  return '💀';
};
