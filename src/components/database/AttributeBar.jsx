import C from '../../theme/colors'
import { getAttrColor } from '../../data/sampleData'

export default function AttributeBar({ label, value, max = 20 }) {
  const pct = (value / max) * 100
  const color = getAttrColor(value)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{
        fontSize: 13,
        color: C.textSecondary,
        width: 120,
        flexShrink: 0,
        textTransform: 'capitalize',
      }}>
        {label.replace(/([A-Z])/g, ' $1').trim()}
      </span>
      <div style={{
        flex: 1,
        height: 8,
        background: C.surface,
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color,
        width: 24,
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {value}
      </span>
    </div>
  )
}
