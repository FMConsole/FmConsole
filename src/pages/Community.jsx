import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import Button from '../components/Button'
import GradientText from '../components/GradientText'

const highlights = [
  {
    tag: 'Hot Topic',
    tagColor: C.orange,
    title: 'What\'s your go-to first signing in a new save?',
    author: 'TacticsGuru22',
    replies: 147,
    time: '2 hours ago',
  },
  {
    tag: 'Save Story',
    tagColor: C.green,
    title: 'From League Two to Champions League — My 15-year Grimsby journey',
    author: 'Underdog_FC',
    replies: 89,
    time: '5 hours ago',
  },
  {
    tag: 'Help',
    tagColor: C.blue,
    title: 'How do you deal with player morale after a long losing streak?',
    author: 'NewManager2025',
    replies: 63,
    time: '8 hours ago',
  },
  {
    tag: 'Challenge',
    tagColor: C.purple,
    title: 'The Pentagon Challenge — Anyone completed all 5 continents?',
    author: 'Globetrotter_FM',
    replies: 204,
    time: '1 day ago',
  },
]

const communityStats = [
  { icon: '👥', value: '50,000+', label: 'Members' },
  { icon: '💬', value: '12,000+', label: 'Discussions' },
  { icon: '📸', value: '8,500+', label: 'Shared Saves' },
  { icon: '🏆', value: '200+', label: 'Challenges' },
]

export default function Community() {
  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            <GradientText gradient={C.gradientOrange}>Community</GradientText>
          </h1>
          <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Connect with fellow managers. Share saves, discuss tactics, and compete in challenges.
          </p>
        </Section>
      </div>

      {/* Stats */}
      <div style={{ background: C.bgLight, borderBottom: `1px solid ${C.border}` }}>
        <Section style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 24,
            textAlign: 'center',
          }}>
            {communityStats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Featured Discussions */}
      <Section>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Trending Discussions</h2>
        <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 32 }}>
          Jump into the latest conversations from the community.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {highlights.map(h => (
            <Card key={h.title} style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 5,
                    background: `${h.tagColor}18`,
                    color: h.tagColor,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 10,
                  }}>
                    {h.tag}
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>{h.title}</h3>
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: C.textSecondary }}>
                    <span>by {h.author}</span>
                    <span>💬 {h.replies} replies</span>
                    <span>{h.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Discord CTA */}
      <div style={{ background: C.bgLight, borderTop: `1px solid ${C.border}` }}>
        <Section style={{ textAlign: 'center' }}>
          <div style={{
            padding: 48,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #5865F2 0%, #7C4DFF 100%)',
            boxShadow: '0 0 60px rgba(88, 101, 242, 0.3)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Join Our Discord</h2>
            <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Real-time chat, live tactics discussions, save sharing, and weekly events.
            </p>
            <Button style={{ background: '#fff', color: '#5865F2', fontWeight: 700 }}>
              Join Discord Server
            </Button>
          </div>
        </Section>
      </div>
    </>
  )
}
