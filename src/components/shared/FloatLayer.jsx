import { motion } from 'framer-motion'

/**
 * FloatLayer
 * Renders floating XP numbers that animate upward and fade out.
 * Rendered at fixed position, pointer-events none — sits above everything.
 *
 * Props:
 *   floats — array of { id, xp, x, y, combo }
 */
export default function FloatLayer({ floats }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {floats.map((f) => {
        const isPositive = f.xp >= 0
        const color      = isPositive ? '#00e5ff' : '#ef4444'
        const shadow     = isPositive
          ? '0 0 20px rgba(0,229,255,0.9)'
          : '0 0 20px rgba(239,68,68,0.9)'
        const label      = f.combo >= 3
          ? `${isPositive ? '+' : ''}${f.xp} ×${f.combo}🔥`
          : `${isPositive ? '+' : ''}${f.xp} XP`

        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.4 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            style={{
              position:    'fixed',
              top:         f.y - 24,
              left:        f.x - 55,
              width:       110,
              textAlign:   'center',
              fontFamily:  'Orbitron, monospace',
              fontWeight:  900,
              fontSize:    f.combo >= 3 ? 24 : 20,
              color,
              textShadow:  shadow,
              pointerEvents: 'none',
              userSelect:  'none',
            }}
          >
            {label}
          </motion.div>
        )
      })}
    </div>
  )
}