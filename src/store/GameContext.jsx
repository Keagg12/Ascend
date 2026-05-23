import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'

import { INITIAL_STATE, STORAGE_KEY }          from './initialState'
import { DEFAULT_HABITS }                       from '../constants/habits'
import { ACHIEVEMENTS }                         from '../constants/achievements'
import { isBossDay, getBossChallenge }          from '../constants/bossChallenges'
import { calcLevel, calcXPGain }               from '../utils/xp'
import { getRank }                              from '../constants/ranks'
import { calcPsych }                           from '../utils/psych'
import { todayStr, yesterdayStr }              from '../utils/date'

// ── Context ───────────────────────────────────────────────────────────────────
const GameCtx = createContext(null)
export const useGame = () => useContext(GameCtx)

// ── Undo window duration (ms) ─────────────────────────────────────────────────
const UNDO_TTL = 12000

// ── Provider ──────────────────────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, setState]             = useState(INITIAL_STATE)
  const [floats, setFloats]           = useState([])
  const [levelUpData, setLevelUpData] = useState(null)
  const [bossWin, setBossWin]         = useState(null)
  const [toast, setToast]             = useState(null)
  const [page, setPage]               = useState('dashboard')

  /**
   * pendingUndo — shown in UndoBar for UNDO_TTL ms after each positive log.
   * Shape: { id, habit, xpGain, date } | null
   * 'id' is a unique string per log event (used as React key in UndoBar).
   * Only set for POSITIVE habits — vices are intentional, no undo offered.
   */
  const [pendingUndo, setPendingUndo] = useState(null)

  const floatId    = useRef(0)
  const prevLv     = useRef(null)
  const loaded     = useRef(false)
  const undoTimer  = useRef(null)   // auto-clears pendingUndo after UNDO_TTL

  // ── Load from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
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

  // ── Persist on state change ───────────────────────────────────────────────
  useEffect(() => {
    if (!loaded.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage quota exceeded — fail silently
    }
  }, [state])

  // ── Achievement + Level-up watcher ───────────────────────────────────────
  useEffect(() => {
    if (!loaded.current || prevLv.current === null) return
    const { lv }      = calcLevel(state.totalXP)
    const enriched    = { ...state, level: lv }
    const newUnlocked = { ...state.unlocked }
    let changed       = false

    for (const ach of ACHIEVEMENTS) {
      if (!newUnlocked[ach.id] && ach.check(enriched)) {
        newUnlocked[ach.id] = true
        changed = true
        setTimeout(() => showToast(`🏆 ${ach.label} unlocked!`, '#f59e0b'), 700)
      }
    }

    if (changed) setState((s) => ({ ...s, unlocked: newUnlocked }))

    if (prevLv.current !== null && lv > prevLv.current) {
      setLevelUpData({ lv, rank: getRank(lv) })
      prevLv.current = lv
    } else if (prevLv.current === null) {
      prevLv.current = lv
    }
  }, [
    state.totalXP, state.totalDone, state.streak,
    state.noRelapse, state.focusSessions,
    state.customHabitsCreated, state.phoenix, state.bossWins, state.maxCombo,
  ])

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  // ── allHabits memo ────────────────────────────────────────────────────────
  const allHabits = useMemo(
    () => [...DEFAULT_HABITS, ...(state.customHabits ?? [])],
    [state.customHabits]
  )

  // ── Derived values ────────────────────────────────────────────────────────
  const td        = todayStr()
  const todayDone = state.done[td] ?? {}
  const levelData = calcLevel(state.totalXP)
  const rank      = getRank(levelData.lv)
  const todayXP   = (state.history.find((h) => h.date === td) ?? {}).xpEarned ?? 0
  const psych     = calcPsych(state)

  // ── logHabit ──────────────────────────────────────────────────────────────
  function logHabit(habit, event) {
    const today         = todayStr()
    const todayDoneSnap = state.done[today] ?? {}
    const currentCount  = todayDoneSnap[habit.id] ?? 0

    if (currentCount >= habit.max) return

    const xpGain = calcXPGain(habit.xp, {
      hardcore:   state.settings?.hardcore ?? false,
      combo:      state.combo ?? 0,
      isPos:      habit.pos,
      isRecovery: psych.mode === 'recovery',
    })

    spawnFloat(xpGain, psych.combo, event?.currentTarget)

    // ── Set up undo (positive habits only) ──────────────────────────────
    if (habit.pos) {
      clearTimeout(undoTimer.current)

      const undoId = `undo_${Date.now()}_${habit.id}`
      setPendingUndo({ id: undoId, habit, xpGain, date: today })

      undoTimer.current = setTimeout(() => {
        setPendingUndo(null)
      }, UNDO_TTL)
    } else {
      // Logging a vice clears any pending undo (different action context)
      clearTimeout(undoTimer.current)
      setPendingUndo(null)
    }

    setState((s) => {
      const isNewDay = s.lastDate !== today
      const yd       = yesterdayStr()

      // ── Streak logic ─────────────────────────────────────────────────
      let newStreak  = s.streak ?? 0
      let usedShield = false

      if (isNewDay) {
        if (s.lastDate === yd) {
          newStreak = (s.streak ?? 0) + 1
        } else if (s.lastDate) {
          if ((s.graceShields ?? 0) > 0) {
            newStreak  = s.streak
            usedShield = true
            setTimeout(
              () => showToast('🛡️ Grace Shield used! Streak protected.', '#00e5ff'),
              300
            )
          } else {
            newStreak = 1
          }
        } else {
          newStreak = 1
        }
      }

      const newShields = usedShield
        ? (s.graceShields ?? 0) - 1
        : newStreak > 0 &&
          newStreak % 7 === 0 &&
          newStreak > (s.graceShields ?? 0) * 7
        ? Math.min(3, (s.graceShields ?? 0) + 1)
        : s.graceShields ?? 0

      // ── Combo ─────────────────────────────────────────────────────────
      const newCombo    = isNewDay && habit.pos ? (s.combo ?? 0) + 1 : habit.pos ? s.combo ?? 0 : 0
      const newMaxCombo = Math.max(s.maxCombo ?? 0, newCombo)

      // ── Vice streak counters ───────────────────────────────────────────
      const newNoJunk    = habit.id === 'junk'    ? 0 : isNewDay ? (s.noJunk    ?? 0) + 1 : s.noJunk    ?? 0
      const newNoScreen  = habit.id === 'screen'  ? 0 : isNewDay ? (s.noScreen  ?? 0) + 1 : s.noScreen  ?? 0
      const newNoRelapse = habit.id === 'relapse' ? 0 : isNewDay ? (s.noRelapse ?? 0) + 1 : s.noRelapse ?? 0

      // ── Bad days / phoenix ─────────────────────────────────────────────
      const newBadDays = xpGain < 0
        ? isNewDay ? (s.badDays ?? 0) + 1 : s.badDays ?? 0
        : 0
      const phoenix = s.phoenix || ((s.badDays ?? 0) >= 3 && xpGain > 30)

      // ── Updated done map ───────────────────────────────────────────────
      const newDone = {
        ...s.done,
        [today]: {
          ...todayDoneSnap,
          [habit.id]: currentCount + 1,
        },
      }

      // ── Habit counts ───────────────────────────────────────────────────
      const newHabitCounts = {
        ...(s.habitCounts ?? {}),
        [habit.id]: ((s.habitCounts ?? {})[habit.id] ?? 0) + 1,
      }

      // ── Task / vice counts for history ─────────────────────────────────
      const posTaskCount = allHabits
        .filter((h) => h.pos)
        .reduce((a, h) => a + ((newDone[today] ?? {})[h.id] ?? 0), 0)
      const viceCount = allHabits
        .filter((h) => !h.pos)
        .reduce((a, h) => a + ((newDone[today] ?? {})[h.id] ?? 0), 0)

      // ── Update history entry ───────────────────────────────────────────
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

      // ── Boss battle check ──────────────────────────────────────────────
      let extraXP      = 0
      let newBossWins  = s.bossWins ?? 0
      let bossWinDates = s.bossWinDates ?? {}

      if (isBossDay(today) && !bossWinDates[today]) {
        const boss            = getBossChallenge(today)
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

  // ── undoLastHabit ─────────────────────────────────────────────────────────
  /**
   * Reverses the most recent positive habit log within the undo window.
   * Safely decrements XP, totalDone, done[date][id], habitCounts, and history.
   * Does NOT reverse streak or combo — too complex and rarely needed.
   */
  function undoLastHabit() {
    if (!pendingUndo) return

    clearTimeout(undoTimer.current)
    const { habit, xpGain, date } = pendingUndo

    setState((s) => {
      const dayDone     = s.done[date] ?? {}
      const currentCount = dayDone[habit.id] ?? 0
      if (currentCount <= 0) return s  // safety guard — nothing to undo

      const newCount = currentCount - 1

      // Remove key entirely if count reaches 0 (clean state)
      const newDayDone = { ...dayDone }
      if (newCount <= 0) {
        delete newDayDone[habit.id]
      } else {
        newDayDone[habit.id] = newCount
      }

      const newDone = { ...s.done, [date]: newDayDone }

      // Recompute task count for history
      const posTaskCount = allHabits
        .filter((h) => h.pos)
        .reduce((a, h) => a + ((newDayDone[h.id] ?? 0)), 0)

      const newHistory = s.history.map((h) =>
        h.date === date
          ? { ...h, xpEarned: h.xpEarned - xpGain, tasks: posTaskCount }
          : h
      )

      const newHabitCounts = {
        ...(s.habitCounts ?? {}),
        [habit.id]: Math.max(0, ((s.habitCounts ?? {})[habit.id] ?? 0) - 1),
      }

      return {
        ...s,
        totalXP:     Math.max(-9999, s.totalXP - xpGain),
        totalDone:   Math.max(0, (s.totalDone ?? 0) - 1),
        done:        newDone,
        history:     newHistory,
        habitCounts: newHabitCounts,
      }
    })

    setPendingUndo(null)
    showToast('↩ Action undone', '#a855f7')
  }

  // ── logMood ───────────────────────────────────────────────────────────────
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

  // ── addJournal ────────────────────────────────────────────────────────────
  function addJournal(text, mood) {
    setState((s) => ({
      ...s,
      journal: [
        { date: todayStr(), text, mood },
        ...s.journal,
      ].slice(0, 90),
    }))
  }

  // ── addCustomHabit ────────────────────────────────────────────────────────
  function addCustomHabit(habit) {
    setState((s) => ({
      ...s,
      customHabits:        [...(s.customHabits ?? []), habit],
      customHabitsCreated: (s.customHabitsCreated ?? 0) + 1,
    }))
  }

  // ── removeCustomHabit ─────────────────────────────────────────────────────
  function removeCustomHabit(id) {
    setState((s) => ({
      ...s,
      customHabits: (s.customHabits ?? []).filter((h) => h.id !== id),
    }))
  }

  // ── incFocusSessions ──────────────────────────────────────────────────────
  function incFocusSessions() {
    setState((s) => ({ ...s, focusSessions: (s.focusSessions ?? 0) + 1 }))
    showToast('🎯 Focus session complete!', '#00e5ff')
  }

  // ── resetAll ──────────────────────────────────────────────────────────────
  function resetAll() {
    clearTimeout(undoTimer.current)
    setPendingUndo(null)
    const name = state.settings?.name ?? 'Hero'
    setState({ ...INITIAL_STATE, settings: { ...INITIAL_STATE.settings, name } })
    prevLv.current = 1
  }

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    state, setState,
    page, setPage,
    logHabit, logMood,
    addJournal, addCustomHabit, removeCustomHabit,
    incFocusSessions, resetAll, showToast,
    floats, levelUpData, setLevelUpData,
    bossWin, setBossWin, toast,
    // Undo system
    pendingUndo, undoLastHabit,
    // Derived
    allHabits, todayDone, levelData, rank, todayXP, psych,
  }

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}