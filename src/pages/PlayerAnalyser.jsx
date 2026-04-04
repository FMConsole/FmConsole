import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import PlayerAnalyserTool from '../tools/PlayerAnalyserTool'

export default function PlayerAnalyser() {
  return (
    <>
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 32, paddingTop: 48 }}>
          <Link to="/tools" style={{
            fontSize: 13, color: C.textSecondary, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>&larr;</span> Back to Tools
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
            <GradientText gradient={C.gradientBlue}>Player Analyser</GradientText>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Upload a player screenshot for a deep attribute analysis with radar charts, position fit scores, and strengths &amp; weaknesses.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <PlayerAnalyserTool />
      </Section>
    </>
  )
}
