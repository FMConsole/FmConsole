import { useState } from 'react'
import C from '../theme/colors'

export default function Card({ children, glow, onClick, style: sx }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.gradientCard,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 16,
        padding: 28,
        transition: 'all 0.3s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? (glow || C.glowBlue) : C.shadow,
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
    >
      {children}
    </div>
  )
}
