import { useState } from 'react'

/**
 * GameIcon
 * Renders a game asset image with automatic emoji fallback.
 *
 * Props:
 *   src      — image URL (e.g. '/icons/habits/gym.webp')
 *   fallback — emoji string shown if src is null or image fails to load
 *   size     — pixel size (used for both img width/height and emoji fontSize)
 *   alt      — accessible alt text (defaults to fallback emoji)
 *   style    — additional inline styles
 *   className — additional class names
 *
 * Usage:
 *   import GameIcon from '../shared/GameIcon'
 *   import { getHabitIcon } from '../../assets/icons'
 *
 *   const icon = getHabitIcon(habit.id, habit.icon)
 *   <GameIcon src={icon.src} fallback={icon.fallback} size={28} />
 */
export default function GameIcon({
  src,
  fallback = '📋',
  size = 24,
  alt,
  style = {},
  className = '',
}) {
  const [imgError, setImgError] = useState(false)

  // Show emoji if no src provided or image failed
  if (!src || imgError) {
    return (
      <span
        className={className}
        role="img"
        aria-label={alt ?? fallback}
        style={{
          fontSize:   size,
          lineHeight: 1,
          display:    'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          ...style,
        }}
      >
        {fallback}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? fallback}
      width={size}
      height={size}
      onError={() => setImgError(true)}
      className={className}
      style={{
        objectFit:       'contain',
        display:         'inline-block',
        verticalAlign:   'middle',
        imageRendering:  'crisp-edges',
        userSelect:      'none',
        flexShrink:      0,
        ...style,
      }}
    />
  )
}