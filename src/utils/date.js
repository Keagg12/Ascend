/**
 * date.js — Date helpers used throughout the app
 */

/**
 * todayStr() → 'YYYY-MM-DD'
 * Returns today's date in ISO format using local time.
 */
export function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * yesterdayStr() → 'YYYY-MM-DD'
 */
export function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * dateLabel(dateStr) → human-friendly label
 * 'Today', 'Yesterday', or 'Mon Jan 1'
 */
export function dateLabel(dateStr) {
  const td = todayStr()
  const yd = yesterdayStr()
  if (dateStr === td) return 'Today'
  if (dateStr === yd) return 'Yesterday'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/**
 * buildMonthGrid(year, month)
 * Returns an array of { dateStr, day } objects for every day of the month,
 * plus the firstDayOffset (0=Sun … 6=Sat) for calendar grid alignment.
 *
 * month — 0-indexed (0 = January)
 */
export function buildMonthGrid(year, month) {
  const totalDays = new Date(year, month + 1, 0).getDate()
  const firstDayOffset = new Date(year, month, 1).getDay()
  const days = []

  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    days.push({ dateStr: `${year}-${mm}-${dd}`, day: d })
  }

  return { days, firstDayOffset, totalDays }
}

/**
 * buildYearHeatmap()
 * Returns an array of weeks (each week = array of 7 dateStr strings),
 * covering the last 365 days from today, padded to week boundaries.
 */
export function buildYearHeatmap() {
  const now = new Date()
  const yearAgo = new Date(now)
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  // Snap back to the Sunday before yearAgo
  const start = new Date(yearAgo)
  start.setDate(start.getDate() - start.getDay())

  const weeks = []
  const cur = new Date(start)

  while (cur <= now) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const y = cur.getFullYear()
      const m = String(cur.getMonth() + 1).padStart(2, '0')
      const day = String(cur.getDate()).padStart(2, '0')
      week.push(`${y}-${m}-${day}`)
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

/**
 * MONTH_NAMES — full month names indexed 0–11
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * DAY_ABBR — short day names indexed 0–6 (Sunday first)
 */
export const DAY_ABBR = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']