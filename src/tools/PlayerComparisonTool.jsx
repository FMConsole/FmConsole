import { useState, useRef, useCallback, Fragment } from 'react'
import C from '../theme/colors'
import { extractText } from './scanner/ocr.js'
import {
  parseAttributes, flattenAttributes, attrDisplayName, toCamelCase,
  GOALKEEPING_ATTRS, TECHNICAL_ATTRS, MENTAL_ATTRS, PHYSICAL_ATTRS,
} from './scanner/attributeParser.js'

const MAX_PLAYERS = 4

const PLAYER_COLORS = [C.blue, C.purple, C.orange, C.green]
const PLAYER_FILLS = [
  'rgba(0,102,255,0.15)',
  'rgba(124,77,255,0.15)',
  'rgba(255,107,0,0.15)',
  'rgba(0,200,83,0.15)',
]

const ATTR_GROUPS = {
  goalkeeping: GOALKEEPING_ATTRS,
  technical: TECHNICAL_ATTRS,
  mental: MENTAL_ATTRS,
  physical: PHYSICAL_ATTRS,
}

// Key stats subset for overview comparison
const KEY_STATS = [
  'pace', 'acceleration', 'finishing', 'passing', 'dribbling',
  'tackling', 'heading', 'composure', 'decisions', 'vision',
  'strength', 'stamina',
]

const VIEW_OPTIONS = [
  { key: 'key', label: 'Key Stats' },
  { key: 'goalkeeping', label: 'Goalkeeping' },
  { key: 'technical', label: 'Technical' },
  { key: 'mental', label: 'Mental' },
  { key: 'physical', label: 'Physical' },
]

function getAttrsForView(view) {
  if (view === 'key') return KEY_STATS
  return ATTR_GROUPS[view].map(toCamelCase)
}

/* ── Radar Chart (pure SVG) ───────────────────────────────────────────── */

function RadarChart({ players, attrKeys, size = 380 }) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 50
  const n = attrKeys.length
  if (n < 3) return null

  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  function polarToXY(angle, r) {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  // Grid rings
  const rings = [4, 8, 12, 16, 20]
  const gridLines = rings.map(val => {
    const r = (val / 20) * maxR
    const pts = attrKeys.map((_, i) => {
      const angle = startAngle + i * angleStep
      return polarToXY(angle, r)
    })
    return { val, points: pts.map(p => p.join(',')).join(' ') }
  })

  // Axis lines
  const axes = attrKeys.map((_, i) => {
    const angle = startAngle + i * angleStep
    return { x2: polarToXY(angle, maxR)[0], y2: polarToXY(angle, maxR)[1] }
  })

  // Player polygons
  const polygons = players.map((player, pi) => {
    const flat = flattenAttributes(player.parsed)
    const pts = attrKeys.map((key, i) => {
      const val = flat[key] || 0
      const r = (val / 20) * maxR
      const angle = startAngle + i * angleStep
      return polarToXY(angle, r)
    })
    return {
      points: pts.map(p => p.join(',')).join(' '),
      color: PLAYER_COLORS[pi % PLAYER_COLORS.length],
      fill: PLAYER_FILLS[pi % PLAYER_FILLS.length],
    }
  })

  // Labels
  const labels = attrKeys.map((key, i) => {
    const angle = startAngle + i * angleStep
    const labelR = maxR + 24
    const [lx, ly] = polarToXY(angle, labelR)
    let anchor = 'middle'
    if (Math.cos(angle) < -0.1) anchor = 'end'
    else if (Math.cos(angle) > 0.1) anchor = 'start'
    return { x: lx, y: ly, anchor, label: attrDisplayName(key) }
  })

  // Hover state
  const [hoverIdx, setHoverIdx] = useState(null)

  return (
    <div style={{ position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {/* Grid */}
        {gridLines.map(g => (
          <polygon key={g.val} points={g.points}
            fill="none" stroke={C.border} strokeWidth={1} />
        ))}
        {/* Ring labels */}
        {rings.map(val => {
          const r = (val / 20) * maxR
          return (
            <text key={val} x={cx + 4} y={cy - r + 4}
              fill={C.textMuted} fontSize={9} fontFamily="inherit">
              {val}
            </text>
          )
        })}
        {/* Axes */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2}
            stroke={C.border} strokeWidth={1} />
        ))}
        {/* Player polygons */}
        {polygons.map((poly, i) => (
          <polygon key={i} points={poly.points}
            fill={poly.fill} stroke={poly.color} strokeWidth={2}
            style={{ transition: 'opacity 0.2s' }}
            opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.3} />
        ))}
        {/* Labels */}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor={l.anchor}
            fill={C.textSecondary} fontSize={11} fontFamily="inherit"
            dominantBaseline="central"
            style={{ cursor: 'default' }}
            onMouseEnter={() => setHoverIdx(null)}>
            {l.label}
          </text>
        ))}
        {/* Hover dots on vertices */}
        {players.map((player, pi) => {
          const flat = flattenAttributes(player.parsed)
          return attrKeys.map((key, i) => {
            const val = flat[key] || 0
            const r = (val / 20) * maxR
            const angle = startAngle + i * angleStep
            const [px, py] = polarToXY(angle, r)
            return (
              <circle key={`${pi}-${i}`} cx={px} cy={py} r={4}
                fill={PLAYER_COLORS[pi % PLAYER_COLORS.length]}
                stroke={C.bg} strokeWidth={1.5}
                style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                onMouseEnter={() => setHoverIdx(i)} />
            )
          })
        })}
      </svg>

      {/* Hover tooltip */}
      {hoverIdx !== null && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: C.surface, border: `1px solid ${C.borderLight}`,
          borderRadius: 10, padding: '10px 14px', minWidth: 140,
          boxShadow: C.shadow,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            {attrDisplayName(attrKeys[hoverIdx])}
          </div>
          {players.map((player, pi) => {
            const flat = flattenAttributes(player.parsed)
            const val = flat[attrKeys[hoverIdx]] ?? '—'
            return (
              <div key={pi} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: 12, fontSize: 12, marginBottom: 2,
              }}>
                <span style={{ color: PLAYER_COLORS[pi % PLAYER_COLORS.length], fontWeight: 600 }}>
                  {player.name}
                </span>
                <span style={{ color: C.text, fontWeight: 700 }}>{val}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Comparison Table ─────────────────────────────────────────────────── */

function ComparisonTable({ players }) {
  const flats = players.map(p => flattenAttributes(p.parsed))

  // Only show goalkeeping if any player has goalkeeper attributes
  const hasGK = flats.some(f => GOALKEEPING_ATTRS.some(a => f[toCamelCase(a)] !== undefined))

  const groups = [
    ...(hasGK ? [{ title: 'Goalkeeping', attrs: GOALKEEPING_ATTRS.map(toCamelCase) }] : []),
    { title: 'Technical', attrs: TECHNICAL_ATTRS.map(toCamelCase) },
    { title: 'Mental', attrs: MENTAL_ATTRS.map(toCamelCase) },
    { title: 'Physical', attrs: PHYSICAL_ATTRS.map(toCamelCase) },
  ]

  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      background: C.gradientCard,
    }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontSize: 13, color: C.text,
      }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', color: C.textSecondary, fontWeight: 600 }}>
              Attribute
            </th>
            {players.map((p, i) => (
              <th key={i} style={{
                textAlign: 'center', padding: '12px 16px', fontWeight: 700,
                color: PLAYER_COLORS[i % PLAYER_COLORS.length],
                minWidth: 80,
              }}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <Fragment key={group.title}>
              <tr>
                <td colSpan={players.length + 1} style={{
                  padding: '10px 16px', fontWeight: 800, fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: 1,
                  color: C.textMuted, background: `${C.surfaceHover}66`,
                  borderBottom: `1px solid ${C.border}`,
                  borderTop: `1px solid ${C.border}`,
                }}>
                  {group.title}
                </td>
              </tr>
              {group.attrs.map(key => {
                const values = flats.map(f => f[key] ?? null)
                const validVals = values.filter(v => v !== null)
                const maxVal = validVals.length ? Math.max(...validVals) : null
                const minVal = validVals.length ? Math.min(...validVals) : null

                return (
                  <tr key={key} style={{ borderBottom: `1px solid ${C.border}22` }}>
                    <td style={{ padding: '8px 16px', color: C.textSecondary }}>
                      {attrDisplayName(key)}
                    </td>
                    {values.map((val, i) => {
                      let bg = 'transparent'
                      if (val !== null && validVals.length > 1) {
                        if (val === maxVal && maxVal !== minVal) bg = `${C.green}18`
                        else if (val === minVal && maxVal !== minVal) bg = `${C.orange}18`
                      }
                      return (
                        <td key={i} style={{
                          textAlign: 'center', padding: '8px 16px',
                          fontWeight: val !== null ? 600 : 400,
                          background: bg,
                          color: val !== null ? C.text : C.textMuted,
                        }}>
                          {val ?? '—'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Upload Card ──────────────────────────────────────────────────────── */

function UploadCard({ index, player, onFile, onRemove, onNameChange }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length]

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }, [onFile])

  if (player) {
    return (
      <div style={{
        background: C.gradientCard, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 16, position: 'relative',
      }}>
        {/* Preview */}
        {player.preview && (
          <img src={player.preview} alt="Screenshot" style={{
            width: '100%', height: 120, objectFit: 'cover',
            borderRadius: 8, marginBottom: 10, opacity: 0.7,
          }} />
        )}

        {/* Status */}
        {player.status === 'scanning' && (
          <div style={{ marginBottom: 10 }}>
            <div style={{
              height: 4, borderRadius: 2, background: C.surfaceHover, overflow: 'hidden',
            }}>
              <div style={{
                width: `${player.progress}%`, height: '100%',
                background: color, transition: 'width 0.3s',
              }} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
              Scanning... {player.progress}%
            </div>
          </div>
        )}

        {player.status === 'done' && (
          <>
            <input
              type="text"
              value={player.name}
              onChange={e => onNameChange(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: C.surfaceLight, color, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '8px 12px',
                fontSize: 14, fontWeight: 700, outline: 'none',
              }}
              placeholder="Player name"
            />
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
              {Object.keys(flattenAttributes(player.parsed)).length} attributes found
            </div>
          </>
        )}

        {player.status === 'error' && (
          <div style={{ fontSize: 12, color: C.orange }}>
            Failed to scan. Try a clearer screenshot.
          </div>
        )}

        {/* Remove button */}
        <button onClick={onRemove} style={{
          position: 'absolute', top: 8, right: 8,
          background: C.surfaceHover, border: 'none', borderRadius: 6,
          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: C.textMuted, fontSize: 14,
        }}>
          ×
        </button>
      </div>
    )
  }

  // Empty upload state
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        background: dragOver ? `${color}10` : C.gradientCard,
        border: `2px dashed ${dragOver ? color : C.border}`,
        borderRadius: 14, padding: 32,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, cursor: 'pointer', minHeight: 150,
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ fontSize: 28, color: C.textMuted }}>+</div>
      <div style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
        Drop a player attribute screenshot or click to upload
      </div>
      <input ref={inputRef} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ── Main Component ───────────────────────────────────────────────────── */

export default function PlayerComparisonTool() {
  const [players, setPlayers] = useState([]) // { id, file, preview, name, parsed, status, progress }
  const [view, setView] = useState('key')
  const nextId = useRef(0)

  const addPlayer = useCallback(async (file) => {
    if (players.length >= MAX_PLAYERS) return

    const id = nextId.current++
    const preview = URL.createObjectURL(file)

    setPlayers(prev => [...prev, {
      id, file, preview, name: '', parsed: null,
      status: 'scanning', progress: 0,
    }])

    try {
      const ocrResult = await extractText(file, {
        onProgress: (pct) => {
          setPlayers(prev => prev.map(p =>
            p.id === id ? { ...p, progress: pct } : p
          ))
        },
      })

      // extractText returns { text, overlay }
      const text = ocrResult.text || ocrResult
      const overlay = ocrResult.overlay || null

      const visionData = ocrResult.visionData || null
      const parsed = parseAttributes(text, overlay, visionData)

      setPlayers(prev => prev.map(p =>
        p.id === id ? {
          ...p, status: 'done', progress: 100,
          name: parsed.playerName, parsed,
        } : p
      ))
    } catch {
      // Revoke preview URL on error to prevent memory leak
      URL.revokeObjectURL(preview)
      setPlayers(prev => prev.map(p =>
        p.id === id ? { ...p, status: 'error' } : p
      ))
    }
  }, [players.length])

  const removePlayer = useCallback((id) => {
    setPlayers(prev => {
      const player = prev.find(p => p.id === id)
      if (player?.preview) URL.revokeObjectURL(player.preview)
      return prev.filter(p => p.id !== id)
    })
  }, [])

  const updateName = useCallback((id, name) => {
    setPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, name } : p
    ))
  }, [])

  const readyPlayers = players.filter(p => p.status === 'done')
  const attrKeys = getAttrsForView(view)

  // How many empty upload slots to show
  const emptySlots = Math.max(1, 2 - players.length)
  const canAddMore = players.length < MAX_PLAYERS

  return (
    <div>
      {/* Upload Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Upload Player Screenshots
        </h3>
        <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          Upload screenshots of FM player attribute profiles (the screen showing Technical, Mental, and Physical attributes).
          Supports up to {MAX_PLAYERS} players.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {players.map((player, i) => (
            <UploadCard
              key={player.id}
              index={i}
              player={player}
              onFile={() => {}}
              onRemove={() => removePlayer(player.id)}
              onNameChange={(name) => updateName(player.id, name)}
            />
          ))}
          {canAddMore && Array.from({ length: Math.min(emptySlots, MAX_PLAYERS - players.length) }).map((_, i) => (
            <UploadCard
              key={`empty-${i}`}
              index={players.length + i}
              player={null}
              onFile={addPlayer}
              onRemove={() => {}}
              onNameChange={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      {readyPlayers.length >= 2 && (
        <>
          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
          }}>
            {VIEW_OPTIONS.filter(opt => {
              if (opt.key !== 'goalkeeping') return true
              // Only show GK tab if any player has GK attributes
              return readyPlayers.some(p => {
                const flat = flattenAttributes(p.parsed)
                return GOALKEEPING_ATTRS.some(a => flat[toCamelCase(a)] !== undefined)
              })
            }).map(opt => (
              <button key={opt.key} onClick={() => setView(opt.key)} style={{
                padding: '8px 18px', borderRadius: 10, border: 'none',
                background: view === opt.key ? C.purple : C.surfaceLight,
                color: view === opt.key ? '#fff' : C.textSecondary,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap',
          }}>
            {readyPlayers.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: PLAYER_COLORS[i % PLAYER_COLORS.length],
                }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {p.name || `Player ${i + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          <div style={{
            background: C.gradientCard, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 24, marginBottom: 32,
          }}>
            <RadarChart players={readyPlayers} attrKeys={attrKeys} />
          </div>

          {/* Comparison Table */}
          <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Attribute Breakdown
          </h3>
          <ComparisonTable players={readyPlayers} />
        </>
      )}

      {readyPlayers.length === 1 && (
        <div style={{
          textAlign: 'center', padding: 40,
          color: C.textSecondary, fontSize: 14,
          background: C.gradientCard, borderRadius: 14,
          border: `1px solid ${C.border}`,
        }}>
          Upload at least one more player to compare.
        </div>
      )}
    </div>
  )
}
