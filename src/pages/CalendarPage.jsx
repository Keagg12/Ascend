import { useState }              from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame }               from '../store/GameContext'
import { isBossDay }             from '../constants/bossChallenges'
import { todayStr, buildMonthGrid, MONTH_NAMES, DAY_ABBR } from '../utils/date'
import { dayBackground, dayBorder, moodEmoji, CALENDAR_LEGEND } from '../utils/mood'

// ── Style tokens ──────────────────────────────────────────────────────────────
const glassDeep = {
  background:   'rgba(255,255,255,0.025)',
  border:       '1px solid rgba(255,255,255,0.05)',
  borderRadius: 12,
}

/**
 * MonthNav
 * Previous / Next month navigation bar.
 */
function MonthNav({ year, month, onChange }) {
  function shift(delta) {
    const d = new Date(year, month + delta)
    onChange({ y: d.getFullYear(), m: d.getMonth() })
  }

  return (
    <div
      style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '1rem',
      }}
    >
      <h2
        style={{
          fontFamily: 'Orbitron, monospace',
          color:      '#00e5ff',
          fontSize:   18,
          fontWeight: 900,
        }}
      >
        {MONTH_NAMES[month]} {year}
      </h2>

      <div style={{ display: 'flex', gap: 5 }}>
        {[{ d: -1, l: '◀' }, { d: 1, l: '▶' }].map(({ d, l }) => (
          <button
            key={d}
            onClick={() => shift(d)}
            style={{
              background:   'rgba(255,255,255,0.06)',
              border:       '1px solid rgba(255,255,255,0.10)',
              borderRadius: 7,
              color:        '#e8e8ff',
              cursor:       'pointer',
              padding:      '5px 12px',
              fontSize:     14,
              fontFamily:   'Rajdhani, sans-serif',
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * LegendRow
 * Colour legend beneath the calendar.
 */
function LegendRow() {
  return (
    <div
      style={{
        display:  'flex',
        gap:      8,
        marginBottom: 12,
        flexWrap: 'wrap',
      }}
    >
      {CALENDAR_LEGEND.map(([color, label]) => (
        <span
          key={label}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        4,
            fontSize:   9,
            color:      '#5558aa',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          <span
            style={{
              width:        9,
              height:       9,
              borderRadius: 2,
              background:   `${color}50`,
              border:       `1px solid ${color}60`,
              display:      'inline-block',
            }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}

/**
 * DayCell
 * Single calendar day square.
 *
 * Props:
 *   day        — { dateStr, day }
 *   histEntry  — history entry for this date or undefined
 *   isToday    — boolean
 *   isSelected — boolean
 *   onClick    — () => void
 */
function DayCell({ day, histEntry, isToday, isSelected, onClick }) {
  const xp     = histEntry?.xpEarned
  const mood   = histEntry?.mood
  const isBoss = isBossDay(day.dateStr)

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      style={{
        aspectRatio:  '1',
        borderRadius: 6,
        display:      'flex',
        flexDirection: 'column',
        alignItems:   'center',
        justifyContent: 'center',
        cursor:       'pointer',
        background:   isToday ? 'rgba(0,229,255,0.10)' : dayBackground(xp),
        border: `1px solid ${
          isToday    ? '#00e5ff'                       :
          isSelected ? 'rgba(0,229,255,0.50)'          :
                       dayBorder(xp)
        }`,
        fontSize:   12,
        fontWeight: isToday ? 700 : 400,
        color:      isToday ? '#00e5ff' : '#e8e8ff',
        boxShadow:  isToday ? '0 0 12px rgba(0,229,255,0.25)' : 'none',
        outline:    isSelected ? '2px solid rgba(0,229,255,0.40)' : 'none',
        outlineOffset: 1,
        transition: 'all 0.15s',
        userSelect: 'none',
      }}
    >
      {/* Day number */}
      <span style={{ lineHeight: 1 }}>{day.day}</span>

      {/* XP delta */}
      {xp !== undefined && xp !== null && (
        <div style={{ fontSize: 7, color: '#6668aa', lineHeight: 1 }}>
          {xp >= 0 ? '+' : ''}{xp}
        </div>
      )}

      {/* Mood emoji */}
      {mood != null && (
        <div style={{ fontSize: 7, lineHeight: 1 }}>{moodEmoji(mood)}</div>
      )}

      {/* Boss day indicator */}
      {isBoss && (
        <div style={{ fontSize: 6, color: '#ffd700', lineHeight: 1 }}>👾</div>
      )}
    </motion.div>
  )
}

/**
 * DayDetail
 * Expandable panel shown below the calendar when a day is selected.
 *
 * Props:
 *   dateStr   — 'YYYY-MM-DD'
 *   histEntry — history entry or undefined
 *   done      — { [habitId]: count } for that date
 *   allHabits — full habits array
 */
function DayDetail({ dateStr, histEntry, done, allHabits }) {
  const xp      = histEntry?.xpEarned ?? 0
  const mood    = histEntry?.mood
  const posHabits  = allHabits.filter((h) => h.pos  && (done[h.id] || 0) > 0)
  const viceHabits = allHabits.filter((h) => !h.pos && (done[h.id] || 0) > 0)

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0       }}
      style={{ ...glassDeep, marginTop: 10, padding: '1rem' }}
    >
      {/* Header */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   8,
          flexWrap:       'wrap',
          gap:            4,
        }}
      >
        <span
          style={{
            fontSize:   13,
            color:      '#8888cc',
            fontWeight: 600,
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          📅 {dateStr}
        </span>

        <span>
          <span
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize:   15,
              color:      xp >= 0 ? '#22c55e' : '#ef4444',
              fontWeight: 700,
            }}
          >
            {xp >= 0 ? '+' : ''}{xp} XP
          </span>
          {mood != null && (
            <span style={{ marginLeft: 8, fontSize: 16 }}>
              {moodEmoji(mood)}
            </span>
          )}
        </span>
      </div>

      {/* Positive habits logged */}
      {posHabits.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
          {posHabits.map((h) => (
            <span
              key={h.id}
              style={{
                fontSize:     10,
                background:   'rgba(34,197,94,0.10)',
                border:       '1px solid rgba(34,197,94,0.20)',
                borderRadius: 5,
                padding:      '2px 7px',
                color:        '#22c55e',
                fontFamily:   'Rajdhani, sans-serif',
              }}
            >
              {h.icon} {h.label}
            </span>
          ))}
        </div>
      )}

      {/* Vices logged */}
      {viceHabits.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {viceHabits.map((h) => (
            <span
              key={h.id}
              style={{
                fontSize:     10,
                background:   'rgba(239,68,68,0.08)',
                border:       '1px solid rgba(239,68,68,0.20)',
                borderRadius: 5,
                padding:      '2px 7px',
                color:        '#ef4444',
                fontFamily:   'Rajdhani, sans-serif',
              }}
            >
              {h.icon} {h.label}
            </span>
          ))}
        </div>
      )}

      {/* Empty state */}
      {posHabits.length === 0 && viceHabits.length === 0 && (
        <div
          style={{
            fontSize:   12,
            color:      '#3a3a88',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          No habits logged for this day.
        </div>
      )}
    </motion.div>
  )
}

/**
 * CalendarPage
 * Full monthly calendar with:
 *   - Month navigation
 *   - Colour-coded day cells (XP / mood / boss)
 *   - Click-to-expand day detail panel
 *   - Colour legend
 */
export default function CalendarPage() {
  const { state, allHabits } = useGame()

  const now = new Date()
  const [vm, setVm]       = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [selected, setSelected] = useState(null)

  const { y, m }              = vm
  const { days, firstDayOffset } = buildMonthGrid(y, m)
  const td                    = todayStr()

  // Look up history and done data for a given dateStr
  function getHistEntry(dateStr) {
    return state.history.find((h) => h.date === dateStr)
  }

  function getDone(dateStr) {
    return state.done[dateStr] ?? {}
  }

  function handleDayClick(dateStr) {
    setSelected((prev) => (prev === dateStr ? null : dateStr))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 660, margin: '0 auto' }}
    >
      {/* Month navigation */}
      <MonthNav year={y} month={m} onChange={setVm} />

      {/* Legend */}
      <LegendRow />

      {/* Calendar grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap:                 3,
        }}
      >
        {/* Day-of-week headers */}
        {DAY_ABBR.map((d) => (
          <div
            key={d}
            style={{
              textAlign:     'center',
              fontSize:      8,
              color:         '#3a3a80',
              padding:       '3px 0',
              fontWeight:    700,
              fontFamily:    'Rajdhani, sans-serif',
              letterSpacing: 1,
            }}
          >
            {d}
          </div>
        ))}

        {/* Leading empty cells for first-day offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {days.map((day) => (
          <DayCell
            key={day.dateStr}
            day={day}
            histEntry={getHistEntry(day.dateStr)}
            isToday={day.dateStr === td}
            isSelected={selected === day.dateStr}
            onClick={() => handleDayClick(day.dateStr)}
          />
        ))}
      </div>

      {/* Day detail panel */}
      <AnimatePresence>
        {selected && (
          <DayDetail
            dateStr={selected}
            histEntry={getHistEntry(selected)}
            done={getDone(selected)}
            allHabits={allHabits}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}