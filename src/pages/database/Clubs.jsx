import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import SearchBar from '../../components/database/SearchBar'
import FilterBar from '../../components/database/FilterBar'
import { SAMPLE_CLUBS } from '../../data/sampleData'

const countryOptions = [...new Set(SAMPLE_CLUBS.map(c => c.country.name))].sort()
const leagueOptions = [...new Set(SAMPLE_CLUBS.map(c => c.competition.name))].sort()

const filters = [
  { key: 'country', label: 'Country', options: countryOptions },
  { key: 'league', label: 'League', options: leagueOptions },
]

export default function Clubs() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [filterVals, setFilterVals] = useState({})

  const filtered = useMemo(() => {
    return SAMPLE_CLUBS.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (filterVals.country && c.country.name !== filterVals.country) return false
      if (filterVals.league && c.competition.name !== filterVals.league) return false
      return true
    })
  }, [search, filterVals])

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
          <GradientText as="h1" gradient={C.gradientGreen} style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            Clubs
          </GradientText>
          <p style={{ color: C.textSecondary, fontSize: 16, margin: '12px 0 0' }}>
            Explore clubs, squads, finances, and facilities.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          alignItems: 'center', marginBottom: 24,
        }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search clubs..." />
          <FilterBar
            filters={filters}
            values={filterVals}
            onChange={(k, v) => setFilterVals(prev => ({ ...prev, [k]: v }))}
          />
        </div>

        <div style={{ marginBottom: 12, color: C.textSecondary, fontSize: 13 }}>
          {filtered.length} club{filtered.length !== 1 ? 's' : ''} found
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(club => (
            <ClubCard key={club.id} club={club} onClick={() => nav(`/database/clubs/${club.id}`)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textSecondary }}>
            No clubs found
          </div>
        )}
      </Section>
    </>
  )
}

function ClubCard({ club, onClick }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.gradientCard,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 14,
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? C.glowGreen : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        {/* Kit color circle */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: club.kitColors?.shirt || C.surfaceHover,
          border: `2px solid ${club.kitColors?.trim || C.border}`,
          flexShrink: 0,
        }} />
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>
            {club.name}
          </h3>
          <span style={{ fontSize: 13, color: C.textSecondary }}>
            {club.competition.name}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 16, fontSize: 13, color: C.textSecondary,
      }}>
        <span>{club.country.name}</span>
        <span>·</span>
        <span>Est. {club.yearFounded}</span>
        <span>·</span>
        <span style={{ color: C.orange }}>Rep: {club.reputation}</span>
      </div>
    </div>
  )
}
