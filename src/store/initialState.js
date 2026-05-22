export const initialState = {
  user: {
    name: 'Seeker',
    level: 1,
    xp: 0,
    maxXp: 100,
    rank: 'Initiate',
    hp: 100,
    maxHp: 100,
    psych: 80, // Psychological health/mana
  },
  habits: [],
  achievements: [],
  history: [],
  stats: {
    totalHabitsCompleted: 0,
    streaks: 0,
  }
};
