import { useState, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { extractText } from './scanner/ocr.js'
import {
  parseAttributes, flattenAttributes, attrDisplayName, toCamelCase,
} from './scanner/attributeParser.js'
import {
  POSITION_LIST, getKeyAttrsForPosition, calcPositionScore,
} from '../data/positionWeights.js'
import {
  getTopRolesForPosition, starsDisplay, scoreToStars,
} from '../data/roleWeights.js'

const TECHNICAL_ATTRS = [
  'corners', 'crossing', 'dribbling', 'finishing', 'first touch',
  'free kicks', 'heading', 'long shots', 'long throws', 'marking',
  'passing', 'penalty taking', 'tackling', 'technique',
]
const TECHNICAL_MAIN = [
  'crossing', 'dribbling', 'finishing', 'first touch',
  'heading', 'long shots', 'marking', 'passing', 'tackling', 'technique',
]
const SET_PIECES = [
  'corners', 'free kicks', 'long throws', 'penalty taking',
]
const MENTAL_ATTRS = [
  'aggression', 'anticipation', 'bravery', 'composure', 'concentration',
  'decisions', 'determination', 'flair',
  'leadership', 'off the ball', 'positioning',
  'teamwork', 'vision', 'work rate',
]
const PHYSICAL_ATTRS = [
  'acceleration', 'agility', 'balance',
  'jumping reach', 'natural fitness', 'pace', 'stamina', 'strength',
]
const GOALKEEPING_ATTRS = [
  'aerial ability', 'command of area', 'communication', 'eccentricity',
  'handling', 'kicking', 'one on ones', 'reflexes', 'rushing out',
  'tendency to punch', 'throwing',
]

const KEY_STATS = [
  'pace', 'acceleration', 'finishing', 'passing', 'dribbling',
  'tackling', 'heading', 'composure', 'decisions', 'vision',
  'strength', 'stamina',
]

const VIEW_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'roles', label: 'Roles' },
  { key: 'positions', label: 'Positions' },
]

/* ── Age helpers ─────────────────────────────────────────────────────── */

const PHYSICAL_SPEED_KEYS = ['pace', 'acceleration', 'agility', 'stamina']

function getAgeProfile(age) {
  if (!age) return null
  if (age <= 20) return { bracket: 'developing', label: 'Developing (U21)', color: C.blue, physNote: 'Physical attributes are still developing — expect improvement with training.' }
  if (age <= 27) return { bracket: 'peak', label: 'Peak (21–27)', color: C.green, physNote: null }
  if (age <= 31) return { bracket: 'prime', label: 'Prime (28–31)', color: C.greenLight, physNote: 'Minor physical decline may be beginning — monitor pace and acceleration.' }
  if (age <= 34) return { bracket: 'veteran', label: 'Veteran (32–34)', color: C.orange, physNote: 'Physical decline is expected at this age. Pace and acceleration scores may understate peak ability.' }
  return { bracket: 'declining', label: `Experienced (${age})`, color: '#e05050', physNote: 'Significant age-related physical decline. Scores reflect current form — consider technical and mental strengths when choosing a role.' }
}

/**
 * Physical demand of a role: ratio of (pace + acceleration + agility + stamina) weights
 * to total weight. Returns 0–1.
 */
function rolePhysicalDemand(roleWeights) {
  const speedWeight = PHYSICAL_SPEED_KEYS.reduce((s, k) => s + (roleWeights[k] || 0), 0)
  const total = Object.values(roleWeights).reduce((s, w) => s + w, 0)
  return total > 0 ? speedWeight / total : 0
}

function getBarColor(val) {
  if (val >= 16) return C.green
  if (val >= 12) return C.blue
  if (val >= 8) return C.orange
  return '#e05050'
}

function groupAvg(flat, attrs) {
  const keys = attrs.map(toCamelCase)
  const vals = keys.map(k => flat[k]).filter(v => v != null && v > 0)
  return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length) : 0
}

/* ── Radar Chart (single player, adapted from PlayerComparisonTool) ──── */

function RadarChart({ flat, attrKeys, size = 520, color = C.blue }) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 80
  const n = attrKeys.length
  if (n < 3) return null

  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  const polarToXY = (angle, r) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]

  const rings = [4, 8, 12, 16, 20]
  const gridLines = rings.map(val => {
    const r = (val / 20) * maxR
    const pts = attrKeys.map((_, i) => polarToXY(startAngle + i * angleStep, r))
    return { val, points: pts.map(p => p.join(',')).join(' ') }
  })

  const axes = attrKeys.map((_, i) => {
    const angle = startAngle + i * angleStep
    return { x2: polarToXY(angle, maxR)[0], y2: polarToXY(angle, maxR)[1] }
  })

  const pts = attrKeys.map((key, i) => {
    const val = flat[key] || 0
    return polarToXY(startAngle + i * angleStep, (val / 20) * maxR)
  })
  const polygon = pts.map(p => p.join(',')).join(' ')

  const labels = attrKeys.map((key, i) => {
    const angle = startAngle + i * angleStep
    const [lx, ly] = polarToXY(angle, maxR + 36)
    let anchor = 'middle'
    if (Math.cos(angle) < -0.1) anchor = 'end'
    else if (Math.cos(angle) > 0.1) anchor = 'start'
    return { x: lx, y: ly, anchor, label: attrDisplayName(key), val: flat[key] || 0 }
  })

  const [hoverIdx, setHoverIdx] = useState(null)

  return (
    <div style={{ position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}
        onMouseLeave={() => setHoverIdx(null)}>
        {gridLines.map(g => (
          <polygon key={g.val} points={g.points}
            fill="none" stroke={C.border} strokeWidth={1} />
        ))}
        {rings.map(val => (
          <text key={val} x={cx + 4} y={cy - (val / 20) * maxR + 4}
            fill={C.textMuted} fontSize={9} fontFamily="inherit">{val}</text>
        ))}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2}
            stroke={C.border} strokeWidth={1} />
        ))}
        <polygon points={polygon}
          fill={`${color}20`} stroke={color} strokeWidth={2.5} />
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor={l.anchor}
            fill={hoverIdx === i ? C.text : C.textSecondary}
            fontSize={11} fontFamily="inherit" dominantBaseline="central"
            style={{ cursor: 'default', transition: 'fill 0.15s' }}
            onMouseEnter={() => setHoverIdx(i)}>
            {l.label}
          </text>
        ))}
        {attrKeys.map((key, i) => {
          const val = flat[key] || 0
          const [px, py] = pts[i]
          return (
            <circle key={i} cx={px} cy={py} r={5}
              fill={color} stroke={C.bg} strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverIdx(i)} />
          )
        })}
      </svg>

      {hoverIdx !== null && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: C.surface, border: `1px solid ${C.borderLight}`,
          borderRadius: 10, padding: '10px 14px', minWidth: 120,
          boxShadow: C.shadow,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {labels[hoverIdx].label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: getBarColor(labels[hoverIdx].val) }}>
            {labels[hoverIdx].val || '—'}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Position Fit Card ───────────────────────────────────────────────── */

function PositionCard({ posKey, posLabel, score, flat }) {
  const topAttrs = getKeyAttrsForPosition(posKey, 4)
  const pct = (score / 20) * 100
  const barColor = score >= 15 ? C.green : score >= 12 ? C.blue : score >= 9 ? C.orange : '#e05050'

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{posLabel}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: barColor }}>{score.toFixed(1)}</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3, background: C.surfaceHover, overflow: 'hidden', marginBottom: 10,
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: barColor,
          borderRadius: 3, transition: 'width 0.3s',
        }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {topAttrs.map(a => {
          const val = flat[a.key] ?? 0
          return (
            <div key={a.key} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 5, background: C.bgLight,
              border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 10, color: C.textMuted }}>{attrDisplayName(a.key)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: getBarColor(val) }}>{val || '—'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Insight Banner ─────────────────────────────────────────────────── */

function InsightBanner({ posScores, flat, age }) {
  const best = posScores[0]
  if (!best) return null

  const topRoles = getTopRolesForPosition(best.key, flat, 3)
  const bestRole = topRoles[0]

  const barColor = best.score >= 15 ? C.green : best.score >= 12 ? C.blue : C.orange

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surfaceLight} 100%)`,
      border: `1px solid ${barColor}40`,
      borderRadius: 14, padding: '16px 20px', marginBottom: 24,
      display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
    }}>
      {/* Best Position */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
          Natural Position
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: barColor }}>{best.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{best.score.toFixed(1)}</span>
        </div>
        {posScores[1] && (
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            Also: {posScores[1].label} ({posScores[1].score.toFixed(1)})
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

      {/* Best Role */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
          Best Role
        </div>
        {bestRole && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{bestRole.label}</div>
            <div style={{ fontSize: 11, color: barColor, marginTop: 2 }}>{bestRole.duty} · {starsDisplay(bestRole.score)}</div>
          </>
        )}
      </div>

      <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

      {/* Top 3 roles quick view */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
          Role Ranking
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {topRoles.map((r, i) => {
            const stars = scoreToStars(r.score)
            const filled = Math.floor(stars)
            const half = stars % 1 >= 0.5
            return (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: C.textMuted, width: 12 }}>{i + 1}.</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? C.text : C.textSecondary, minWidth: 150 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: '#FFD600', letterSpacing: -1 }}>
                  {'★'.repeat(filled)}{half ? '½' : ''}{'☆'.repeat(5 - filled - (half ? 1 : 0))}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Description */}
      {bestRole?.description && (
        <div style={{
          flex: '1 1 100%', paddingTop: 12, borderTop: `1px solid ${C.border}`,
          fontSize: 12, color: C.textSecondary, fontStyle: 'italic',
        }}>
          {bestRole.description}
        </div>
      )}

      {/* Age advice */}
      {(() => {
        const ageProfile = getAgeProfile(age)
        if (!ageProfile || !ageProfile.physNote) return null
        return (
          <div style={{
            flex: '1 1 100%', paddingTop: 10,
            borderTop: bestRole?.description ? 'none' : `1px solid ${C.border}`,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <span style={{
              flexShrink: 0, fontSize: 10, fontWeight: 700, padding: '2px 8px',
              borderRadius: 5, background: `${ageProfile.color}20`,
              border: `1px solid ${ageProfile.color}50`, color: ageProfile.color,
            }}>
              {ageProfile.label}
            </span>
            <span style={{ fontSize: 12, color: C.textMuted }}>
              {ageProfile.physNote}
            </span>
          </div>
        )
      })()}
    </div>
  )
}

/* ── Roles Tab ───────────────────────────────────────────────────────── */

function RolesTab({ posScores, flat, age }) {
  const [selectedPos, setSelectedPos] = useState(posScores[0]?.key || '')
  const roles = getTopRolesForPosition(selectedPos, flat, 8)

  return (
    <div>
      {/* Position selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {posScores.slice(0, 6).map(p => {
          const isActive = selectedPos === p.key
          const barColor = p.score >= 15 ? C.green : p.score >= 12 ? C.blue : C.orange
          return (
            <button key={p.key} onClick={() => setSelectedPos(p.key)} style={{
              padding: '8px 14px', borderRadius: 8, border: `1px solid ${isActive ? barColor : C.border}`,
              background: isActive ? `${barColor}18` : C.surface,
              color: isActive ? barColor : C.textSecondary,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}>
              {p.label}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>{p.score.toFixed(1)}</span>
            </button>
          )
        })}
      </div>

      {/* Role cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.map((r, i) => {
          const stars = scoreToStars(r.score)
          const filled = Math.floor(stars)
          const half = stars % 1 >= 0.5
          const pct = (r.score / 20) * 100
          const barColor = r.score >= 15 ? C.green : r.score >= 12 ? C.blue : r.score >= 9 ? C.orange : '#e05050'

          // Top 3 key attrs for this role
          const topAttrs = Object.entries(r.weights)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key, w]) => ({ key, w, val: flat[key] ?? 0 }))

          return (
            <div key={r.key} style={{
              background: i === 0 ? `linear-gradient(135deg, ${C.surface}, ${C.surfaceLight})` : C.surface,
              border: `1px solid ${i === 0 ? barColor + '40' : C.border}`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                {/* Rank */}
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: i === 0 ? barColor : C.surfaceHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: i === 0 ? '#fff' : C.textMuted,
                }}>
                  {i + 1}
                </div>
                {/* Name + duty */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{r.duty}</div>
                </div>
                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: barColor }}>{r.score.toFixed(1)}</div>
                  <div style={{ fontSize: 12, color: '#FFD600', letterSpacing: -1 }}>
                    {'★'.repeat(filled)}{half ? '½' : ''}{'☆'.repeat(5 - filled - (half ? 1 : 0))}
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ height: 4, borderRadius: 2, background: C.surfaceHover, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2, transition: 'width 0.4s' }} />
              </div>

              {/* Key attributes */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {topAttrs.map(a => (
                  <div key={a.key} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 5,
                    background: C.bgLight, border: `1px solid ${C.border}`,
                  }}>
                    <span style={{ fontSize: 10, color: C.textMuted }}>{attrDisplayName(a.key)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: getBarColor(a.val) }}>{a.val || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Age / physical demand warning */}
              {(() => {
                const ageProfile = getAgeProfile(age)
                if (!ageProfile || ageProfile.bracket === 'peak' || ageProfile.bracket === 'developing') return null
                const demand = rolePhysicalDemand(r.weights)
                if (demand < 0.22) return null // low physical demand — no warning needed
                const isHighDemand = demand >= 0.32
                return (
                  <div style={{
                    marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 6,
                    background: isHighDemand ? '#e0505018' : `${C.orange}12`,
                    border: `1px solid ${isHighDemand ? '#e0505040' : C.orange + '40'}`,
                  }}>
                    <span style={{ fontSize: 12 }}>⚡</span>
                    <span style={{ fontSize: 11, color: isHighDemand ? '#e05050' : C.orange }}>
                      {isHighDemand
                        ? `High physical demand — at ${age}, pace and acceleration decline affects this role`
                        : `Moderate physical demand — still viable at ${age} but monitor pace/acceleration`}
                    </span>
                  </div>
                )
              })()}

              {/* Description */}
              {r.description && (
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8, fontStyle: 'italic' }}>
                  {r.description}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function PlayerAnalyserTool() {
  const [player, setPlayer] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const inputRef = useRef(null)
  const reuploadRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const scanPlayer = useCallback(async (file) => {
    const preview = URL.createObjectURL(file)
    setPlayer({
      file, preview, name: '', parsed: null,
      status: 'scanning', progress: 0,
    })

    try {
      const ocrResult = await extractText(file, {
        onProgress: (pct) => {
          setPlayer(prev => prev ? { ...prev, progress: pct } : prev)
        },
      })

      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      const overlay = ocrResult.overlay || null
      const visionData = ocrResult.visionData || null
      const parsed = parseAttributes(text, overlay, visionData)

      setPlayer(prev => prev ? {
        ...prev, status: 'done', progress: 100,
        name: parsed.playerName, parsed,
      } : prev)
    } catch {
      URL.revokeObjectURL(preview)
      setPlayer(prev => prev ? { ...prev, status: 'error' } : prev)
    }
  }, [])

  const resetPlayer = useCallback(() => {
    if (player?.preview) URL.revokeObjectURL(player.preview)
    setPlayer(null)
    setActiveView('overview')
  }, [player])

  const reupload = useCallback(() => {
    reuploadRef.current?.click()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) scanPlayer(file)
  }, [scanPlayer])

  const exportData = useCallback(() => {
    if (!player?.parsed) return
    const flat = flattenAttributes(player.parsed)
    const details = player.parsed?.details || {}
    const attrKeys = Object.keys(flat).sort()
    const headers = ['Name', 'Age', 'Nationality', 'Club', 'Positions', 'Height', 'Foot', 'Personality', 'Reputation', ...attrKeys.map(k => attrDisplayName(k))]
    const detailVals = [
      details.age || '', details.nationality || '', details.currentClub || '',
      (details.positions || []).join('/'), details.height || '',
      details.preferredFoot ? `L:${details.preferredFoot.leftFoot || ''} R:${details.preferredFoot.rightFoot || ''}` : '',
      details.personality || '', details.reputation || '',
    ]
    const row = [player.name || '', ...detailVals, ...attrKeys.map(k => flat[k] ?? '')]
    const csv = [headers, row].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fmconsole-${(player.name || 'player').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [player])

  // ── Upload state ──
  if (!player) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            background: dragOver ? `${C.blue}10` : C.gradientCard,
            border: `2px dashed ${dragOver ? C.blue : C.border}`,
            borderRadius: 16, padding: 48,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 12, cursor: 'pointer', minHeight: 200,
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <div style={{ fontSize: 48, opacity: 0.5 }}>🔬</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Upload Player Screenshot</div>
          <div style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center', maxWidth: 320, lineHeight: 1.5 }}>
            Drop an FM player attribute screenshot or click to upload. Uses Vision AI to extract attributes automatically.
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', maxWidth: 300, lineHeight: 1.5, marginTop: 4 }}>
            Tip: Full-screen screenshots are more accurate than windowed mode
          </div>
          <input ref={inputRef} type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) scanPlayer(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    )
  }

  // ── Scanning state ──
  if (player.status === 'scanning') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        {player.preview && (
          <img src={player.preview} alt="Screenshot" style={{
            width: '100%', maxHeight: 200, objectFit: 'cover',
            borderRadius: 12, marginBottom: 16, opacity: 0.6,
          }} />
        )}
        <div style={{
          height: 6, borderRadius: 3, background: C.surfaceHover, overflow: 'hidden', marginBottom: 8,
        }}>
          <div style={{
            width: `${player.progress}%`, height: '100%',
            background: C.blue, transition: 'width 0.3s', borderRadius: 3,
          }} />
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary }}>
          Analyzing player... {player.progress}%
        </div>
      </div>
    )
  }

  // ── Error state ──
  if (player.status === 'error') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.orange, marginBottom: 8 }}>
          Failed to scan screenshot
        </div>
        <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>
          Try a clearer screenshot showing the player's attribute profile.
        </p>
        <button onClick={resetPlayer} style={{
          padding: '10px 24px', borderRadius: 10,
          background: C.gradientBlue, border: 'none',
          color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Try Again
        </button>
      </div>
    )
  }

  // ── Analysis state ──
  const flat = flattenAttributes(player.parsed)
  const details = player.parsed?.details || {}
  const hasGK = GOALKEEPING_ATTRS.some(a => flat[toCamelCase(a)] != null)

  // Strengths & Weaknesses
  const allEntries = Object.entries(flat).filter(([, v]) => v != null && v > 0).sort((a, b) => b[1] - a[1])
  const strengths = allEntries.slice(0, 5)
  const weaknesses = allEntries.slice(-5).reverse()

  // Group averages
  const techAvg = groupAvg(flat, TECHNICAL_ATTRS)
  const mentAvg = groupAvg(flat, MENTAL_ATTRS)
  const physAvg = groupAvg(flat, PHYSICAL_ATTRS)
  const overallAvg = allEntries.length ? (allEntries.reduce((s, [, v]) => s + v, 0) / allEntries.length) : 0

  // Position scores
  const posScores = POSITION_LIST
    .filter(p => hasGK ? p.key === 'GK' : p.key !== 'GK')
    .map(p => ({ ...p, score: calcPositionScore(p.key, flat) }))
    .sort((a, b) => b.score - a.score)

  return (
    <div>
      {/* Player Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 24,
        padding: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            {player.preview && (
              <img src={player.preview} alt="" style={{
                width: 48, height: 48, borderRadius: 10, objectFit: 'cover', opacity: 0.8,
              }} />
            )}
            <div>
              <input
                type="text"
                value={player.name}
                onChange={e => setPlayer(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  background: 'transparent', color: C.text, border: 'none',
                  fontSize: 20, fontWeight: 800, outline: 'none', padding: 0,
                  width: '100%', fontFamily: 'inherit',
                }}
                placeholder="Player name"
              />
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
                {[
                  details.age && `Age ${details.age}`,
                  details.nationality,
                  details.currentClub,
                  details.positions?.length > 0 && details.positions.join(', '),
                ].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>
          {(details.height || details.preferredFoot || details.personality || details.reputation) && (
            <div style={{ fontSize: 11, color: C.textMuted, display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              {details.height && <span>Height: {details.height}</span>}
              {details.preferredFoot && <span>Foot: L{details.preferredFoot.leftFoot} / R{details.preferredFoot.rightFoot}</span>}
              {details.personality && <span>{details.personality}</span>}
              {details.reputation && <span>Rep: {details.reputation}</span>}
            </div>
          )}
          {details.traits?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {details.traits.map(t => (
                <span key={t} style={{
                  padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                  background: `${C.purple}18`, border: `1px solid ${C.purple}40`, color: C.purpleLight,
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={reupload} style={{
            padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${C.blue}40`, background: `${C.blue}12`,
            color: C.blue, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Re-upload
          </button>
          <input ref={reuploadRef} type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                if (player?.preview) URL.revokeObjectURL(player.preview)
                scanPlayer(file)
              }
              e.target.value = ''
            }}
          />
          <button onClick={exportData} style={{
            padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: C.surfaceLight,
            color: C.textSecondary, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Export CSV
          </button>
          <button onClick={resetPlayer} style={{
            padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: C.surfaceLight,
            color: C.textMuted, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            New Player
          </button>
        </div>
      </div>

      {/* ── Insight Banner ── */}
      <InsightBanner posScores={posScores} flat={flat} age={details.age} />

      {/* ── 4-Column Attribute Table (FM-style) ── */}
      <style>{`@media (max-width: 900px) { .fm-attr-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 520px) { .fm-attr-grid { grid-template-columns: 1fr !important; } }`}</style>
      <div className="fm-attr-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 24,
      }}>
        {[
          { title: 'Technical', attrs: TECHNICAL_MAIN, color: C.blue, avg: groupAvg(flat, TECHNICAL_MAIN) },
          { title: 'Set Pieces', attrs: SET_PIECES, color: C.purple, avg: groupAvg(flat, SET_PIECES) },
          { title: 'Mental', attrs: MENTAL_ATTRS, color: '#FFD600', avg: mentAvg },
          { title: 'Physical', attrs: PHYSICAL_ATTRS, color: C.green, avg: physAvg },
        ].map(col => (
          <div key={col.title} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: `${col.color}12`, borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: col.color }}>{col.title}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: col.color }}>{col.avg.toFixed(1)}</span>
            </div>
            <div style={{ padding: '4px 12px' }}>
              {col.attrs.map(attr => {
                const key = toCamelCase(attr)
                const val = flat[key]
                if (val == null) return null
                return (
                  <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '5px 4px', borderBottom: `1px solid ${C.border}15`,
                  }}>
                    <span style={{ fontSize: 12, color: C.textSecondary }}>{attrDisplayName(key)}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getBarColor(val), minWidth: 20, textAlign: 'right' }}>{val}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar (Overview / Positions) */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        padding: 4, background: C.surface, borderRadius: 12,
        border: `1px solid ${C.border}`,
      }}>
        {VIEW_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              background: activeView === tab.key ? C.gradientBlue : 'transparent',
              color: activeView === tab.key ? '#fff' : C.textSecondary,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeView === 'overview' && (
        <>
          {/* Stat Summary Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: 'Overall', val: overallAvg },
              { label: 'Technical', val: techAvg },
              { label: 'Mental', val: mentAvg },
              { label: 'Physical', val: physAvg },
            ].map(s => (
              <div key={s.label} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: 16, textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: getBarColor(s.val) }}>
                  {s.val.toFixed(1)}
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
            padding: 16, marginBottom: 24,
          }}>
            <RadarChart flat={flat} attrKeys={KEY_STATS} size={520} color={C.blue} />
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20,
            }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Strengths
              </h4>
              {strengths.map(([key, val]) => (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: `1px solid ${C.border}22`,
                }}>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{attrDisplayName(key)}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20,
            }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#e05050', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Weaknesses
              </h4>
              {weaknesses.map(([key, val]) => (
                <div key={key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: `1px solid ${C.border}22`,
                }}>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{attrDisplayName(key)}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: getBarColor(val) }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Roles Tab ── */}
      {activeView === 'roles' && (
        <RolesTab posScores={posScores} flat={flat} age={details.age} />
      )}

      {/* ── Positions Tab ── */}
      {activeView === 'positions' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>
              Position Fit Scores
            </h4>
            <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
              Weighted attribute scores for each position (0-20 scale)
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}>
            {posScores.map(p => (
              <PositionCard key={p.key} posKey={p.key} posLabel={p.label} score={p.score} flat={flat} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
