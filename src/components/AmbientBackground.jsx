import { motion } from 'framer-motion'
import { useGame } from '../store/GameContext'

/**
 * AmbientBackground
 * Three base radial gradient blobs. Now psych-aware:
 *   - blob colors shift subtly with momentum / mode
 *   - animation speed adapts to energy level
 *   - recovery mode → calmer, slower blobs
 *   - hardcore / high-momentum → slightly more vivid
 *
 * Stays at z-index: 0, pointer-events: none.
 */
export default function AmbientBackground() {
  const { psych } = useGame()
  const { momentum, burnout, mode } = psych

  const isRecovery = mode === 'recovery'
  const isHardcore = mode === 'hardcore'
  const isHighMomo = momentum > 65

  // Derive adaptive values
  const blobSpeed1 = isRecovery ? 14 : isHighMomo ? 7  : 9
  const blobSpeed2 = isRecovery ? 16 : isHighMomo ? 8  : 11
  const blobSpeed3 = isRecovery ? 18 : isHighMomo ? 10 : 14

  const cyanOpacity   = isRecovery ? 0.018 : isHighMomo ? 0.040 : 0.028
  const purpleOpacity = isRecovery ? 0.040 : isHardcore  ? 0.020 : 0.025
  const amberOpacity  = isHardcore  ? 0.035 : burnout > 60 ? 0.015 : 0.018

  // In recovery: cyan shifts to a softer indigo
  const cyanColor = isRecovery
    ? `rgba(99,102,241,${cyanOpacity})`
    : `rgba(0,229,255,${cyanOpacity})`

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        overflow:      'hidden',
        zIndex:        0,
      }}
    >
      {/* Blob 1 — top-left (cyan / indigo in recovery) */}
      <motion.div
        animate={{
          y:       ['0px', '-10px', '0px'],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration:   blobSpeed1,
          repeat:     Infinity,
          ease:       'easeInOut',
        }}
        style={{
          position:     'absolute',
          top:          '10%',
          left:         '15%',
          width:        600,
          height:       600,
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${cyanColor}, transparent 70%)`,
          filter:       'blur(60px)',
        }}
      />

      {/* Blob 2 — bottom-right (purple) */}
      <motion.div
        animate={{
          y:       ['0px', '10px', '0px'],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration:   blobSpeed2,
          repeat:     Infinity,
          ease:       'easeInOut',
          delay:      1,
        }}
        style={{
          position:     'absolute',
          bottom:       '5%',
          right:        '10%',
          width:        500,
          height:       500,
          borderRadius: '50%',
          background:   `radial-gradient(circle, rgba(168,85,247,${purpleOpacity}), transparent 70%)`,
          filter:       'blur(60px)',
        }}
      />

      {/* Blob 3 — mid-right (amber / slightly red on burnout) */}
      <motion.div
        animate={{
          y:       ['0px', '-6px', '0px'],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration:   blobSpeed3,
          repeat:     Infinity,
          ease:       'easeInOut',
          delay:      2,
        }}
        style={{
          position:     'absolute',
          top:          '40%',
          right:        0,
          width:        400,
          height:       400,
          borderRadius: '50%',
          background:   burnout > 70
            ? `radial-gradient(circle, rgba(239,68,68,${amberOpacity}), transparent 70%)`
            : `radial-gradient(circle, rgba(245,158,11,${amberOpacity}), transparent 70%)`,
          filter:       'blur(60px)',
        }}
      />
    </div>
  )
}