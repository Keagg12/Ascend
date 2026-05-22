import { motion } from 'framer-motion'
import { useGame } from '../../store/GameContext'

/**
 * NAV_ITEMS
 * Each item: { id, icon, label }
 * id must match a page key in App.jsx PAGES map.
 */
const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Home'    },
  { id: 'focus',     icon: '🎯', label: 'Focus'   },
  { id: 'tasks',     icon: '⚡', label: 'Tasks'   },
  { id: 'calendar',  icon: '📅', label: 'Calendar'},
  { id: 'analytics', icon: '📊', label: 'Stats'   },
  { id: 'achieve',   icon: '🏆', label: 'Awards'  },
  { id: 'journal',   icon: '📝', label: 'Journal' },
  { id: 'settings',  icon: '⚙️', label: 'Config'  },
]

/**
 * NavBar
 * Fixed bottom navigation bar.
 * Active page indicated by a glowing cyan top-border pip.
 * Focus item pulses when combo ≥ 5 to encourage entering Focus Mode.
 */
export default function NavBar() {
  const { page, setPage, psych } = useGame()

  return (
    <nav
      style={{
        position:       'fixed',
        bottom:         0,
        left:           0,
        right:          0,
        zIndex:         1000,
        background:     'rgba(3,3,10,0.98)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop:      '1px solid rgba(255,255,255,0.06)',
        display:        'flex',
        justifyContent: 'space-around',
        alignItems:     'center',
        padding:        '4px 0',
        // Safe area padding for iOS home bar
        paddingBottom:  'max(4px, env(safe-area-inset-bottom))',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive  = page === item.id
        const isFocus   = item.id === 'focus'
        const shouldPulse = isFocus && psych.combo >= 5

        return (
          <motion.button
            key={item.id}
            onClick={() => setPage(item.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.88 }}
            style={{
              background:  'none',
              border:      'none',
              cursor:      'pointer',
              display:     'flex',
              flexDirection: 'column',
              alignItems:  'center',
              gap:         1,
              padding:     '3px 6px',
              borderRadius: 10,
              color:       isActive ? '#00e5ff' : '#3a3a80',
              transition:  'color 0.2s',
              position:    'relative',
              animation:   shouldPulse ? 'pulse 1.5s ease-in-out infinite' : 'none',
              minWidth:    36,
            }}
          >
            {/* Active pip indicator */}
            {isActive && (
              <motion.div
                layoutId="navIndicator"
                style={{
                  position:     'absolute',
                  top:          -4,
                  left:         '50%',
                  transform:    'translateX(-50%)',
                  width:        16,
                  height:       2,
                  background:   '#00e5ff',
                  borderRadius: 2,
                  boxShadow:    '0 0 8px rgba(0,229,255,0.8)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Icon */}
            <span
              style={{
                fontSize:   16,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>

            {/* Label */}
            <span
              style={{
                fontSize:      7,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontWeight:    isActive ? 700 : 400,
                fontFamily:    'Rajdhani, sans-serif',
                lineHeight:    1,
              }}
            >
              {item.label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}