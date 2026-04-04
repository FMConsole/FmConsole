import { useState } from 'react'
import C from '../theme/colors'

const tagColors = {
  green: C.green,
  orange: C.orange,
  blue: C.blue,
  purple: C.purple,
}

export default function AffiliateCard({ name, url, store, tag, tagColor = 'blue' }) {
  const [hov, setHov] = useState(false)
  const color = tagColors[tagColor] || C.blue

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: C.gradientCard,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 16,
        padding: 24,
        transition: 'all 0.3s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? C.glowBlue : C.shadow,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          padding: '3px 10px',
          borderRadius: 5,
          background: `${color}18`,
          color,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
          {tag}
        </span>
        <span style={{ fontSize: 12, color: C.textMuted }}>
          {store}
        </span>
      </div>
      <h4 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 14 }}>
        {name}
      </h4>
      <div style={{
        display: 'inline-block',
        padding: '8px 20px',
        borderRadius: 10,
        background: C.gradientBlue,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
      }}>
        Get It
      </div>
      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 10 }}>
        Affiliate link
      </div>
    </a>
  )
}
