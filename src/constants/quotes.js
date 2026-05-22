/**
 * DAILY_QUOTES
 * Rotated by day-of-week index (0–6) on the dashboard.
 */
export const DAILY_QUOTES = [
  'The man who moves a mountain begins by carrying away small stones.',
  'Discipline is the bridge between goals and accomplishment.',
  'Every day is a new level. You choose how to play it.',
  'Your character is built in the moments no one is watching.',
  'The warrior is not the one who always wins — it is the one who always rises.',
  'Push yourself. No one else is going to do it for you.',
  'Small steps, taken consistently, become giant leaps.',
]

/**
 * FOCUS_QUOTES
 * Shown in Focus Mode. Rotated by hour.
 */
export const FOCUS_QUOTES = [
  'Lock in. Zero distractions. This is your moment.',
  'The mind that bends to discipline is unbreakable.',
  'One task. All of you. Right now.',
  'Silence is the gym for the mind.',
  'Earn today. Rest tomorrow.',
]

/**
 * RECOVERY_TIPS
 * Shown when Recovery Mode is active. Rotated by day-of-week.
 */
export const RECOVERY_TIPS = [
  "Start small. One glass of water. One deep breath. You're still in the game.",
  "You don't have to be perfect — just show up today.",
  'Every legend has fallen. The difference is they always got back up.',
  'Recovery Mode: half the goals, all the momentum.',
  "The chain isn't broken. One link at a time.",
]

/**
 * WEEKLY_INSIGHTS
 * Array of (history: HistoryEntry[]) => string functions.
 * history = last 7 days from state.history.
 */
export const WEEKLY_INSIGHTS = [
  (history) => {
    if (!history.length) return 'Keep logging to unlock insights!'
    const positiveDays = history.filter((h) => (h.xpEarned || 0) > 0).length
    return positiveDays > history.length * 0.6
      ? 'Elite trajectory — above average most days.'
      : 'Consistency is building — keep the chain alive.'
  },
  (history) => {
    const moodDays = history.filter((h) => h.mood)
    if (!moodDays.length) return 'Log mood daily to unlock pattern insights.'
    const avg = moodDays.reduce((a, h) => a + h.mood, 0) / moodDays.length
    return avg >= 7
      ? 'Mood is strong. Protect your morning routines.'
      : 'Mood dipping — check sleep and screen time first.'
  },
  (history) => {
    const highTaskDays = history.filter((h) => (h.tasks || 0) >= 3)
    return highTaskDays.length
      ? `You dominate on days with 3+ tasks (${highTaskDays.length}/${history.length} days). Make that the floor.`
      : 'Complete 3+ tasks daily to unlock your peak performance state.'
  },
]