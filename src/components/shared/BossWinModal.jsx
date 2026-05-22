import { motion } from 'framer-motion'

/**
 * BossWinModal
 * Shown when the player completes a Sunday Boss Battle.
 * Wrap in <AnimatePresence> at call site.
 *
 * Props:
 *   data    — { boss: BossChallenge, bonus: number }
 *   onClose — () => void
 */
export default function BossWinModal({ data, onClose }) {
  const { boss, bonus } = data

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         4999,
        cursor:         'pointer',
      }}
    >
      <motion.div
        initial={{ scale: 0.4, y: 80 }}
        animate={{ scale: 1,   y: 0  }}
        exit={{    scale: 0.4, opacity: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 130 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   '#07070f',
          border:       '2px solid #f59e0b',
          borderRadius: 24,
          padding:      '2.5rem 2rem',
          textAlign:    'center',
          maxWidth:     340,
          width:        '90%',
          boxShadow:    '0 0 80px rgba(245,158,11,0.5)',
        }}
      >
        {/* Boss icon */}
        <div style={{ fontSize: 58, marginBottom: 6 }}>👾</div>

        {/* Tag */}
        <div
          style={{
            fontFamily:    'Orbitron, monospace',
            fontSize:      10,
            color:         '#f59e0b',
            letterSpacing: 4,
            marginBottom:  6,
          }}
        >
          BOSS DEFEATED
        </div>

        {/* Challenge name */}
        <div
          style={{
            fontFamily:   'Rajdhani, sans-serif',
            fontSize:     18,
            color:        '#e8e8ff',
            fontWeight:   700,
            marginBottom: 4,
          }}
        >
          {boss.label}
        </div>

        {/* Bonus XP */}
        <div
          style={{
            fontFamily:  'Orbitron, monospace',
            fontSize:    36,
            fontWeight:  900,
            color:       '#f59e0b',
            textShadow:  '0 0 30px rgba(245,158,11,0.8)',
          }}
        >
          +{bonus} XP
        </div>

        {/* Subtitle */}
        <div
          style={{
            color:     '#6668aa',
            fontSize:  11,
            marginTop: 8,
          }}
        >
          Sunday Boss Bonus Claimed
        </div>

        {/* Claim button */}
        <button
          onClick={onClose}
          style={{
            marginTop:     18,
            background:    'rgba(245,158,11,0.15)',
            border:        '1px solid rgba(245,158,11,0.4)',
            borderRadius:  8,
            color:         '#f59e0b',
            padding:       '8px 32px',
            cursor:        'pointer',
            fontFamily:    'Orbitron, monospace',
            fontSize:      11,
            letterSpacing: 2,
          }}
        >
          CLAIM VICTORY
        </button>
      </motion.div>
    </motion.div>
  )
}