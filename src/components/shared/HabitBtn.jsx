import { motion, AnimatePresence } from 'framer-motion'
import GameIcon        from './GameIcon'
import { getHabitIcon } from '../../assets/icons'

/**
 * HabitBtn — premium interaction version
 *
 * Improvements over original:
 *   - Layered background with radial gradient depth
 *   - Glow border only on hover (not always-on)
 *   - Satisfying "completed" state with animated check
 *   - GameIcon integration (image or emoji fallback)
 *   - Micro-spring on tap
 *   - Stat badge more refined
 */
export default function HabitBtn({ habit, cnt, maxed, onLog }) {
  const accentColor = habit.pos
    ? (maxed ? '#22c55e' : '#00e5ff')
    : '#ef4444'

  const iconData = getHabitIcon(habit.id, habit.icon)

  return (
    <motion.button
      onClick={onLog}
      whileHover={maxed ? {} : {
        scale:     1.035,
        boxShadow: `0 0 0 1px ${accentColor}30, 0 4px 20px ${accentColor}12`,
        y:         -1,
      }}
      whileTap={maxed ? {} : {
        scale: 0.96,
        y:     0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{
        padding:      '0.85rem 0.75rem',
        borderRadius: 13,
        textAlign:    'left',
        cursor:       maxed ? 'default' : 'pointer',
        border:       `1px solid ${maxed ? `${accentColor}35` : 'rgba(255,255,255,0.06)'}`,
        // Layered background: radial depth + base glass
        background:   maxed
          ? `radial-gradient(ellipse at 20% 0%, ${accentColor}12, transparent 60%), rgba(34,197,94,0.04)`
          : `radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.04), transparent 60%), rgba(255,255,255,0.02)`,
        // Subtle inset top-edge highlight
        boxShadow:    maxed
          ? `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${accentColor}15`
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        color:        '#e8e8ff',
        transition:   'border-color 0.2s ease, background 0.2s ease',
        width:        '100%',
        userSelect:   'none',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* Completed shimmer overlay — subtle sweep when maxed */}
      <AnimatePresence>
        {maxed && (
          <motion.div
            key="shimmer"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%',  opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position:   'absolute',
              inset:      0,
              background: `linear-gradient(90deg, transparent, ${accentColor}08, transparent)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <div style={{ marginBottom: 4 }}>
        <GameIcon
          src={iconData.src}
          fallback={iconData.fallback}
          size={26}
          style={{ filter: maxed ? 'saturate(0.7) brightness(0.9)' : 'none' }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          fontSize:     12,
          fontWeight:   600,
          marginBottom: 2,
          lineHeight:   1.25,
          fontFamily:   'Rajdhani, sans-serif',
          color:        maxed ? 'rgba(232,232,255,0.6)' : '#e8e8ff',
        }}
      >
        {habit.label}
      </div>

      {/* Stat tag */}
      {habit.stat && (
        <div
          style={{
            fontSize:      8,
            color:         maxed ? 'rgba(68,72,170,0.6)' : '#3a3a80',
            letterSpacing: '0.08em',
            marginBottom:  4,
            textTransform: 'uppercase',
            fontFamily:    'Rajdhani, sans-serif',
          }}
        >
          +{habit.stat}
        </div>
      )}

      {/* Bottom row: XP + counter */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}
      >
        <span
          style={{
            fontSize:      11,
            color:         maxed ? '#22c55e' : accentColor,
            fontWeight:    700,
            fontFamily:    'Orbitron, monospace',
            letterSpacing: '-0.01em',
          }}
        >
          {maxed
            ? '✓ Done'
            : `${habit.pos ? '+' : ''}${habit.xp}`
          }
        </span>

        <span
          style={{
            fontSize:      9,
            color:         maxed ? 'rgba(58,58,128,0.6)' : '#3a3a80',
            fontFamily:    'Rajdhani, sans-serif',
            letterSpacing: '0.05em',
          }}
        >
          {cnt}/{habit.max}
        </span>
      </div>
    </motion.button>
  )
}