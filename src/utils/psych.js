/**
 * psych.js — Psychological system calculations
 *
 * All functions are pure — they receive state slices and return numbers/strings.
 * No side effects, no imports from React.
 */

/**
 * calcPsych(state) → PsychResult
 *
 * Returns the five psychological meters derived from recent history.
 *
 * PsychResult:
 *   momentum   — 0–100  overall forward energy
 *   discipline — 0–100  consistency score
 *   dopamine   — 0–100  reward-system health (high = clean, low = vice-heavy)
 *   burnout    — 0–100  overload risk (high = dangerous)
 *   combo      — number current combo count
 *   mode       — 'normal' | 'recovery' | 'hardcore'
 */
export function calcPsych(state) {
  const history = state.history ?? []
  const recent14 = history.slice(-14)
  const recent7  = history.slice(-7)

  // Positive-day ratio (days with XP > 0 out of last 7)
  const positiveRatio = recent7.length
    ? recent7.filter((h) => (h.xpEarned || 0) > 0).length / recent7.length
    : 0

  const streakBonus = Math.min(30, state.streak ?? 0)

  // ── Momentum ─────────────────────────────────────────────
  // Driven by recent positive-day ratio and streak
  const momentum = Math.round(
    Math.min(100, Math.max(0, positiveRatio * 60 + streakBonus * 1.5 + 10))
  )

  // ── Discipline ───────────────────────────────────────────
  // Positivity ratio + streak + lifetime task experience
  const discipline = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        positiveRatio * 50 +
          streakBonus * 2 +
          Math.min(20, (state.totalDone ?? 0) / 5)
      )
    )
  )

  // ── Dopamine Balance ─────────────────────────────────────
  // Total vices in last 7 days subtract from a base of 100
  const totalVices = recent7.reduce((acc, h) => acc + (h.vices || 0), 0)
  const dopamine = Math.round(
    Math.min(100, Math.max(0, 100 - totalVices * 12 + positiveRatio * 30))
  )

  // ── Burnout Risk ─────────────────────────────────────────
  // High task load → rising burnout
  const totalTasks7 = recent7.reduce((acc, h) => acc + (h.tasks || 0), 0)
  let burnout = 15
  if (totalTasks7 > 40) burnout = 70
  else if (totalTasks7 > 25) burnout = 40
  burnout = Math.round(Math.min(100, Math.max(0, burnout)))

  // ── Mode ─────────────────────────────────────────────────
  let mode = 'normal'
  if ((state.streak ?? 0) === 0 && (state.badDays ?? 0) >= 2) {
    mode = 'recovery'
  } else if (state.settings?.hardcore) {
    mode = 'hardcore'
  }

  return {
    momentum,
    discipline,
    dopamine,
    burnout,
    combo: state.combo ?? 0,
    mode,
  }
}

/**
 * calcDayQuality(todayDone, allHabits, mood) → 0–100
 *
 * Composite day quality score based on:
 *   - positive habits completed (weighted by XP value)
 *   - mood contribution
 *   - vice deductions
 *
 * todayDone  — { [habitId]: count }
 * allHabits  — full habit array (DEFAULT_HABITS + customHabits)
 * mood       — 1–10 number
 */
export function calcDayQuality(todayDone, allHabits, mood) {
  const positiveScore = allHabits
    .filter((h) => h.pos)
    .reduce((acc, h) => acc + (todayDone[h.id] || 0) * (h.xp / 3), 0)

  const moodScore = (mood ?? 5) * 4

  const viceDeduction = allHabits
    .filter((h) => !h.pos)
    .reduce((acc, h) => acc + (todayDone[h.id] || 0) * 8, 0)

  return Math.min(100, Math.max(0, Math.round(positiveScore + moodScore - viceDeduction)))
}

/**
 * calcHabitPct(habitIds, done7days, allHabits) → 0–100
 *
 * Percentage completion of the given habit IDs over the last 7 days.
 * Used for the Life Balance radar chart.
 *
 * habitIds — string[]
 * done7days — array of done objects: { [habitId]: count }[]
 * allHabits — full habit array
 */
export function calcHabitPct(habitIds, done7days, allHabits) {
  if (!done7days.length) return 0
  let total = 0
  let possible = 0

  for (const id of habitIds) {
    const habit = allHabits.find((h) => h.id === id)
    if (!habit) continue
    for (const dayDone of done7days) {
      total    += dayDone[id] || 0
      possible += habit.max
    }
  }

  return Math.min(100, Math.round((total / Math.max(1, possible)) * 100))
}