import { useState }        from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame }         from '../store/GameContext'
import { moodColor, moodEmoji } from '../utils/mood'
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

/** Daily reflection prompts — rotate by day-of-month */
const PROMPTS = [
  "What's the one habit that moved the needle most today?",
  "Where did your discipline hold — and where did it crack?",
  "What would your future self say about today?",
  "Rate your mental clarity: what drained it, what fueled it?",
  "What's one thing you'll do differently tomorrow?",
  "Describe today in three words. Why those words?",
  "What distracted you most? How will you guard against it?",
  "What are you most proud of from today?",
  "What did you sacrifice today to stay on the path?",
  "How close were you to your best possible self today?",
]

/**
 * EntryCard
 * A single past journal entry displayed as a card.
 */
function EntryCard({ entry, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x:  0 }}
      transition={{ delay: index * 0.04 }}
      style={{ ...glassDeep, padding: '1.25rem', marginBottom: '0.75rem' }}
    >
      {/* Header row */}
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
            fontSize:   12,
            color:      '#5558aa',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          📅 {entry.date}
        </span>

        <span>
          <span style={{ fontSize: 16 }}>{moodEmoji(entry.mood)} </span>
          <span
            style={{
              fontSize:   12,
              color:      moodColor(entry.mood),
              fontWeight: 700,
              fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            {entry.mood}/10
          </span>
        </span>
      </div>

      {/* Entry text */}
      <div
        style={{
          fontSize:   14,
          color:      '#b8b8ee',
          lineHeight: 1.7,
          fontFamily: 'Rajdhani, sans-serif',
          whiteSpace: 'pre-wrap',
        }}
      >
        {entry.text}
      </div>
    </motion.div>
  )
}

/**
 * WritePanel
 * Today's entry input area with daily prompt and save button.
 */
function WritePanel({ mood, onSave, hasTodayEntry }) {
  const [text, setText] = useState('')
  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length]

  function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSave(trimmed)
    setText('')
  }

  return (
    <div style={{ ...glass, padding: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Panel label */}
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  5,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        {hasTodayEntry ? "Today's Entry — Already Saved" : "Today's Reflection"}
      </div>

      {/* Daily prompt */}
      <div
        style={{
          fontSize:    12,
          color:       '#a855f7',
          fontStyle:   'italic',
          marginBottom: 10,
          lineHeight:  1.6,
          fontFamily:  'Rajdhani, sans-serif',
        }}
      >
        💬 {prompt}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reflection here..."
        rows={5}
        style={{
          width:        '100%',
          minHeight:    108,
          background:   'rgba(255,255,255,0.03)',
          border:       '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          color:        '#e8e8ff',
          fontSize:     14,
          padding:      '12px',
          resize:       'vertical',
          fontFamily:   'Rajdhani, sans-serif',
          lineHeight:   1.6,
          display:      'block',
        }}
      />

      {/* Footer row */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginTop:      10,
        }}
      >
        {/* Mood badge */}
        <span
          style={{
            fontSize:   12,
            color:      '#3a3a80',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {moodEmoji(mood)} Mood: {mood}/10
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Character count */}
          <span style={{ fontSize: 11, color: '#3a3a80', fontFamily: 'Rajdhani, sans-serif' }}>
            {text.length} chars
          </span>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!text.trim()}
            style={{
              background:    'linear-gradient(135deg,rgba(0,229,255,0.10),rgba(168,85,247,0.10))',
              border:        `1px solid ${text.trim() ? 'rgba(0,229,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius:  9,
              color:         text.trim() ? '#00e5ff' : '#3a3a80',
              padding:       '8px 24px',
              cursor:        text.trim() ? 'pointer' : 'default',
              fontSize:      14,
              fontWeight:    600,
              fontFamily:    'Rajdhani, sans-serif',
              transition:    'all 0.2s',
            }}
          >
            Save Entry
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/**
 * JournalPage
 * Daily reflection journal with:
 *   - Rotating daily prompt
 *   - Free-text entry with mood tagging
 *   - Scrollable history of past entries
 */
export default function JournalPage() {
  const { state, addJournal } = useGame()

  const today        = new Date().toISOString().split('T')[0]
  const hasTodayEntry = state.journal.some((j) => j.date === today)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 680, margin: '0 auto' }}
    >
      <SectionHeader
        title="Journal"
        sub={`${state.journal.length} entr${state.journal.length === 1 ? 'y' : 'ies'} written`}
      />

      {/* Write panel */}
      <WritePanel
        mood={state.moodLog[today] ?? state.mood ?? 5}
        onSave={(text) => addJournal(text, state.moodLog[today] ?? state.mood ?? 5)}
        hasTodayEntry={hasTodayEntry}
      />

      {/* Empty state */}
      {state.journal.length === 0 && (
        <div
          style={{
            textAlign:  'center',
            color:      '#3a3a80',
            fontSize:   14,
            padding:    '2rem',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          ✍️ Your story starts here. Write your first entry.
        </div>
      )}

      {/* Past entries */}
      <AnimatePresence>
        {state.journal.map((entry, i) => (
          <EntryCard key={`${entry.date}-${i}`} entry={entry} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}