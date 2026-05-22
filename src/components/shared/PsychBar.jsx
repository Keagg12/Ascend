import { motion } from 'framer-motion'

/**
 * PsychBar
 * Animated horizontal bar for the psychological meter system.
 *
 * Props:
 *   label — meter name (e.g. 'Momentum')
 *   value — 0–100 number
 *   color — hex accent color
 *   icon  — emoji prefix
 */
export default function PsychBar({ label, value, color, icon }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color:    '#8888cc',
            display:  'flex',
            alignItems: 'center',
            gap:      4,
          }}
        >
          {icon} {label}
        </span>

        <span
          style={{
            fontSize:   11,
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            color,
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          height:       4,
          borderRadius: 100,
          background:   'rgba(255,255,255,0.05)',
          overflow:     'hidden',
        }}
      >
        {/* Fill */}
        <motion.div
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height:       '100%',
            borderRadius: 100,
            background:   `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow:    `0 0 6px ${color}50`,
          }}
        />
      </div>
    </div>
  )
}