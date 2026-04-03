import { useParams, Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import StatCard from '../../components/database/StatCard'
import DataTable from '../../components/database/DataTable'
import { SAMPLE_CLUBS, SAMPLE_PLAYERS, formatValue, getAttrColor } from '../../data/sampleData'

export default function ClubDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const club = SAMPLE_CLUBS.find(c => c.id === id)

  if (!club) return (
    <Section>
      <p style={{ color: C.textSecondary }}>Club not found.</p>
      <Link to="/database/clubs" style={{ color: C.blue }}>← Back to Clubs</Link>
    </Section>
  )

  const squad = SAMPLE_PLAYERS.filter(p => p.basedClub.id === club.id)

  const squadColumns = [
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
    { key: 'currentAbility', label: 'CA', width: '60px', align: 'center', render: v => (
      <span style={{ fontWeight: 700, color: getAttrColor(Math.round(v / 10)) }}>{v}</span>
    )},
    { key: 'value', label: 'Value', width: '100px', align: 'right', render: v => (
      <span style={{ color: C.green }}>{formatValue(v?.amount)}</span>
    )},
  ]

  return (
    <>
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database/clubs" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            ← Back to Clubs
          </Link>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: club.kitColors?.shirt || C.surfaceHover,
              border: `3px solid ${club.kitColors?.trim || C.border}`,
              flexShrink: 0,
            }} />
            <div>
              <GradientText as="h1" gradient={C.gradientGreen} style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>
                {club.name}
              </GradientText>
              <div style={{
                display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap',
                color: C.textSecondary, fontSize: 15,
              }}>
                <span>{club.competition.name}</span>
                <span>·</span>
                <span>{club.country.name}</span>
                <span>·</span>
                <span>Est. {club.yearFounded}</span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        {/* Club Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}>
          <StatCard label="Stadium" value={club.stadium?.name || '-'} />
          <StatCard label="Capacity" value={club.stadium?.capacity?.toLocaleString() || '-'} />
          <StatCard label="Reputation" value={club.reputation} color={C.orange} />
          <StatCard label="Training" value={club.trainingFacilities} />
          <StatCard label="Balance" value={formatValue(club.balance)} color={C.green} />
          <StatCard label="Transfer Budget" value={formatValue(club.transferBudget)} color={C.blue} />
        </div>

        {/* Youth */}
        {club.youth && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>Youth Development</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              <StatCard label="Facilities" value={`${club.youth.facilities}/20`} color={getAttrColor(club.youth.facilities)} />
              <StatCard label="Coaching" value={`${club.youth.coaching}/20`} color={getAttrColor(club.youth.coaching)} />
              <StatCard label="Recruitment" value={`${club.youth.recruitment}/20`} color={getAttrColor(club.youth.recruitment)} />
              <StatCard label="Importance" value={`${club.youth.importance}/20`} color={getAttrColor(club.youth.importance)} />
            </div>
          </div>
        )}

        {/* Squad */}
        <div>
          <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>
            Squad ({squad.length} players)
          </h3>
          {squad.length > 0 ? (
            <DataTable
              columns={squadColumns}
              rows={squad}
              onRowClick={row => nav(`/database/players/${row.id}`)}
            />
          ) : (
            <div style={{
              padding: 40, textAlign: 'center',
              background: C.gradientCard, borderRadius: 12,
              border: `1px solid ${C.border}`, color: C.textSecondary,
            }}>
              No player data available for this club
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
