import { AnimatePresence } from 'framer-motion'

// ── Context / State ────────────────────────────────────────────────────────────
import { GameProvider, useGame } from './store/GameContext'

// ── Layout ────────────────────────────────────────────────────────────────────
import Header             from './components/layout/Header'
import NavBar             from './components/layout/NavBar'
import AmbientBackground  from './components/AmbientBackground'

// ── Overlay Components ────────────────────────────────────────────────────────
import FloatLayer    from './components/shared/FloatLayer'
import Toast         from './components/shared/Toast'
import LevelUpModal  from './components/shared/LevelUpModal'
import BossWinModal  from './components/shared/BossWinModal'

// ── Pages ─────────────────────────────────────────────────────────────────────
import Dashboard    from './pages/Dashboard'
import FocusPage    from './pages/FocusPage'
import TasksPage    from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AchievePage  from './pages/AchievePage'
import JournalPage  from './pages/JournalPage'
import SettingsPage from './pages/SettingsPage'

/**
 * PAGE_MAP
 * Maps page IDs (used in state.page / NavBar) to their components.
 * Add new pages here — no other file needs to change.
 */
const PAGE_MAP = {
  dashboard: Dashboard,
  focus:     FocusPage,
  tasks:     TasksPage,
  calendar:  CalendarPage,
  analytics: AnalyticsPage,
  achieve:   AchievePage,
  journal:   JournalPage,
  settings:  SettingsPage,
}

// ── Inner shell — consumes GameContext ─────────────────────────────────────────
function AppShell() {
  const {
    page,
    floats,
    levelUpData,
    setLevelUpData,
    bossWin,
    setBossWin,
    toast,
  } = useGame()

  // Resolve current page component (fall back to Dashboard)
  const PageComponent = PAGE_MAP[page] ?? Dashboard

  return (
    <div
      style={{
        minHeight:   '100vh',
        background:  '#03030a',
        color:       '#e8e8ff',
        fontFamily:  "'Rajdhani', 'Segoe UI', sans-serif",
        overflowX:   'hidden',
        // Stacking context
        position:    'relative',
      }}
    >
      {/* ── Ambient neon blobs (z-index: 0) ── */}
      <AmbientBackground />

      {/* ── Sticky top header (z-index: 600) ── */}
      <Header />

      {/* ── Page content (z-index: 1) ── */}
      <main
        style={{
          paddingBottom: 82, // clear fixed NavBar
          position:      'relative',
          zIndex:        1,
          // Safe area for iOS notch
          paddingLeft:   'env(safe-area-inset-left)',
          paddingRight:  'env(safe-area-inset-right)',
        }}
      >
        <AnimatePresence mode="wait">
          <PageComponent key={page} />
        </AnimatePresence>
      </main>

      {/* ── Fixed bottom navigation (z-index: 1000) ── */}
      <NavBar />

      {/* ── Floating XP numbers (z-index: 9999) ── */}
      <FloatLayer floats={floats} />

      {/* ── Toast notification (z-index: 9998) ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" toast={toast} />}
      </AnimatePresence>

      {/* ── Level-up modal (z-index: 5000) ── */}
      <AnimatePresence>
        {levelUpData && (
          <LevelUpModal
            key="levelup"
            data={levelUpData}
            onClose={() => setLevelUpData(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Boss-win modal (z-index: 4999) ── */}
      <AnimatePresence>
        {bossWin && (
          <BossWinModal
            key="bosswin"
            data={bossWin}
            onClose={() => setBossWin(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * App — root component
 * Wraps the entire application in GameProvider so all descendants
 * can access game state via useGame().
 */
export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  )
}