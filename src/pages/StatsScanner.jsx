import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import StatsScannerTool from '../tools/StatsScannerTool'

const STORAGE_KEY = 'fmc_scanner_user'

function LoginGate({ onLogin }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed.length < 2) {
      setError('Enter at least 2 characters')
      return
    }
    localStorage.setItem(STORAGE_KEY, trimmed)
    onLogin(trimmed)
  }

  return (
    <div style={{
      maxWidth: 420, margin: '0 auto', padding: '60px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
    }}>
      <div style={{ fontSize: 48 }}>📊</div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>
          <GradientText gradient={C.gradientBlue}>Stats Scanner</GradientText>
        </h2>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>
          Upload FM screenshots, extract player stats via OCR, and export as CSV.
          Enter your name to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Your name or manager name..."
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.surfaceLight, color: C.text,
            border: `1px solid ${error ? '#e05050' : C.border}`, borderRadius: 10,
            padding: '14px 16px', fontSize: 15,
            fontFamily: 'Inter, sans-serif', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = C.blue }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = C.border }}
        />
        {error && <div style={{ color: '#e05050', fontSize: 12, marginTop: -4 }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: '100%', padding: '14px 0', borderRadius: 10,
            background: C.gradientBlue, border: 'none',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            letterSpacing: 0.3,
          }}
        >
          Get Started
        </button>
      </form>
    </div>
  )
}

export default function StatsScanner() {
  const [user, setUser] = useState(() => localStorage.getItem(STORAGE_KEY) || '')

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser('')
  }

  return (
    <>
      {/* Hero */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: user ? 20 : 32, paddingTop: 48 }}>
          <Link to="/tools" style={{
            fontSize: 13, color: C.textSecondary, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>&larr;</span> Back to Tools
          </Link>
          {!user && (
            <>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
                <GradientText gradient={C.gradientBlue}>Stats Scanner</GradientText>
              </h1>
              <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
                Upload your FM squad stats screenshots. OCR extracts the data — export as CSV or copy to clipboard.
              </p>
            </>
          )}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900 }}>
                <GradientText gradient={C.gradientBlue}>Stats Scanner</GradientText>
              </h1>
              <span style={{ color: C.textMuted, fontSize: 13 }}>—</span>
              <span style={{ color: C.textSecondary, fontSize: 14, fontWeight: 600 }}>{user}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                  color: C.textMuted, fontSize: 11, padding: '4px 10px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                }}
              >
                Log out
              </button>
            </div>
          )}
        </Section>
      </div>

      {/* Content */}
      <Section style={{ paddingTop: 24, paddingBottom: 48 }}>
        {!user ? (
          <LoginGate onLogin={setUser} />
        ) : (
          <StatsScannerTool user={user} />
        )}
      </Section>
    </>
  )
}
