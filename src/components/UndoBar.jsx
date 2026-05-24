import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/GameContext'

/**
 * UndoBar
 * Now supports multiple undos by stacking them above the NavBar.
 * Each item has its own countdown based on expiresAt.
 */
const UNDO_DURATION = 12 // seconds

function UndoItem({ undo, onUndo }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const diff = Math.ceil((undo.expiresAt - now) / 1000)
      setTimeLeft(Math.max(0, diff))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [undo.expiresAt])

  const pct = (timeLeft / UNDO_DURATION) * 100

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,  scale: 1   }}
      exit={{    opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        width:         'min(360px, 92vw)',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          background:     'rgba(8,8,22,0.97)',
          border:         '1px solid rgba(168,85,247,0.30)',
          borderRadius:   12,
          overflow:       'hidden',
          boxShadow:      '0 4px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '10px 14px',
            gap:            12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>
              {undo.habit.icon}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize:     12,
                  color:        '#8888cc',
                  fontFamily:   'Rajdhani, sans-serif',
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Logged: {undo.habit.label}
              </div>
              <div
                style={{
                  fontSize:   11,
                  color:      undo.xpGain >= 0 ? '#22c55e' : '#ef4444',
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 700,
                }}
              >
                {undo.xpGain >= 0 ? '+' : ''}{undo.xpGain} XP
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span
              style={{
                fontSize:   10,
                color:      '#4448aa',
                fontFamily: 'Orbitron, monospace',
              }}
            >
              {timeLeft}s
            </span>

            <motion.button
              onClick={onUndo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background:    'rgba(168,85,247,0.15)',
                border:        '1px solid rgba(168,85,247,0.35)',
                borderRadius:  7,
                color:         '#a855f7',
                padding:       '5px 12px',
                cursor:        'pointer',
                fontSize:      12,
                fontWeight:    700,
                fontFamily:    'Rajdhani, sans-serif',
                letterSpacing: 1,
                whiteSpace:    'nowrap',
              }}
            >
              ↩ Undo
            </motion.button>
          </div>
        </div>

        <div style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{
              height:     '100%',
              background: 'linear-gradient(90deg, #a855f7, #00e5ff)',
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function UndoBar() {
  const { pendingUndos, undoLastHabit } = useGame()

  return (
    <div
      style={{
        position:       'fixed',
        bottom:         84,
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         1010,
        display:        'flex',
        flexDirection:  'column-reverse',
        gap:            8,
        alignItems:     'center',
        pointerEvents:  'none', // Don't block background interactions
        width:          'min(400px, 100vw)',
      }}
    >
      <AnimatePresence mode="popLayout">
        {pendingUndos.map((undo) => (
          <UndoItem
            key={undo.id}
            undo={undo}
            onUndo={() => undoLastHabit(undo.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
