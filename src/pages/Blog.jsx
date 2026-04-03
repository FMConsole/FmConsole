import { useState } from 'react'
import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import GradientText from '../components/GradientText'

const categories = ['All', 'Tactics', 'Transfers', 'Wonderkids', 'Beginners', 'Save Ideas']

const articles = [
  {
    category: 'Tactics',
    title: 'The Ultimate 4-2-3-1 Guide for FM25',
    excerpt: 'Master the most versatile formation in Football Manager with our detailed tactical breakdown and role assignments.',
    author: 'TacticsGuru',
    date: 'Mar 8, 2026',
    readTime: '12 min',
    color: C.blue,
  },
  {
    category: 'Wonderkids',
    title: 'Top 50 Wonderkids You Need to Sign',
    excerpt: 'Our scouting team reveals the best young talent across every position for your FM25 save.',
    author: 'ScoutMaster',
    date: 'Mar 6, 2026',
    readTime: '15 min',
    color: C.green,
  },
  {
    category: 'Transfers',
    title: 'Best Free Agents in Every FM25 Save',
    excerpt: 'Build a title-winning squad on a budget with these incredible free transfer signings.',
    author: 'TransferWhiz',
    date: 'Mar 4, 2026',
    readTime: '10 min',
    color: C.orange,
  },
  {
    category: 'Beginners',
    title: 'Complete Beginner\'s Guide to Football Manager',
    excerpt: 'New to FM? This comprehensive guide covers everything from your first day to your first trophy.',
    author: 'FMConsole Team',
    date: 'Mar 2, 2026',
    readTime: '20 min',
    color: C.purple,
  },
  {
    category: 'Tactics',
    title: 'Gegenpressing in FM25: A Deep Dive',
    excerpt: 'Learn how to implement an effective pressing system that turns your team into a high-octane machine.',
    author: 'TacticsGuru',
    date: 'Feb 28, 2026',
    readTime: '14 min',
    color: C.blue,
  },
  {
    category: 'Save Ideas',
    title: '10 Unique Save Ideas for Your Next FM25 Playthrough',
    excerpt: 'Bored of the usual saves? Try these creative challenges to breathe new life into your FM experience.',
    author: 'SaveExplorer',
    date: 'Feb 25, 2026',
    readTime: '8 min',
    color: C.orange,
  },
  {
    category: 'Transfers',
    title: 'Hidden Gems Under 1M: Budget Signings That Deliver',
    excerpt: 'Discover bargain players who massively outperform their price tag across multiple leagues.',
    author: 'TransferWhiz',
    date: 'Feb 22, 2026',
    readTime: '11 min',
    color: C.orange,
  },
  {
    category: 'Wonderkids',
    title: 'Developing Youth: Training & Mentoring Guide',
    excerpt: 'Everything you need to know about turning raw potential into world-class talent in FM25.',
    author: 'ScoutMaster',
    date: 'Feb 20, 2026',
    readTime: '16 min',
    color: C.green,
  },
  {
    category: 'Beginners',
    title: 'Understanding Player Attributes: What Actually Matters',
    excerpt: 'Not all attributes are created equal. Learn which stats to prioritize for every position.',
    author: 'FMConsole Team',
    date: 'Feb 18, 2026',
    readTime: '13 min',
    color: C.purple,
  },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            <GradientText gradient={C.gradientGreen}>Blog & Guides</GradientText>
          </h1>
          <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Expert guides, tips, and strategies to improve your Football Manager game.
          </p>
        </Section>
      </div>

      {/* Filters */}
      <Section style={{ paddingBottom: 0 }}>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 36,
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: `1px solid ${activeCategory === cat ? C.blue : C.border}`,
                background: activeCategory === cat ? 'rgba(0,102,255,0.12)' : 'transparent',
                color: activeCategory === cat ? C.blue : C.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      {/* Articles Grid */}
      <Section style={{ paddingTop: 0 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {filtered.map(a => (
            <Card key={a.title}>
              {/* Gradient banner */}
              <div style={{
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${a.color}, ${a.color}66)`,
                marginBottom: 20,
                marginTop: -4,
              }} />
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 5,
                background: `${a.color}18`,
                color: a.color,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 12,
              }}>
                {a.category}
              </span>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
                {a.title}
              </h3>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
                {a.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: C.textMuted,
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
              }}>
                <span>{a.author}</span>
                <span>{a.readTime} read · {a.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
