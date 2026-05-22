/**
 * BOSS_CHALLENGES
 * Rotate weekly (indexed by Math.floor(weekTimestamp / ms_per_week) % length).
 * Each challenge:
 *   label — display name shown in the boss banner
 *   tasks — array of habit IDs that must ALL be completed on that day
 *   bonus — bonus XP awarded when all tasks are complete
 */
export const BOSS_CHALLENGES = [
  {
    label: 'The Discipline Gauntlet',
    tasks: ['gym', 'meditate', 'deepwork', 'read'],
    bonus: 200,
  },
  {
    label: "The Monk's Trial",
    tasks: ['meditate', 'speech', 'read', 'sleep'],
    bonus: 180,
  },
  {
    label: 'The Iron Hour',
    tasks: ['gym', 'surya', 'walk', 'eat'],
    bonus: 190,
  },
  {
    label: 'The Mind Fortress',
    tasks: ['deepwork', 'read', 'speech', 'cold'],
    bonus: 210,
  },
]

/**
 * isBossDay(dateString) → boolean
 * Returns true if the given date (YYYY-MM-DD) is a Sunday.
 */
export function isBossDay(dateStr) {
  return new Date(dateStr + 'T12:00:00').getDay() === 0
}

/**
 * getBossChallenge(dateString) → BOSS_CHALLENGES entry
 * Returns the boss challenge for the week containing the given date.
 */
export function getBossChallenge(dateStr) {
  const MS_PER_WEEK = 604800000
  const idx =
    Math.floor(new Date(dateStr + 'T12:00:00').getTime() / MS_PER_WEEK) %
    BOSS_CHALLENGES.length
  return BOSS_CHALLENGES[idx]
}