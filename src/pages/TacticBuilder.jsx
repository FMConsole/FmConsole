import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import TacticsBoard from '../tools/TacticsBoard'

export default function TacticBuilder() {
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
            <GradientText>Tactic Builder</GradientText>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 480, margin: '0 auto' }}>
            Visualize formations on an interactive pitch. Pick a formation, toggle the layout, and plan your tactics.
          </p>
        </Section>
      </div>

      {/* Board */}
      <Section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <TacticsBoard />
      </Section>
    </>
  )
}
