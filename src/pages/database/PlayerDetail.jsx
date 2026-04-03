import { useParams, Link } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import AttributeBar from '../../components/database/AttributeBar'
import StatCard from '../../components/database/StatCard'
import { SAMPLE_PLAYERS, formatValue, formatWage, getAttrColor } from '../../data/sampleData'

export default function PlayerDetail() {
  const { id } = useParams()
  const player = SAMPLE_PLAYERS.find(p => p.id === id)

  if (!player) return (
    <Section>
      <p style={{ color: C.textSecondary }}>Player not found.</p>
      <Link to="/database/players" style={{ color: C.blue }}>← Back to Players</Link>
    </Section>
  )

  const p = player
  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database/players" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            ← Back to Players
          </Link>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar placeholder */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: C.surfaceHover, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 32, color: C.textSecondary, flexShrink: 0,
              border: `2px solid ${C.border}`,
            }}>
              {p.commonName?.[0] || p.name[0]}
            </div>

            <div>
              <GradientText as="h1" style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>
                {p.commonName || p.name}
              </GradientText>
              <div style={{
                display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap',
                color: C.textSecondary, fontSize: 15,
              }}>
                <span>{p.bestPosition}</span>
                <span>·</span>
                <span>{p.age} years old</span>
                <span>·</span>
                <span>{p.country.name}</span>
                <span>·</span>
                <span>{p.basedClub.name}</span>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}>
          <StatCard label="Current Ability" value={p.currentAbility} color={C.blue} />
          <StatCard label="Potential" value={p.potentialAbility} color={C.purple} />
          <StatCard label="Value" value={formatValue(p.value?.amount)} color={C.green} />
          <StatCard label="Wage" value={formatWage(p.wage)} color={C.orange} />
          <StatCard label="Position" value={p.position} color={C.blueLight} />
          <StatCard label="Best Role" value={p.bestRole} color={C.purpleLight} />
          <StatCard label="Height" value={`${p.height} cm`} />
          <StatCard label="Foot" value={p.preferredFoot} />
        </div>

        {/* Positions */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>Positions</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {p.positions.map(pos => (
              <div key={pos.position} style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: pos.rating >= 18 ? `${C.green}22` : pos.rating >= 14 ? `${C.blue}22` : `${C.orange}22`,
                border: `1px solid ${pos.rating >= 18 ? C.green : pos.rating >= 14 ? C.blue : C.orange}44`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{
                  fontWeight: 700, fontSize: 14,
                  color: pos.rating >= 18 ? C.green : pos.rating >= 14 ? C.blue : C.orange,
                }}>
                  {pos.position}
                </span>
                <span style={{ fontSize: 12, color: C.textSecondary }}>{pos.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {p.goalkeepingAttributes && (
            <AttrGroup title="Goalkeeping" attrs={p.goalkeepingAttributes} color={C.orange} />
          )}
          <AttrGroup title="Technical" attrs={p.technicalAttributes} color={C.blue} />
          <AttrGroup title="Mental" attrs={p.mentalAttributes} color={C.purple} />
          <AttrGroup title="Physical" attrs={p.physicalAttributes} color={C.green} />
        </div>

        {/* Reputation */}
        {p.reputation && (
          <div style={{ marginTop: 40 }}>
            <h3 style={{ color: C.text, margin: '0 0 16px', fontSize: 18 }}>Reputation</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              <StatCard label="Home" value={p.reputation.home} />
              <StatCard label="Current" value={p.reputation.current} />
              <StatCard label="World" value={p.reputation.world} />
            </div>
          </div>
        )}
      </Section>
    </>
  )
}

function AttrGroup({ title, attrs, color }) {
  if (!attrs) return null
  return (
    <div>
      <h3 style={{
        margin: '0 0 16px', fontSize: 18,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {title}
      </h3>
      <div style={{
        background: C.gradientCard,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
      }}>
        {Object.entries(attrs).map(([k, v]) => (
          <AttributeBar key={k} label={k} value={v} />
        ))}
      </div>
    </div>
  )
}
