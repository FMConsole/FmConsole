import { useState, useEffect } from 'react'
import C from '../theme/colors'
import { FORMATIONS, ROLES, POS_CATEGORY } from './formations'

// ── Category colors & labels ──────────────────────────────────────────────────
const CAT_COLORS = {
  goalkeeper: C.orange,
  back:       C.green,
  midfield:   C.blue,
  forward:    C.purple,
}
const CAT_LABELS = {
  goalkeeper: 'Goalkeeper',
  back:       'Defence',
  midfield:   'Midfield',
  forward:    'Attack',
}

// ── Group formation lines by category ─────────────────────────────────────────
function getLineGroups(lines) {
  // Each line in the formation maps to a group
  // Line 0 is always GK, then we use POS_CATEGORY to label the rest
  return lines.map(line => {
    const positions = line.map(([id, title]) => ({ id, title }))
    const cat = POS_CATEGORY[positions[0].id] || 'midfield'
    return { category: cat, color: CAT_COLORS[cat], label: CAT_LABELS[cat], positions }
  })
}

// ── Position slot row ─────────────────────────────────────────────────────────
function SlotRow({ pos, data, isSelected, color, onClick }) {
  const hasPlayer = data?.name
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
        background: isSelected ? `${color}12` : C.bg,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.surfaceHover }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = C.bg }}
    >
      {/* Position badge */}
      <span style={{
        width: 44, flexShrink: 0, textAlign: 'center',
        padding: '4px 0', borderRadius: 6,
        background: `${color}18`, color, fontSize: 11,
        fontWeight: 700, letterSpacing: 0.5,
      }}>
        {pos.title.length > 8 ? pos.title.split(' ').map(w => w[0]).join('') : pos.title}
      </span>

      {/* Player name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: hasPlayer ? 600 : 400,
          color: hasPlayer ? C.text : C.textMuted,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {hasPlayer ? data.name : 'Empty slot'}
        </div>
        {data?.role && (
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>
            {data.role}
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: hasPlayer ? C.green : C.border,
        boxShadow: hasPlayer ? `0 0 6px ${C.green}` : 'none',
      }}/>
    </div>
  )
}

// ── Edit panel (desktop: side, mobile: bottom overlay) ────────────────────────
function EditPanel({ pos, category, data, onSave, onClear, onClose, isMobile }) {
  const [name, setName] = useState(data?.name || '')
  const [role, setRole] = useState(data?.role || '')
  const [roleSearch, setRoleSearch] = useState('')
  const roles = ROLES[category] || []
  const catColor = CAT_COLORS[category] || C.blue
  const filtered = roleSearch
    ? roles.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase()))
    : roles

  // Sync when pos changes
  useEffect(() => {
    setName(data?.name || '')
    setRole(data?.role || '')
    setRoleSearch('')
  }, [pos.id, data?.name, data?.role])

  const handleSave = () => {
    onSave({ name: name.trim(), role })
  }

  const panelContent = (
    <>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor, boxShadow: `0 0 8px ${catColor}`, flexShrink: 0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1 }}>{pos.title}</div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>
            {CAT_LABELS[category]}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: C.textMuted,
          cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4,
        }}>
          ✕
        </button>
      </div>

      {/* Player name input */}
      <div style={{ padding: '16px 16px 8px', flexShrink: 0 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
          Player Name
        </label>
        <input
          type="text"
          placeholder="Enter player name..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) handleSave() }}
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.surfaceLight, color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '10px 12px', fontSize: 14,
            fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
      </div>

      {/* Role section */}
      <div style={{ padding: '8px 16px 4px', flexShrink: 0 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
          Role
        </label>
        <input
          type="text"
          placeholder="Search roles..."
          value={roleSearch}
          onChange={e => setRoleSearch(e.target.value)}
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
        {filtered.map(r => {
          const isActive = role === r
          return (
            <div
              key={r}
              onClick={() => setRole(isActive ? '' : r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 16px', cursor: 'pointer',
                background: isActive ? `${catColor}15` : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.surfaceHover }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? `${catColor}15` : 'transparent' }}
            >
              <div style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: isActive ? catColor : C.border,
              }}/>
              <span style={{
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                color: isActive ? catColor : C.text, flex: 1,
              }}>
                {r}
              </span>
              {isActive && <span style={{ fontSize: 11, color: catColor }}>&#10003;</span>}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '20px 16px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
            No roles match "{roleSearch}"
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0,
      }}>
        {data?.name && (
          <button onClick={onClear} style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.textSecondary, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            Clear
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          style={{
            flex: 2, padding: '10px 0', borderRadius: 8,
            background: name.trim() ? C.gradientBlue : C.surfaceLight,
            border: 'none', color: name.trim() ? '#fff' : C.textMuted,
            fontSize: 13, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Save
        </button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 100, animation: 'sbFadeIn 0.2s ease both',
        }}/>
        {/* Bottom sheet */}
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          height: '70vh', display: 'flex', flexDirection: 'column',
          background: C.bg, borderTop: `1px solid ${C.border}`,
          borderRadius: '16px 16px 0 0', zIndex: 101,
          animation: 'sbSlideUp 0.25s cubic-bezier(.22,.68,0,1.2) both',
        }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }}/>
          </div>
          {panelContent}
        </div>
      </>
    )
  }

  return (
    <div style={{
      width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: C.bg, borderLeft: `1px solid ${C.border}`,
      animation: 'sbPanelIn 0.22s cubic-bezier(.22,.68,0,1.2) both',
    }}>
      {panelContent}
    </div>
  )
}

// ── Squad summary bar ─────────────────────────────────────────────────────────
function SummaryBar({ totalSlots, filledSlots }) {
  const pct = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
      background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          height: 4, borderRadius: 2, background: C.border, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2, width: `${pct}%`,
            background: C.gradientBlue, transition: 'width 0.3s ease',
          }}/>
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, flexShrink: 0 }}>
        {filledSlots}/{totalSlots} filled
      </span>
    </div>
  )
}

// ── Main SquadBoard component ─────────────────────────────────────────────────
export default function SquadBoard() {
  const [fk, setFk] = useState('4-3-3')
  const [selectedPos, setSelectedPos] = useState(null) // { id, title }
  const [squad, setSquad] = useState({}) // { [posId]: { name, role } }
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const fm = FORMATIONS[fk]
  const lineGroups = getLineGroups(fm.lines)
  const allPositions = lineGroups.flatMap(g => g.positions)
  const filledCount = allPositions.filter(p => squad[p.id]?.name).length

  const onFormation = (e) => {
    setFk(e.target.value)
    setSelectedPos(null)
    setSquad({})
  }

  const onSlotClick = (pos) => {
    setSelectedPos(prev => prev?.id === pos.id ? null : pos)
  }

  const onSave = (data) => {
    if (!selectedPos) return
    setSquad(prev => ({ ...prev, [selectedPos.id]: data }))
    // Auto-advance to next empty slot
    const idx = allPositions.findIndex(p => p.id === selectedPos.id)
    const next = allPositions.slice(idx + 1).find(p => !squad[p.id]?.name)
    if (next) {
      setSelectedPos(next)
    } else {
      setSelectedPos(null)
    }
  }

  const onClear = () => {
    if (!selectedPos) return
    setSquad(prev => {
      const next = { ...prev }
      delete next[selectedPos.id]
      return next
    })
  }

  const selectedCategory = selectedPos ? POS_CATEGORY[selectedPos.id] : null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 320px)', minHeight: 500,
      background: C.bg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${C.border}`, position: 'relative',
    }}>
      <style>{`
        @keyframes sbPanelIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        @keyframes sbSlideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:none} }
        @keyframes sbFadeIn { from{opacity:0} to{opacity:1} }
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
      </div>

      {/* Summary bar */}
      <SummaryBar totalSlots={allPositions.length} filledSlots={filledCount} />

      {/* Body: depth chart + optional panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Depth chart */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {lineGroups.map((group, gi) => (
            <div key={gi}>
              {/* Group header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', background: C.surface,
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: group.color, boxShadow: `0 0 6px ${group.color}`,
                }}/>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
                  color: group.color, textTransform: 'uppercase',
                }}>
                  {group.label}
                </span>
                <span style={{ fontSize: 11, color: C.textMuted }}>
                  {group.positions.filter(p => squad[p.id]?.name).length}/{group.positions.length}
                </span>
              </div>

              {/* Position slots */}
              {group.positions.map(pos => (
                <SlotRow
                  key={pos.id}
                  pos={pos}
                  data={squad[pos.id]}
                  isSelected={selectedPos?.id === pos.id}
                  color={group.color}
                  onClick={() => onSlotClick(pos)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Edit panel (desktop only — mobile uses overlay) */}
        {selectedPos && selectedCategory && !isMobile && (
          <EditPanel
            pos={selectedPos}
            category={selectedCategory}
            data={squad[selectedPos.id]}
            onSave={onSave}
            onClear={onClear}
            onClose={() => setSelectedPos(null)}
            isMobile={false}
          />
        )}
      </div>

      {/* Mobile panel overlay */}
      {selectedPos && selectedCategory && isMobile && (
        <EditPanel
          pos={selectedPos}
          category={selectedCategory}
          data={squad[selectedPos.id]}
          onSave={onSave}
          onClear={onClear}
          onClose={() => setSelectedPos(null)}
          isMobile={true}
        />
      )}
    </div>
  )
}
