import { useState } from 'react'
import C from '../theme/colors'
import Section from '../components/Section'
import Card from '../components/Card'
import Button from '../components/Button'
import GradientText from '../components/GradientText'

const faqs = [
  {
    q: 'Is FMConsole free to use?',
    a: 'Yes! Our core tools and community features are completely free. We may offer premium features in the future, but the essentials will always be free.',
  },
  {
    q: 'Is FMConsole affiliated with Sports Interactive?',
    a: 'No, FMConsole is an independent fan project. We are not affiliated with Sports Interactive, SEGA, or the Football Manager brand.',
  },
  {
    q: 'How can I contribute guides or articles?',
    a: 'We love community contributions! Send us a message through the contact form and we\'ll get you set up as a contributor.',
  },
  {
    q: 'Which FM versions do your tools support?',
    a: 'We primarily focus on the latest FM release, but many of our guides and tools are applicable across multiple versions.',
  },
]

const socials = [
  { label: 'Discord', icon: '💬', color: '#5865F2' },
  { label: 'Twitter / X', icon: '🐦', color: '#1DA1F2' },
  { label: 'YouTube', icon: '📺', color: '#FF0000' },
  { label: 'Reddit', icon: '🟠', color: '#FF4500' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.surface,
    color: C.text,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      {/* Header */}
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            <GradientText gradient={C.gradientOrange}>Get In Touch</GradientText>
          </h1>
          <p style={{ fontSize: 18, color: C.textSecondary, maxWidth: 520, margin: '0 auto' }}>
            Questions, feedback, or just want to say hi? We'd love to hear from you.
          </p>
        </Section>
      </div>

      <Section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 40,
        }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Send a Message</h2>

            {sent ? (
              <Card glow={C.glowGreen}>
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: C.textSecondary }}>We'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    style={{
                      marginTop: 16,
                      background: 'none',
                      border: 'none',
                      color: C.blue,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="contribute">Contribute Content</option>
                  <option value="partnership">Partnership</option>
                </select>
                <textarea
                  required
                  placeholder="Your message..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <Button style={{ alignSelf: 'flex-start' }}>Send Message</Button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Socials */}
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Connect With Us</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
              {socials.map(s => (
                <Card key={s.label} style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>FAQ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map(f => (
                <div key={f.q} style={{
                  padding: 20,
                  borderRadius: 12,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.q}</h4>
                  <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
