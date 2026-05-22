export const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const xpForNextLevel = (level) => {
  return Math.pow(level, 2) * 100;
};

export const getProgress = (xp, level) => {
  const currentLevelXp = xpForNextLevel(level - 1);
  const nextLevelXp = xpForNextLevel(level);
  return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
};
