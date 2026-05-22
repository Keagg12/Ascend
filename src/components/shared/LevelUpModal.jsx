import { motion } from 'framer-motion'

/**
 * LevelUpModal
 * Full-screen animated celebration shown when the player levels up.
 * Wrap in <AnimatePresence> at call site.
 *
 * Props:
 *   data    — { lv: number, rank: RankObject }
 *   onClose — () => void
 */
export default function LevelUpModal({ data, onClose }) {
  const { lv, rank } = data

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         5000,
        cursor:         'pointer',
      }}
    >
      <motion.div
        initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
        animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
        exit={{    scale: 0.3, opacity: 0 }}
        transition={{ type: 'spring', damping: 10, stiffness: 130 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   '#07070f',
          border:       `2px solid ${rank.color}`,
          borderRadius: 28,
          padding:      '3rem 2.5rem',
          textAlign:    'center',
          boxShadow:    `0 0 100px ${rank.glow}, 0 0 200px ${rank.glow}`,
          maxWidth:     380,
          width:        '90%',
        }}
      >
        {/* Floating star */}
        <div
          style={{
            fontSize:  64,
            marginBottom: 6,
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          ✨
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily:    'Orbitron, monospace',
            fontSize:      11,
            color:         rank.color,
            letterSpacing: 5,
            marginBottom:  6,
          }}
        >
          LEVEL UP
        </div>

        {/* Level number */}
        <div
          style={{
            fontFamily:            'Orbitron, monospace',
            fontSize:              88,
            fontWeight:            900,
            lineHeight:            1,
            background:            'linear-gradient(135deg, #00e5ff, #a855f7)',
            WebkitBackgroundClip:  'text',
            WebkitTextFillColor:   'transparent',
          }}
        >
          {lv}
        </div>

        {/* Rank */}
        <div
          style={{
            fontSize:     20,
            color:        '#e8e8ff',
            marginTop:    12,
            fontFamily:   'Rajdhani, sans-serif',
            fontWeight:   700,
          }}
        >
          {rank.icon} {rank.label}
        </div>

        {/* Flavour text */}
        <div
          style={{
            color:     '#5558aa',
            fontSize:  13,
            marginTop: 6,
          }}
        >
          Your legend grows.
        </div>

        {/* Continue button */}
        <button
          onClick={onClose}
          style={{
            marginTop:     24,
            background:    `${rank.color}20`,
            border:        `1px solid ${rank.color}60`,
            borderRadius:  10,
            color:         rank.color,
            padding:       '10px 40px',
            cursor:        'pointer',
            fontSize:      12,
            fontFamily:    'Orbitron, monospace',
            letterSpacing: 3,
          }}
        >
          CONTINUE
        </button>
      </motion.div>
    </motion.div>
  )
}