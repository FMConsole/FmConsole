import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import StatCard from '../../components/database/StatCard'
import { SAMPLE_COMPETITIONS, SAMPLE_CLUBS } from '../../data/sampleData'

export default function CompetitionDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const comp = SAMPLE_COMPETITIONS.find(c => c.id === id)

  if (!comp) return (
    <Section>
      <p style={{ color: C.textSecondary }}>Competition not found.</p>
      <Link to="/database/competitions" style={{ color: C.blue }}>← Back to Competitions</Link>
    </Section>
  )

  const clubs = SAMPLE_CLUBS.filter(c => c.competition.id === comp.id)

  return (
    <>
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database/competitions" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            ← Back to Competitions
          </Link>
          <GradientText as="h1" gradient={C.gradientOrange} style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>
            {comp.name}
          </GradientText>
          <div style={{
            display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap',
            color: C.textSecondary, fontSize: 15,
          }}>
            <span>{comp.country?.name || 'International'}</span>
            <span>·</span>
            <span>{comp.format}</span>
            {comp.tier > 0 && <><span>·</span><span>Tier {comp.tier}</span></>}
          </div>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}>
          <StatCard label="Teams" value={comp.teams} color={C.blue} />
          <StatCard label="Reputation" value={comp.reputation} color={C.orange} />
          <StatCard label="Format" value={comp.format} />
          <StatCard label="Continent" value={comp.continent || 'Global'} />
        </div>

        {clubs.length > 0 && (
          <div>
            <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>
              Clubs ({clubs.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
            }}>
              {clubs.map(club => (
                <ClubMini key={club.id} club={club} onClick={() => nav(`/database/clubs/${club.id}`)} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  )
}

function ClubMini({ club, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 16, borderRadius: 10,
        background: hov ? C.surfaceHover : C.surface,
        border: `1px solid ${C.border}`,
        cursor: 'pointer', transition: 'background 0.2s ease',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: club.kitColors?.shirt || C.surfaceHover,
        border: `2px solid ${club.kitColors?.trim || C.border}`,
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{club.name}</div>
        <div style={{ fontSize: 12, color: C.textSecondary }}>{club.country.name}</div>
      </div>
    </div>
  )
}

