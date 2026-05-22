import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence }      from 'framer-motion'
import { useGame }                      from '../store/GameContext'
import { FOCUS_QUOTES }                 from '../constants/quotes'

/**
 * TIMER_DURATIONS
 * Preset focus session durations shown as quick-select buttons.
 */
const TIMER_DURATIONS = [
  { label: '10 min Sprint',    sec: 600  },
  { label: '25 min Focus',     sec: 1500 },
  { label: '45 min Deep Work', sec: 2700 },
  { label: '1 hr Session',     sec: 3600 },
]

/**
 * FocusPage
 * Minimal distraction-free mode with:
 *   - Countdown timer ring (4 preset durations)
 *   - Today's positive habit checklist
 *   - Motivational quote
 *   - Focus session completion triggers incFocusSessions()
 */
export default function FocusPage() {
  const { allHabits, todayDone, logHabit, incFocusSessions, setPage } = useGame()

  const [timerConfig, setTimerConfig] = useState(null)  // { total, label } | null
  const [elapsed, setElapsed]         = useState(0)
  const [running, setRunning]         = useState(false)
  const intervalRef = useRef(null)

  // Rotate quote by hour
  const quote = FOCUS_QUOTES[Math.floor(Date.now() / 3600000) % FOCUS_QUOTES.length]

  // Positive habits for the checklist
  const posHabits   = allHabits.filter((h) => h.pos)
  const doneCount   = posHabits.filter((h) => (todayDone[h.id] || 0) > 0).length
  const progressPct = posHabits.length
    ? Math.round((doneCount / posHabits.length) * 100)
    : 0

  // Timer math
  const remaining  = timerConfig ? Math.max(0, timerConfig.total - elapsed) : 0
  const timerPct   = timerConfig ? elapsed / timerConfig.total : 0
  const mm         = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss         = String(remaining % 60).padStart(2, '0')
  const RADIUS     = 85
  const CIRCUM     = 2 * Math.PI * RADIUS

  // Clear interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), [])

  function startTimer(sec, label) {
    clearInterval(intervalRef.current)
    setElapsed(0)
    setTimerConfig({ total: sec, label })
    setRunning(true)

    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1
        if (next >= sec) {
          clearInterval(intervalRef.current)
          setRunning(false)
          incFocusSessions()
          return 0
        }
        return next
      })
    }, 1000)
  }

  function stopTimer() {
    clearInterval(intervalRef.current)
    setTimerConfig(null)
    setElapsed(0)
    setRunning(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      style={{
        minHeight:      '85vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        '2rem 1.2rem',
        maxWidth:       560,
        margin:         '0 auto',
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          width:          '100%',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '2rem',
        }}
      >
        <div
          style={{
            fontFamily:    'Orbitron, monospace',
            fontSize:      14,
            fontWeight:    900,
            color:         '#00e5ff',
            letterSpacing: 4,
          }}
        >
          FOCUS MODE
        </div>

        <button
          onClick={() => { stopTimer(); setPage('dashboard') }}
          style={{
            background:    'none',
            border:        'none',
            color:         '#5558aa',
            cursor:        'pointer',
            fontSize:      12,
            letterSpacing: 2,
            fontFamily:    'Rajdhani, sans-serif',
          }}
        >
          EXIT ×
        </button>
      </div>

      {/* ── Motivational quote ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign:    'center',
          marginBottom: '2rem',
          maxWidth:     420,
        }}
      >
        <div
          style={{
            fontSize:    14,
            color:       '#6668aa',
            fontStyle:   'italic',
            lineHeight:  1.7,
            fontFamily:  'Rajdhani, sans-serif',
          }}
        >
          "{quote}"
        </div>
      </motion.div>

      {/* ── Timer ring ── */}
      <div
        style={{
          position:     'relative',
          width:        200,
          height:       200,
          marginBottom: '2rem',
          flexShrink:   0,
        }}
      >
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
          {/* Background track */}
          <circle
            cx={100} cy={100} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={8}
          />
          {/* Progress arc */}
          <circle
            cx={100} cy={100} r={RADIUS}
            fill="none"
            stroke="#00e5ff"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={CIRCUM}
            strokeDashoffset={CIRCUM * (1 - timerPct)}
            transform="rotate(-90 100 100)"
            style={{
              transition: 'stroke-dashoffset 0.5s linear',
              filter: running
                ? 'drop-shadow(0 0 12px rgba(0,229,255,0.8))'
                : 'none',
            }}
          />
        </svg>

        {/* Inner text */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          {running ? (
            <>
              <div
                style={{
                  fontFamily:    'Orbitron, monospace',
                  fontSize:      36,
                  fontWeight:    900,
                  color:         '#00e5ff',
                  letterSpacing: 2,
                  lineHeight:    1,
                }}
              >
                {mm}:{ss}
              </div>
              <div
                style={{
                  fontSize:   10,
                  color:      '#5558aa',
                  marginTop:  4,
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                {timerConfig?.label}
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize:   13,
                color:      '#5558aa',
                textAlign:  'center',
                lineHeight: 1.6,
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              Select a<br />duration
            </div>
          )}
        </div>
      </div>

      {/* ── Timer controls ── */}
      <AnimatePresence mode="wait">
        {!running ? (
          <motion.div
            key="presets"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 '0.6rem',
              width:               '100%',
              marginBottom:        '2rem',
            }}
          >
            {TIMER_DURATIONS.map((d) => (
              <motion.button
                key={d.label}
                onClick={() => startTimer(d.sec, d.label)}
                whileHover={{ scale: 1.03 }}
                whileTap={{   scale: 0.97 }}
                style={{
                  padding:      '10px',
                  borderRadius: 10,
                  border:       '1px solid rgba(0,229,255,0.2)',
                  background:   'rgba(0,229,255,0.05)',
                  color:        '#00e5ff',
                  cursor:       'pointer',
                  fontSize:     12,
                  fontFamily:   'Rajdhani, sans-serif',
                  fontWeight:   600,
                }}
              >
                {d.label}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.button
            key="stop"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            onClick={stopTimer}
            whileHover={{ scale: 1.03 }}
            style={{
              padding:      '10px 32px',
              borderRadius: 10,
              border:       '1px solid rgba(239,68,68,0.3)',
              background:   'rgba(239,68,68,0.06)',
              color:        '#ef4444',
              cursor:       'pointer',
              fontSize:     13,
              fontFamily:   'Rajdhani, sans-serif',
              fontWeight:   700,
              letterSpacing: 2,
              marginBottom: '1.5rem',
            }}
          >
            STOP TIMER
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Today's checklist ── */}
      <div style={{ width: '100%' }}>
        {/* Header */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   10,
          }}
        >
          <span
            style={{
              fontSize:      9,
              color:         '#5558aa',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Today's Checklist
          </span>
          <span
            style={{
              fontSize:   11,
              fontFamily: 'Orbitron, monospace',
              color:      '#00e5ff',
              fontWeight: 700,
            }}
          >
            {progressPct}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height:       3,
            borderRadius: 100,
            background:   'rgba(255,255,255,0.05)',
            marginBottom: 12,
            overflow:     'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1 }}
            style={{
              height:     '100%',
              borderRadius: 100,
              background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
            }}
          />
        </div>

        {/* Habit rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {posHabits.slice(0, 8).map((h) => {
            const done  = (todayDone[h.id] || 0) > 0
            const maxed = (todayDone[h.id] || 0) >= h.max

            return (
              <motion.div
                key={h.id}
                onClick={(e) => !maxed && logHabit(h, e)}
                whileHover={{ x: 4 }}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         10,
                  padding:     '8px 12px',
                  borderRadius: 8,
                  cursor:      maxed ? 'default' : 'pointer',
                  background:  done
                    ? 'rgba(34,197,94,0.06)'
                    : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${
                    done
                      ? 'rgba(34,197,94,0.2)'
                      : 'rgba(255,255,255,0.06)'
                  }`,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {done ? '✅' : h.icon}
                </span>

                <span
                  style={{
                    fontSize:   13,
                    color:      done ? '#22c55e' : '#e8e8ff',
                    fontWeight: done ? 700 : 400,
                    flex:       1,
                    fontFamily: 'Rajdhani, sans-serif',
                  }}
                >
                  {h.label}
                </span>

                <span
                  style={{
                    fontSize:   11,
                    color:      done ? '#22c55e' : '#5558aa',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 700,
                  }}
                >
                  {done ? `+${h.xp}` : '·'}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}