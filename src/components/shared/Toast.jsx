import { motion } from 'framer-motion'

/**
 * Toast
 * Animated notification bar that slides in from the top.
 * Wrap in <AnimatePresence> at call site for exit animation.
 *
 * Props:
 *   toast — { msg: string, color: string }
 */
export default function Toast({ toast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, x: '-50%' }}
      animate={{ opacity: 1, y: 0,   x: '-50%' }}
      exit={{    opacity: 0, y: -30,  x: '-50%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        position:       'fixed',
        top:            68,
        left:           '50%',
        zIndex:         9998,
        background:     'rgba(5,5,18,0.97)',
        border:         `1px solid ${toast.color}50`,
        borderRadius:   12,
        padding:        '10px 22px',
        color:          toast.color,
        fontSize:       14,
        fontWeight:     700,
        fontFamily:     'Rajdhani, sans-serif',
        backdropFilter: 'blur(20px)',
        boxShadow:      `0 0 24px ${toast.color}30`,
        whiteSpace:     'nowrap',
        userSelect:     'none',
      }}
    >
      {toast.msg}
    </motion.div>
  )
}