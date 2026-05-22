import { motion } from 'framer-motion'
import { useGame }       from '../store/GameContext'
import { CAT_COLORS, CAT_ICONS } from '../constants/habits'
import HabitBtn          from '../components/shared/HabitBtn'
import SectionHeader     from '../components/shared/SectionHeader'

// ── Local style tokens ────────────────────────────────────────────────────────
const glassDeep = {
  background:   'rgba(255,255,255,0.025)',
  border:       '1px solid rgba(255,255,255,0.05)',
  borderRadius: 12,
}

/**
 * ComboPanel
 * Shown in the header when an active XP combo multiplier is in effect.
 */
function ComboPanel({ combo }) {
  return (
    <div
      style={{
        ...glassDeep,
        padding:   '8px 14px',
        textAlign: 'center',
        flexShrink: 0,
        animation: 'hcPulse 2s ease-in-out infinite',
      }}
    >
      <div style={{ fontSize: 20 }}>🔥</div>
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize:   15,
          fontWeight: 900,
          color:      '#ff6b35',
        }}
      >
        ×{combo} COMBO
      </div>
      <div
        style={{
          fontSize:      9,
          color:         '#8866aa',
          letterSpacing: 1,
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        XP MULTIPLIER
      </div>
    </div>
  )
}

/**
 * CategorySection
 * Renders one category heading + grid of habit buttons.
 *
 * Props:
 *   cat      — category string
 *   habits   — filtered habit array for this category
 *   todayDone — { [habitId]: count }
 *   onLog    — (habit, event) => void
 */
function CategorySection({ cat, habits, todayDone, onLog }) {
  const color = CAT_COLORS[cat] || '#6668aa'
  const icon  = CAT_ICONS[cat]  || '📋'

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Category heading */}
      <div
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:         8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width:        3,
            height:       18,
            background:   color,
            borderRadius: 2,
            boxShadow:    `0 0 8px ${color}60`,
          }}
        />
        <span
          style={{
            fontSize:      11,
            color,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontWeight:    700,
            fontFamily:    'Rajdhani, sans-serif',
          }}
        >
          {icon} {cat}
        </span>
      </div>

      {/* Habit grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap:                 '0.7rem',
        }}
      >
        {habits.map((h) => {
          const cnt   = todayDone[h.id] || 0
          const maxed = cnt >= h.max
          return (
            <HabitBtn
              key={h.id}
              habit={h}
              cnt={cnt}
              maxed={maxed}
              onLog={(e) => !maxed && onLog(h, e)}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * TasksPage
 * Full habit logging page — all categories, all habits,
 * grouped into sections with category colour-coded headings.
 */
export default function TasksPage() {
  const { logHabit, todayDone, state, psych, allHabits } = useGame()

  // Derive ordered unique categories from allHabits
  const categories = [...new Set(allHabits.map((h) => h.cat))]

  const subtitle = state.settings?.hardcore
    ? '⚡ Hardcore Mode: 2× XP rewards AND 2× penalties'
    : 'Log actions. Every choice shapes your character.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 860, margin: '0 auto' }}
    >
      {/* Page header */}
      <div
        style={{
          marginBottom: '1.25rem',
          display:      'flex',
          justifyContent: 'space-between',
          flexWrap:     'wrap',
          gap:          8,
        }}
      >
        <SectionHeader title="Daily Habits" sub={subtitle} />
        {psych.combo >= 2 && <ComboPanel combo={psych.combo} />}
      </div>

      {/* Category sections */}
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          cat={cat}
          habits={allHabits.filter((h) => h.cat === cat)}
          todayDone={todayDone}
          onLog={logHabit}
        />
      ))}
    </motion.div>
  )
}