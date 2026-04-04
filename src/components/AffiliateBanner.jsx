import { useState } from 'react'
import C from '../theme/colors'

export default function AffiliateBanner({ name, url, store, label = 'Get it now' }) {
  const [hov, setHov] = useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        textDecoration: 'none',
        background: C.surface,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 12,
        padding: '14px 20px',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
          {name}
        </span>
        <span style={{ fontSize: 12, color: C.textMuted }}>
          on {store}
        </span>
        <span style={{ fontSize: 10, color: C.textMuted }}>
          Affiliate
        </span>
      </div>
      <span style={{
        padding: '6px 16px',
        borderRadius: 8,
        background: hov ? C.gradientBlue : `${C.blue}18`,
        color: hov ? '#fff' : C.blue,
        fontSize: 13,
        fontWeight: 600,
        transition: 'all 0.2s ease',
      }}>
        {label}
      </span>
    </a>
  )
}
