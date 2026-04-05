import { useState, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { extractText } from './scanner/ocr.js'
import {
  parseAttributes, flattenAttributes, attrDisplayName, toCamelCase,
} from './scanner/attributeParser.js'
import {
  POSITION_LIST, getKeyAttrsForPosition, calcPositionScore, footAdjustment,
} from '../data/positionWeights.js'
import {
  getRolesForPosition, calcRoleScore, getTopRolesForPosition, starsDisplay, scoreToStars,
} from '../data/roleWeights.js'
import { getAgeProfile, rolePhysicalDemand } from '../data/playerHelpers.js'
import { getTopArchetypes, getSetPieceBonus } from '../data/archetypes.js'

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
  { key: 'roles', label: 'IP / OOP Roles' },
  { key: 'positions', label: 'Positions' },
]


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

const ARCHETYPE_BANDS = [
  { min: 16, label: 'Elite',  color: '#a855f7' },
  { min: 14, label: 'Gold',   color: '#f59e0b' },
  { min: 12, label: 'Silver', color: '#94a3b8' },
  { min: 10, label: 'Bronze', color: '#cd7f32' },
  { min: 0,  label: 'Fringe', color: '#6b7280' },
]

function archetypeBand(score) {
  return ARCHETYPE_BANDS.find(b => score >= b.min) || ARCHETYPE_BANDS.at(-1)
}

function InsightBanner({ posScores, flat, age, fmPositions, traits }) {
  const [archetypeOpen, setArchetypeOpen] = useState(false)
  // Derive natural position: prefer the highest-scoring position from extracted FM positions
  const mappedKeys = [...new Set(
    (fmPositions || []).flatMap(p => {
      const r = mapFMPosition(p)
      return Array.isArray(r) ? r : r ? [r] : []
    })
  )]
  const fmPosSorted = mappedKeys.length > 0
    ? posScores.filter(p => mappedKeys.includes(p.key)).sort((a, b) => b.score - a.score)
    : []
  const naturalPos = fmPosSorted[0] || posScores[0]
  const altPos = fmPosSorted[1] || null
  const best = naturalPos
  if (!best) return null

  const topRoles = getTopRolesForPosition(best.key, flat, 30)
  const bestRoleIP = topRoles.find(r => r.phase === 'IP') || null
  const bestRoleOOP = topRoles.find(r => r.phase === 'OOP') || null
  const bestRole = bestRoleIP || topRoles[0]
  const topArchetypes = getTopArchetypes(flat, 3, mappedKeys, traits).filter(a => a.score >= 10)
  const setPieceBonus = getSetPieceBonus(flat, traits)
  const bestArchetype = topArchetypes[0]
  // Top key attrs for the primary archetype (by weight), with player values
  const archetypeKeyAttrs = bestArchetype
    ? Object.entries(bestArchetype.weights || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k]) => ({ key: k, label: attrDisplayName(k), val: flat[k] ?? '–' }))
    : []

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
        {altPos && (
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            Also: {altPos.label} ({altPos.score.toFixed(1)})
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

      {/* Best Role IP */}
      {bestRoleIP && (
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            Best Role IP
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{bestRoleIP.label}</div>
          <div style={{ fontSize: 11, color: barColor, marginTop: 2 }}>{starsDisplay(bestRoleIP.score)}</div>
        </div>
      )}

      <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

      {/* Best Role OOP */}
      {bestRoleOOP && (
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            Best Role OOP
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{bestRoleOOP.label}</div>
          <div style={{ fontSize: 11, color: barColor, marginTop: 2 }}>{starsDisplay(bestRoleOOP.score)}</div>
        </div>
      )}

      {bestArchetype && (
        <>
          <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />
          {/* Archetype — 3-box horizontal cards */}
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Archetype
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* Primary + secondary archetype cards */}
              {topArchetypes.map((a, i) => {
                const band = archetypeBand(a.score)
                const keyAttrs = Object.entries(a.weights || {})
                  .sort((x, y) => y[1] - x[1]).slice(0, 3)
                  .map(([k]) => ({ key: k, label: attrDisplayName(k), val: flat[k] ?? '–' }))
                return (
                  <div key={a.key} style={{
                    flex: '1 1 100px', padding: '8px 10px', borderRadius: 10,
                    background: `${a.color}0d`, border: `1px solid ${a.color}35`,
                    position: 'relative',
                  }}>
                    {i > 0 && (
                      <div style={{
                        position: 'absolute', top: 6, right: 8,
                        fontSize: 8, fontWeight: 700, color: a.color,
                        textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7,
                      }}>Also</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{a.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: a.color }}>{a.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                        background: `${band.color}22`, border: `1px solid ${band.color}60`, color: band.color,
                      }}>{band.label}</span>
                      <span style={{ fontSize: 10, color: C.textMuted }}>{a.score.toFixed(1)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {keyAttrs.map(attr => (
                        <span key={attr.key} style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 4,
                          background: `${a.color}15`, border: `1px solid ${a.color}35`,
                          color: a.color, fontWeight: 600,
                        }}>{attr.label} {attr.val}</span>
                      ))}
                    </div>
                    {a.source && (
                      <div style={{ marginTop: 5, fontSize: 8, color: C.textMuted, opacity: 0.7 }}>
                        via <a href={a.source.url} target="_blank" rel="noopener noreferrer"
                          style={{ color: C.textMuted, textDecoration: 'underline' }}>{a.source.label}</a>
                      </div>
                    )}
                  </div>
                )
              })}
              {/* Set Piece Specialist bonus card */}
              {setPieceBonus && (
                <div style={{
                  flex: '1 1 100px', padding: '8px 10px', borderRadius: 10,
                  background: `${setPieceBonus.color}0d`, border: `1px dashed ${setPieceBonus.color}50`,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 6, right: 8,
                    fontSize: 8, fontWeight: 700, color: setPieceBonus.color,
                    textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.8,
                  }}>Bonus</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{setPieceBonus.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: setPieceBonus.color }}>{setPieceBonus.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {setPieceBonus.attrs.map(a => (
                      <span key={a.key} style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 4,
                        background: `${setPieceBonus.color}15`, border: `1px solid ${setPieceBonus.color}35`,
                        color: setPieceBonus.color, fontWeight: 600,
                      }}>{a.label} {a.val}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

      {/* Role Rankings — split IP / OOP */}
      {(() => {
        const ipRoles = topRoles.filter(r => r.phase === 'IP').slice(0, 4)
        const oopRoles = topRoles.filter(r => r.phase === 'OOP').slice(0, 4)
        const renderRoleList = (roles) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {roles.map((r, i) => {
              const stars = scoreToStars(r.score)
              const filled = Math.floor(stars)
              const half = stars % 1 >= 0.5
              return (
                <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: C.textMuted, width: 12 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? C.text : C.textSecondary, minWidth: 140 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: '#FFD600', letterSpacing: -1 }}>
                    {'★'.repeat(filled)}{half ? '½' : ''}{'☆'.repeat(5 - filled - (half ? 1 : 0))}
                  </span>
                </div>
              )
            })}
          </div>
        )
        return (
          <>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                IP Roles
              </div>
              {renderRoleList(ipRoles)}
            </div>
            <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                OOP Roles
              </div>
              {renderRoleList(oopRoles)}
            </div>
          </>
        )
      })()}

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

/* ── Position Map data ───────────────────────────────────────────────── */

const ZONE_COLORS = { gk: '#c4a935', def: '#8c7856', mid: '#d4782a', att: '#3fbf4f' }

/**
 * Map an FM position string (e.g. "ST (C)", "D (L)", "WB (R)") to a positionWeights key.
 * Returns null if no match.
 */
function mapFMPosition(str) {
  if (!str) return null
  const s = str.toUpperCase().replace(/\s/g, '')

  // Compound FM positions like "DWB/M (L)", "D/WB (R)", "WB/M (L)", "M/AM (C)"
  // Parse by side indicator + WB presence before doing prefix checks
  const hasL = s.includes('(L)')
  const hasR = s.includes('(R)')
  const hasWB = s.includes('WB')
  const hasAM = s.includes('AM')
  if (s.includes('/') || (hasWB && (hasL || hasR))) {
    if (hasL && hasWB) return 'LWB'
    if (hasR && hasWB) return 'RWB'
    if (hasL) return 'LB'
    if (hasR) return 'RB'
    if (hasAM && s.includes('(C)')) return 'AM'
  }

  // Bare position codes without side indicator — return both sides so foot adjustment picks correctly
  if (s === 'WB' || s === 'DWB' || s === 'WBL' || s === 'WBR') return ['LWB', 'RWB']
  if (s === 'AM') return 'AM'
  if (s === 'M') return 'CM'

  // Long-form names extracted by OCR (e.g. "Defender (Left)", "Defensive Midfielder")
  if (s === 'GOALKEEPER') return 'GK'
  if (s.startsWith('STRIKER')) return 'ST'
  if (s === 'DEFENSIVEMIDFIELDER') return 'DM'
  if (s.startsWith('WINGBACK(L)') || s === 'WINGBACK(LEFT)') return 'LWB'
  if (s.startsWith('WINGBACK(R)') || s === 'WINGBACK(RIGHT)') return 'RWB'
  if (s.startsWith('WINGBACK')) return 'LWB'
  if (s === 'DEFENDER(CENTRE)' || s === 'DEFENDER(C)') return 'CB'
  if (s === 'DEFENDER(LEFT)' || s === 'DEFENDER(L)') return 'LB'
  if (s === 'DEFENDER(RIGHT)' || s === 'DEFENDER(R)') return 'RB'
  if (s.startsWith('ATTACKINGMIDFIELDER(C)') || s === 'ATTACKINGMIDFIELDER(CENTRE)') return 'AM'
  if (s.startsWith('ATTACKINGMIDFIELDER(L)') || s === 'ATTACKINGMIDFIELDER(LEFT)') return 'LW'
  if (s.startsWith('ATTACKINGMIDFIELDER(R)') || s === 'ATTACKINGMIDFIELDER(RIGHT)') return 'RW'
  if (s === 'MIDFIELDER(CENTRE)' || s === 'MIDFIELDER(C)') return 'CM'
  if (s === 'MIDFIELDER(LEFT)' || s === 'MIDFIELDER(L)') return 'LM'
  if (s === 'MIDFIELDER(RIGHT)' || s === 'MIDFIELDER(R)') return 'RM'

  // Abbreviated forms (e.g. "D (L)", "AM (R)", "ST (C)")
  if (s.startsWith('GK')) return 'GK'
  if (s.startsWith('ST')) return 'ST'
  if (s === 'DM' || s.startsWith('DM(')) return 'DM'
  if (s.startsWith('WB(L)') || s === 'WBL') return 'LWB'
  if (s.startsWith('WB(R)') || s === 'WBR') return 'RWB'
  if (s.startsWith('WB')) return 'LWB'
  if (s.startsWith('D(C)') || s === 'DC' || s === 'CB') return 'CB'
  if (s.startsWith('D(L)') || s === 'DL' || s === 'LB') return 'LB'
  if (s.startsWith('D(R)') || s === 'DR' || s === 'RB') return 'RB'
  if (s.startsWith('D')) return 'CB'
  if (s.startsWith('AM(C)') || s === 'AMC') return 'AM'
  if (s.startsWith('AM(L)') || s === 'AML') return 'LW'
  if (s.startsWith('AM(R)') || s === 'AMR') return 'RW'
  if (s.startsWith('M(C)') || s === 'MC' || s === 'CM') return 'CM'
  if (s.startsWith('M(L)') || s === 'ML' || s === 'LM') return 'LM'
  if (s.startsWith('M(R)') || s === 'MR' || s === 'RM') return 'RM'
  return null
}

// Maps each pitch dot ID → positionWeights.js key for suitability scoring
const POSMAP_TO_POSWEIGHT = {
  GK: 'GK', DL: 'LB', DC: 'CB', DR: 'RB',
  DML: 'LWB', DMC: 'DM', DMR: 'RWB',
  ML: 'LM', MC: 'CM', MR: 'RM',
  AML: 'LW', AMC: 'AM', AMR: 'RW', ST: 'ST',
}

function suitabilityColor(score, maxScore) {
  if (!maxScore) return ZONE_COLORS.mid
  const r = score / maxScore
  if (r >= 0.96) return C.green
  if (r >= 0.90) return C.blue
  if (r >= 0.74) return C.orange
  return '#ef4444'
}

const POSITION_MAP = [
  { id: 'GK', label: 'Goalkeeper', x: 6, y: 50, zone: 'gk',
    gk: { key: ['aerialAbility', 'commandOfArea', 'communication', 'handling', 'oneOnOnes', 'rushingOut'] },
    technical: { key: ['firstTouch', 'passing', 'technique'], useful: ['kicking', 'throwing'] },
    mental: { key: ['anticipation', 'composure', 'concentration', 'decisions', 'positioning'], useful: ['vision'] },
    physical: { key: ['agility', 'reflexes'], useful: ['acceleration', 'pace'] },
  },
  { id: 'DL', label: 'Defender (L)', x: 22, y: 18, zone: 'def',
    technical: { key: ['crossing', 'dribbling', 'marking', 'tackling'], useful: ['firstTouch', 'passing', 'technique'] },
    mental: { key: ['anticipation', 'concentration', 'decisions', 'positioning', 'teamwork', 'workRate'], useful: ['determination'] },
    physical: { key: ['acceleration', 'pace', 'stamina'], useful: ['agility', 'naturalFitness'] },
  },
  { id: 'DC', label: 'Centre Back', x: 22, y: 50, zone: 'def',
    technical: { key: ['heading', 'marking', 'tackling'], useful: ['passing', 'firstTouch'] },
    mental: { key: ['aggression', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions', 'positioning'], useful: ['teamwork'] },
    physical: { key: ['jumpingReach', 'pace', 'strength'], useful: ['acceleration', 'stamina'] },
  },
  { id: 'DR', label: 'Defender (R)', x: 22, y: 82, zone: 'def',
    technical: { key: ['crossing', 'dribbling', 'marking', 'tackling'], useful: ['firstTouch', 'passing', 'technique'] },
    mental: { key: ['anticipation', 'concentration', 'decisions', 'positioning', 'teamwork', 'workRate'], useful: ['determination'] },
    physical: { key: ['acceleration', 'pace', 'stamina'], useful: ['agility', 'naturalFitness'] },
  },
  { id: 'DML', label: 'Def Mid (L)', x: 38, y: 18, zone: 'mid',
    technical: { key: ['crossing', 'marking', 'passing', 'tackling', 'technique'], useful: ['dribbling', 'firstTouch'] },
    mental: { key: ['anticipation', 'concentration', 'decisions', 'positioning', 'teamwork', 'workRate'], useful: ['aggression', 'vision'] },
    physical: { key: ['acceleration', 'pace', 'stamina'], useful: ['balance', 'strength'] },
  },
  { id: 'DMC', label: 'Def Midfielder', x: 38, y: 50, zone: 'mid',
    technical: { key: ['firstTouch', 'marking', 'passing', 'tackling', 'technique'], useful: ['heading'] },
    mental: { key: ['aggression', 'anticipation', 'composure', 'concentration', 'decisions', 'positioning', 'teamwork', 'workRate'], useful: ['bravery', 'vision'] },
    physical: { key: ['stamina', 'strength'], useful: ['balance', 'jumpingReach', 'pace'] },
  },
  { id: 'DMR', label: 'Def Mid (R)', x: 38, y: 82, zone: 'mid',
    technical: { key: ['crossing', 'marking', 'passing', 'tackling', 'technique'], useful: ['dribbling', 'firstTouch'] },
    mental: { key: ['anticipation', 'concentration', 'decisions', 'positioning', 'teamwork', 'workRate'], useful: ['aggression', 'vision'] },
    physical: { key: ['acceleration', 'pace', 'stamina'], useful: ['balance', 'strength'] },
  },
  { id: 'ML', label: 'Midfielder (L)', x: 54, y: 18, zone: 'mid',
    technical: { key: ['crossing', 'dribbling', 'firstTouch', 'passing', 'technique'], useful: ['finishing'] },
    mental: { key: ['anticipation', 'decisions', 'flair', 'offTheBall', 'teamwork', 'workRate'], useful: ['vision'] },
    physical: { key: ['acceleration', 'agility', 'pace', 'stamina'], useful: ['balance'] },
  },
  { id: 'MC', label: 'Midfielder (C)', x: 54, y: 50, zone: 'mid',
    technical: { key: ['firstTouch', 'passing', 'tackling', 'technique'], useful: ['dribbling', 'longShots'] },
    mental: { key: ['anticipation', 'composure', 'decisions', 'teamwork', 'vision', 'workRate'], useful: ['concentration', 'determination', 'offTheBall'] },
    physical: { key: ['stamina'], useful: ['acceleration', 'balance', 'naturalFitness', 'pace'] },
  },
  { id: 'MR', label: 'Midfielder (R)', x: 54, y: 82, zone: 'mid',
    technical: { key: ['crossing', 'dribbling', 'firstTouch', 'passing', 'technique'], useful: ['finishing'] },
    mental: { key: ['anticipation', 'decisions', 'flair', 'offTheBall', 'teamwork', 'workRate'], useful: ['vision'] },
    physical: { key: ['acceleration', 'agility', 'pace', 'stamina'], useful: ['balance'] },
  },
  { id: 'AML', label: 'Att Mid (L)', x: 70, y: 18, zone: 'att',
    technical: { key: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique'], useful: ['passing'] },
    mental: { key: ['anticipation', 'composure', 'decisions', 'flair', 'offTheBall', 'vision'], useful: ['workRate'] },
    physical: { key: ['acceleration', 'agility', 'pace'], useful: ['balance', 'stamina'] },
  },
  { id: 'AMC', label: 'Att Mid (C)', x: 70, y: 50, zone: 'att',
    technical: { key: ['dribbling', 'firstTouch', 'passing', 'technique'], useful: ['finishing', 'longShots'] },
    mental: { key: ['anticipation', 'composure', 'decisions', 'flair', 'offTheBall', 'vision'], useful: ['teamwork', 'workRate'] },
    physical: { key: ['acceleration', 'agility'], useful: ['balance', 'pace'] },
  },
  { id: 'AMR', label: 'Att Mid (R)', x: 70, y: 82, zone: 'att',
    technical: { key: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique'], useful: ['passing'] },
    mental: { key: ['anticipation', 'composure', 'decisions', 'flair', 'offTheBall', 'vision'], useful: ['workRate'] },
    physical: { key: ['acceleration', 'agility', 'pace'], useful: ['balance', 'stamina'] },
  },
  { id: 'ST', label: 'Striker', x: 88, y: 50, zone: 'att',
    technical: { key: ['dribbling', 'finishing', 'firstTouch', 'heading', 'technique'], useful: ['passing', 'longShots'] },
    mental: { key: ['anticipation', 'composure', 'decisions', 'offTheBall'], useful: ['aggression', 'bravery', 'concentration', 'determination', 'flair', 'workRate'] },
    physical: { key: ['acceleration', 'pace', 'strength'], useful: ['agility', 'balance', 'jumpingReach', 'stamina'] },
  },
]

function PositionMapTab({ flat, preferredFoot, onPosClick }) {
  const [selected, setSelected] = useState(null)
  const [collapsed, setCollapsed] = useState({})
  const hasPlayer = flat && Object.keys(flat).length > 0

  const toggleSection = (sectionKey) => setCollapsed(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))

  const renderAttrGroup = (sectionKey, title, color, group) => {
    if (!group) return null
    const isCollapsed = collapsed[sectionKey]
    const attrs = [
      ...(group.key || []).map(k => ({ key: k, tier: 'key' })),
      ...(group.useful || []).map(k => ({ key: k, tier: 'useful' })),
    ]
    return (
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={() => toggleSection(sectionKey)}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isCollapsed ? 0 : 5, paddingBottom: 3, borderBottom: `1px solid ${C.border}` }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color }}>{title}</span>
          <span style={{ fontSize: 10, color, opacity: 0.7 }}>{isCollapsed ? '▶' : '▼'}</span>
        </button>
        {!isCollapsed && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
            {attrs.map(({ key, tier }) => {
              const val = hasPlayer ? (flat[key] ?? null) : null
              const valColor = val == null ? null : getBarColor(val)
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 5, background: tier === 'key' ? `${C.purple}10` : 'transparent' }}>
                  <span style={{ fontSize: 11, color: C.text }}>{attrDisplayName(key)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {val != null && <span style={{ fontSize: 12, fontWeight: 700, color: valColor }}>{val}</span>}
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: tier === 'key' ? `${C.purple}25` : `${C.green}15`, color: tier === 'key' ? '#a78bfa' : '#4ade80' }}>
                      {tier === 'key' ? 'KEY' : 'USF'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      {/* Pitch */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
        <div
          style={{ position: 'relative', width: '100%', aspectRatio: '1.5 / 1', background: 'linear-gradient(180deg, #1a6b30 0%, #155d28 50%, #1a6b30 100%)', borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)' }}
          onClick={() => setSelected(null)}
        >
          {/* Field markings */}
          <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '18%', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ position: 'absolute', top: '20%', left: 0, height: '60%', width: '16%', border: '1px solid rgba(255,255,255,0.2)', borderLeft: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', right: 0, height: '60%', width: '16%', border: '1px solid rgba(255,255,255,0.2)', borderRight: 'none' }} />
          {/* Position dots */}
          {(() => {
            const posScoreMap = hasPlayer
              ? Object.fromEntries(POSITION_MAP.map(p => {
                  const k = POSMAP_TO_POSWEIGHT[p.id]
                  return [p.id, k ? calcPositionScore(k, flat) * footAdjustment(k, preferredFoot) : null]
                }))
              : {}
            const scores = Object.values(posScoreMap).filter(s => s != null)
            const maxScore = scores.length ? Math.max(...scores) : null
            return POSITION_MAP.map(pos => {
            const score = posScoreMap[pos.id] ?? null
            const dotColor = score != null ? suitabilityColor(score, maxScore) : ZONE_COLORS[pos.zone]
            const isActive = selected?.id === pos.id
            return (
              <div
                key={pos.id}
                onClick={e => {
                  e.stopPropagation()
                  setCollapsed({})
                  setSelected(isActive ? null : pos)
                  if (!isActive && onPosClick) {
                    const pwKey = POSMAP_TO_POSWEIGHT[pos.id]
                    if (pwKey) onPosClick(pwKey)
                  }
                }}
                title={score != null ? `${pos.label} — ${score.toFixed(1)}` : pos.label}
                style={{
                  position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                  width: isActive ? 30 : 24, height: isActive ? 30 : 24,
                  borderRadius: '50%', transform: 'translate(-50%,-50%)',
                  background: dotColor, cursor: 'pointer', zIndex: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 7, fontWeight: 800, color: '#000',
                  border: isActive ? '2.5px solid #fff' : '1.5px solid rgba(255,255,255,0.35)',
                  boxShadow: isActive ? `0 0 10px ${dotColor}90` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {pos.id}
              </div>
            )
          })
          })()}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          {hasPlayer
            ? [['#22c55e','Top fit'],['#0066ff','Good fit'],['#ff6b00','Fair fit'],['#ef4444','Weak fit']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.textMuted }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  {l}
                </div>
              ))
            : [['gk','GK'],['def','DEF'],['mid','MID'],['att','ATT']].map(([z, l]) => (
                <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.textMuted }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ZONE_COLORS[z] }} />
                  {l}
                </div>
              ))
          }
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', minHeight: 260 }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, color: C.textMuted, gap: 8 }}>
            <div style={{ fontSize: 28 }}>⚽</div>
            <p style={{ fontSize: 12 }}>Click a position on the pitch</p>
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 16px 10px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ZONE_COLORS[selected.zone], flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{selected.label}</span>
              {hasPlayer && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 'auto' }}>values shown</span>}
            </div>
            <div style={{ padding: '12px 16px', overflowY: 'auto', maxHeight: 420 }}>
              {selected.gk && renderAttrGroup('gk', 'Goalkeeping', C.orange, selected.gk)}
              {renderAttrGroup('technical', 'Technical', C.blue, selected.technical)}
              {renderAttrGroup('mental', 'Mental', C.orange, selected.mental)}
              {renderAttrGroup('physical', 'Physical', C.green, selected.physical)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Age-adjusted role scoring ───────────────────────────────────────── */

function ageAdjustedScore(score, weights, age) {
  const profile = getAgeProfile(age)
  if (!profile || ['developing', 'peak', 'prime'].includes(profile.bracket)) return score
  const demand = rolePhysicalDemand(weights)
  const penaltyFactor = profile.bracket === 'declining' ? 1.6 : 0.7
  const penalty = Math.max(0, demand - 0.2) * penaltyFactor
  return score * Math.max(0.65, 1 - penalty)
}

function RoleSection({ title, roles, flat, age, accentColor }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: accentColor, flexShrink: 0,
        }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.map((r, i) => {
          const ageProfile = getAgeProfile(age)
          const demand = rolePhysicalDemand(r.weights)
          const showWarning = ageProfile && ageProfile.bracket !== 'peak' && ageProfile.bracket !== 'developing' && demand >= 0.22
          const isHighDemand = demand >= 0.32
          const barColor = r.score >= 15 ? C.green : r.score >= 12 ? C.blue : r.score >= 9 ? C.orange : '#e05050'
          const stars = scoreToStars(r.score)
          const filled = Math.floor(stars)
          const half = stars % 1 >= 0.5
          const pct = (r.score / 20) * 100
          const topAttrs = Object.entries(r.weights)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key]) => ({ key, val: flat[key] ?? 0 }))

          return (
            <div key={r.key} style={{
              background: i === 0 ? `linear-gradient(135deg, ${C.surface}, ${C.surfaceLight})` : C.surface,
              border: `1px solid ${i === 0 ? barColor + '40' : C.border}`,
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: i === 0 ? barColor : C.surfaceHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: i === 0 ? '#fff' : C.textMuted,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{r.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: barColor }}>{r.score.toFixed(1)}</div>
                  <div style={{ fontSize: 12, color: '#FFD600', letterSpacing: -1 }}>
                    {'★'.repeat(filled)}{half ? '½' : ''}{'☆'.repeat(5 - filled - (half ? 1 : 0))}
                  </div>
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: C.surfaceHover, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2, transition: 'width 0.4s' }} />
              </div>
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
              {showWarning && (
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
              )}
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

function RolesTab({ posScores, flat, age, selectedPos }) {
  const activePos = selectedPos || posScores[0]?.key || ''

  const allRoles = getRolesForPosition(activePos)
    .map(r => ({ ...r, score: calcRoleScore(r.key, flat) }))
    .sort((a, b) => ageAdjustedScore(b.score, b.weights, age) - ageAdjustedScore(a.score, a.weights, age))

  const isGK = activePos === 'GK'
  const ipRoles = isGK ? allRoles : allRoles.filter(r => r.phase === 'IP')
  const oopRoles = isGK ? [] : allRoles.filter(r => r.phase === 'OOP')

  const posLabel = posScores.find(p => p.key === activePos)?.label || activePos

  return (
    <div>
      {posLabel && (
        <div style={{ marginBottom: 16, fontSize: 13, color: C.textSecondary }}>
          Showing roles for <span style={{ color: C.text, fontWeight: 700 }}>{posLabel}</span>
          <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 6 }}>— click a position dot on the map to change</span>
        </div>
      )}

      {/* IP + OOP side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: oopRoles.length ? '1fr 1fr' : '1fr', gap: 16 }}>
        {ipRoles.length > 0 && (
          <RoleSection
            title="In Possession"
            roles={ipRoles}
            flat={flat}
            age={age}
            accentColor={C.blue}
          />
        )}

        {oopRoles.length > 0 && (
          <RoleSection
            title="Out of Possession"
            roles={oopRoles}
            flat={flat}
            age={age}
            accentColor={C.orange}
          />
        )}
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function PlayerAnalyserTool() {
  const [player, setPlayer] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const [selectedRolesPos, setSelectedRolesPos] = useState(null)
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
    setSelectedRolesPos(null)
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
    .map(p => ({ ...p, score: calcPositionScore(p.key, flat) * footAdjustment(p.key, details.preferredFoot) }))
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
              <a
                href={player.preview}
                download={`${(player.name || 'player').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.png`}
                title="Download screenshot"
                style={{ position: 'relative', display: 'block', flexShrink: 0 }}
              >
                <img src={player.preview} alt="" style={{
                  width: 48, height: 48, borderRadius: 10, objectFit: 'cover', opacity: 0.8,
                  display: 'block',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 10,
                  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </div>
              </a>
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
      <InsightBanner posScores={posScores} flat={flat} age={details.age} fmPositions={details.positions} traits={details.traits} />

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

      {/* ── Position Map (always visible) ── */}
      <div style={{ marginBottom: 24 }}>
        <PositionMapTab flat={flat} preferredFoot={details.preferredFoot} onPosClick={(posKey) => { setSelectedRolesPos(posKey); setActiveView('roles') }} />
      </div>

      {/* Tab Bar */}
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
        <RolesTab posScores={posScores} flat={flat} age={details.age} selectedPos={selectedRolesPos} />
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
