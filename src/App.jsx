import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from './store/GameContext'

// Layout
import Header            from './components/layout/Header'
import NavBar            from './components/layout/NavBar'
import AmbientBackground from './components/AmbientBackground'
import PsychAtmosphere   from './components/PsychAtmosphere'
import UndoBar           from './components/UndoBar'

// Shared UI
import Toast             from './components/shared/Toast'
import LevelUpModal      from './components/shared/LevelUpModal'
import BossWinModal      from './components/shared/BossWinModal'
import FloatLayer        from './components/shared/FloatLayer'

// Pages
import Dashboard         from './pages/Dashboard'
import TasksPage         from './pages/TasksPage'
import FocusPage         from './pages/FocusPage'
import CalendarPage      from './pages/CalendarPage'
import AnalyticsPage     from './pages/AnalyticsPage'
import AchievePage       from './pages/AchievePage'
import JournalPage       from './pages/JournalPage'
import SettingsPage      from './pages/SettingsPage'

/**
 * App
 * Main application shell.
 * Handles page routing, global overlays, and the persistent layout (Header/NavBar).
 * Wraps everything in GameProvider (in main.jsx).
 */
export default function App() {
  const { 
    page, 
    toast, 
    levelUpData, setLevelUpData, 
    bossWin, setBossWin, 
    floats 
  } = useGame()

  // ── Page routing ──────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'tasks':     return <TasksPage />
      case 'focus':     return <FocusPage />
      case 'calendar':  return <CalendarPage />
      case 'analytics': return <AnalyticsPage />
      case 'achieve':   return <AchievePage />
      case 'journal':   return <JournalPage />
      case 'settings':  return <SettingsPage />
      default:          return <Dashboard />
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Background & Atmosphere ── */}
      <AmbientBackground />
      <PsychAtmosphere />

      {/* ── Fixed UI Layers ── */}
      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>

      <UndoBar />
      <FloatLayer floats={floats} />

      <AnimatePresence>
        {levelUpData && (
          <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bossWin && (
          <BossWinModal data={bossWin} onClose={() => setBossWin(null)} />
        )}
      </AnimatePresence>

      {/* ── Persistent Layout ── */}
      <Header />

      <main style={{ flex: 1, paddingBottom: 100, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: '100%' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <NavBar />
    </div>
  )
}
