import { motion } from 'framer-motion'

/**
 * LevelUpModal — cinematic version
 *
 * Improvements:
 *   - Three staggered pulse rings behind the card
 *   - Level number has dramatic scale entrance with spring
 *   - Rank label slides up with delay
 *   - Top-edge rank color bar
 *   - Tagline rotates through motivational phrases
 *   - CONTINUE button has premium hover state
 */

const LEVEL_TAGLINES = [
  'Your legend grows.',
  'The path unfolds.',
  'Discipline rewarded.',
  'Character forged.',
  'Ascension continues.',
  'The warrior rises.',
]

/** PulseRing — a single expanding + fading ring */
function PulseRing({ color, delay, size }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0.7 }}
      animate={{ scale: 2.4, opacity: 0   }}
      transition={{
        duration: 2,
        delay,
        repeat:   Infinity,
        ease:     'easeOut',
      }}
      style={{
        position:     'absolute',
        top:          '50%',
        left:         '50%',
        transform:    'translate(-50%, -50%)',
        width:        size,
        height:       size,
        borderRadius: '50%',
        border:       `1px solid ${color}`,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function LevelUpModal({ data, onClose }) {
  const { lv, rank } = data
  const tagline = LEVEL_TAGLINES[lv % LEVEL_TAGLINES.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(20px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         5000,
        cursor:         'pointer',
      }}
    >
      {/* ── Pulse rings — behind the card ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <PulseRing color={`${rank.color}50`} delay={0}    size={300} />
        <PulseRing color={`${rank.color}30`} delay={0.65} size={420} />
        <PulseRing color={`${rank.color}15`} delay={1.3}  size={560} />
      </div>

      {/* ── Main card ── */}
      <motion.div
        initial={{ scale: 0.3, rotate: -8, opacity: 0, y: 40 }}
        animate={{ scale: 1,   rotate:  0, opacity: 1, y:  0 }}
        exit={{    scale: 0.3,             opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 14, stiffness: 140 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position:     'relative',
          background:   '#07070f',
          border:       `1px solid ${rank.color}40`,
          borderRadius: 24,
          padding:      '0 2.5rem 2.5rem',
          textAlign:    'center',
          boxShadow:    `0 0 80px ${rank.glow}, 0 0 160px ${rank.glow}, inset 0 1px 0 ${rank.color}20`,
          maxWidth:     360,
          width:        '90%',
          overflow:     'hidden',
        }}
      >
        {/* Top rank-color bar */}
        <div
          style={{
            height:     3,
            background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)`,
            marginBottom: '1.75rem',
            boxShadow:  `0 0 12px ${rank.color}`,
          }}
        />

        {/* Floating icon */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize:  56,
            animation: 'float 3s ease-in-out infinite',
            marginBottom: 6,
            lineHeight: 1,
          }}
        >
          {rank.icon}
        </motion.div>

        {/* LEVEL UP label */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily:    'Orbitron, monospace',
            fontSize:      10,
            color:         rank.color,
            letterSpacing: '0.35em',
            marginBottom:  8,
          }}
        >
          LEVEL UP
        </motion.div>

        {/* Level number — dramatic spring entrance */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: 'spring', damping: 8, stiffness: 120, delay: 0.3 }}
          style={{
            fontFamily:            'Orbitron, monospace',
            fontSize:              88,
            fontWeight:            900,
            lineHeight:            1,
            background:            `linear-gradient(135deg, #00e5ff, ${rank.color})`,
            WebkitBackgroundClip:  'text',
            WebkitTextFillColor:   'transparent',
            letterSpacing:         '-0.02em',
          }}
        >
          {lv}
        </motion.div>

        {/* Rank name — slides up */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ marginTop: 10 }}
        >
          <div
            style={{
              fontSize:     18,
              color:        rank.color,
              fontFamily:   'Rajdhani, sans-serif',
              fontWeight:   700,
              textShadow:   `0 0 16px ${rank.color}60`,
              letterSpacing: '0.05em',
            }}
          >
            {rank.label}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            color:      'rgba(85,88,170,0.8)',
            fontSize:   12,
            marginTop:  6,
            fontFamily: 'Rajdhani, sans-serif',
            fontStyle:  'italic',
          }}
        >
          {tagline}
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onClose}
          whileHover={{
            scale:      1.03,
            boxShadow: `0 0 20px ${rank.color}40`,
            background: `${rank.color}25`,
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop:     22,
            background:    `${rank.color}15`,
            border:        `1px solid ${rank.color}50`,
            borderRadius:  10,
            color:         rank.color,
            padding:       '10px 40px',
            cursor:        'pointer',
            fontSize:      11,
            fontFamily:    'Orbitron, monospace',
            letterSpacing: '0.2em',
            transition:    'background 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          CONTINUE
        </motion.button>
      </motion.div>
    </motion.div>
  )
}