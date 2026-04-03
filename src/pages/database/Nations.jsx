import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import SearchBar from '../../components/database/SearchBar'
import { SAMPLE_NATIONS, CONTINENTS } from '../../data/sampleData'

export default function Nations() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('')

  const filtered = useMemo(() => {
    return SAMPLE_NATIONS.filter(n => {
      if (search && !n.name.toLowerCase().includes(search.toLowerCase())) return false
      if (continent && n.continent !== continent) return false
      return true
    })
  }, [search, continent])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => a.fifaRanking - b.fifaRanking)
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
          <GradientText as="h1" gradient="linear-gradient(135deg, #7C4DFF, #E040FB)" style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            Nations
          </GradientText>
          <p style={{ color: C.textSecondary, fontSize: 16, margin: '12px 0 0' }}>
            National team profiles, rankings, and competition entries.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        {/* Continent tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => setContinent('')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: !continent ? `${C.purple}22` : 'transparent',
              color: !continent ? C.purple : C.textSecondary,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >All</button>
          {CONTINENTS.map(c => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: continent === c ? `${C.purple}22` : 'transparent',
                color: continent === c ? C.purple : C.textSecondary,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >{c}</button>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search nations..." />
        </div>

        <div style={{ marginBottom: 12, color: C.textSecondary, fontSize: 13 }}>
          {sorted.length} nation{sorted.length !== 1 ? 's' : ''} found
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
        }}>
          {sorted.map(nation => (
            <NationCard key={nation.id} nation={nation} onClick={() => nav(`/database/nations/${nation.id}`)} />
          ))}
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textSecondary }}>
            No nations found
          </div>
        )}
      </Section>
    </>
  )
}

function NationCard({ nation, onClick }) {
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
        padding: 22,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>
          {nation.name}
        </h4>
        <span style={{
          padding: '4px 10px', borderRadius: 6,
          background: `${C.purple}22`, color: C.purpleLight,
          fontSize: 13, fontWeight: 700,
        }}>
          #{nation.fifaRanking}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: C.textSecondary }}>
        <span>{nation.continent}</span>
        <span>·</span>
        <span>Rep: {nation.reputation}</span>
      </div>
    </div>
  )
}
