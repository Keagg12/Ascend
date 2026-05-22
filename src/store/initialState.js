/**
 * INITIAL_STATE
 * The canonical default state for a brand-new Ascend player.
 * All fields must be present so downstream consumers never need
 * to guard against undefined keys on a fresh install.
 *
 * Storage key: 'ascend_v3'  (localStorage)
 */
export const INITIAL_STATE = {
  // ── XP & Progression ──────────────────────────────────────
  totalXP: 0,          // cumulative XP (can go negative, floored at -9999)

  // ── Streaks ───────────────────────────────────────────────
  streak: 0,           // current daily streak (days)
  lastDate: null,      // ISO date string of last logged day (YYYY-MM-DD)
  graceShields: 0,     // grace shields protecting the streak (max 3)

  // ── Vice-specific counters ────────────────────────────────
  noJunk: 0,           // consecutive days without junk food
  noScreen: 0,         // consecutive days without excess screen
  noRelapse: 0,        // consecutive days without relapse
  pureWeek: 0,         // consecutive pure days (zero vices)

  // ── Combo system ──────────────────────────────────────────
  combo: 0,            // current daily combo (resets on vice or new day)
  maxCombo: 0,         // all-time highest combo reached

  // ── Psychological flags ───────────────────────────────────
  badDays: 0,          // consecutive bad days (negative XP days)
  phoenix: false,      // true once player came back from 3+ bad days

  // ── Totals ────────────────────────────────────────────────
  totalDone: 0,        // total number of habit log events

  // ── Boss Battle ───────────────────────────────────────────
  bossWins: 0,         // total Sunday boss battles completed
  bossWinDates: {},    // { [YYYY-MM-DD]: true } — prevents double-claim

  // ── Habit usage counts ────────────────────────────────────
  habitCounts: {},     // { [habitId]: number } — lifetime total per habit

  // ── Daily done map ────────────────────────────────────────
  // { [YYYY-MM-DD]: { [habitId]: count } }
  done: {},

  // ── History (up to 365 entries) ───────────────────────────
  // Each entry: { date, xpEarned, tasks, vices, mood }
  history: [],

  // ── Mood ─────────────────────────────────────────────────
  mood: 5,             // current/default mood (1–10)
  moodLog: {},         // { [YYYY-MM-DD]: number }

  // ── Achievements ─────────────────────────────────────────
  unlocked: {},        // { [achievementId]: true }

  // ── Journal ───────────────────────────────────────────────
  // Each entry: { date, text, mood }
  journal: [],         // max 90 entries (oldest dropped)

  // ── Custom Habits ─────────────────────────────────────────
  customHabits: [],            // array of habit objects (same shape as DEFAULT_HABITS)
  customHabitsCreated: 0,      // lifetime count

  // ── Focus Mode ────────────────────────────────────────────
  focusSessions: 0,    // total completed focus timer sessions

  // ── Settings ─────────────────────────────────────────────
  settings: {
    name:        'Hero',   // player display name
    hardcore:    false,    // 2× XP gains AND 2× penalties
    sound:       true,     // Web Audio API sound effects
    targetWake:  '06:00',  // target wake-up time (HH:MM)
  },
}

/**
 * STORAGE_KEY
 * Single source of truth for the localStorage key.
 */
export const STORAGE_KEY = 'ascend_v3'