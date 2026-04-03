import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import SearchBar from '../../components/database/SearchBar'
import { SAMPLE_COMPETITIONS } from '../../data/sampleData'

const tabs = [
  { key: 'club', label: 'Club Competitions' },
  { key: 'national', label: 'National Competitions' },
]

export default function Competitions() {
  const nav = useNavigate()
  const [tab, setTab] = useState('club')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return SAMPLE_COMPETITIONS.filter(c => {
      if (c.type !== tab) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tab, search])

  // Group by continent
  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(c => {
      const key = c.continent || 'International'
      if (!map[key]) map[key] = []
      map[key].push(c)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <>
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16,
          }}>
            ← Back to Database
          </Link>
          <GradientText as="h1" gradient={C.gradientOrange} style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            Competitions
          </GradientText>
          <p style={{ color: C.textSecondary, fontSize: 16, margin: '12px 0 0' }}>
            Leagues, cups, and international tournaments.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                background: tab === t.key ? `${C.orange}22` : 'transparent',
                color: tab === t.key ? C.orange : C.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search competitions..." />
        </div>

        {grouped.map(([continent, comps]) => (
          <div key={continent} style={{ marginBottom: 32 }}>
            <h3 style={{
              color: C.textSecondary, fontSize: 13, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: 1,
              margin: '0 0 12px', paddingBottom: 8,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {continent}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
            }}>
              {comps.map(comp => (
                <CompCard key={comp.id} comp={comp} onClick={() => nav(`/database/competitions/${comp.id}`)} />
              ))}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textSecondary }}>
            No competitions found
          </div>
        )}
      </Section>
    </>
  )
}

function CompCard({ comp, onClick }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.gradientCard,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: C.text }}>
            {comp.name}
          </h4>
          <span style={{ fontSize: 13, color: C.textSecondary }}>
            {comp.country?.name || 'International'} · {comp.format}
          </span>
        </div>
        {comp.tier !== undefined && comp.tier > 0 && (
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: `${C.orange}22`, color: C.orange,
            fontSize: 12, fontWeight: 600,
          }}>
            Tier {comp.tier}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: C.textMuted }}>
        <span>{comp.teams} teams</span>
        <span>·</span>
        <span>Rep: {comp.reputation}</span>
      </div>
    </div>
  )
}
