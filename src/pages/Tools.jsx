import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import GradientText from '../components/GradientText'

const tools = [
  {
    icon: '⚔️',
    title: 'Tactic Builder',
    desc: 'Create, visualize, and share custom tactics. Test formations with our interactive pitch editor.',
    color: C.green,
    glow: C.glowGreen,
    status: 'Live',
    href: '/tools/tactic-builder',
  },
  {
    icon: '📋',
    title: 'Squad Planner',
    desc: 'Build your squad depth chart. Assign players to positions, pick roles, and plan your lineup.',
    color: C.green,
    glow: C.glowGreen,
    status: 'Live',
    href: '/tools/squad-planner',
  },
  {
    icon: '📊',
    title: 'Stats Scanner',
    desc: 'Upload FM screenshots, OCR-extract player stats, and export as CSV. Build your performance database from your phone.',
    color: C.blue,
    glow: C.glowBlue,
    status: 'Live',
    href: '/tools/stats-scanner',
  },
  {
    icon: '⚖️',
    title: 'Player Comparison',
    desc: 'Compare any two players side-by-side with radar charts and weighted attribute scores.',
    color: C.purple,
    glow: C.glowPurple,
    status: 'Live',
    href: '/tools/player-comparison',
  },
  {
    icon: '🧬',
    title: 'Trait Recommender',
    desc: 'Enter player attributes to find the best matching traits. Powered by FM trait requirements and attribute thresholds.',
    color: C.green,
    glow: C.glowGreen,
    status: 'Live',
    href: '/tools/trait-recommender',
  },
  {
    icon: '💰',
    title: 'Transfer Tracker',
    desc: 'Track transfer rumors, valuations, and market trends across all top leagues.',
    color: C.orange,
    glow: C.glowOrange,
    status: 'Coming Soon',
  },
  {
    icon: '🔍',
    title: 'Formation Analyzer',
    desc: 'Analyze your formation\'s strengths and weaknesses. Get AI-powered counter-tactic suggestions.',
    color: C.blue,
    glow: C.glowBlue,
    status: 'Coming Soon',
  },
  {
    icon: '⭐',
    title: 'Wonderkid Database',
    desc: 'Browse the most comprehensive wonderkid database with potential ratings and scouting reports.',
    color: C.green,
    glow: C.glowGreen,
    status: 'Coming Soon',
  },
]

export default function Tools() {
  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            <GradientText>FM Tools</GradientText>
          </h1>
          <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Powerful tools built for Football Manager enthusiasts. Analyze, plan, and dominate.
          </p>
        </Section>
      </div>

      {/* Tools Grid */}
      <Section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {tools.map(t => {
            const inner = (
              <Card key={t.title} glow={t.glow}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    fontSize: 36,
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    background: `${t.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {t.icon}
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: `${t.color}18`,
                    color: t.color,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {t.status}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{t.title}</h3>
                <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.6 }}>{t.desc}</p>
              </Card>
            )
            return t.href
              ? <Link key={t.title} to={t.href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>
              : <div key={t.title}>{inner}</div>
          })}
        </div>

        {/* Suggest tool CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: 60,
          padding: 40,
          borderRadius: 16,
          background: C.gradientCard,
          border: `1px solid ${C.border}`,
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
            Have a tool idea?
          </h3>
          <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 20 }}>
            We're always building new tools. Let us know what you want to see next.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 12,
              background: C.gradientBlue,
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Suggest a Tool
          </a>
        </div>
      </Section>
    </>
  )
}
