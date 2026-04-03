import { useState } from 'react'
import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'

const categories = [
  {
    title: 'Players',
    desc: 'Browse player profiles, attributes, and stats from FM26.',
    icon: '\u26BD',
    count: '100K+',
    href: '/database/players',
    gradient: C.gradientBlue,
    glow: C.glowBlue,
  },
  {
    title: 'Clubs',
    desc: 'Explore clubs, squads, finances, and facilities worldwide.',
    icon: '\uD83C\uDFDF\uFE0F',
    count: '2,500+',
    href: '/database/clubs',
    gradient: C.gradientGreen,
    glow: C.glowGreen,
  },
  {
    title: 'Competitions',
    desc: 'Leagues, cups, and international tournaments across the globe.',
    icon: '\uD83C\uDFC6',
    count: '500+',
    href: '/database/competitions',
    gradient: C.gradientOrange,
    glow: C.glowOrange,
  },
  {
    title: 'Nations',
    desc: 'National team profiles, rankings, and competition entries.',
    icon: '\uD83C\uDF0D',
    count: '200+',
    href: '/database/nations',
    gradient: 'linear-gradient(135deg, #7C4DFF, #E040FB)',
    glow: C.glowPurple,
  },
]

export default function Database() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: C.gradientHero,
        padding: '80px 24px 60px',
        textAlign: 'center',
      }}>
        <GradientText as="h1" style={{ fontSize: 48, fontWeight: 800, margin: 0 }}>
          FM Database
        </GradientText>
        <p style={{
          color: C.textSecondary,
          fontSize: 18,
          maxWidth: 560,
          margin: '16px auto 0',
          lineHeight: 1.6,
        }}>
          Explore the complete Football Manager 26 database. Search players, clubs, competitions, and nations.
        </p>
      </div>

      {/* Category Grid */}
      <Section style={{ paddingTop: 48 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {categories.map(cat => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </Section>
    </>
  )
}

function CategoryCard({ title, desc, icon, count, href, gradient, glow }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div style={{
        background: C.gradientCard,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 16,
        padding: 32,
        transition: 'all 0.3s ease',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? glow : C.shadow,
      }}>
        <div style={{
          fontSize: 40,
          marginBottom: 16,
        }}>
          {icon}
        </div>
        <h3 style={{
          margin: '0 0 8px',
          fontSize: 22,
          fontWeight: 700,
        }}>
          <span style={{
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {title}
          </span>
        </h3>
        <p style={{
          color: C.textSecondary,
          fontSize: 14,
          lineHeight: 1.6,
          margin: '0 0 16px',
        }}>
          {desc}
        </p>
        <span style={{
          fontSize: 13,
          color: C.textMuted,
          fontWeight: 600,
        }}>
          {count} entries
        </span>
      </div>
    </Link>
  )
}
