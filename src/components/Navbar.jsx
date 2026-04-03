import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import C from '../theme/colors'
import GradientText from './GradientText'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
  { to: '/database', label: 'Database' },
  { to: '/community', label: 'Community' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: C.gradientBlue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 900,
          }}>
            FM
          </div>
          <GradientText style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
            FMConsole
          </GradientText>
        </Link>

        {/* Desktop links */}
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
          className="nav-desktop"
        >
          {NAV_LINKS.map(l => {
            const active = l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to)
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.blue : C.textSecondary,
                  background: active ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: 24,
              height: 2,
              background: C.text,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                : i === 1 ? 'opacity(0)' : 'rotate(-45deg) translate(5px, -5px)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            padding: '8px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: 'rgba(10, 14, 23, 0.95)',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {NAV_LINKS.map(l => {
            const active = l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to)
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.blue : C.textSecondary,
                  background: active ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
