/**
 * RANKS
 * Ordered by minimum level requirement.
 * Each rank has:
 *   min    — minimum level to reach this rank
 *   label  — rank name displayed in UI
 *   color  — primary accent hex
 *   glow   — rgba for box-shadow glow effect
 *   icon   — emoji badge
 *   bg     — transparent background for rank card
 */
export const RANKS = [
  {
    min:   1,
    label: 'Lost Soul',
    color: '#64748b',
    glow:  'rgba(100, 116, 139, 0.35)',
    icon:  '👻',
    bg:    'rgba(100, 116, 139, 0.08)',
  },
  {
    min:   3,
    label: 'Beginner',
    color: '#22c55e',
    glow:  'rgba(34, 197, 94, 0.35)',
    icon:  '🌱',
    bg:    'rgba(34, 197, 94, 0.08)',
  },
  {
    min:   6,
    label: 'Disciplined',
    color: '#3b82f6',
    glow:  'rgba(59, 130, 246, 0.35)',
    icon:  '📘',
    bg:    'rgba(59, 130, 246, 0.08)',
  },
  {
    min:   10,
    label: 'Warrior',
    color: '#f59e0b',
    glow:  'rgba(245, 158, 11, 0.35)',
    icon:  '⚔️',
    bg:    'rgba(245, 158, 11, 0.08)',
  },
  {
    min:   15,
    label: 'Monk',
    color: '#8b5cf6',
    glow:  'rgba(139, 92, 246, 0.35)',
    icon:  '🧿',
    bg:    'rgba(139, 92, 246, 0.08)',
  },
  {
    min:   20,
    label: 'Elite',
    color: '#ec4899',
    glow:  'rgba(236, 72, 153, 0.35)',
    icon:  '💎',
    bg:    'rgba(236, 72, 153, 0.08)',
  },
  {
    min:   30,
    label: 'Ascended',
    color: '#00e5ff',
    glow:  'rgba(0, 229, 255, 0.45)',
    icon:  '✨',
    bg:    'rgba(0, 229, 255, 0.08)',
  },
  {
    min:   40,
    label: 'Legend',
    color: '#ff6b35',
    glow:  'rgba(255, 107, 53, 0.35)',
    icon:  '🔥',
    bg:    'rgba(255, 107, 53, 0.08)',
  },
  {
    min:   50,
    label: 'Mythic',
    color: '#ffd700',
    glow:  'rgba(255, 215, 0, 0.45)',
    icon:  '👑',
    bg:    'rgba(255, 215, 0, 0.08)',
  },
]

/**
 * getRank(level) → RANKS entry
 * Returns the highest rank the player has achieved.
 */
export function getRank(lv) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (lv >= r.min) rank = r
  }
  return rank
}