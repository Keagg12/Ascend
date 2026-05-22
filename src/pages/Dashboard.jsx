import { motion } from 'framer-motion'
import { useGame }          from '../store/GameContext'
import { isBossDay, getBossChallenge } from '../constants/bossChallenges'
import { RECOVERY_TIPS, WEEKLY_INSIGHTS, DAILY_QUOTES } from '../constants/quotes'
import { calcDayQuality }   from '../utils/psych'
import { moodColor, moodEmoji } from '../utils/mood'
import { todayStr }         from '../utils/date'
import { formatXPSigned }   from '../utils/xp'
import StatCard             from '../components/shared/StatCard'
import PsychBar             from '../components/shared/PsychBar'
import HabitBtn             from '../components/shared/HabitBtn'

// ── Local style tokens ────────────────────────────────────────────────────────
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

// ── Sub-components ────────────────────────────────────────────────────────────

/** BossBanner — shown every Sunday when a boss challenge is active */
function BossBanner({ boss, todayDone, allHabits }) {
  const tasksDone = boss.tasks.filter((t) => (todayDone[t] || 0) > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        ...glassDeep,
        marginBottom:  '0.85rem',
        padding:       '1rem 1.25rem',
        background:    'linear-gradient(135deg,rgba(245,158,11,0.10),rgba(239,68,68,0.06))',
        borderColor:   'rgba(245,158,11,0.30)',
        display:       'flex',
        alignItems:    'center',
        gap:           12,
      }}
    >
      <span style={{ fontSize: 30, animation: 'pulse 2s ease-in-out infinite' }}>
        👾
      </span>

      <div style={{ flex: 1 }}>
        <div
          style={{
            color:         '#f59e0b',
            fontFamily:    'Orbitron, monospace',
            fontSize:      10,
            letterSpacing: 3,
            marginBottom:  2,
          }}
        >
          SUNDAY BOSS BATTLE
        </div>
        <div
          style={{
            color:      '#e8e8ff',
            fontWeight: 700,
            fontSize:   15,
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {boss.label}
        </div>
        <div
          style={{
            display:    'flex',
            gap:        5,
            marginTop:  5,
            flexWrap:   'wrap',
          }}
        >
          {boss.tasks.map((t) => {
            const h    = allHabits.find((x) => x.id === t)
            const done = (todayDone[t] || 0) > 0
            return (
              <span
                key={t}
                style={{
                  fontSize:   10,
                  background: done ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.05)',
                  border:     `1px solid ${done ? 'rgba(245,158,11,0.40)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 5,
                  padding:    '2px 7px',
                  color:      done ? '#f59e0b' : '#5558aa',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                {h?.icon} {h?.label}
              </span>
            )
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize:   22,
            fontWeight: 900,
            color:      '#f59e0b',
          }}
        >
          {tasksDone}/{boss.tasks.length}
        </div>
        <div style={{ fontSize: 9, color: '#6668aa', letterSpacing: 1 }}>
          +{boss.bonus} XP BONUS
        </div>
      </div>
    </motion.div>
  )
}

/** RankCard — left hero card showing level, XP bar, rank, grace shields */
function RankCard({ rank, levelData, graceShields, hardcore }) {
  const pct = Math.round(levelData.pct * 100)

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      style={{
        ...glass,
        flex:        '1 1 210px',
        padding:     '1.5rem',
        textAlign:   'center',
        boxShadow:   `0 0 60px ${rank.glow}`,
        background:  rank.bg,
        borderColor: `${rank.color}50`,
        transition:  'all 0.3s',
      }}
    >
      {/* Rank icon */}
      <div style={{ fontSize: 48, animation: 'float 4s ease-in-out infinite' }}>
        {rank.icon}
      </div>

      {/* Rank label */}
      <div
        style={{
          fontFamily:    'Orbitron, monospace',
          fontSize:      9,
          color:         rank.color,
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginTop:     6,
        }}
      >
        {rank.label}
      </div>

      {/* Level number */}
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize:   60,
          fontWeight: 900,
          color:      '#00e5ff',
          lineHeight: 1,
          textShadow: '0 0 40px rgba(0,229,255,0.6)',
        }}
      >
        {levelData.lv}
      </div>

      {/* LEVEL label */}
      <div
        style={{
          fontSize:      8,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  10,
        }}
      >
        LEVEL
      </div>

      {/* XP progress bar */}
      <div
        style={{
          background:   'rgba(255,255,255,0.07)',
          borderRadius: 100,
          height:       5,
          overflow:     'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            height:       '100%',
            borderRadius: 100,
            background:   'linear-gradient(90deg, #00e5ff, #a855f7)',
            boxShadow:    '0 0 10px rgba(0,229,255,0.5)',
          }}
        />
      </div>

      {/* XP numbers */}
      <div style={{ fontSize: 9, color: '#5558aa', marginTop: 4 }}>
        {levelData.inLv} / {levelData.req} XP
      </div>

      {/* Grace shields */}
      {graceShields > 0 && (
        <div
          style={{
            marginTop:     7,
            fontSize:      10,
            color:         '#00e5ff',
            letterSpacing: 1,
          }}
        >
          🛡️ {graceShields} Grace Shield{graceShields > 1 ? 's' : ''}
        </div>
      )}

      {/* Hardcore badge */}
      {hardcore && (
        <div
          style={{
            marginTop:  6,
            fontSize:   8,
            color:      '#f59e0b',
            letterSpacing: 2,
            animation:  'pulse 2s ease-in-out infinite',
          }}
        >
          ⚡ HARDCORE MODE
        </div>
      )}
    </motion.div>
  )
}

/** WeeklySummary — right panel showing 7-day stats */
function WeeklySummary({ history7, setPage }) {
  const wXP    = history7.reduce((a, h) => a + (h.xpEarned || 0), 0)
  const wTasks = history7.reduce((a, h) => a + (h.tasks || 0), 0)
  const wGood  = history7.filter((h) => (h.xpEarned || 0) > 0).length

  const rows = [
    { icon: '📅', label: 'Days tracked',   value: `${history7.length} / 7`,            color: '#6668aa' },
    { icon: '⚡', label: 'Week XP',        value: formatXPSigned(wXP),                  color: '#00e5ff' },
    { icon: '✅', label: 'Tasks done',     value: wTasks,                               color: '#22c55e' },
    { icon: '☀️', label: 'Positive days',  value: `${wGood} / ${history7.length}`,     color: '#f59e0b' },
  ]

  return (
    <div style={{ ...glass, padding: '1.2rem' }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom:  10,
        }}
      >
        Weekly Performance
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(({ icon, label, value, color }) => (
          <div
            key={label}
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
            }}
          >
            <span style={{ fontSize: 12, color: '#6668aa', fontFamily: 'Rajdhani, sans-serif' }}>
              {icon} {label}
            </span>
            <span
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize:   12,
                fontWeight: 700,
                color,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <motion.button
        onClick={() => setPage('analytics')}
        whileHover={{ scale: 1.02 }}
        style={{
          marginTop:    12,
          width:        '100%',
          background:   'rgba(0,229,255,0.06)',
          border:       '1px solid rgba(0,229,255,0.15)',
          borderRadius: 8,
          color:        '#00e5ff',
          padding:      '6px',
          cursor:       'pointer',
          fontSize:     11,
          fontFamily:   'Rajdhani, sans-serif',
          fontWeight:   600,
          letterSpacing: 1,
        }}
      >
        View Full Analytics →
      </motion.button>
    </div>
  )
}

/** MoodLogger — 1–10 mood slider row */
function MoodLogger({ todayMood, logMood }) {
  return (
    <div style={{ ...glass, marginBottom: '0.85rem', padding: '1.2rem' }}>
      {/* Header */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   8,
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
          Mental State — Today
        </span>
        <span>
          <span style={{ fontSize: 18 }}>{moodEmoji(todayMood)} </span>
          <span
            style={{
              fontSize:   14,
              color:      moodColor(todayMood),
              fontWeight: 700,
              fontFamily: 'Orbitron, monospace',
            }}
          >
            {todayMood}/10
          </span>
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <motion.button
            key={n}
            onClick={() => logMood(n)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            style={{
              flex:         1,
              height:       30,
              borderRadius: 6,
              border:       'none',
              cursor:       'pointer',
              background:   todayMood === n ? moodColor(n) : 'rgba(255,255,255,0.05)',
              color:        todayMood === n ? '#000' : '#5558aa',
              fontWeight:   700,
              fontSize:     12,
              boxShadow:    todayMood === n ? `0 0 12px ${moodColor(n)}70` : 'none',
              transition:   'all 0.15s',
              fontFamily:   'Rajdhani, sans-serif',
            }}
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/** DayQualityRing — circular SVG progress showing today's quality 0–100 */
function DayQualityRing({ quality, hardcore }) {
  const RADIUS = 42
  const CIRCUM = 2 * Math.PI * RADIUS
  const clamped = Math.min(100, Math.max(0, Math.round(quality)))

  return (
    <div
      style={{
        ...glassDeep,
        width:     140,
        flexShrink: 0,
        padding:   '1.25rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  8,
          textTransform: 'uppercase',
        }}
      >
        Day Quality
      </div>

      <div
        style={{
          position: 'relative',
          width:    88,
          height:   88,
          margin:   '0 auto',
        }}
      >
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={50} cy={50} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={6}
          />
          {/* Fill */}
          <circle
            cx={50} cy={50} r={RADIUS}
            fill="none"
            stroke="#00e5ff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={CIRCUM}
            strokeDashoffset={CIRCUM * (1 - clamped / 100)}
            style={{
              transition: 'stroke-dashoffset 1.3s ease',
              filter:     'drop-shadow(0 0 6px rgba(0,229,255,0.6))',
            }}
          />
        </svg>

        {/* Inner label */}
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
          <span
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize:   20,
              fontWeight: 900,
              color:      '#00e5ff',
            }}
          >
            {clamped}
          </span>
          <span style={{ fontSize: 8, color: '#4448aa', letterSpacing: 1 }}>
            /100
          </span>
        </div>
      </div>

      {hardcore && (
        <div
          style={{
            marginTop:     6,
            fontSize:      8,
            color:         '#f59e0b',
            letterSpacing: 2,
            animation:     'pulse 2s ease-in-out infinite',
          }}
        >
          ⚡ HARDCORE
        </div>
      )}
    </div>
  )
}

/** InsightPanel — AI-like weekly insight + daily quote */
function InsightPanel({ history7 }) {
  const insightFn = WEEKLY_INSIGHTS[new Date().getDate() % WEEKLY_INSIGHTS.length]
  const insight   = insightFn(history7)
  const quote     = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length]

  return (
    <div
      style={{
        ...glassDeep,
        flex:          1,
        padding:       '1.25rem',
        display:       'flex',
        flexDirection: 'column',
        gap:           8,
      }}
    >
      <div
        style={{
          fontSize:      9,
          color:         '#4448aa',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Weekly Insight
      </div>

      <div
        style={{
          fontSize:   13,
          color:      '#9998cc',
          fontStyle:  'italic',
          lineHeight: 1.6,
          flex:       1,
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        "{insight}"
      </div>

      <div
        style={{
          borderTop:  '1px solid rgba(255,255,255,0.05)',
          paddingTop: 8,
          fontSize:   11,
          color:      '#6668aa',
          fontStyle:  'italic',
          lineHeight: 1.5,
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        "{quote}"
      </div>
    </div>
  )
}

// ── Main Dashboard component ──────────────────────────────────────────────────
export default function Dashboard() {
  const {
    state,
    levelData,
    rank,
    todayXP,
    todayDone,
    logHabit,
    logMood,
    psych,
    allHabits,
    setPage,
  } = useGame()

  const td         = todayStr()
  const todayMood  = state.moodLog[td] ?? state.mood ?? 5
  const isBoss     = isBossDay(td)
  const boss       = getBossChallenge(td)
  const isSunday   = new Date().getDay() === 0
  const isRecovery = psych.mode === 'recovery'
  const history7   = state.history.slice(-7)
  const dayQuality = calcDayQuality(todayDone, allHabits, todayMood)
  const quickPos   = allHabits.filter((h) => h.pos).slice(0, 9)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 860, margin: '0 auto' }}
    >
      {/* ── Sunday Rest Notice (non-boss Sundays) ── */}
      {isSunday && !isBoss && (
        <div
          style={{
            ...glassDeep,
            marginBottom: '0.85rem',
            padding:      '0.85rem 1.25rem',
            background:   'rgba(139,92,246,0.07)',
            borderColor:  'rgba(139,92,246,0.20)',
            display:      'flex',
            alignItems:   'center',
            gap:          10,
          }}
        >
          <span style={{ fontSize: 22 }}>🌙</span>
          <div>
            <div
              style={{
                color:      '#8b5cf6',
                fontWeight: 700,
                fontSize:   13,
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              Sunday Rest Mode
            </div>
            <div
              style={{
                color:    '#5a3a9a',
                fontSize: 12,
                marginTop: 1,
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              Penalties reduced 50%. Reflect. Recover. Prepare.
            </div>
          </div>
        </div>
      )}

      {/* ── Recovery Banner ── */}
      {isRecovery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            ...glassDeep,
            marginBottom: '0.85rem',
            padding:      '0.85rem 1.25rem',
            background:   'rgba(168,85,246,0.08)',
            borderColor:  'rgba(168,85,246,0.20)',
            display:      'flex',
            alignItems:   'center',
            gap:          10,
          }}
        >
          <span style={{ fontSize: 22 }}>🌿</span>
          <div>
            <div
              style={{
                color:      '#a855f7',
                fontWeight: 700,
                fontSize:   13,
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              Recovery Mode Active
            </div>
            <div
              style={{
                color:      '#7756aa',
                fontSize:   12,
                marginTop:  1,
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              {RECOVERY_TIPS[new Date().getDay() % RECOVERY_TIPS.length]}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Boss Battle Banner ── */}
      {isBoss && (
        <BossBanner boss={boss} todayDone={todayDone} allHabits={allHabits} />
      )}

      {/* ── Hero Row: Rank card + Stats grid ── */}
      <div
        style={{
          display:    'flex',
          gap:        '0.85rem',
          marginBottom: '0.85rem',
          flexWrap:   'wrap',
        }}
      >
        <RankCard
          rank={rank}
          levelData={levelData}
          graceShields={state.graceShields ?? 0}
          hardcore={state.settings?.hardcore ?? false}
        />

        <div
          style={{
            flex:                '2 1 300px',
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '0.65rem',
          }}
        >
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${state.streak}d`}
            color="#f59e0b"
            sub={
              state.streak >= 30 ? 'Legendary!' :
              state.streak >= 7  ? 'On fire!'   : null
            }
          />
          <StatCard
            icon="⚡"
            label="Today's XP"
            value={formatXPSigned(todayXP)}
            color={todayXP >= 0 ? '#22c55e' : '#ef4444'}
          />
          <StatCard
            icon="💰"
            label="Total XP"
            value={
              state.totalXP >= 1000
                ? `${(state.totalXP / 1000).toFixed(1)}k`
                : String(state.totalXP)
            }
            color="#00e5ff"
          />
          {psych.combo >= 2 ? (
            <StatCard
              icon="🔥"
              label="Combo"
              value={`×${psych.combo}`}
              color="#ff6b35"
              sub="XP Multiplier!"
            />
          ) : (
            <StatCard
              icon="✅"
              label="Logged"
              value={state.totalDone}
              color="#a855f7"
            />
          )}
        </div>
      </div>

      {/* ── Psych Meters + Weekly Summary ── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 '0.85rem',
          marginBottom:        '0.85rem',
          flexWrap:            'wrap',
        }}
      >
        {/* Psychological meters */}
        <div style={{ ...glass, padding: '1.2rem' }}>
          <div
            style={{
              fontSize:      9,
              color:         '#5558aa',
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom:  10,
            }}
          >
            Psychological Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PsychBar label="Momentum"     value={psych.momentum}   color="#00e5ff" icon="⚡" />
            <PsychBar label="Discipline"   value={psych.discipline} color="#a855f7" icon="🎯" />
            <PsychBar label="Dopamine"     value={psych.dopamine}   color="#22c55e" icon="🧠" />
            <PsychBar
              label="Burnout Risk"
              value={psych.burnout}
              color={
                psych.burnout > 70 ? '#ef4444' :
                psych.burnout > 40 ? '#f59e0b' : '#22c55e'
              }
              icon="⚠️"
            />
          </div>
        </div>

        {/* Weekly summary */}
        <WeeklySummary history7={history7} setPage={setPage} />
      </div>

      {/* ── Mood Logger ── */}
      <MoodLogger todayMood={todayMood} logMood={logMood} />

      {/* ── Quick Habit Log ── */}
      <div style={{ ...glass, marginBottom: '0.85rem', padding: '1.2rem' }}>
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
            Quick Log — Positive Habits
          </span>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {psych.combo >= 2 && (
              <span
                style={{
                  fontSize:   10,
                  color:      '#ff6b35',
                  fontWeight: 700,
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                🔥 ×{psych.combo} Combo
              </span>
            )}
            <motion.button
              onClick={() => setPage('tasks')}
              whileHover={{ scale: 1.04 }}
              style={{
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                color:        '#6668aa',
                padding:      '3px 10px',
                cursor:       'pointer',
                fontSize:     10,
                fontFamily:   'Rajdhani, sans-serif',
              }}
            >
              + All Habits
            </motion.button>
          </div>
        </div>

        {/* Habit grid */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
            gap:                 '0.6rem',
          }}
        >
          {quickPos.map((h) => {
            const cnt   = todayDone[h.id] || 0
            const maxed = cnt >= h.max
            return (
              <HabitBtn
                key={h.id}
                habit={h}
                cnt={cnt}
                maxed={maxed}
                onLog={(e) => !maxed && logHabit(h, e)}
              />
            )
          })}
        </div>
      </div>

      {/* ── Bottom row: Day Quality Ring + Insight Panel ── */}
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        <DayQualityRing
          quality={dayQuality}
          hardcore={state.settings?.hardcore ?? false}
        />
        <InsightPanel history7={history7} />
      </div>
    </motion.div>
  )
}