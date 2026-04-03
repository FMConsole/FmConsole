import { useState, useEffect, useRef } from 'react'
import C from '../theme/colors'
import { FORMATIONS, VW, VH, HW, HH, getVertPositions, getHorzPositions, ROLES, POS_CATEGORY } from './formations'

const ACCENT = C.blue

// ── Shirt SVG ─────────────────────────────────────────────────────────────────
function ShirtSVG({ color, size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M10 4 C10 4 8 5 6 7 L2 11 L7 14 L7 28 L25 28 L25 14 L30 11 L26 7 C24 5 22 4 22 4 C21 6 19 8 16 8 C13 8 11 6 10 4Z"
        fill={color} fillOpacity="0.92" stroke={color} strokeWidth="0.5"/>
      <path d="M6 7 L2 11 L7 14 L9 10Z" fill={color} fillOpacity="0.7" stroke={color} strokeWidth="0.5"/>
      <path d="M26 7 L30 11 L25 14 L23 10Z" fill={color} fillOpacity="0.7" stroke={color} strokeWidth="0.5"/>
      <path d="M13 9 L13 26" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Vertical position card ────────────────────────────────────────────────────
function VCard({ title, x, y, color, delay, selected, onClick, role }) {
  return (
    <div onClick={onClick} style={{
      position: 'absolute', left: x, top: y - 28, width: 86,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: 'tbCardIn 0.3s cubic-bezier(.22,.68,0,1.2) both',
      animationDelay: `${delay}ms`,
      zIndex: 10, cursor: 'pointer',
      transform: selected ? 'scale(1.08)' : 'scale(1)',
      transition: 'transform 0.15s',
    }}>
      <ShirtSVG color={color} size={22}/>
      <div style={{
        marginTop: 3, width: '100%',
        background: selected
          ? `linear-gradient(160deg, ${C.surfaceHover} 0%, ${C.surfaceLight} 100%)`
          : `linear-gradient(160deg, ${C.surface} 0%, ${C.bgLight} 100%)`,
        border: `1px solid ${color}${selected ? '99' : '55'}`,
        borderTop: `2px solid ${color}`,
        borderRadius: 5,
        boxShadow: selected
          ? `0 0 0 2px ${color}55, 0 2px 12px rgba(0,0,0,0.55)`
          : `0 2px 12px rgba(0,0,0,0.55), 0 0 8px ${color}22`,
        padding: '3px 5px', textAlign: 'center',
      }}>
        <span style={{
          fontSize: 8, fontWeight: 700, color: selected ? color : C.text,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
        }}>
          {title}
        </span>
        {role && (
          <span style={{
            fontSize: 6, color: C.textSecondary, display: 'block',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginTop: 1,
          }}>
            {role}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Horizontal position card ──────────────────────────────────────────────────
function HCard({ title, x, y, color, delay, selected, onClick, role }) {
  return (
    <div onClick={onClick} style={{
      position: 'absolute', left: x, top: y - 42, width: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: 'tbCardIn 0.35s ease both',
      animationDelay: `${delay}ms`,
      zIndex: 10, cursor: 'pointer',
      transform: selected ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform 0.15s',
    }}>
      <ShirtSVG color={color} size={36}/>
      <div style={{
        marginTop: 5, width: '100%',
        background: selected
          ? `linear-gradient(145deg, ${C.surfaceHover}, ${C.surfaceLight})`
          : `linear-gradient(145deg, ${C.surface}, ${C.bgLight})`,
        border: `1px solid ${color}${selected ? '88' : '44'}`,
        borderTop: `2px solid ${color}`,
        borderRadius: 8,
        boxShadow: selected
          ? `0 0 0 2px ${color}44, 0 4px 18px rgba(0,0,0,0.5)`
          : `0 4px 18px rgba(0,0,0,0.5), 0 0 10px ${color}18`,
        padding: '7px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }}/>
          <span style={{
            fontSize: 13, fontWeight: 700, color: selected ? color : C.text, letterSpacing: 0.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </span>
        </div>
        {role && (
          <div style={{
            fontSize: 10, color: C.textSecondary, marginTop: 3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            paddingLeft: 12,
          }}>
            {role}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Pitch SVG markings (vertical) ─────────────────────────────────────────────
function VerticalPitchSVG({ W, H }) {
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }} width={W} height={H}>
      <rect x={2} y={2} width={W-4} height={H-4} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2}/>
      <line x1={2} y1={H/2} x2={W-2} y2={H/2} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <circle cx={W/2} cy={H/2} r={71} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
      <circle cx={W/2} cy={H/2} r={4} fill="rgba(255,255,255,0.4)"/>
      <rect x={98} y={2} width={285} height={129} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <rect x={176} y={2} width={129} height={43} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1}/>
      <rect x={214} y={-8} width={52} height={10} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2}/>
      <circle cx={W/2} cy={86} r={3} fill="rgba(255,255,255,0.4)"/>
      <path d="M 181 131 A 71 71 0 0 0 299 131" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
      <rect x={98} y={H-131} width={285} height={129} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <rect x={176} y={H-45} width={129} height={43} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1}/>
      <rect x={214} y={H-2} width={52} height={10} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2}/>
      <circle cx={W/2} cy={H-86} r={3} fill="rgba(255,255,255,0.4)"/>
      <path d={`M 181 ${H-131} A 71 71 0 0 1 299 ${H-131}`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
    </svg>
  )
}

// ── Pitch SVG markings (horizontal) ───────────────────────────────────────────
function HorizontalPitchSVG({ W, H }) {
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }} width={W} height={H}>
      <rect x={2} y={2} width={W-4} height={H-4} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2}/>
      <line x1={W/2} y1={2} x2={W/2} y2={H-2} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <circle cx={W/2} cy={H/2} r={96} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
      <circle cx={W/2} cy={H/2} r={4} fill="rgba(255,255,255,0.4)"/>
      <rect x={2} y={139} width={173} height={403} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <rect x={2} y={249} width={58} height={183} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1}/>
      <rect x={-9} y={304} width={11} height={73} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2}/>
      <circle cx={115} cy={H/2} r={3} fill="rgba(255,255,255,0.4)"/>
      <path d={`M 175 ${H/2-96} A 96 96 0 0 1 175 ${H/2+96}`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
      <rect x={W-175} y={139} width={173} height={403} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
      <rect x={W-60} y={249} width={58} height={183} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1}/>
      <rect x={W-2} y={304} width={11} height={73} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2}/>
      <circle cx={W-115} cy={H/2} r={3} fill="rgba(255,255,255,0.4)"/>
      <path d={`M ${W-175} ${H/2-96} A 96 96 0 0 0 ${W-175} ${H/2+96}`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5}/>
    </svg>
  )
}

// ── Layout toggle button ──────────────────────────────────────────────────────
function LayoutToggle({ isVertical, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center',
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 8, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
    }}>
      {[true, false].map(vert => (
        <div key={String(vert)} style={{
          padding: '6px 10px',
          background: isVertical === vert ? `${ACCENT}22` : 'transparent',
          borderRight: vert ? `1px solid ${C.border}` : 'none',
          transition: 'background 0.2s',
        }}>
          {vert
            ? <svg width={13} height={15} viewBox="0 0 14 16" fill="none">
                <rect x={2} y={0} width={10} height={5} rx={1} fill={isVertical ? ACCENT : C.textMuted}/>
                <rect x={3} y={6} width={8} height={4} rx={1} fill={isVertical ? ACCENT : C.textMuted} opacity={0.65}/>
                <rect x={4} y={11} width={6} height={4} rx={1} fill={isVertical ? ACCENT : C.textMuted} opacity={0.35}/>
              </svg>
            : <svg width={15} height={13} viewBox="0 0 16 14" fill="none">
                <rect x={0} y={2} width={5} height={10} rx={1} fill={!isVertical ? ACCENT : C.textMuted}/>
                <rect x={6} y={3} width={4} height={8} rx={1} fill={!isVertical ? ACCENT : C.textMuted} opacity={0.65}/>
                <rect x={11} y={4} width={5} height={6} rx={1} fill={!isVertical ? ACCENT : C.textMuted} opacity={0.35}/>
              </svg>
          }
        </div>
      ))}
    </div>
  )
}

// ── Green pitch stripes ───────────────────────────────────────────────────────
function PitchGrass({ width, height, vertical }) {
  const count = vertical ? 12 : 14
  return (
    <div style={{ position: 'absolute', left: 16, top: 16, width, height, overflow: 'hidden', borderRadius: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(vertical
            ? { left: 0, top: i * (height / count), width: '100%', height: height / count }
            : { left: i * (width / count), top: 0, width: width / count, height: '100%' }
          ),
          background: i % 2 === 0
            ? `linear-gradient(${vertical ? '90deg' : '180deg'}, #1e6e32, #1b6229)`
            : `linear-gradient(${vertical ? '90deg' : '180deg'}, #1c6530, #195827)`,
        }}/>
      ))}
    </div>
  )
}

// ── Category colors ───────────────────────────────────────────────────────────
const CAT_COLORS = {
  goalkeeper: C.orange,
  back:       C.green,
  midfield:   C.blue,
  forward:    C.purple,
}

const CAT_LABELS = {
  goalkeeper: 'Goalkeeper',
  back:       'Defenders',
  midfield:   'Midfielders',
  forward:    'Forwards',
}

// ── Role side panel ───────────────────────────────────────────────────────────
function RolePanel({ posId, title, category, assignedRole, onSelect, onClose }) {
  const roles = ROLES[category] || []
  const catColor = CAT_COLORS[category] || ACCENT
  const [search, setSearch] = useState('')
  const filtered = search
    ? roles.filter(r => r.toLowerCase().includes(search.toLowerCase()))
    : roles

  return (
    <div style={{
      width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: C.bg, borderLeft: `1px solid ${C.border}`,
      animation: 'tbPanelIn 0.22s cubic-bezier(.22,.68,0,1.2) both',
    }}>
      <style>{`@keyframes tbPanelIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }`}</style>

      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor, boxShadow: `0 0 8px ${catColor}`, flexShrink: 0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1 }}>{title}</div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>
            {CAT_LABELS[category]} — {roles.length} roles
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: C.textMuted,
          cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4,
        }}>
          ✕
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px 6px', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.surfaceLight, color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '8px 12px', fontSize: 13,
            fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
      </div>

      {/* Role list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {/* Clear role option */}
        {assignedRole && (
          <div
            onClick={() => onSelect(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', cursor: 'pointer',
              borderBottom: `1px solid ${C.border}`,
              background: C.surface,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = C.surface}
          >
            <span style={{ fontSize: 13, color: C.textMuted, fontStyle: 'italic' }}>Clear role</span>
          </div>
        )}

        {filtered.map(role => {
          const isActive = assignedRole === role
          return (
            <div
              key={role}
              onClick={() => onSelect(role)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', cursor: 'pointer',
                borderBottom: `1px solid ${C.border}`,
                background: isActive ? `${catColor}15` : C.bg,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.surfaceHover }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = C.bg }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: isActive ? catColor : C.border,
                boxShadow: isActive ? `0 0 6px ${catColor}` : 'none',
              }}/>
              <span style={{
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? catColor : C.text,
                flex: 1,
              }}>
                {role}
              </span>
              {isActive && (
                <span style={{ fontSize: 11, color: catColor }}>&#10003;</span>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
            No roles match "{search}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px', borderTop: `1px solid ${C.border}`,
        fontSize: 11, color: C.textMuted, textAlign: 'center', background: C.surface,
      }}>
        {assignedRole || 'No role assigned'}
      </div>
    </div>
  )
}

// ── Main TacticsBoard component ───────────────────────────────────────────────
export default function TacticsBoard() {
  const [fk, setFk] = useState('4-3-3')
  const [gen, setGen] = useState(0)
  const [autoMobile, setAutoMobile] = useState(() => window.innerWidth < 768)
  const [manualLayout, setManual] = useState(null)
  const [pitchScale, setPitchScale] = useState(1)
  const [selectedPos, setSelectedPos] = useState(null) // { id, title }
  const [roleMap, setRoleMap] = useState({}) // { posId: roleName }
  const containerRef = useRef(null)

  useEffect(() => {
    const h = () => { setAutoMobile(window.innerWidth < 768); setManual(null) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const isVertical = manualLayout !== null ? manualLayout === 'vertical' : autoMobile

  // Auto-scale pitch to fit container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const calc = () => {
      const availW = el.clientWidth - 32
      const availH = el.clientHeight - 32
      const naturalW = (isVertical ? VW : HW) + 32
      const naturalH = (isVertical ? VH : HH) + 32
      const scaleW = availW < naturalW ? availW / naturalW : 1
      const scaleH = availH < naturalH ? availH / naturalH : 1
      setPitchScale(Math.min(scaleW, scaleH))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isVertical, selectedPos])

  const fm = FORMATIONS[fk]
  const positions = isVertical ? getVertPositions(fm.lines) : getHorzPositions(fm.lines)
  const Card = isVertical ? VCard : HCard
  const pitchW = isVertical ? VW : HW
  const pitchH = isVertical ? VH : HH
  const PitchSVG = isVertical ? VerticalPitchSVG : HorizontalPitchSVG
  const wmLeft = isVertical ? 16 + VW / 2 - 55 : 16 + HW / 2 - 75
  const wmTop = isVertical ? 16 + VH / 2 - 26 : 16 + HH / 2 - 34
  const wmSize = isVertical ? 44 : 52

  const onCardClick = (posId, title) => {
    setSelectedPos(prev => prev?.id === posId ? null : { id: posId, title })
  }

  const onFormation = (e) => {
    setFk(e.target.value)
    setGen(g => g + 1)
    setSelectedPos(null)
    setRoleMap({})
  }

  const onRoleSelect = (role) => {
    if (!selectedPos) return
    setRoleMap(prev => {
      const next = { ...prev }
      if (role === null) {
        delete next[selectedPos.id]
      } else {
        next[selectedPos.id] = role
      }
      return next
    })
  }

  const selectedCategory = selectedPos ? POS_CATEGORY[selectedPos.id] : null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 320px)', minHeight: 500,
      background: C.bg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${C.border}`,
    }}>
      <style>{`
        @keyframes tbCardIn {
          from { opacity: 0; transform: scale(0.88) translateY(5px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
        background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: 0.5 }}>
            {fk}
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 1 }}>{fm.desc}</div>
        </div>

        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}/>

        <select
          value={fk}
          onChange={onFormation}
          style={{
            background: C.surfaceLight, color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '6px 30px 6px 12px', fontFamily: 'Inter, sans-serif',
            fontSize: 13, fontWeight: 600, letterSpacing: 0.3,
            cursor: 'pointer', outline: 'none',
            appearance: 'none', WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238892A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            minWidth: 110,
          }}
        >
          {Object.keys(FORMATIONS).map(k => <option key={k} value={k}>{k}</option>)}
        </select>

        <LayoutToggle isVertical={isVertical} onToggle={() => { setManual(isVertical ? 'horizontal' : 'vertical'); setSelectedPos(null) }}/>
      </div>

      {/* Body: pitch + optional role panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Pitch scroll area */}
        <div ref={containerRef} style={{
          flex: 1, overflow: 'auto', display: 'flex',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: 16, background: C.bg,
        }}>
          <div style={{
            width: (pitchW + 32) * pitchScale,
            height: (pitchH + 32) * pitchScale,
            flexShrink: 0,
          }}>
            <div style={{
              position: 'relative', width: pitchW + 32, height: pitchH + 32,
              transform: `scale(${pitchScale})`, transformOrigin: 'top left',
            }}>
              <PitchGrass width={pitchW} height={pitchH} vertical={isVertical}/>
              <div style={{ position: 'absolute', left: 16, top: 16 }}>
                <PitchSVG W={pitchW} H={pitchH}/>
              </div>

              {/* Formation watermark */}
              <div key={`wm-${gen}`} style={{
                position: 'absolute', left: wmLeft, top: wmTop,
                pointerEvents: 'none', zIndex: 2,
                animation: 'tbCardIn 0.4s ease both',
              }}>
                <span style={{
                  fontSize: wmSize, fontWeight: 900,
                  color: `${ACCENT}14`, letterSpacing: isVertical ? 4 : 6,
                  userSelect: 'none',
                }}>
                  {fk}
                </span>
              </div>

              {/* Position cards */}
              <div key={gen}>
                {positions.map((pos, idx) => (
                  <Card
                    key={pos.id}
                    {...pos}
                    x={pos.x + 16}
                    y={pos.y + 16}
                    color={ACCENT}
                    delay={idx * 28}
                    selected={selectedPos?.id === pos.id}
                    onClick={() => onCardClick(pos.id, pos.title)}
                    role={roleMap[pos.id]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role panel */}
        {selectedPos && selectedCategory && (
          <RolePanel
            posId={selectedPos.id}
            title={selectedPos.title}
            category={selectedCategory}
            assignedRole={roleMap[selectedPos.id] || null}
            onSelect={onRoleSelect}
            onClose={() => setSelectedPos(null)}
          />
        )}
      </div>
    </div>
  )
}
