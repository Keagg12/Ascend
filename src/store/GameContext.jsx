import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'

import { INITIAL_STATE, STORAGE_KEY } from './initialState'
import { DEFAULT_HABITS }             from '../constants/habits'
import { ACHIEVEMENTS }               from '../constants/achievements'
import { isBossDay, getBossChallenge } from '../constants/bossChallenges'
import { calcLevel }                  from '../utils/xp'
import { calcXPGain }                 from '../utils/xp'
import { getRank }                    from '../constants/ranks'
import { calcPsych }                  from '../utils/psych'
import { todayStr, yesterdayStr }     from '../utils/date'

// ── Context ──────────────────────────────────────────────────────────────────
const GameCtx = createContext(null)
export const useGame = () => useContext(GameCtx)

// ── Provider ─────────────────────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, setState]       = useState(INITIAL_STATE)
  const [floats, setFloats]     = useState([])        // floating XP numbers
  const [levelUpData, setLevelUpData] = useState(null) // triggers level-up modal
  const [bossWin, setBossWin]   = useState(null)       // triggers boss-win modal
  const [toast, setToast]       = useState(null)       // { msg, color }
  const [page, setPage]         = useState('dashboard')

  const floatId   = useRef(0)
  const prevLv    = useRef(null)
  const loaded    = useRef(false)

  // ── Load from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Merge with INITIAL_STATE to fill any missing keys from older saves
        setState((prev) => ({ ...prev, ...parsed }))
        prevLv.current = calcLevel(parsed.totalXP ?? 0).lv
      } else {
        prevLv.current = 1
      }
    } catch {
      prevLv.current = 1
    }
    loaded.current = true
  }, [])

  // ── Persist to localStorage on every state change ──────────────────────
  useEffect(() => {
    if (!loaded.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage quota exceeded — fail silently
    }
  }, [state])

  // ── Achievement + Level-up watcher ─────────────────────────────────────
  useEffect(() => {
    if (!loaded.current || prevLv.current === null) return

    const { lv } = calcLevel(state.totalXP)
    const enriched = { ...state, level: lv }
    const newUnlocked = { ...state.unlocked }
    let changed = false

    for (const ach of ACHIEVEMENTS) {
      if (!newUnlocked[ach.id] && ach.check(enriched)) {
        newUnlocked[ach.id] = true
        changed = true
        setTimeout(
          () => showToast(`🏆 ${ach.label} unlocked!`, '#f59e0b'),
          700
        )
      }
    }

    if (changed) {
      setState((s) => ({ ...s, unlocked: newUnlocked }))
    }

    if (prevLv.current !== null && lv > prevLv.current) {
      setLevelUpData({ lv, rank: getRank(lv) })
      prevLv.current = lv
    } else if (prevLv.current === null) {
      prevLv.current = lv
    }
  }, [
    state.totalXP,
    state.totalDone,
    state.streak,
    state.noRelapse,
    state.focusSessions,
    state.customHabitsCreated,
    state.phoenix,
    state.bossWins,
    state.maxCombo,
  ])

  // ── Helpers ────────────────────────────────────────────────────────────
  function showToast(msg, color = '#00e5ff') {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3500)
  }

  function spawnFloat(xp, combo, element) {
    const rect = element?.getBoundingClientRect?.()
    const id   = ++floatId.current
    setFloats((f) => [
      ...f,
      {
        id,
        xp,
        combo,
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top : 200,
      },
    ])
    setTimeout(() => setFloats((f) => f.filter((ff) => ff.id !== id)), 2400)
  }

  // ── allHabits memo ─────────────────────────────────────────────────────
  const allHabits = useMemo(
    () => [...DEFAULT_HABITS, ...(state.customHabits ?? [])],
    [state.customHabits]
  )

  // ── Derived values ─────────────────────────────────────────────────────
  const td         = todayStr()
  const todayDone  = state.done[td] ?? {}
  const levelData  = calcLevel(state.totalXP)
  const rank       = getRank(levelData.lv)
  const todayXP    = (state.history.find((h) => h.date === td) ?? {}).xpEarned ?? 0
  const psych      = calcPsych(state)

  // ── logHabit ───────────────────────────────────────────────────────────
  function logHabit(habit, event) {
    const today     = todayStr()
    const todayDoneSnap = state.done[today] ?? {}
    const currentCount  = todayDoneSnap[habit.id] ?? 0

    if (currentCount >= habit.max) return // already maxed

    const xpGain = calcXPGain(habit.xp, {
      hardcore:   state.settings?.hardcore ?? false,
      combo:      state.combo ?? 0,
      isPos:      habit.pos,
      isRecovery: psych.mode === 'recovery',
    })

    // Spawn floating XP number
    spawnFloat(xpGain, psych.combo, event?.currentTarget)

    setState((s) => {
      const isNewDay = s.lastDate !== today
      const yd       = yesterdayStr()

      // ── Streak logic ──────────────────────────────────────
      let newStreak    = s.streak ?? 0
      let usedShield   = false

      if (isNewDay) {
        if (s.lastDate === yd) {
          // Consecutive day — extend streak
          newStreak = (s.streak ?? 0) + 1
        } else if (s.lastDate) {
          // Gap — check grace shield
          if ((s.graceShields ?? 0) > 0) {
            newStreak  = s.streak // preserved
            usedShield = true
            setTimeout(
              () => showToast('🛡️ Grace Shield used! Streak protected.', '#00e5ff'),
              300
            )
          } else {
            newStreak = 1 // restart
          }
        } else {
          newStreak = 1 // first ever log
        }
      }

      // Earn a grace shield every 7 streak days (max 3)
      const newShields = usedShield
        ? (s.graceShields ?? 0) - 1
        : newStreak > 0 &&
          newStreak % 7 === 0 &&
          newStreak > (s.graceShields ?? 0) * 7
        ? Math.min(3, (s.graceShields ?? 0) + 1)
        : s.graceShields ?? 0

      // ── Combo ─────────────────────────────────────────────
      const newCombo    = isNewDay && habit.pos ? (s.combo ?? 0) + 1 : habit.pos ? s.combo ?? 0 : 0
      const newMaxCombo = Math.max(s.maxCombo ?? 0, newCombo)

      // ── Vice streak counters ───────────────────────────────
      const newNoJunk    = habit.id === 'junk'    ? 0 : isNewDay ? (s.noJunk ?? 0) + 1    : s.noJunk ?? 0
      const newNoScreen  = habit.id === 'screen'  ? 0 : isNewDay ? (s.noScreen ?? 0) + 1  : s.noScreen ?? 0
      const newNoRelapse = habit.id === 'relapse' ? 0 : isNewDay ? (s.noRelapse ?? 0) + 1 : s.noRelapse ?? 0

      // ── Bad days / phoenix ────────────────────────────────
      const newBadDays = xpGain < 0
        ? isNewDay ? (s.badDays ?? 0) + 1 : s.badDays ?? 0
        : 0
      const phoenix = s.phoenix || ((s.badDays ?? 0) >= 3 && xpGain > 30)

      // ── Updated done map ──────────────────────────────────
      const newDone = {
        ...s.done,
        [today]: {
          ...todayDoneSnap,
          [habit.id]: currentCount + 1,
        },
      }

      // ── Habit counts ──────────────────────────────────────
      const newHabitCounts = {
        ...(s.habitCounts ?? {}),
        [habit.id]: ((s.habitCounts ?? {})[habit.id] ?? 0) + 1,
      }

      // ── Task / vice counts for history ────────────────────
      const posTaskCount  = allHabits
        .filter((h) => h.pos)
        .reduce((a, h) => a + ((newDone[today] ?? {})[h.id] ?? 0), 0)
      const viceCount = allHabits
        .filter((h) => !h.pos)
        .reduce((a, h) => a + ((newDone[today] ?? {})[h.id] ?? 0), 0)

      // ── Update history entry ──────────────────────────────
      const existingEntry = s.history.find((h) => h.date === today)
      let newHistory
      if (existingEntry) {
        newHistory = s.history.map((h) =>
          h.date === today
            ? { ...h, xpEarned: h.xpEarned + xpGain, tasks: posTaskCount, vices: viceCount }
            : h
        )
      } else {
        newHistory = [
          ...s.history,
          { date: today, xpEarned: xpGain, tasks: posTaskCount, vices: viceCount, mood: s.mood },
        ].slice(-365)
      }

      // ── Boss battle check ─────────────────────────────────
      let extraXP       = 0
      let newBossWins   = s.bossWins ?? 0
      let bossWinDates  = s.bossWinDates ?? {}

      if (isBossDay(today) && !bossWinDates[today]) {
        const boss = getBossChallenge(today)
        const allBossTasksDone = boss.tasks.every(
          (t) => ((newDone[today] ?? {})[t] ?? 0) > 0
        )
        if (allBossTasksDone) {
          extraXP      = boss.bonus
          newBossWins  += 1
          bossWinDates = { ...bossWinDates, [today]: true }
          setTimeout(() => {
            setBossWin({ boss, bonus: boss.bonus })
            setTimeout(() => setBossWin(null), 6000)
          }, 600)
        }
      }

      // ── Clamp total XP ────────────────────────────────────
      const newTotalXP = Math.max(-9999, s.totalXP + xpGain + extraXP)

      return {
        ...s,
        totalXP:      newTotalXP,
        streak:       newStreak,
        lastDate:     today,
        done:         newDone,
        history:      newHistory,
        noJunk:       newNoJunk,
        noScreen:     newNoScreen,
        noRelapse:    newNoRelapse,
        totalDone:    (s.totalDone ?? 0) + 1,
        badDays:      newBadDays,
        phoenix,
        combo:        newCombo,
        maxCombo:     newMaxCombo,
        habitCounts:  newHabitCounts,
        graceShields: newShields,
        bossWins:     newBossWins,
        bossWinDates,
      }
    })
  }

  // ── logMood ────────────────────────────────────────────────────────────
  function logMood(value) {
    const today = todayStr()
    setState((s) => ({
      ...s,
      mood:    value,
      moodLog: { ...s.moodLog, [today]: value },
      history: s.history.map((h) =>
        h.date === today ? { ...h, mood: value } : h
      ),
    }))
  }

  // ── addJournal ─────────────────────────────────────────────────────────
  function addJournal(text, mood) {
    setState((s) => ({
      ...s,
      journal: [
        { date: todayStr(), text, mood },
        ...s.journal,
      ].slice(0, 90),
    }))
  }

  // ── addCustomHabit ─────────────────────────────────────────────────────
  function addCustomHabit(habit) {
    setState((s) => ({
      ...s,
      customHabits:          [...(s.customHabits ?? []), habit],
      customHabitsCreated:   (s.customHabitsCreated ?? 0) + 1,
    }))
  }

  // ── removeCustomHabit ──────────────────────────────────────────────────
  function removeCustomHabit(id) {
    setState((s) => ({
      ...s,
      customHabits: (s.customHabits ?? []).filter((h) => h.id !== id),
    }))
  }

  // ── incFocusSessions ──────────────────────────────────────────────────
  function incFocusSessions() {
    setState((s) => ({ ...s, focusSessions: (s.focusSessions ?? 0) + 1 }))
    showToast('🎯 Focus session complete! XP unlocked.', '#00e5ff')
  }

  // ── resetAll ──────────────────────────────────────────────────────────
  function resetAll() {
    const name = state.settings?.name ?? 'Hero'
    setState({
      ...INITIAL_STATE,
      settings: { ...INITIAL_STATE.settings, name },
    })
    prevLv.current = 1
  }

  // ── Context value ─────────────────────────────────────────────────────
  const value = {
    // State
    state,
    setState,

    // Navigation
    page,
    setPage,

    // Actions
    logHabit,
    logMood,
    addJournal,
    addCustomHabit,
    removeCustomHabit,
    incFocusSessions,
    resetAll,
    showToast,

    // UI triggers
    floats,
    levelUpData,
    setLevelUpData,
    bossWin,
    setBossWin,
    toast,

    // Derived (memoized / computed)
    allHabits,
    todayDone,
    levelData,
    rank,
    todayXP,
    psych,
  }

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}