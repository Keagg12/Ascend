/**
 * Ascend Icon Registry
 *
 * Images live in: public/icons/{category}/{id}.webp
 *
 * HOW TO ADD REAL ICONS (zero code changes needed):
 *   Drop any of these files into the public/ folder:
 *     public/icons/habits/gym.webp
 *     public/icons/habits/surya.webp
 *     public/icons/ranks/warrior.webp
 *     ...etc
 *
 *   GameIcon automatically uses the image if found,
 *   falls back to the emoji if missing or failed.
 *
 * ADDING A CUSTOM HABIT ICON:
 *   Add to HABIT_ICON_MAP with the custom habit's id.
 */

const BASE = '/icons'

// ── Habit icons ───────────────────────────────────────────────────────────────
export const HABIT_ICON_MAP = {
  // Fitness
  gym:      { src: `${BASE}/habits/gym.webp`,      fallback: '🏋️' },
  surya:    { src: `${BASE}/habits/surya.webp`,    fallback: '☀️' },
  walk:     { src: `${BASE}/habits/walk.webp`,     fallback: '🏃' },

  // Mind
  read:     { src: `${BASE}/habits/read.webp`,     fallback: '📖' },
  meditate: { src: `${BASE}/habits/meditate.webp`, fallback: '🧘' },
  deepwork: { src: `${BASE}/habits/deepwork.webp`, fallback: '⚡' },
  speech:   { src: `${BASE}/habits/speech.webp`,   fallback: '🎤' },

  // Body
  eat:      { src: `${BASE}/habits/eat.webp`,      fallback: '🥗' },
  sleep:    { src: `${BASE}/habits/sleep.webp`,    fallback: '💤' },
  cold:     { src: `${BASE}/habits/cold.webp`,     fallback: '🚿' },

  // Vices
  junk:     { src: `${BASE}/habits/junk.webp`,     fallback: '🍔' },
  screen:   { src: `${BASE}/habits/screen.webp`,   fallback: '📱' },
  doom:     { src: `${BASE}/habits/doom.webp`,     fallback: '😵' },
  skip:     { src: `${BASE}/habits/skip.webp`,     fallback: '❌' },
  latewake: { src: `${BASE}/habits/latewake.webp`, fallback: '⏰' },
  relapse:  { src: `${BASE}/habits/relapse.webp`,  fallback: '⚠️' },
}

// ── Rank icons ────────────────────────────────────────────────────────────────
export const RANK_ICON_MAP = {
  'Lost Soul':   { src: `${BASE}/ranks/lost-soul.webp`,   fallback: '👻' },
  'Beginner':    { src: `${BASE}/ranks/beginner.webp`,    fallback: '🌱' },
  'Disciplined': { src: `${BASE}/ranks/disciplined.webp`, fallback: '📘' },
  'Warrior':     { src: `${BASE}/ranks/warrior.webp`,     fallback: '⚔️' },
  'Monk':        { src: `${BASE}/ranks/monk.webp`,        fallback: '🧿' },
  'Elite':       { src: `${BASE}/ranks/elite.webp`,       fallback: '💎' },
  'Ascended':    { src: `${BASE}/ranks/ascended.webp`,    fallback: '✨' },
  'Legend':      { src: `${BASE}/ranks/legend.webp`,      fallback: '🔥' },
  'Mythic':      { src: `${BASE}/ranks/mythic.webp`,      fallback: '👑' },
}

// ── UI / system icons ─────────────────────────────────────────────────────────
export const UI_ICON_MAP = {
  shield:   { src: `${BASE}/ui/shield.webp`,   fallback: '🛡️' },
  streak:   { src: `${BASE}/ui/streak.webp`,   fallback: '🔥' },
  combo:    { src: `${BASE}/ui/combo.webp`,    fallback: '🔥' },
  boss:     { src: `${BASE}/ui/boss.webp`,     fallback: '👾' },
  xp:       { src: `${BASE}/ui/xp.webp`,       fallback: '⚡' },
  trophy:   { src: `${BASE}/ui/trophy.webp`,   fallback: '🏆' },
  recovery: { src: `${BASE}/ui/recovery.webp`, fallback: '🌿' },
  moon:     { src: `${BASE}/ui/moon.webp`,     fallback: '🌙' },
}

// ── Stat icons (character stat labels) ───────────────────────────────────────
export const STAT_ICON_MAP = {
  Strength:    { src: `${BASE}/stats/strength.webp`,    fallback: '💪' },
  Flexibility: { src: `${BASE}/stats/flexibility.webp`, fallback: '🤸' },
  Cardio:      { src: `${BASE}/stats/cardio.webp`,      fallback: '🫀' },
  Knowledge:   { src: `${BASE}/stats/knowledge.webp`,   fallback: '📚' },
  Focus:       { src: `${BASE}/stats/focus.webp`,       fallback: '🎯' },
  Discipline:  { src: `${BASE}/stats/discipline.webp`,  fallback: '⚡' },
  Charisma:    { src: `${BASE}/stats/charisma.webp`,    fallback: '✨' },
  Health:      { src: `${BASE}/stats/health.webp`,      fallback: '🌿' },
  Recovery:    { src: `${BASE}/stats/recovery.webp`,    fallback: '💤' },
  Resilience:  { src: `${BASE}/stats/resilience.webp`,  fallback: '🧊' },
}

// ── Lookup helpers ────────────────────────────────────────────────────────────

/**
 * getHabitIcon(id, emojiFallback)
 * Returns { src, fallback } for a habit id.
 * Falls back to { src: null, fallback: emoji } for custom habits.
 */
export function getHabitIcon(id, emojiFallback) {
  return HABIT_ICON_MAP[id] ?? { src: null, fallback: emojiFallback ?? '📋' }
}

export function getRankIcon(label, emojiFallback) {
  return RANK_ICON_MAP[label] ?? { src: null, fallback: emojiFallback ?? '⭐' }
}

export function getUIIcon(key) {
  return UI_ICON_MAP[key] ?? { src: null, fallback: '•' }
}

export function getStatIcon(stat) {
  return STAT_ICON_MAP[stat] ?? { src: null, fallback: '📊' }
}