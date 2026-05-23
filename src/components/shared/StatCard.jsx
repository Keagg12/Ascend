import { motion } from 'framer-motion'

/**
 * StatCard — premium version
 *
 * Improvements:
 *   - Radial gradient depth per color (each card feels unique)
 *   - Hover lift with matched color glow
 *   - Inset top-edge highlight for panel depth
 *   - Value text has matched color glow (discipline, not spray)
 *   - Sub-text more refined
 */
export default function StatCard({ icon, label, value, color, sub, onClick }) {
  return (
    <motion.div
      whileHover={{
        scale:     1.04,
        y:         -3,
        boxShadow: `0 8px 32px ${color}18, 0 0 0 1px ${color}20, inset 0 1px 0 rgba(255,255,255,0.07)`,
      }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        // Layered background: radial tint + deep glass base
        background:   `radial-gradient(ellipse at 30% 0%, ${color}0a, transparent 55%), rgba(255,255,255,0.025)`,
        border:       `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 12,
        padding:      '1rem',
        textAlign:    'center',
        cursor:       onClick ? 'pointer' : 'default',
        // Default shadow: inset top edge + subtle drop
        boxShadow:    `inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.25)`,
        userSelect:   'none',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* Top-edge light catch */}
      <div
        style={{
          position:     'absolute',
          top:          0,
          left:         '20%',
          right:        '20%',
          height:       1,
          background:   `linear-gradient(90deg, transparent, ${color}20, transparent)`,
          borderRadius: '100%',
        }}
      />

      {/* Icon */}
      <div style={{ fontSize: 22, marginBottom: 4, lineHeight: 1 }}>
        {icon}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily:    'Orbitron, monospace',
          fontSize:      18,
          fontWeight:    900,
          color,
          textShadow:    `0 0 12px ${color}40`,
          lineHeight:    1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize:      8,
          color:         'rgba(85,88,170,0.8)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop:     4,
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        {label}
      </div>

      {/* Optional sub */}
      {sub && (
        <div
          style={{
            fontSize:   9,
            color:      `${color}80`,
            marginTop:  3,
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
          }}
        >
          {sub}
        </div>
      )}
    </motion.div>
  )
}