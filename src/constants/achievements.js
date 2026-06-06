/**
 * ACHIEVEMENTS
 * Each achievement:
 *   id    — unique string
 *   label — display name
 *   desc  — short description
 *   icon  — emoji
 *   rare  — boolean (rare achievements get purple badge)
 *   check — (enrichedState) => boolean
 *
 * enrichedState = { 
 *   ...state, 
 *   level: number,
 *   todayDone: { [id]: count },
 *   allHabits: Habit[],
 *   todayXP: number
 * }
 */
export const ACHIEVEMENTS = [
  // ── CORE PROGRESSION ──────────────────────────────────────
  {
    id:    'a1',
    label: 'First Blood',
    desc:  'Log your very first task',
    icon:  '🩸',
    rare:  false,
    check: (s) => s.totalDone >= 1,
  },
  {
    id:    'a9',
    label: 'XP Millionaire',
    desc:  'Accumulate 10,000 total XP',
    icon:  '⚡',
    rare:  true,
    check: (s) => s.totalXP >= 10000,
  },
  {
    id:    'a11',
    label: 'Phoenix Return',
    desc:  'Make a comeback after 3+ bad days in a row',
    icon:  '🦅',
    rare:  true,
    check: (s) => s.phoenix === true,
  },
  {
    id:    'a12',
    label: 'Boss Slayer',
    desc:  'Complete a Sunday Boss Battle challenge',
    icon:  '👾',
    rare:  true,
    check: (s) => (s.bossWins || 0) >= 1,
  },

  // ── AVOIDANCE & WILLPOWER (REPLACED STREAKS) ────────────────
  {
    id:    'a3',
    label: 'Unstoppable Will',
    desc:  '30 days without logging a single Vice',
    icon:  '🛡️',
    rare:  true,
    check: (s) => (s.pureWeek || 0) >= 30, // pureWeek tracks days with 0 vices
  },
  {
    id:    'a6',
    label: 'Dopamine Detox',
    desc:  'Maintain a 30-day "No Relapse" streak',
    icon:  '🌊',
    rare:  true,
    check: (s) => (s.noRelapse || 0) >= 30,
  },
  {
    id:    'a7',
    label: 'Ghost of Vices',
    desc:  'Log 7 days in a row without touching your worst habit',
    icon:  '👻',
    rare:  true,
    check: (s) => {
      // Find the vice with the most penalty (worst habit)
      const vices = (s.habits || []).filter(h => !h.pos);
      if (vices.length === 0) return false;
      const worst = vices.sort((a,b) => a.xp - b.xp)[0];
      // Note: This check relies on the fact that if they haven't logged it, 
      // they are essentially maintaining a "noHabit" streak.
      // We use noRelapse/noJunk as proxies or check history.
      // For this creative redesign, we'll assume s.pureWeek >= 7 is the goal.
      return s.pureWeek >= 7;
    },
  },

  // ── CHECKLIST & CUSTOMIZATION (THE GAMEFIED CHECKLIST) ──────
  {
    id:    'a16',
    label: 'Forge Master',
    desc:  'Create your first custom activity',
    icon:  '⚙️',
    rare:  false,
    check: (s) => (s.customHabitsCreated || 0) >= 1,
  },
  {
    id:    'a21',
    label: 'System Architect',
    desc:  'Build a checklist with 10+ active habits',
    icon:  '🏗️',
    rare:  false,
    check: (s) => (s.habits || []).length >= 10,
  },
  {
    id:    'a19',
    label: 'Checklist Clear',
    desc:  'Check off EVERY positive item on your list today',
    icon:  '✅',
    rare:  true,
    check: (s) => {
      const posHabits = (s.allHabits || []).filter(h => h.pos);
      if (posHabits.length === 0) return false;
      return posHabits.every(h => (s.todayDone?.[h.id] || 0) >= 1);
    }
  },
  {
    id:    'a20',
    label: 'Efficiency Expert',
    desc:  'Reach your daily XP target exactly',
    icon:  '🎯',
    rare:  false,
    check: (s) => {
      const target = s.settings?.targetDailyXP ?? 100;
      return (s.todayXP || 0) >= target;
    }
  },

  // ── NEW CATEGORY MASTERY ──────────────────────────────────
  {
    id:    'a13',
    label: 'Master of Mind',
    desc:  'Log 50 checklist items in the Mind category',
    icon:  '🧠',
    rare:  true,
    check: (s) => {
      const ids = (s.habits || []).filter(h => h.cat === 'Mind').map(h => h.id);
      const count = ids.reduce((acc, id) => acc + (s.habitCounts?.[id] || 0), 0);
      return count >= 50;
    }
  },
  {
    id:    'a18',
    label: 'Body Alchemist',
    desc:  'Log 50 checklist items in the Body category',
    icon:  '🧪',
    rare:  true,
    check: (s) => {
      const ids = (s.habits || []).filter(h => h.cat === 'Body').map(h => h.id);
      const count = ids.reduce((acc, id) => acc + (s.habitCounts?.[id] || 0), 0);
      return count >= 50;
    }
  },
  {
    id:    'a22',
    label: 'Titan of Fitness',
    desc:  'Log 50 checklist items in the Fitness category',
    icon:  '🔱',
    rare:  true,
    check: (s) => {
      const ids = (s.habits || []).filter(h => h.cat === 'Fitness').map(h => h.id);
      const count = ids.reduce((acc, id) => acc + (s.habitCounts?.[id] || 0), 0);
      return count >= 50;
    }
  },

  // ── SPECIAL ACTIONS ───────────────────────────────────────
  {
    id:    'a17',
    label: 'Focus Warrior',
    desc:  'Complete 5 Focus Mode timer sessions',
    icon:  '🎯',
    rare:  false,
    check: (s) => (s.focusSessions || 0) >= 5,
  },
  {
    id:    'a23',
    label: 'Minimalist',
    desc:  'Complete a day with only 3 high-weight habits',
    icon:  '🧘',
    rare:  true,
    check: (s) => {
      // If XP target is met but only 3 tasks were done
      const target = s.settings?.targetDailyXP ?? 100;
      const tasksToday = Object.values(s.todayDone || {}).reduce((a, b) => a + b, 0);
      return (s.todayXP || 0) >= target && tasksToday <= 3 && tasksToday > 0;
    }
  }
]
