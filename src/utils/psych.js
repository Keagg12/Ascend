export const calculatePsychDrain = (streak, difficulty) => {
  // Logic to calculate mental drain based on habit difficulty and current streak
  return (difficulty * 5) - (streak * 0.5);
};

export const canPerformHabit = (psych, cost) => {
  return psych >= cost;
};
