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
 * enrichedState = { ...state, level: number }
 * All check functions must be pure and handle missing/zero values safely.
 */
export const ACHIEVEMENTS = [
  {
    id:    'a1',
    label: 'First Blood',
    desc:  'Log your very first task',
    icon:  '🩸',
    rare:  false,
    check: (s) => s.totalDone >= 1,
  },
  {
    id:    'a2',
    label: '7-Day Warrior',
    desc:  'Maintain a 7-day streak',
    icon:  '🗓️',
    rare:  false,
    check: (s) => s.streak >= 7,
  },
  {
    id:    'a3',
    label: 'Iron Mind',
    desc:  'Achieve a 30-day streak',
    icon:  '🔩',
    rare:  true,
    check: (s) => s.streak >= 30,
  },
  {
    id:    'a4',
    label: 'No Junk Week',
    desc:  '7 consecutive days without junk food',
    icon:  '🥗',
    rare:  false,
    check: (s) => (s.noJunk || 0) >= 7,
  },
  {
    id:    'a5',
    label: 'Screen Slayer',
    desc:  '7 days without excess screen time',
    icon:  '🖥️',
    rare:  false,
    check: (s) => (s.noScreen || 0) >= 7,
  },
  {
    id:    'a6',
    label: 'Dopamine Detox',
    desc:  '30 days without relapse',
    icon:  '🌊',
    rare:  true,
    check: (s) => (s.noRelapse || 0) >= 30,
  },
  {
    id:    'a7',
    label: 'Monk Mode',
    desc:  '7 pure days with zero vices logged',
    icon:  '🧘',
    rare:  true,
    check: (s) => (s.pureWeek || 0) >= 7,
  },
  {
    id:    'a8',
    label: 'Combo Master',
    desc:  'Achieve a ×5 daily combo streak',
    icon:  '🔥',
    rare:  false,
    check: (s) => (s.maxCombo || 0) >= 5,
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
    id:    'a10',
    label: 'Century Club',
    desc:  'Complete 100 individual tasks',
    icon:  '💯',
    rare:  true,
    check: (s) => s.totalDone >= 100,
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
  {
    id:    'a13',
    label: 'Deep Mind',
    desc:  'Complete 10 deep work sessions total',
    icon:  '🧠',
    rare:  false,
    check: (s) => (s.habitCounts?.deepwork || 0) >= 10,
  },
  {
    id:    'a14',
    label: 'Level 10',
    desc:  'Reach Level 10',
    icon:  '⭐',
    rare:  false,
    check: (s) => (s.level || 0) >= 10,
  },
  {
    id:    'a15',
    label: 'Ascended Status',
    desc:  'Reach Level 30',
    icon:  '✨',
    rare:  true,
    check: (s) => (s.level || 0) >= 30,
  },
  {
    id:    'a16',
    label: 'Forge Master',
    desc:  'Create your first custom habit',
    icon:  '⚙️',
    rare:  false,
    check: (s) => (s.customHabitsCreated || 0) >= 1,
  },
  {
    id:    'a17',
    label: 'Focus Warrior',
    desc:  'Complete 5 Focus Mode timer sessions',
    icon:  '🎯',
    rare:  false,
    check: (s) => (s.focusSessions || 0) >= 5,
  },
  {
    id:    'a18',
    label: 'Night Owl Tamed',
    desc:  'Log quality sleep 7 times total',
    icon:  '🌙',
    rare:  false,
    check: (s) => (s.habitCounts?.sleep || 0) >= 7,
  },
]