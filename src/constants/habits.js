/**
 * DEFAULT_HABITS
 * Each habit has:
 *   id       — unique key, used in state.done[date][id]
 *   label    — display name
 *   xp       — XP delta (positive or negative)
 *   pos      — true = good habit, false = vice
 *   icon     — emoji
 *   max      — max times loggable per day
 *   cat      — category: 'Fitness' | 'Mind' | 'Body' | 'Vice'
 *   stat     — character stat label shown in UI (pos habits only)
 *   custom   — false for built-in habits
 */
export const DEFAULT_HABITS = [
  // ── FITNESS ──────────────────────────────────────────────
  {
    id: 'gym',
    label: 'Gym Session',
    xp: 50,
    pos: true,
    icon: '🏋️',
    max: 1,
    cat: 'Fitness',
    stat: 'Strength',
    custom: false,
  },
  {
    id: 'surya',
    label: 'Suryanamaskar',
    xp: 14,
    pos: true,
    icon: '☀️',
    max: 5,
    cat: 'Fitness',
    stat: 'Flexibility',
    custom: false,
  },
  {
    id: 'walk',
    label: 'Walk / Jog',
    xp: 20,
    pos: true,
    icon: '🏃',
    max: 2,
    cat: 'Fitness',
    stat: 'Cardio',
    custom: false,
  },

  // ── MIND ─────────────────────────────────────────────────
  {
    id: 'read',
    label: 'Reading',
    xp: 22,
    pos: true,
    icon: '📖',
    max: 3,
    cat: 'Mind',
    stat: 'Knowledge',
    custom: false,
  },
  {
    id: 'meditate',
    label: 'Meditation',
    xp: 28,
    pos: true,
    icon: '🧘',
    max: 2,
    cat: 'Mind',
    stat: 'Focus',
    custom: false,
  },
  {
    id: 'deepwork',
    label: 'Deep Work',
    xp: 45,
    pos: true,
    icon: '⚡',
    max: 3,
    cat: 'Mind',
    stat: 'Discipline',
    custom: false,
  },
  {
    id: 'speech',
    label: 'Speech Practice',
    xp: 30,
    pos: true,
    icon: '🎤',
    max: 3,
    cat: 'Mind',
    stat: 'Charisma',
    custom: false,
  },

  // ── BODY ─────────────────────────────────────────────────
  {
    id: 'eat',
    label: 'Healthy Eating',
    xp: 20,
    pos: true,
    icon: '🥗',
    max: 1,
    cat: 'Body',
    stat: 'Health',
    custom: false,
  },
  {
    id: 'sleep',
    label: 'Quality Sleep',
    xp: 32,
    pos: true,
    icon: '💤',
    max: 1,
    cat: 'Body',
    stat: 'Recovery',
    custom: false,
  },
  {
    id: 'cold',
    label: 'Cold Shower',
    xp: 18,
    pos: true,
    icon: '🚿',
    max: 1,
    cat: 'Body',
    stat: 'Resilience',
    custom: false,
  },

  // ── VICE ─────────────────────────────────────────────────
  {
    id: 'junk',
    label: 'Junk Food',
    xp: -35,
    pos: false,
    icon: '🍔',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
  {
    id: 'screen',
    label: 'Excess Screen Time',
    xp: -35,
    pos: false,
    icon: '📱',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
  {
    id: 'doom',
    label: 'Doomscrolling',
    xp: -25,
    pos: false,
    icon: '😵',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
  {
    id: 'skip',
    label: 'Skipped Workout',
    xp: -40,
    pos: false,
    icon: '❌',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
  {
    id: 'latewake',
    label: 'Late Wake-up',
    xp: -20,
    pos: false,
    icon: '⏰',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
  {
    id: 'relapse',
    label: 'Relapse',
    xp: -300,
    pos: false,
    icon: '⚠️',
    max: 1,
    cat: 'Vice',
    stat: null,
    custom: false,
  },
]

/** Category display config */
export const CAT_COLORS = {
  Fitness: '#22c55e',
  Mind:    '#00e5ff',
  Body:    '#a855f7',
  Vice:    '#ef4444',
}

export const CAT_ICONS = {
  Fitness: '🏅',
  Mind:    '🧠',
  Body:    '💪',
  Vice:    '⛔',
}

/** Icons available for custom habit creation */
export const CUSTOM_HABIT_ICONS = [
  '⭐', '💪', '🎸', '🧩', '🏊', '🚴', '📓', '🎯',
  '🔬', '🎹', '🌿', '🏃', '⚡', '📚', '🎤', '🌅',
  '🧪', '🏄', '🥋', '🧗', '🎨', '🎭', '🚶', '🌙',
]

/** Categories allowed for custom habits */
export const CUSTOM_HABIT_CATS = ['Fitness', 'Mind', 'Body']