import { motion }       from 'framer-motion'
import { useGame }      from '../store/GameContext'
import { ACHIEVEMENTS } from '../constants/achievements'
import SectionHeader    from '../components/shared/SectionHeader'

// ── Style tokens ──────────────────────────────────────────────────────────────
const glass = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
}

/**
 * ProgressSummary
 * Shows unlocked / total counts with a progress bar.
 */
function ProgressSummary({ unlocked, total, rareUnlocked, rareTotal }) {
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0

  return (
    <div
      style={{
        ...glass,
        padding:      '1rem 1.25rem',
        marginBottom: '1.25rem',
        display:      'flex',
        alignItems:   'center',
        gap:          16,
        flexWrap:     'wrap',
      }}
    >
      {/* Counts */}
      <div style={{ flex: 1, minWidth: 160 }}>
        <div
          style={{
            display:    'flex',
            alignItems: 'baseline',
            gap:        6,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize:   28,
              fontWeight: 900,
              color:      '#f59e0b',
            }}
          >
            {unlocked}
          </span>
          <span style={{ color: '#5558aa', fontSize: 14, fontFamily: 'Rajdhani, sans-serif' }}>
            / {total} achievements
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height:       4,
            borderRadius: 100,
            background:   'rgba(255,255,255,0.05)',
            overflow:     'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              height:       '100%',
              borderRadius: 100,
              background:   'linear-gradient(90deg, #f59e0b, #ff6b35)',
              boxShadow:    '0 0 6px rgba(245,158,11,0.5)',
            }}
          />
        </div>
        <div
          style={{
            fontSize:   10,
            color:      '#4448aa',
            marginTop:  4,
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {pct}% complete
        </div>
      </div>

      {/* Rare count */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize:   22,
            fontWeight: 900,
            color:      '#a855f7',
          }}
        >
          {rareUnlocked}
        </div>
        <div style={{ fontSize: 10, color: '#5558aa', fontFamily: 'Rajdhani, sans-serif' }}>
          / {rareTotal} rare
        </div>
      </div>
    </div>
  )
}

/**
 * AchievementCard
 * Single achievement tile — locked achievements are dimmed.
 *
 * Props:
 *   achievement — ACHIEVEMENTS entry
 *   done        — boolean
 */
function AchievementCard({ achievement: a, done }) {
  const accentColor = done
    ? a.rare ? '#a855f7' : '#00e5ff'
    : '#1a1a44'

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      style={{
        ...glass,
        padding:    '1.25rem',
        opacity:    done ? 1 : 0.4,
        border:     `1px solid ${done ? `${accentColor}45` : 'rgba(255,255,255,0.04)'}`,
        boxShadow:  done ? `0 0 28px ${accentColor}20` : 'none',
        transition: 'all 0.2s',
        cursor:     'default',
      }}
    >
      {/* Achievement icon */}
      <div
        style={{
          fontSize:     34,
          filter:       done ? 'none' : 'grayscale(1)',
          marginBottom: 5,
        }}
      >
        {a.icon}
      </div>

      {/* Rare badge */}
      {done && a.rare && (
        <div
          style={{
            fontSize:      8,
            color:         '#a855f7',
            letterSpacing: 2,
            marginBottom:  3,
            fontFamily:    'Orbitron, monospace',
          }}
        >
          ✦ RARE
        </div>
      )}

      {/* Achievement name */}
      <div
        style={{
          fontSize:     14,
          fontWeight:   700,
          color:        done ? '#e8e8ff' : '#3a3a80',
          marginBottom: 3,
          fontFamily:   'Rajdhani, sans-serif',
          lineHeight:   1.2,
        }}
      >
        {a.label}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize:   11,
          color:      '#5558aa',
          lineHeight: 1.5,
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        {a.desc}
      </div>

      {/* Unlocked indicator */}
      {done && (
        <div
          style={{
            fontSize:      8,
            color:         '#22c55e',
            marginTop:     8,
            letterSpacing: 1,
            fontFamily:    'Orbitron, monospace',
          }}
        >
          ✓ UNLOCKED
        </div>
      )}
    </motion.div>
  )
}

/**
 * AchievePage
 * Full achievements gallery — sorted so unlocked appear first.
 */
export default function AchievePage() {
  const { state } = useGame()

  const total        = ACHIEVEMENTS.length
  const unlocked     = Object.keys(state.unlocked).length
  const rareTotal    = ACHIEVEMENTS.filter((a) => a.rare).length
  const rareUnlocked = ACHIEVEMENTS.filter((a) => a.rare && state.unlocked[a.id]).length

  // Sort: unlocked first, then rare locked, then common locked
  const sorted = [...ACHIEVEMENTS].sort((a, b) => {
    const aDone = !!state.unlocked[a.id]
    const bDone = !!state.unlocked[b.id]
    if (aDone !== bDone) return aDone ? -1 : 1
    if (a.rare !== b.rare) return a.rare ? -1 : 1
    return 0
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 860, margin: '0 auto' }}
    >
      <SectionHeader title="Achievements" />

      {/* Progress summary */}
      <ProgressSummary
        unlocked={unlocked}
        total={total}
        rareUnlocked={rareUnlocked}
        rareTotal={rareTotal}
      />

      {/* Achievement grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
          gap:                 '0.8rem',
        }}
      >
        {sorted.map((a) => (
          <AchievementCard
            key={a.id}
            achievement={a}
            done={!!state.unlocked[a.id]}
          />
        ))}
      </div>
    </motion.div>
  )
}