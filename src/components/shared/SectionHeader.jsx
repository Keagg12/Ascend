/**
 * SectionHeader
 * Consistent page-level heading used at the top of every page.
 *
 * Props:
 *   title — main heading string
 *   sub   — optional subtitle string
 */
export default function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h2
        style={{
          fontFamily: 'Orbitron, monospace',
          color:      '#00e5ff',
          fontSize:   20,
          fontWeight: 900,
          marginBottom: sub ? 3 : 0,
          textShadow: '0 0 20px rgba(0,229,255,0.3)',
        }}
      >
        {title}
      </h2>

      {sub && (
        <p
          style={{
            color:      '#5558aa',
            fontSize:   13,
            fontFamily: 'Rajdhani, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}