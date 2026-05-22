import { useState }        from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame }         from '../store/GameContext'
import { RANKS, getRank }  from '../constants/ranks'
import { CUSTOM_HABIT_ICONS, CUSTOM_HABIT_CATS } from '../constants/habits'
import { calcLevel }       from '../utils/xp'
import SectionHeader       from '../components/shared/SectionHeader'

// ── Style tokens ──────────────────────────────────────────────────────────────
const glass = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
}
const glassDeep = {
  background:   'rgba(255,255,255,0.025)',
  border:       '1px solid rgba(255,255,255,0.05)',
  borderRadius: 12,
}
const inputStyle = {
  width:        '100%',
  background:   'rgba(255,255,255,0.06)',
  border:       '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color:        '#e8e8ff',
  padding:      '8px 12px',
  fontSize:     14,
  fontFamily:   'Rajdhani, sans-serif',
}
const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  colorScheme: 'dark',
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * ProfileCard
 * Shows rank icon, hero name, level, rank label and key stats.
 */
function ProfileCard({ state, rank, lv }) {
  return (
    <div
      style={{
        ...glass,
        marginBottom: '0.85rem',
        padding:      '1.5rem',
        textAlign:    'center',
      }}
    >
      <div style={{ fontSize: 50, marginBottom: 5, animation: 'float 5s ease-in-out infinite' }}>
        {rank.icon}
      </div>

      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize:   24,
          fontWeight: 900,
          color:      '#00e5ff',
          textShadow: '0 0 20px rgba(0,229,255,0.4)',
        }}
      >
        {state.settings?.name || 'Hero'}
      </div>

      <div
        style={{
          color:     rank.color,
          fontSize:  14,
          marginTop: 4,
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
        }}
      >
        {rank.label} · Level {lv}
      </div>

      <div
        style={{
          color:     '#5558aa',
          fontSize:  11,
          marginTop: 4,
          fontFamily: 'Rajdhani, sans-serif',
          lineHeight: 1.6,
        }}
      >
        {state.totalXP} XP · {state.streak}d streak ·{' '}
        {state.graceShields || 0} 🛡️ ·{' '}
        {Object.keys(state.unlocked).length} 🏆
      </div>
    </div>
  )
}

/**
 * ToggleRow
 * A settings row with a label, description, and animated toggle switch.
 */
function ToggleRow({ label, desc, value, onToggle }) {
  return (
    <div
      style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '1rem 1.25rem',
        borderBottom:   '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Labels */}
      <div style={{ paddingRight: 16 }}>
        <div
          style={{
            fontSize:   14,
            fontWeight: 600,
            color:      '#e8e8ff',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize:   11,
            color:      '#5558aa',
            marginTop:  2,
            fontFamily: 'Rajdhani, sans-serif',
            lineHeight: 1.4,
          }}
        >
          {desc}
        </div>
      </div>

      {/* Toggle */}
      <motion.div
        onClick={onToggle}
        style={{
          width:      42,
          height:     22,
          borderRadius: 11,
          background: value ? '#00e5ff' : 'rgba(255,255,255,0.08)',
          cursor:     'pointer',
          position:   'relative',
          transition: 'background 0.3s',
          flexShrink: 0,
          boxShadow:  value ? '0 0 10px rgba(0,229,255,0.4)' : 'none',
        }}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            position:     'absolute',
            top:          2,
            width:        18,
            height:       18,
            borderRadius: 9,
            background:   '#fff',
            boxShadow:    '0 1px 4px rgba(0,0,0,0.4)',
          }}
        />
      </motion.div>
    </div>
  )
}

/**
 * CustomHabitForm
 * Inline form for creating a new custom habit.
 * Shown/hidden via the Add / Cancel button in CustomHabitsPanel.
 */
function CustomHabitForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    label: '',
    icon:  '⭐',
    xp:    20,
    cat:   'Mind',
    max:   1,
  })

  function handleSubmit() {
    const trimmed = form.label.trim()
    if (!trimmed) return
    const id = `custom_${Date.now()}`
    onAdd({
      id,
      label:  trimmed,
      icon:   form.icon,
      xp:     Number(form.xp),
      pos:    Number(form.xp) >= 0,
      cat:    form.cat,
      max:    Number(form.max),
      stat:   'Custom',
      custom: true,
    })
  }

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{    opacity: 0, height: 0    }}
      style={{ overflow: 'hidden' }}
    >
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           10,
          marginBottom:  12,
          paddingTop:    4,
        }}
      >
        {/* Icon picker */}
        <div>
          <div
            style={{
              fontSize:      9,
              color:         '#5558aa',
              letterSpacing: 1,
              marginBottom:  5,
              textTransform: 'uppercase',
              fontFamily:    'Rajdhani, sans-serif',
            }}
          >
            Icon
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {CUSTOM_HABIT_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                style={{
                  width:        32,
                  height:       32,
                  borderRadius: 6,
                  border:       `1px solid ${form.icon === ic ? 'rgba(0,229,255,0.5)' : 'rgba(255,255,255,0.10)'}`,
                  background:   form.icon === ic ? 'rgba(0,229,255,0.10)' : 'rgba(255,255,255,0.04)',
                  cursor:       'pointer',
                  fontSize:     16,
                  transition:   'all 0.15s',
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Name + XP */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div
              style={{
                fontSize:      9,
                color:         '#5558aa',
                letterSpacing: 1,
                marginBottom:  4,
                textTransform: 'uppercase',
                fontFamily:    'Rajdhani, sans-serif',
              }}
            >
              Habit Name
            </div>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Cold Plunge"
              style={inputStyle}
            />
          </div>

          <div>
            <div
              style={{
                fontSize:      9,
                color:         '#5558aa',
                letterSpacing: 1,
                marginBottom:  4,
                textTransform: 'uppercase',
                fontFamily:    'Rajdhani, sans-serif',
              }}
            >
              XP Value (+/-)
            </div>
            <input
              type="number"
              value={form.xp}
              onChange={(e) => setForm((f) => ({ ...f, xp: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Category + Max per day */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div
              style={{
                fontSize:      9,
                color:         '#5558aa',
                letterSpacing: 1,
                marginBottom:  4,
                textTransform: 'uppercase',
                fontFamily:    'Rajdhani, sans-serif',
              }}
            >
              Category
            </div>
            <select
              value={form.cat}
              onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))}
              style={selectStyle}
            >
              {CUSTOM_HABIT_CATS.map((c) => (
                <option key={c} value={c} style={{ background: '#0a0a1a' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              style={{
                fontSize:      9,
                color:         '#5558aa',
                letterSpacing: 1,
                marginBottom:  4,
                textTransform: 'uppercase',
                fontFamily:    'Rajdhani, sans-serif',
              }}
            >
              Max / Day
            </div>
            <select
              value={form.max}
              onChange={(e) => setForm((f) => ({ ...f, max: e.target.value }))}
              style={selectStyle}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} style={{ background: '#0a0a1a' }}>
                  {n}×
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex:         1,
              background:   'linear-gradient(135deg,rgba(0,229,255,0.15),rgba(168,85,247,0.15))',
              border:       '1px solid rgba(0,229,255,0.30)',
              borderRadius: 8,
              color:        '#00e5ff',
              padding:      '8px',
              cursor:       'pointer',
              fontSize:     13,
              fontWeight:   700,
              fontFamily:   'Rajdhani, sans-serif',
            }}
          >
            Add Habit
          </motion.button>

          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            style={{
              background:   'rgba(255,255,255,0.04)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color:        '#5558aa',
              padding:      '8px 16px',
              cursor:       'pointer',
              fontSize:     13,
              fontFamily:   'Rajdhani, sans-serif',
            }}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * CustomHabitsPanel
 * Manages creating and removing custom habits.
 */
function CustomHabitsPanel({ customHabits, onAdd, onRemove }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div style={{ ...glass, marginBottom: '0.85rem', padding: '1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   10,
        }}
      >
        <div
          style={{
            fontSize:      9,
            color:         '#5558aa',
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontFamily:    'Rajdhani, sans-serif',
          }}
        >
          Custom Habits
        </div>

        <motion.button
          onClick={() => setShowForm((v) => !v)}
          whileHover={{ scale: 1.04 }}
          style={{
            background:   'rgba(0,229,255,0.10)',
            border:       '1px solid rgba(0,229,255,0.25)',
            borderRadius: 7,
            color:        '#00e5ff',
            padding:      '5px 12px',
            cursor:       'pointer',
            fontSize:     12,
            fontFamily:   'Rajdhani, sans-serif',
            fontWeight:   700,
          }}
        >
          {showForm ? 'Cancel' : '+ Add Habit'}
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <CustomHabitForm
            onAdd={(h) => { onAdd(h); setShowForm(false) }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Empty state */}
      {customHabits.length === 0 && !showForm && (
        <div
          style={{
            fontSize:   12,
            color:      '#3a3a88',
            textAlign:  'center',
            padding:    '1rem 0',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          No custom habits yet. Build your own ritual.
        </div>
      )}

      {/* Custom habit rows */}
      {customHabits.map((h) => (
        <motion.div
          key={h.id}
          layout
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         10,
            padding:     '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span style={{ fontSize: 22 }}>{h.icon}</span>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize:   13,
                fontWeight: 600,
                color:      '#e8e8ff',
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              {h.label}
            </div>
            <div
              style={{
                fontSize:   10,
                color:      '#5558aa',
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              {h.cat} · {h.xp >= 0 ? '+' : ''}{h.xp} XP · max {h.max}×/day
            </div>
          </div>

          <motion.button
            onClick={() => onRemove(h.id)}
            whileHover={{ scale: 1.08 }}
            style={{
              background:   'rgba(239,68,68,0.10)',
              border:       '1px solid rgba(239,68,68,0.20)',
              borderRadius: 6,
              color:        '#ef4444',
              padding:      '4px 10px',
              cursor:       'pointer',
              fontSize:     11,
              fontFamily:   'Rajdhani, sans-serif',
            }}
          >
            Remove
          </motion.button>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * RankLadder
 * Visual display of all 9 ranks, highlighting unlocked ones.
 */
function RankLadder({ currentLv }) {
  return (
    <div style={{ ...glass, marginBottom: '0.85rem', padding: '1.25rem' }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom:  10,
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Rank Progression
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {RANKS.map((r) => {
          const unlocked = currentLv >= r.min
          return (
            <div
              key={r.label}
              style={{
                padding:      '4px 10px',
                borderRadius: 20,
                fontSize:     10,
                fontWeight:   600,
                background:   unlocked ? r.bg    : 'rgba(255,255,255,0.03)',
                border:       `1px solid ${unlocked ? `${r.color}50` : 'rgba(255,255,255,0.06)'}`,
                color:        unlocked ? r.color : '#3a3a80',
                boxShadow:    unlocked ? `0 0 10px ${r.glow}` : 'none',
                fontFamily:   'Rajdhani, sans-serif',
                transition:   'all 0.3s',
              }}
            >
              {r.icon} {r.label} (Lv{r.min}+)
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * DangerZone
 * Reset button with confirmation guard.
 */
function DangerZone({ onReset }) {
  return (
    <div
      style={{
        ...glass,
        padding:     '1.25rem',
        borderColor: 'rgba(239,68,68,0.15)',
      }}
    >
      <div
        style={{
          fontSize:      9,
          color:         '#ef4444',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom:  10,
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Danger Zone
      </div>

      <div
        style={{
          fontSize:     12,
          color:        '#5558aa',
          marginBottom: 12,
          fontFamily:   'Rajdhani, sans-serif',
          lineHeight:   1.5,
        }}
      >
        Permanently wipe all XP, habits, streaks, and journal entries.
        This action cannot be undone.
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        style={{
          background:   'rgba(239,68,68,0.10)',
          border:       '1px solid rgba(239,68,68,0.30)',
          borderRadius: 8,
          color:        '#ef4444',
          padding:      '8px 20px',
          cursor:       'pointer',
          fontSize:     14,
          fontFamily:   'Rajdhani, sans-serif',
          fontWeight:   600,
        }}
      >
        Reset All Progress
      </motion.button>
    </div>
  )
}

// ── Main SettingsPage ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const {
    state,
    setState,
    addCustomHabit,
    removeCustomHabit,
    resetAll,
  } = useGame()

  const { lv }  = calcLevel(state.totalXP)
  const rank     = getRank(lv)

  function handleReset() {
    if (window.confirm('Reset ALL progress permanently? This cannot be undone.')) {
      resetAll()
    }
  }

  function updateSetting(key, value) {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, [key]: value },
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 600, margin: '0 auto' }}
    >
      <SectionHeader title="Config" />

      {/* Profile card */}
      <ProfileCard state={state} rank={rank} lv={lv} />

      {/* Hero name input */}
      <div style={{ ...glass, marginBottom: '0.85rem', padding: '1.25rem' }}>
        <div
          style={{
            fontSize:      9,
            color:         '#5558aa',
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom:  8,
            fontFamily:    'Rajdhani, sans-serif',
          }}
        >
          Hero Name
        </div>
        <input
          value={state.settings?.name || ''}
          onChange={(e) => updateSetting('name', e.target.value)}
          maxLength={24}
          style={inputStyle}
        />
      </div>

      {/* Toggle settings */}
      <div style={{ ...glass, marginBottom: '0.85rem', overflow: 'hidden' }}>
        <ToggleRow
          label="Hardcore Mode"
          desc="2× XP rewards AND 2× penalties on every logged habit. For the truly disciplined."
          value={state.settings?.hardcore || false}
          onToggle={() => updateSetting('hardcore', !state.settings?.hardcore)}
        />
        <ToggleRow
          label="Sound Effects"
          desc="Auditory feedback on XP gains, level ups, and achievements."
          value={state.settings?.sound !== false}
          onToggle={() => updateSetting('sound', state.settings?.sound === false)}
        />
      </div>

      {/* Custom habit builder */}
      <CustomHabitsPanel
        customHabits={state.customHabits || []}
        onAdd={addCustomHabit}
        onRemove={removeCustomHabit}
      />

      {/* Rank ladder */}
      <RankLadder currentLv={lv} />

      {/* Danger zone */}
      <DangerZone onReset={handleReset} />
    </motion.div>
  )
}