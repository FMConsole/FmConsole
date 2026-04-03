import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import StatCard from '../../components/database/StatCard'
import DataTable from '../../components/database/DataTable'
import { SAMPLE_NATIONS, SAMPLE_PLAYERS, SAMPLE_COMPETITIONS, getAttrColor } from '../../data/sampleData'

export default function NationDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const nation = SAMPLE_NATIONS.find(n => n.id === id)

  if (!nation) return (
    <Section>
      <p style={{ color: C.textSecondary }}>Nation not found.</p>
      <Link to="/database/nations" style={{ color: C.blue }}>← Back to Nations</Link>
    </Section>
  )

  const players = SAMPLE_PLAYERS.filter(p => p.country.id === nation.id)
  const comps = SAMPLE_COMPETITIONS.filter(c => nation.competitions?.includes(c.id))

  const playerColumns = [
    { key: 'name', label: 'Player', render: (v, row) => (
      <span style={{ fontWeight: 600 }}>{row.commonName || row.name}</span>
    )},
    { key: 'age', label: 'Age', width: '60px', align: 'center' },
    { key: 'position', label: 'Pos', width: '70px', align: 'center', render: v => (
      <span style={{
        padding: '3px 8px', borderRadius: 6,
        background: `${C.blue}22`, color: C.blueLight,
        fontSize: 12, fontWeight: 600,
      }}>{v}</span>
    )},
    { key: 'basedClub', label: 'Club', render: v => v?.name || '-' },
    { key: 'currentAbility', label: 'CA', width: '60px', align: 'center', render: v => (
      <span style={{ fontWeight: 700, color: getAttrColor(Math.round(v / 10)) }}>{v}</span>
    )},
  ]

  return (
    <>
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database/nations" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            ← Back to Nations
          </Link>
          <GradientText as="h1" gradient="linear-gradient(135deg, #7C4DFF, #E040FB)" style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>
            {nation.name}
          </GradientText>
          <div style={{
            display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap',
            color: C.textSecondary, fontSize: 15,
          }}>
            <span>{nation.continent}</span>
            <span>·</span>
            <span>FIFA Ranking: #{nation.fifaRanking}</span>
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
          <StatCard label="FIFA Ranking" value={`#${nation.fifaRanking}`} color={C.purple} />
          <StatCard label="Reputation" value={nation.reputation} color={C.orange} />
          <StatCard label="Continent" value={nation.continent} />
          <StatCard label="Competitions" value={comps.length} color={C.blue} />
        </div>

        {/* Competitions */}
        {comps.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>Competitions</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {comps.map(c => (
                <CompChip key={c.id} comp={c} onClick={() => nav(`/database/competitions/${c.id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        <div>
          <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>
            Players ({players.length})
          </h3>
          {players.length > 0 ? (
            <DataTable
              columns={playerColumns}
              rows={players}
              onRowClick={row => nav(`/database/players/${row.id}`)}
            />
          ) : (
            <div style={{
              padding: 40, textAlign: 'center',
              background: C.gradientCard, borderRadius: 12,
              border: `1px solid ${C.border}`, color: C.textSecondary,
            }}>
              No player data available for this nation
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

function CompChip({ comp, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 18px', borderRadius: 10,
        background: hov ? C.surfaceHover : C.surface,
        border: `1px solid ${C.border}`,
        cursor: 'pointer', transition: 'background 0.2s ease',
        fontSize: 14, fontWeight: 600, color: C.text,
      }}
    >
      {comp.name}
    </div>
  )
}
