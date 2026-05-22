/**
 * xp.js — XP and levelling mathematics
 */

/**
 * xpRequired(level) → number
 * XP needed to complete a given level (i.e. cost to go from level → level+1).
 * Formula: 100l + 30l(l-1)   — grows quadratically so early levels are fast.
 *
 * level 1  → 100
 * level 2  → 260
 * level 3  → 450
 * level 5  → 860
 * level 10 → 3700
 * level 20 → 13600
 */
export function xpRequired(level) {
  return 100 * level + 30 * level * (level - 1)
}

/**
 * calcLevel(totalXP) → { lv, inLv, req, pct }
 *
 * lv   — current level (integer, min 1)
 * inLv — XP accumulated within the current level
 * req  — total XP required to complete the current level
 * pct  — progress through current level as 0–1 float
 *
 * Works for negative totalXP (returns level 1, pct 0).
 */
export function calcLevel(totalXP) {
  const xp = Math.max(0, totalXP)
  let lv = 1
  let cumulative = 0

  while (lv <= 999) {
    const req = xpRequired(lv)
    if (cumulative + req > xp) {
      const inLv = xp - cumulative
      return {
        lv,
        inLv,
        req,
        pct: Math.min(1, inLv / req),
      }
    }
    cumulative += req
    lv++
  }

  // Hard cap at level 999
  return { lv: 999, inLv: 0, req: 1, pct: 1 }
}

/**
 * calcXPGain(baseXP, options) → number
 * Applies hardcore and combo multipliers to a raw XP value.
 *
 * options:
 *   hardcore  — boolean, doubles both gains and losses
 *   combo     — current combo count
 *   isPos     — whether this is a positive habit
 *   isRecovery— whether recovery mode is active
 */
export function calcXPGain(baseXP, { hardcore = false, combo = 0, isPos = true, isRecovery = false } = {}) {
  let mult = hardcore ? 2 : 1

  // Combo multiplier only applies to positive habits at combo ≥ 3
  if (isPos && combo >= 3) {
    const comboMult = Math.min(1.5, 1 + (combo - 2) * 0.1)
    mult = Math.min(mult * comboMult, hardcore ? 3 : 2)
  }

  let result = Math.round(baseXP * mult)

  // In recovery mode, vices deal reduced damage
  if (isRecovery && !isPos) {
    result = Math.round(result * 0.5)
  }

  return result
}

/**
 * formatXP(xp) → string
 * Human-readable XP value.
 * e.g. 1234 → "1.2k",  999 → "999",  -300 → "-300"
 */
export function formatXP(xp) {
  if (Math.abs(xp) >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`
  }
  return String(xp)
}

/**
 * formatXPSigned(xp) → string
 * Always shows sign.  e.g. +50, -300, +1.2k
 */
export function formatXPSigned(xp) {
  const abs = formatXP(Math.abs(xp))
  return xp >= 0 ? `+${abs}` : `-${abs}`
}