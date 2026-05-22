import { motion } from 'framer-motion'
import { useGame } from '../../store/GameContext'

/**
 * Header
 * Sticky top bar showing:
 *   - ASCEND wordmark
 *   - Mode badge (Recovery / Hardcore)
 *   - Combo indicator (clickable → Focus page)
 *   - Current rank icon + level
 *
 * Always visible above page content (z-index: 600).
 */
export default function Header() {
  const { levelData, rank, psych, setPage } = useGame()

  return (
    <header
      style={{
        position:       'sticky',
        top:            0,
        zIndex:         600,
        background:     'rgba(3,3,10,0.98)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom:   '1px solid rgba(255,255,255,0.05)',
        padding:        '8px 1.25rem',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}
    >
      {/* ── Left: wordmark + mode badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Wordmark */}
        <span
          style={{
            fontFamily:    'Orbitron, monospace',
            fontSize:      16,
            fontWeight:    900,
            color:         '#00e5ff',
            letterSpacing: 5,
            textShadow:    '0 0 20px rgba(0,229,255,0.5)',
            userSelect:    'none',
          }}
        >
          ASCEND
        </span>

        {/* Recovery badge */}
        {psych.mode === 'recovery' && (
          <span
            style={{
              fontSize:      9,
              color:         '#a855f7',
              letterSpacing: 2,
              animation:     'pulse 2s ease-in-out infinite',
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
              fontSize:      9,
              color:         '#f59e0b',
              letterSpacing: 2,
              animation:     'pulse 2s ease-in-out infinite',
              userSelect:    'none',
            }}
          >
            ⚡ HC
          </span>
        )}
      </div>

      {/* ── Right: combo pill + rank ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Combo indicator — only shown at combo ≥ 3, clickable to Focus */}
        {psych.combo >= 3 && (
          <motion.button
            onClick={() => setPage('focus')}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              fontFamily:    'Orbitron, monospace',
              fontSize:      10,
              color:         '#ff6b35',
              fontWeight:    900,
              background:    'rgba(255,107,53,0.08)',
              border:        '1px solid rgba(255,107,53,0.25)',
              borderRadius:  6,
              padding:       '3px 8px',
              cursor:        'pointer',
              animation:     'pulse 1.5s ease-in-out infinite',
              userSelect:    'none',
            }}
          >
            🔥 ×{psych.combo}
          </motion.button>
        )}

        {/* Rank icon + level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15 }}>{rank.icon}</span>
          <div>
            <div
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize:   12,
                fontWeight: 700,
                color:      '#00e5ff',
                lineHeight: 1.2,
              }}
            >
              Lv.{levelData.lv}
            </div>
            <div
              style={{
                fontSize:      8,
                color:         '#3a3a80',
                letterSpacing: 1,
                lineHeight:    1,
              }}
            >
              {rank.label}
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}