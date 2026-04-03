import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import Button from '../components/Button'
import GradientText from '../components/GradientText'

const features = [
  {
    icon: '🎮',
    title: 'Powerful Tools',
    desc: 'Tactic builders, squad planners, and analytics tools to dominate every save.',
    color: C.blue,
    glow: C.glowBlue,
    to: '/tools',
  },
  {
    icon: '👥',
    title: 'Community Hub',
    desc: 'Connect with thousands of FM managers. Share saves, discuss tactics, find leagues.',
    color: C.orange,
    glow: C.glowOrange,
    to: '/community',
  },
  {
    icon: '📚',
    title: 'Guides & Tips',
    desc: 'Expert guides on tactics, transfers, wonderkids, and everything in between.',
    color: C.green,
    glow: C.glowGreen,
    to: '/blog',
  },
]

const stats = [
  { value: '50K+', label: 'Active Managers' },
  { value: '200+', label: 'Guides Published' },
  { value: '12', label: 'Free Tools' },
  { value: '24/7', label: 'Community' },
]

const latestPosts = [
  {
    tag: 'Tactics',
    tagColor: C.blue,
    title: 'The Ultimate 4-2-3-1 Guide for FM25',
    excerpt: 'Master the most versatile formation in Football Manager with our in-depth breakdown.',
  },
  {
    tag: 'Wonderkids',
    tagColor: C.green,
    title: 'Top 50 Wonderkids You Need to Sign',
    excerpt: 'Our scouting team reveals the best young talent across every position.',
  },
  {
    tag: 'Transfers',
    tagColor: C.orange,
    title: 'Best Free Agents in Every FM25 Save',
    excerpt: 'Build a title-winning squad on a budget with these incredible free signings.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: C.gradientHero,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)',
        }} />

        <Section style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(0, 102, 255, 0.12)',
            border: `1px solid rgba(0, 102, 255, 0.25)`,
            fontSize: 13,
            fontWeight: 600,
            color: C.blueLight,
            marginBottom: 24,
          }}>
            The #1 Football Manager Companion
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: -1,
          }}>
            Level Up Your
            <br />
            <GradientText style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
              FM Experience
            </GradientText>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: C.textSecondary,
            maxWidth: 560,
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Tools, tactics, and a thriving community — everything you need to
            build your dynasty in Football Manager.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/tools"><Button>Explore Tools</Button></Link>
            <Link to="/community"><Button variant="secondary">Join Community</Button></Link>
          </div>
        </Section>
      </div>

      {/* Features */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Everything You Need
          </h2>
          <p style={{ fontSize: 17, color: C.textSecondary }}>
            One platform for all your Football Manager needs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {features.map(f => (
            <Link to={f.to} key={f.title} style={{ textDecoration: 'none' }}>
              <Card glow={f.glow} style={{ height: '100%' }}>
                <div style={{
                  fontSize: 40,
                  marginBottom: 16,
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: `${f.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: C.text }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <div style={{ background: C.bgLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <Section style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 32,
            textAlign: 'center',
          }}>
            {stats.map(s => (
              <div key={s.label}>
                <GradientText style={{ fontSize: 40, fontWeight: 900, display: 'block' }}>
                  {s.value}
                </GradientText>
                <p style={{ fontSize: 14, color: C.textSecondary, marginTop: 6, fontWeight: 500 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Latest Content */}
      <Section>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800 }}>Latest Guides</h2>
            <p style={{ fontSize: 15, color: C.textSecondary, marginTop: 6 }}>
              Fresh content from our expert contributors.
            </p>
          </div>
          <Link to="/blog"><Button variant="outline" style={{ fontSize: 14 }}>View All</Button></Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {latestPosts.map(p => (
            <Card key={p.title}>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 6,
                background: `${p.tagColor}18`,
                color: p.tagColor,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 14,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {p.tag}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>
                {p.excerpt}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
            Ready to <GradientText gradient={C.gradientOrange}>Take Over?</GradientText>
          </h2>
          <p style={{ fontSize: 17, color: C.textSecondary, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Join thousands of managers already using FMConsole to elevate their game.
          </p>
          <Link to="/tools"><Button variant="orange">Get Started Free</Button></Link>
        </Section>
      </div>
    </>
  )
}
