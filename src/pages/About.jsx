import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import GradientText from '../components/GradientText'

const values = [
  {
    icon: '🎯',
    title: 'Built for Managers',
    desc: 'Every tool and feature is designed with the FM community in mind.',
    color: C.blue,
  },
  {
    icon: '🔓',
    title: 'Free & Open',
    desc: 'Core tools and community features are completely free. Always.',
    color: C.green,
  },
  {
    icon: '🚀',
    title: 'Always Improving',
    desc: 'Regular updates driven by community feedback and new FM releases.',
    color: C.orange,
  },
  {
    icon: '🤝',
    title: 'Community First',
    desc: 'Built by FM fans, for FM fans. Your voice shapes our roadmap.',
    color: C.purple,
  },
]

const roadmap = [
  { quarter: 'Q1 2026', title: 'Launch', desc: 'Core platform, community, and first tools go live.', done: true },
  { quarter: 'Q2 2026', title: 'Tactic Builder', desc: 'Interactive tactic creator with formation sharing.', done: false },
  { quarter: 'Q3 2026', title: 'Player Database', desc: 'Full wonderkid database with scouting reports.', done: false },
  { quarter: 'Q4 2026', title: 'Save Analytics', desc: 'Import your save and get deep performance analytics.', done: false },
]

export default function About() {
  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            About <GradientText>FMConsole</GradientText>
          </h1>
          <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            We're building the ultimate companion platform for Football Manager players worldwide.
          </p>
        </Section>
      </div>

      {/* Mission */}
      <Section>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
          <p style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.8 }}>
            Football Manager is more than a game — it's a passion. FMConsole exists to enhance
            every aspect of that experience. Whether you need tactical tools, scouting databases,
            or just want to share your latest underdog story, we've got you covered.
          </p>
        </div>
      </Section>

      {/* Values */}
      <div style={{ background: C.bgLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <Section>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
            What We Believe
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {values.map(v => (
              <Card key={v.title}>
                <div style={{
                  fontSize: 36,
                  marginBottom: 16,
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `${v.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{v.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      {/* Roadmap */}
      <Section>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}>Roadmap</h2>
        <p style={{ fontSize: 15, color: C.textSecondary, textAlign: 'center', marginBottom: 40 }}>
          Here's what's coming next for FMConsole.
        </p>

        <div style={{
          maxWidth: 600,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}>
          {roadmap.map((r, i) => (
            <div key={r.quarter} style={{ display: 'flex', gap: 24 }}>
              {/* Timeline line */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 24,
                flexShrink: 0,
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: r.done ? C.gradientBlue : C.surface,
                  border: r.done ? 'none' : `2px solid ${C.border}`,
                  flexShrink: 0,
                }} />
                {i < roadmap.length - 1 && (
                  <div style={{
                    width: 2,
                    flex: 1,
                    background: r.done ? C.blue : C.border,
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: 36 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: r.done ? C.blue : C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  {r.quarter} {r.done && '✓'}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4, marginBottom: 6 }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5 }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
