import { useState } from 'react'
import C from '../theme/colors'

export default function Button({ children, variant = 'primary', onClick, href, style: sx }) {
  const [hov, setHov] = useState(false)

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    transform: hov ? 'translateY(-2px)' : 'none',
  }

  const variants = {
    primary: {
      background: C.gradientBlue,
      color: '#fff',
      boxShadow: hov ? C.glowBlue : C.shadow,
    },
    secondary: {
      background: C.surface,
      color: '#fff',
      border: `1px solid ${C.border}`,
      boxShadow: hov ? `0 0 20px rgba(0,102,255,0.15)` : 'none',
    },
    outline: {
      background: 'transparent',
      color: C.blue,
      border: `2px solid ${C.blue}`,
      boxShadow: hov ? C.glowBlue : 'none',
    },
    orange: {
      background: C.gradientOrange,
      color: '#fff',
      boxShadow: hov ? C.glowOrange : C.shadow,
    },
  }

  const s = { ...base, ...variants[variant], ...sx }

  const props = {
    style: s,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onClick,
  }

  if (href) return <a href={href} {...props}>{children}</a>
  return <button {...props}>{children}</button>
}
