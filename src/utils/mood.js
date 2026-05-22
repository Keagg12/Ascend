/**
 * mood.js — Mood colour, emoji and heatmap colour helpers
 */

/**
 * moodColor(value) → hex string
 * Maps a 1–10 mood value to a colour.
 *   1–3  → red    (bad)
 *   4–5  → amber  (below average)
 *   6–7  → green  (good)
 *   8–10 → cyan   (excellent)
 */
export function moodColor(value) {
  if (value <= 3) return '#ef4444'
  if (value <= 5) return '#f59e0b'
  if (value <= 7) return '#22c55e'
  return '#00e5ff'
}

/**
 * moodEmoji(value) → emoji string
 */
export function moodEmoji(value) {
  if (value <= 2) return '😞'
  if (value <= 4) return '😕'
  if (value <= 6) return '😐'
  if (value <= 8) return '😊'
  return '🤩'
}

/**
 * xpHeatColor(xp) → rgba string
 * Maps an XP value (or null = no data) to a heatmap cell colour.
 */
export function xpHeatColor(xp) {
  if (xp === null || xp === undefined) return 'rgba(255,255,255,0.04)'
  if (xp >= 100) return 'rgba(0,229,255,0.80)'
  if (xp >= 50)  return 'rgba(34,197,94,0.70)'
  if (xp >= 10)  return 'rgba(245,158,11,0.60)'
  if (xp >= 0)   return 'rgba(255,255,255,0.18)'
  return 'rgba(239,68,68,0.60)'
}

/**
 * dayBackground(xpEarned) → rgba string
 * Used for calendar day cell backgrounds.
 */
export function dayBackground(xpEarned) {
  if (xpEarned === undefined || xpEarned === null) return 'rgba(255,255,255,0.03)'
  if (xpEarned >= 100) return 'rgba(0,229,255,0.18)'
  if (xpEarned >= 50)  return 'rgba(34,197,94,0.18)'
  if (xpEarned >= 10)  return 'rgba(245,158,11,0.14)'
  if (xpEarned >= 0)   return 'rgba(255,255,255,0.06)'
  return 'rgba(239,68,68,0.18)'
}

/**
 * dayBorder(xpEarned) → rgba string
 * Used for calendar day cell borders.
 */
export function dayBorder(xpEarned) {
  if (xpEarned === undefined || xpEarned === null) return 'rgba(255,255,255,0.05)'
  if (xpEarned >= 100) return 'rgba(0,229,255,0.40)'
  if (xpEarned >= 50)  return 'rgba(34,197,94,0.40)'
  if (xpEarned >= 0)   return 'rgba(245,158,11,0.30)'
  return 'rgba(239,68,68,0.40)'
}

/**
 * HEATMAP_LEGEND
 * Array of [color, label] pairs for the heatmap legend row.
 */
export const HEATMAP_LEGEND = [
  ['rgba(255,255,255,0.04)', 'No data'],
  ['rgba(239,68,68,0.55)',   'Negative'],
  ['rgba(255,255,255,0.18)', 'Minimal'],
  ['rgba(245,158,11,0.60)',  'Good'],
  ['rgba(34,197,94,0.70)',   'Great'],
  ['rgba(0,229,255,0.80)',   'Epic'],
]

/**
 * CALENDAR_LEGEND
 * Array of [color, label] pairs for the calendar legend row.
 */
export const CALENDAR_LEGEND = [
  ['#00e5ff', 'Epic (100+)'],
  ['#22c55e', 'Good (50+)'],
  ['#f59e0b', 'OK'],
  ['#ef4444', 'Negative'],
  ['#ffd700', 'Boss Day'],
]