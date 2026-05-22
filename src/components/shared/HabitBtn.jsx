import { motion } from 'framer-motion'

/**
 * HabitBtn
 * Reusable habit logging button tile.
 * Used in both Dashboard quick-log and TasksPage full grid.
 *
 * Props:
 *   habit   — habit object { id, label, icon, xp, pos, max, stat, cat }
 *   cnt     — times logged today (number)
 *   maxed   — boolean — true when cnt >= habit.max
 *   onLog   — (event) => void — called when button clicked and not maxed
 */
export default function HabitBtn({ habit, cnt, maxed, onLog }) {
  const accentColor = habit.pos
    ? maxed ? '#22c55e' : '#00e5ff'
    : '#ef4444'

  return (
    <motion.button
      onClick={onLog}
      whileHover={maxed ? {} : { scale: 1.04, boxShadow: `0 0 18px ${accentColor}18` }}
      whileTap={maxed ? {} : { scale: 0.96 }}
      style={{
        padding:      '0.9rem 0.75rem',
        borderRadius: 13,
        textAlign:    'left',
        cursor:       maxed ? 'default' : 'pointer',
        border:       `1px solid ${maxed ? `${accentColor}40` : 'rgba(255,255,255,0.07)'}`,
        background:   maxed ? `${accentColor}0d` : 'rgba(255,255,255,0.025)',
        color:        '#e8e8ff',
        transition:   'all 0.2s',
        width:        '100%',
        userSelect:   'none',
      }}
    >
      {/* Habit icon */}
      <div style={{ fontSize: 26 }}>{habit.icon}</div>

      {/* Label */}
      <div
        style={{
          fontSize:   12,
          fontWeight: 600,
          margin:     '4px 0 2px',
          lineHeight: 1.2,
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        {habit.label}
      </div>

      {/* Stat tag (positive habits only) */}
      {habit.stat && (
        <div
          style={{
            fontSize:      8,
            color:         '#4448aa',
            letterSpacing: 1,
            marginBottom:  3,
            textTransform: 'uppercase',
          }}
        >
          +{habit.stat}
        </div>
      )}

      {/* Bottom row: XP value + counter */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}
      >
        <span
          style={{
            fontSize:   12,
            color:      accentColor,
            fontWeight: 700,
            fontFamily: 'Orbitron, monospace',
          }}
        >
          {maxed ? '✓ Done' : `${habit.pos ? '+' : ''}${habit.xp} XP`}
        </span>

        <span style={{ fontSize: 9, color: '#3a3a80' }}>
          {cnt}/{habit.max}
        </span>
      </div>

      {/* Completed tag */}
      {maxed && (
        <div
          style={{
            fontSize:      8,
            color:         '#22c55e',
            marginTop:     3,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          ✓ COMPLETED
        </div>
      )}
    </motion.button>
  )
}