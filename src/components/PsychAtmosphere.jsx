import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/GameContext'

/**
 * PsychAtmosphere
 * Renders subtle full-screen atmospheric overlays that react
 * to the player's psychological state. Zero layout impact.
 *
 * States handled:
 *   recovery  → healing lavender calm pulse
 *   burnout>70→ faint red weight
 *   momentum>70+streak≥7 → energetic cyan surge
 *   hardcore  → amber edge intensity
 *   combo≥5   → golden arc shimmer
 *
 * All overlays use very low opacity (0.03–0.07).
 * Pointer-events: none — never blocks interaction.
 */
export default function PsychAtmosphere() {
  const { psych, state } = useGame()
  const { momentum, burnout, mode, combo } = psych
  const streak = state.streak ?? 0

  // ── Determine which overlay(s) are active ──────────────────────────────
  const isRecovery  = mode === 'recovery'
  const isHardcore  = mode === 'hardcore'
  const isHighBurn  = burnout > 70
  const isHighMomo  = momentum > 70 && streak >= 7
  const isComboFire = combo >= 5

  // Pulse animation speed — calmer in recovery, faster in high-energy
  const recoveryPulse = { duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
  const energyPulse   = { duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
  const burnPulse     = { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }

  const base = {
    position:      'fixed',
    inset:         0,
    pointerEvents: 'none',
    zIndex:        0,
  }

  return (
    <div aria-hidden="true" style={{ ...base }}>

      {/* ── Recovery: healing lavender bloom ── */}
      <AnimatePresence>
        {isRecovery && (
          <motion.div
            key="recovery-atm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* Top-left soft lavender */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
              transition={recoveryPulse}
              style={{
                position:     'absolute',
                top:          '-10%',
                left:         '-5%',
                width:        500,
                height:       500,
                borderRadius: '50%',
                background:   'radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)',
                filter:       'blur(80px)',
              }}
            />
            {/* Bottom-right healing teal */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] }}
              transition={{ ...recoveryPulse, delay: 2 }}
              style={{
                position:     'absolute',
                bottom:       '-5%',
                right:        '-5%',
                width:        400,
                height:       400,
                borderRadius: '50%',
                background:   'radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)',
                filter:       'blur(70px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── High Burnout: subtle red weight overlay ── */}
      <AnimatePresence>
        {isHighBurn && !isRecovery && (
          <motion.div
            key="burn-atm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            exit={{ opacity: 0 }}
            transition={burnPulse}
            style={{
              position:     'absolute',
              bottom:       '-20%',
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        700,
              height:       400,
              borderRadius: '50%',
              background:   'radial-gradient(circle, rgba(239,68,68,0.04), transparent 70%)',
              filter:       'blur(80px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── High Momentum + Streak: energetic cyan surge ── */}
      <AnimatePresence>
        {isHighMomo && !isRecovery && !isHighBurn && (
          <motion.div
            key="momo-atm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
              transition={energyPulse}
              style={{
                position:     'absolute',
                top:          '-15%',
                right:        '-10%',
                width:        500,
                height:       500,
                borderRadius: '50%',
                background:   'radial-gradient(circle, rgba(0,229,255,0.06), transparent 70%)',
                filter:       'blur(70px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hardcore Mode: amber edge intensity ── */}
      <AnimatePresence>
        {isHardcore && (
          <motion.div
            key="hc-atm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to bottom, rgba(245,158,11,0.025) 0%, transparent 30%, transparent 70%, rgba(245,158,11,0.02) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Combo ≥ 5: golden shimmer arc at top ── */}
      <AnimatePresence>
        {isComboFire && (
          <motion.div
            key="combo-atm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror' }}
            style={{
              position:     'absolute',
              top:          0,
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        '80%',
              height:       200,
              borderRadius: '0 0 50% 50%',
              background:   'radial-gradient(ellipse at top, rgba(255,107,53,0.06), transparent 70%)',
              filter:       'blur(40px)',
            }}
          />
        )}
      </AnimatePresence>

    </div>
  )
}