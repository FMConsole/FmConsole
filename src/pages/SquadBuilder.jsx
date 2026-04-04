import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import SquadBuilderTool from '../tools/SquadBuilderTool'

export default function SquadBuilder() {
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
            <GradientText gradient={C.gradientBlue}>Squad Builder</GradientText>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Upload your FM squad screenshot or pick a team from the database, then build your formation.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <SquadBuilderTool />
      </Section>
    </>
  )
}
