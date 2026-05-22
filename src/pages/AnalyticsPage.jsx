import {
  AreaChart, Area,
  LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { motion }           from 'framer-motion'
import { useGame }          from '../store/GameContext'
import { DEFAULT_HABITS }   from '../constants/habits'
import { buildYearHeatmap, MONTH_NAMES } from '../utils/date'
import { calcHabitPct }     from '../utils/psych'
import { xpHeatColor, HEATMAP_LEGEND } from '../utils/mood'
import { formatXPSigned }   from '../utils/xp'
import StatCard             from '../components/shared/StatCard'
import SectionHeader        from '../components/shared/SectionHeader'

// ── Style tokens ──────────────────────────────────────────────────────────────
const glass = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
}

/** Recharts tooltip style */
const TOOLTIP_STYLE = {
  background:   '#0a0a1a',
  border:       '1px solid rgba(0,229,255,0.15)',
  borderRadius: 8,
  padding:      '8px 12px',
  color:        '#e8e8ff',
  fontSize:     11,
  fontFamily:   'Rajdhani, sans-serif',
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * XPChart — AreaChart of XP earned per day over the last 30 days.
 */
function XPChart({ data }) {
  return (
    <div style={{ ...glass, padding: '1.25rem', marginBottom: '0.85rem' }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  12,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        XP Earned — Last 30 Days
      </div>

      <ResponsiveContainer width="100%" height={165}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#3a3a80', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#3a3a80', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ stroke: 'rgba(0,229,255,0.15)' }}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#00e5ff"
            strokeWidth={2}
            fill="url(#xpGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * MoodChart — LineChart of mood trend over the last 30 days.
 */
function MoodChart({ data }) {
  return (
    <div style={{ ...glass, padding: '1.25rem', minWidth: 0 }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  12,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Mood Trend
      </div>

      <ResponsiveContainer width="100%" height={145}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#3a3a80', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[1, 10]}
            tick={{ fill: '#3a3a80', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#a855f7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * RadarBalance — Radar chart showing Life Balance across 5 dimensions.
 */
function RadarBalance({ radarData }) {
  return (
    <div style={{ ...glass, padding: '1.25rem', minWidth: 0 }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  12,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Life Balance (7d)
      </div>

      <ResponsiveContainer width="100%" height={145}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="cat"
            tick={{ fill: '#5558aa', fontSize: 9, fontFamily: 'Rajdhani, sans-serif' }}
          />
          <Radar
            dataKey="val"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.18}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * HabitLeaderboard
 * Top 6 positive habits ranked by lifetime completion count,
 * shown as labelled bar rows.
 */
function HabitLeaderboard({ habitCounts }) {
  const positiveHabits = DEFAULT_HABITS.filter((h) => h.pos)

  const ranked = [...positiveHabits]
    .sort((a, b) => (habitCounts?.[b.id] || 0) - (habitCounts?.[a.id] || 0))
    .slice(0, 6)

  const maxCount = ranked.reduce(
    (max, h) => Math.max(max, habitCounts?.[h.id] || 0),
    1
  )

  return (
    <div style={{ ...glass, padding: '1.25rem', marginBottom: '0.85rem' }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  12,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Top Habits — Lifetime Count
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ranked.map((h) => {
          const count = habitCounts?.[h.id] || 0
          const pct   = Math.round((count / maxCount) * 100)

          return (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Icon */}
              <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>
                {h.icon}
              </span>

              {/* Bar + labels */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    marginBottom:   3,
                  }}
                >
                  <span
                    style={{
                      fontSize:   11,
                      color:      '#8888cc',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {h.label}
                  </span>
                  <span
                    style={{
                      fontSize:   11,
                      fontFamily: 'Orbitron, monospace',
                      color:      '#00e5ff',
                      fontWeight: 700,
                    }}
                  >
                    {count}×
                  </span>
                </div>

                {/* Bar track */}
                <div
                  style={{
                    height:       3,
                    borderRadius: 100,
                    background:   'rgba(255,255,255,0.05)',
                    overflow:     'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height:       '100%',
                      borderRadius: 100,
                      background:   'linear-gradient(90deg, rgba(0,229,255,0.5), #00e5ff)',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * YearHeatmap
 * GitHub-style contribution grid showing XP colour for every day
 * in the past year. Hover shows the date + XP.
 */
function YearHeatmap({ history }) {
  const weeks      = buildYearHeatmap()
  const historyMap = Object.fromEntries(
    history.map((h) => [h.date, h.xpEarned])
  )

  // Determine which months fall at week boundaries for month labels
  const monthLabels = []
  weeks.forEach((week, wi) => {
    const firstDate = week[0]
    const d         = new Date(firstDate + 'T12:00:00')
    if (d.getDate() <= 7) {
      monthLabels.push({ wi, label: MONTH_NAMES[d.getMonth()].slice(0, 3) })
    }
  })

  return (
    <div style={{ ...glass, padding: '1.25rem', overflowX: 'auto' }}>
      <div
        style={{
          fontSize:      9,
          color:         '#5558aa',
          letterSpacing: 2,
          marginBottom:  10,
          textTransform: 'uppercase',
          fontFamily:    'Rajdhani, sans-serif',
        }}
      >
        Year Heatmap — XP Activity
      </div>

      {/* Month label row */}
      <div
        style={{
          display:     'flex',
          gap:         2,
          marginBottom: 4,
          minWidth:    'max-content',
          paddingLeft: 16,
        }}
      >
        {weeks.map((_, wi) => {
          const ml = monthLabels.find((x) => x.wi === wi)
          return (
            <div
              key={wi}
              style={{
                width:     9,
                fontSize:  7,
                color:     ml ? '#5558aa' : 'transparent',
                textAlign: 'center',
                fontFamily: 'Rajdhani, sans-serif',
                userSelect: 'none',
              }}
            >
              {ml ? ml.label : '·'}
            </div>
          )
        })}
      </div>

      {/* Week columns */}
      <div style={{ display: 'flex', gap: 2, minWidth: 'max-content' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {week.map((dateStr, di) => {
              const xp    = historyMap[dateStr] ?? null
              const color = xpHeatColor(xp)
              const tip   =
                xp !== null
                  ? `${dateStr} · ${xp >= 0 ? '+' : ''}${xp} XP`
                  : dateStr

              return (
                <motion.div
                  key={di}
                  whileHover={{ scale: 1.8 }}
                  title={tip}
                  style={{
                    width:        9,
                    height:       9,
                    borderRadius: 2,
                    background:   color,
                    cursor:       'default',
                    flexShrink:   0,
                    transition:   'background 0.1s',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Heatmap legend */}
      <div
        style={{
          display:  'flex',
          gap:      8,
          marginTop: 8,
          flexWrap: 'wrap',
        }}
      >
        {HEATMAP_LEGEND.map(([color, label]) => (
          <span
            key={label}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        4,
              fontSize:   9,
              color:      '#4448aa',
              fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            <span
              style={{
                width:        9,
                height:       9,
                borderRadius: 2,
                background:   color,
                display:      'inline-block',
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main AnalyticsPage ────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { state, allHabits } = useGame()

  // Prepare last-30-day chart data
  const hist30 = state.history.slice(-30)
  const chartData = hist30.map((h) => ({
    date:  h.date.slice(5),          // 'MM-DD'
    xp:    Math.max(0, h.xpEarned || 0),
    mood:  h.mood  || 5,
    tasks: h.tasks || 0,
  }))

  // Summary stats
  const avgXP = hist30.length
    ? Math.round(hist30.reduce((a, h) => a + (h.xpEarned || 0), 0) / hist30.length)
    : 0

  const avgMood = hist30.length
    ? (hist30.reduce((a, h) => a + (h.mood || 5), 0) / hist30.length).toFixed(1)
    : '5.0'

  const bestDay = hist30.reduce(
    (best, h) => ((h.xpEarned || 0) > (best?.xpEarned || 0) ? h : best),
    null
  )

  // Radar data — last 7 days done objects
  const last7Dates = Object.keys(state.done).sort().slice(-7)
  const done7      = last7Dates.map((d) => state.done[d] || {})

  const radarData = [
    { cat: 'Fitness', val: calcHabitPct(['gym', 'surya', 'walk'],              done7, allHabits) },
    { cat: 'Mind',    val: calcHabitPct(['read', 'meditate', 'deepwork', 'speech'], done7, allHabits) },
    { cat: 'Body',    val: calcHabitPct(['eat', 'sleep', 'cold'],               done7, allHabits) },
    { cat: 'No Vices',val: Math.max(0, 100 - calcHabitPct(['junk', 'screen', 'doom'], done7, allHabits) * 3) },
    { cat: 'Pure',    val: Math.max(0, 100 - calcHabitPct(['relapse'],          done7, allHabits) * 20) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -10 }}
      style={{ padding: '1.2rem', maxWidth: 860, margin: '0 auto' }}
    >
      <SectionHeader title="Analytics" />

      {/* Summary stat cards */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
          gap:                 '0.65rem',
          marginBottom:        '0.85rem',
        }}
      >
        <StatCard
          icon="📈"
          label="Avg Daily XP"
          value={formatXPSigned(avgXP)}
          color="#00e5ff"
        />
        <StatCard
          icon="😊"
          label="Avg Mood"
          value={`${avgMood}/10`}
          color="#a855f7"
        />
        <StatCard
          icon="📅"
          label="Days Tracked"
          value={hist30.length}
          color="#f59e0b"
        />
        <StatCard
          icon="🏆"
          label="Best Day"
          value={bestDay ? formatXPSigned(bestDay.xpEarned) : '+0'}
          color="#22c55e"
        />
      </div>

      {/* XP area chart */}
      <XPChart data={chartData} />

      {/* Mood trend + Life balance radar */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 '0.85rem',
          marginBottom:        '0.85rem',
        }}
      >
        <MoodChart    data={chartData}  />
        <RadarBalance radarData={radarData} />
      </div>

      {/* Habit leaderboard */}
      <HabitLeaderboard habitCounts={state.habitCounts} />

      {/* Year heatmap */}
      <YearHeatmap history={state.history} />
    </motion.div>
  )
}