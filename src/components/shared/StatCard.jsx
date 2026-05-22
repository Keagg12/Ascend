import { motion } from 'framer-motion'

/**
 * StatCard
 * Small metric tile used in the Dashboard stats grid.
 *
 * Props:
 *   icon    — emoji string
 *   label   — short uppercase label (e.g. 'STREAK')
 *   value   — display value string (e.g. '7d', '+120', '1.2k')
 *   color   — hex accent color
 *   sub     — optional small subtitle below the value
 *   onClick — optional click handler
 */
export default function StatCard({ icon, label, value, color, sub, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={onClick}
      style={{
        background:   'rgba(255,255,255,0.025)',
        border:       '1px solid rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding:      '1rem',
        textAlign:    'center',
        cursor:       onClick ? 'pointer' : 'default',
        transition:   'all 0.2s',
        userSelect:   'none',
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: 22, marginBottom: 2 }}>{icon}</div>

      {/* Value */}
      <div
        style={{
          fontFamily:  'Orbitron, monospace',
          fontSize:    18,
          fontWeight:  900,
          color,
          textShadow:  `0 0 8px ${color}50`,
          lineHeight:  1.1,
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginTop:     3,
        }}
      >
        {label}
      </div>

      {/* Optional sub-text */}
      {sub && (
        <div style={{ fontSize: 9, color: '#3a3a88', marginTop: 2 }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}