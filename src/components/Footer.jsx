import { Link } from 'react-router-dom'
import C from '../theme/colors'
import GradientText from './GradientText'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Tools', to: '/tools' },
      { label: 'Database', to: '/database' },
      { label: 'Community', to: '/community' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Discord', to: '#' },
      { label: 'Twitter', to: '#' },
      { label: 'YouTube', to: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      background: C.bgLight,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px 30px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 40,
          marginBottom: 50,
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: C.gradientBlue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
              }}>
                FM
              </div>
              <GradientText style={{ fontSize: 18, fontWeight: 800 }}>FMConsole</GradientText>
            </div>
            <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>
              Your ultimate Football Manager companion. Tools, community, and guides all in one place.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <Link
                    key={l.label}
                    to={l.to}
                    style={{
                      fontSize: 14,
                      color: C.textSecondary,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = C.blue}
                    onMouseLeave={e => e.target.style.color = C.textSecondary}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            &copy; {new Date().getFullYear()} FMConsole. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            Not affiliated with Sports Interactive or SEGA.
          </p>
        </div>
      </div>
    </footer>
  )
}
