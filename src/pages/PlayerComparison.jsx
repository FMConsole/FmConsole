import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import PlayerComparisonTool from '../tools/PlayerComparisonTool'

export default function PlayerComparison() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 32, paddingTop: 48 }}>
          <Link to="/tools" style={{
            fontSize: 13, color: C.textSecondary, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>&larr;</span> Back to Tools
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
            <GradientText gradient="linear-gradient(135deg, #7C4DFF, #0066FF)">Player Comparison</GradientText>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Upload FM player attribute screenshots to compare players side-by-side
            with radar charts and detailed attribute breakdowns.
          </p>
        </Section>
      </div>

      {/* Tool */}
      <Section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <PlayerComparisonTool />
      </Section>
    </>
  )
}
