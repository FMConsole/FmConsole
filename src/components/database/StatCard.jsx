import C from '../../theme/colors'

export default function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: C.gradientCard,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      {icon && (
        <span style={{ fontSize: 20, marginBottom: 2 }}>{icon}</span>
      )}
      <span style={{
        fontSize: 12,
        color: C.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 600,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 22,
        fontWeight: 700,
        color: color || C.text,
      }}>
        {value}
      </span>
    </div>
  )
}
