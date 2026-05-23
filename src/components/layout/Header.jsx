import { motion } from 'framer-motion'
import { useGame } from '../../store/GameContext'

/**
 * Header — premium version
 *
 * Additions:
 *   - 2px XP progress bar at bottom edge (classic JRPG feel)
 *     Bar color matches current rank, fills with level progress
 *   - Wordmark has a very subtle letter-spacing animation on mount
 *   - Rank display more defined with rank color accent
 *   - Combo pill more premium
 *
 * All additions are non-invasive — the bar is 2px, invisible until noticed.
 */
export default function Header() {
  const { levelData, rank, psych, setPage } = useGame()

  const xpPct = Math.round(levelData.pct * 100)

  return (
    <header
      style={{
        position:       'sticky',
        top:            0,
        zIndex:         600,
        background:     'rgba(3,3,10,0.97)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        // Subtle bottom border fades into the XP bar
        borderBottom:   '1px solid rgba(255,255,255,0.05)',
        padding:        '9px 1.25rem 0',
        // Needed for absolute XP bar
        position:       'sticky',
      }}
    >
      {/* ── Main row ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingBottom:  9,
        }}
      >
        {/* ── Left: wordmark + mode badges ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontFamily:  'Orbitron, monospace',
              fontSize:    15,
              fontWeight:  900,
              color:       '#00e5ff',
              textShadow:  '0 0 16px rgba(0,229,255,0.4)',
              userSelect:  'none',
              lineHeight:  1,
            }}
          >
            ASCEND
          </motion.span>

          {/* Recovery badge */}
          {psych.mode === 'recovery' && (
            <span
              style={{
                fontSize:      8,
                color:         'rgba(139,92,246,0.8)',
                letterSpacing: '0.15em',
                animation:     'pulse 2.5s ease-in-out infinite',
                fontFamily:    'Rajdhani, sans-serif',
                userSelect:    'none',
              }}
            >
              🌿 REC
            </span>
          )}

          {/* Hardcore badge */}
          {psych.mode === 'hardcore' && (
            <span
              style={{
                fontSize:      8,
                color:         '#f59e0b',
                letterSpacing: '0.15em',
                animation:     'pulse 2s ease-in-out infinite',
                fontFamily:    'Rajdhani, sans-serif',
                userSelect:    'none',
              }}
            >
              ⚡ HC
            </span>
          )}
        </div>

        {/* ── Right: combo + rank ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Combo — only at ≥ 3 */}
          {psych.combo >= 3 && (
            <motion.button
              onClick={() => setPage('focus')}
              whileHover={{ scale: 1.06, boxShadow: '0 0 16px rgba(255,107,53,0.3)' }}
              whileTap={{ scale: 0.94 }}
              style={{
                fontFamily:    'Orbitron, monospace',
                fontSize:      10,
                color:         '#ff6b35',
                fontWeight:    900,
                background:    'rgba(255,107,53,0.08)',
                border:        '1px solid rgba(255,107,53,0.22)',
                borderRadius:  6,
                padding:       '3px 9px',
                cursor:        'pointer',
                animation:     'pulse 1.6s ease-in-out infinite',
                userSelect:    'none',
                letterSpacing: '0.05em',
              }}
            >
              🔥 ×{psych.combo}
            </motion.button>
          )}

          {/* Rank + level */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        7,
              padding:    '4px 10px 4px 7px',
              background: `${rank.color}0d`,
              border:     `1px solid ${rank.color}22`,
              borderRadius: 20,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>{rank.icon}</span>
            <div>
              <div
                style={{
                  fontFamily:    'Orbitron, monospace',
                  fontSize:      11,
                  fontWeight:    700,
                  color:         '#00e5ff',
                  lineHeight:    1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                Lv.{levelData.lv}
              </div>
              <div
                style={{
                  fontSize:      7,
                  color:         rank.color,
                  letterSpacing: '0.08em',
                  lineHeight:    1,
                  fontFamily:    'Rajdhani, sans-serif',
                  opacity:       0.8,
                }}
              >
                {rank.label}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── XP Progress bar — 2px, bottom edge ──
          Classic JRPG EXP bar. Color tracks current rank.
          Gives constant, glanceable progression feedback.        ── */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     2,
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <motion.div
          animate={{ width: `${xpPct}%` }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          style={{
            height:     '100%',
            background: `linear-gradient(90deg, ${rank.color}70, ${rank.color})`,
            boxShadow:  `0 0 8px ${rank.color}60`,
          }}
        />
      </div>
    </header>
  )
}