import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/GameContext'

/**
 * UndoBar
 * Slides up above the NavBar for 12 seconds after a habit is logged.
 * Lets the user reverse an accidental tap with one click.
 * Includes a countdown progress bar so the window is visible.
 *
 * Positioned at bottom: 84px (just above the NavBar).
 * Does NOT appear for vice logs (negative XP) — intentional.
 */
const UNDO_DURATION = 12 // seconds

export default function UndoBar() {
  const { pendingUndo, undoLastHabit } = useGame()
  const [timeLeft, setTimeLeft] = useState(UNDO_DURATION)

  // Reset + run countdown whenever a new pendingUndo appears
  useEffect(() => {
    if (!pendingUndo) return

    setTimeLeft(UNDO_DURATION)
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [pendingUndo?.id])  // re-run on each new action (unique id per log)

  const pct = pendingUndo ? (timeLeft / UNDO_DURATION) * 100 : 0

  return (
    <AnimatePresence>
      {pendingUndo && timeLeft > 0 && (
        <motion.div
          key={pendingUndo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            position:   'fixed',
            bottom:     84,
            left:       '50%',
            transform:  'translateX(-50%)',
            zIndex:     1010,
            width:      'min(360px, 92vw)',
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
            {/* Content row */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '10px 14px',
                gap:            12,
              }}
            >
              {/* Habit info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {pendingUndo.habit.icon}
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
                    Logged: {pendingUndo.habit.label}
                  </div>
                  <div
                    style={{
                      fontSize:   11,
                      color:      pendingUndo.xpGain >= 0 ? '#22c55e' : '#ef4444',
                      fontFamily: 'Orbitron, monospace',
                      fontWeight: 700,
                    }}
                  >
                    {pendingUndo.xpGain >= 0 ? '+' : ''}{pendingUndo.xpGain} XP
                  </div>
                </div>
              </div>

              {/* Countdown + Undo button */}
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
                  onClick={undoLastHabit}
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

            {/* Countdown progress bar — drains left to right */}
            <div
              style={{
                height:     2,
                background: 'rgba(255,255,255,0.05)',
              }}
            >
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
      )}
    </AnimatePresence>
  )
}