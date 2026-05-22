/**
 * AmbientBackground
 * Three fixed radial gradient blobs that create the
 * atmospheric neon glow behind all page content.
 * Pointer-events: none — never interferes with interaction.
 * z-index: 0 — always behind content (content uses z-index: 1+).
 */
export default function AmbientBackground() {
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
      {/* Cyan blob — top-left */}
      <div
        style={{
          position:     'absolute',
          top:          '10%',
          left:         '15%',
          width:        600,
          height:       600,
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(0,229,255,0.028), transparent 70%)',
          filter:       'blur(60px)',
          animation:    'float 9s ease-in-out infinite',
        }}
      />

      {/* Purple blob — bottom-right */}
      <div
        style={{
          position:     'absolute',
          bottom:       '5%',
          right:        '10%',
          width:        500,
          height:       500,
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(168,85,247,0.025), transparent 70%)',
          filter:       'blur(60px)',
          animation:    'float 11s ease-in-out infinite reverse',
        }}
      />

      {/* Amber blob — mid-right */}
      <div
        style={{
          position:     'absolute',
          top:          '40%',
          right:        0,
          width:        400,
          height:       400,
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(245,158,11,0.018), transparent 70%)',
          filter:       'blur(60px)',
        }}
      />
    </div>
  )
}