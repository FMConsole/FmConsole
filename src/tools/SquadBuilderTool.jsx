import { useState, useEffect, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { FORMATIONS, POS_CATEGORY, ROLES } from './formations'
import { extractText, SQUAD_EXTRACTION_PROMPT } from './scanner/ocr.js'

/* ── League / team data ────────────────────────────────────────────────── */

const LEAGUE_META = {
  pl:"Premier League|ENG", elc:"Championship|ENG", lo:"League One|ENG", lt:"League Two|ENG",
  enl:"National League|ENG",
  bl1:"Bundesliga|GER", bl2:"2. Bundesliga|GER",
  sa:"Serie A|ITA", sb:"Serie B|ITA",
  pd:"La Liga|ESP", l2:"La Liga 2|ESP",
  fl1:"Ligue 1|FRA", fl2:"Ligue 2|FRA",
  ded:"Eredivisie|NED",
  ppl:"Liga Portugal|POR",
  ssl:"Super Lig|TUR",
  bpl:"Pro League|BEL",
  spl:"Premiership|SCO",
  mls:"Major League Soccer|USA",
  arg:"Primera Division|ARG",
  bsa:"Serie A|BRA",
  abl:"Bundesliga|AUT",
}

const COUNTRY_FLAGS = {
  ENG:"\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  SCO:"\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  GER:"\uD83C\uDDE9\uD83C\uDDEA", ITA:"\uD83C\uDDEE\uD83C\uDDF9", ESP:"\uD83C\uDDEA\uD83C\uDDF8",
  FRA:"\uD83C\uDDEB\uD83C\uDDF7", NED:"\uD83C\uDDF3\uD83C\uDDF1", POR:"\uD83C\uDDF5\uD83C\uDDF9",
  TUR:"\uD83C\uDDF9\uD83C\uDDF7", BEL:"\uD83C\uDDE7\uD83C\uDDEA", AUT:"\uD83C\uDDE6\uD83C\uDDF9",
  USA:"\uD83C\uDDFA\uD83C\uDDF8", BRA:"\uD83C\uDDE7\uD83C\uDDF7", ARG:"\uD83C\uDDE6\uD83C\uDDF7",
}

function getLeagueInfo(code) {
  const meta = LEAGUE_META[code]
  if (!meta) return null
  const [name, country] = meta.split('|')
  return { code, name, country, flag: COUNTRY_FLAGS[country] || '' }
}

const LEAGUE_LIST = Object.keys(LEAGUE_META).map(getLeagueInfo).filter(Boolean)
const LEAGUES_BY_COUNTRY = {}
for (const l of LEAGUE_LIST) {
  if (!LEAGUES_BY_COUNTRY[l.country]) LEAGUES_BY_COUNTRY[l.country] = []
  LEAGUES_BY_COUNTRY[l.country].push(l)
}

const clubModules = import.meta.glob('../data/fm/*-clubs.json')
const squadModules = import.meta.glob('../data/fm/*-squads.json')

async function loadClubs(leagueCode) {
  const key = `../data/fm/${leagueCode}-clubs.json`
  if (!clubModules[key]) return []
  const mod = await clubModules[key]()
  return mod.default || mod
}

async function loadSquad(leagueCode, clubId) {
  const key = `../data/fm/${leagueCode}-squads.json`
  if (!squadModules[key]) return []
  const mod = await squadModules[key]()
  const data = mod.default || mod
  return data[clubId] || []
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

const CAT_COLORS = { goalkeeper: C.orange, back: C.green, midfield: C.blue, forward: C.purple }

function posToCategory(pos) {
  if (!pos) return 'midfield'
  const p = pos.toUpperCase()
  if (p.includes('GK')) return 'goalkeeper'
  if (p.includes('D') || p.includes('CB') || p.includes('LB') || p.includes('RB') || p.includes('WB')) return 'back'
  if (p.includes('ST') || p.includes('CF') || p.includes('FW')) return 'forward'
  if (p.includes('AM') || p.includes('LW') || p.includes('RW')) return 'forward'
  return 'midfield'
}

const STORAGE = {
  roster: 'fmc_squad_roster',
  formation: 'fmc_squad_formation',
  assignments: 'fmc_squad_assignments',
  team: 'fmc_squad_team',
}

/* ── Step 1: Roster Builder ─────────────────────────────────────────────── */

function RosterStep({ roster, setRoster, onNext }) {
  const [source, setSource] = useState('upload') // 'upload' | 'database'
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState('')
  const [scanError, setScanError] = useState('')
  const [league, setLeague] = useState('')
  const [clubs, setClubs] = useState([])
  const [clubId, setClubId] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  // Upload screenshot
  const handleUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setScanning(true)
    setProgress(0)
    setScanError('')
    setScanStatus('')
    try {
      const result = await extractText(file, {
        onProgress: setProgress,
        onStatus: setScanStatus,
        prompt: SQUAD_EXTRACTION_PROMPT,
      })
      const visionData = result.visionData
      if (visionData && visionData.players && visionData.players.length > 0) {
        const players = visionData.players.map((p, i) => ({
          id: `v-${i}-${Date.now()}`,
          name: p.playerName || '',
          pos: p.position || '',
          age: p.age || null,
          nationality: p.nationality || '',
          value: p.transferValue || '',
          wage: p.wage || '',
          playingTime: p.playingTime || '',
          status: p.status || [],
        }))
        setRoster(players)
        localStorage.setItem(STORAGE.roster, JSON.stringify(players))
        setScanStatus(`Found ${players.length} players`)
      } else {
        setScanError('No players found in screenshot. Make sure it\'s an FM squad list view.')
      }
    } catch (err) {
      console.error('Vision scan failed:', err)
      setScanError(err.message || 'Scan failed. Check your API key configuration.')
    }
    setScanning(false)
  }, [setRoster])

  // Load from database
  useEffect(() => {
    if (!league) return
    setLoading(true)
    loadClubs(league).then(c => { setClubs(c); setLoading(false) })
  }, [league])

  const handleClubSelect = useCallback(async (id) => {
    setClubId(id)
    setLoading(true)
    const players = await loadSquad(league, id)
    const mapped = players.map(p => ({
      id: p.id || `db-${Math.random().toString(36).slice(2)}`,
      name: p.name || '',
      pos: p.pos || '',
      age: p.age || null,
      nationality: p.nationality || '',
      fmCA: p.fmCA || null,
      value: '',
      wage: '',
      playingTime: '',
      status: [],
    }))
    setRoster(mapped)
    localStorage.setItem(STORAGE.roster, JSON.stringify(mapped))
    const club = clubs.find(c => c.id === id)
    localStorage.setItem(STORAGE.team, JSON.stringify({ leagueCode: league, clubId: id, clubName: club?.name || '' }))
    setLoading(false)
  }, [league, clubs, setRoster])

  const removePlayer = (id) => {
    const updated = roster.filter(p => p.id !== id)
    setRoster(updated)
    localStorage.setItem(STORAGE.roster, JSON.stringify(updated))
  }

  const MAJOR = ['ENG', 'ESP', 'GER', 'ITA', 'FRA', 'NED', 'POR']
  const sortedCountries = Object.keys(LEAGUES_BY_COUNTRY).sort((a, b) => {
    const ai = MAJOR.indexOf(a), bi = MAJOR.indexOf(b)
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return a.localeCompare(b)
  })

  return (
    <div>
      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ key: 'upload', label: 'Upload Screenshot' }, { key: 'database', label: 'Pick from Database' }].map(opt => (
          <button key={opt.key} onClick={() => setSource(opt.key)} style={{
            flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none',
            background: source === opt.key ? C.blue : C.surfaceLight,
            color: source === opt.key ? '#fff' : C.textSecondary,
            fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      {source === 'upload' && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f) }}
          style={{
            padding: scanning ? '20px' : '40px 24px',
            border: `2px dashed ${C.border}`, borderRadius: 14,
            background: C.gradientCard, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            marginBottom: 20,
          }}
        >
          {scanning ? (
            <>
              <div style={{ width: '100%', height: 6, borderRadius: 3, background: C.surfaceHover, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: C.blue, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 12, color: C.textMuted }}>{scanStatus || `Analyzing squad screenshot... ${progress}%`}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 28 }}>+</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>
                Drop FM squad list screenshot or click to upload
              </span>
              {scanStatus && !scanError && (
                <span style={{ fontSize: 12, color: C.green }}>{scanStatus}</span>
              )}
              {scanError && (
                <span style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', maxWidth: 360 }}>{scanError}</span>
              )}
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} />
        </div>
      )}

      {/* Database picker */}
      {source === 'database' && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select value={league} onChange={e => { setLeague(e.target.value); setClubId('') }}
            style={{
              flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10,
              background: C.surfaceLight, color: C.text, border: `1px solid ${C.border}`,
              fontFamily: 'inherit', fontSize: 13, outline: 'none',
            }}>
            <option value="">Select League...</option>
            {sortedCountries.map(country => (
              <optgroup key={country} label={`${COUNTRY_FLAGS[country] || ''} ${country}`}>
                {LEAGUES_BY_COUNTRY[country].map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {clubs.length > 0 && (
            <select value={clubId} onChange={e => handleClubSelect(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10,
                background: C.surfaceLight, color: C.text, border: `1px solid ${C.border}`,
                fontFamily: 'inherit', fontSize: 13, outline: 'none',
              }}>
              <option value="">Select Club...</option>
              {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          {loading && <span style={{ fontSize: 12, color: C.textMuted, alignSelf: 'center' }}>Loading...</span>}
        </div>
      )}

      {/* Roster table */}
      {roster.length > 0 && (
        <>
          <div style={{
            overflowX: 'auto', borderRadius: 12,
            border: `1px solid ${C.border}`, background: C.gradientCard, marginBottom: 16,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: C.text }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Name', 'Pos', 'Age', 'Nat', 'Value', 'Wage', 'Role', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 10px', color: C.textSecondary, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster.map(p => {
                  const cat = posToCategory(p.pos)
                  const color = CAT_COLORS[cat] || C.blue
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}22` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, background: `${color}18`, color, fontSize: 11, fontWeight: 700 }}>
                          {p.pos || '?'}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', color: C.textSecondary }}>{p.age || '—'}</td>
                      <td style={{ padding: '8px 10px', color: C.textSecondary }}>{p.nationality || '—'}</td>
                      <td style={{ padding: '8px 10px', color: C.textSecondary, fontSize: 11 }}>{p.value || '—'}</td>
                      <td style={{ padding: '8px 10px', color: C.textSecondary, fontSize: 11 }}>{p.wage || '—'}</td>
                      <td style={{ padding: '8px 10px', color: C.textMuted, fontSize: 11 }}>{p.playingTime || '—'}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <button onClick={() => removePlayer(p.id)} style={{
                          background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 14,
                        }}>x</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>{roster.length} players</span>
            <button onClick={onNext} style={{
              padding: '12px 28px', borderRadius: 10, border: 'none',
              background: C.gradientBlue, color: '#fff', fontWeight: 700,
              fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Build Formation &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Step 2: Formation Builder ──────────────────────────────────────────── */

function FormationStep({ roster, onBack }) {
  const [formation, setFormation] = useState(() => localStorage.getItem(STORAGE.formation) || '4-3-3')
  const [squad, setSquad] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE.assignments) || '{}') } catch { return {} }
  })
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [dragPlayer, setDragPlayer] = useState(null)
  const [hoverSlot, setHoverSlot] = useState(null)
  const [rosterFilter, setRosterFilter] = useState('all')

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const fm = FORMATIONS[formation]
  const allPositions = fm.lines.flatMap(line => line.map(([id, title]) => ({ id, title })))
  const filledCount = allPositions.filter(p => squad[p.id]).length
  const placedIds = new Set(Object.values(squad).filter(Boolean).map(p => p.id))

  const grouped = { goalkeeper: [], back: [], midfield: [], forward: [] }
  for (const p of roster) {
    const cat = posToCategory(p.pos)
    if (cat && grouped[cat]) grouped[cat].push(p)
    else grouped.midfield.push(p)
  }

  const catLabels = { goalkeeper: 'GK', back: 'DEF', midfield: 'MID', forward: 'FWD' }
  const filteredPlayers = rosterFilter === 'all'
    ? roster
    : roster.filter(p => posToCategory(p.pos) === rosterFilter)

  const saveSquad = (s, f) => {
    localStorage.setItem(STORAGE.assignments, JSON.stringify(s))
    if (f) localStorage.setItem(STORAGE.formation, f)
  }

  const handleFormationChange = (e) => {
    const newFm = e.target.value
    const newFormation = FORMATIONS[newFm]
    if (!newFormation) return

    const newSlots = newFormation.lines.flatMap(line => line.map(([id]) => id))
    const newSquad = {}
    const placed = new Set()

    for (const slotId of newSlots) {
      if (squad[slotId]) { newSquad[slotId] = squad[slotId]; placed.add(slotId) }
    }

    const posSlotMap = { GK: 'gk', LB: 'lb', RB: 'rb', LWB: 'lwb', RWB: 'rwb', LW: 'lw', RW: 'rw', LM: 'lm', RM: 'rm', ST: 'st' }
    for (const [oldSlotId, player] of Object.entries(squad)) {
      if (!player || placed.has(oldSlotId)) continue
      const targetSlot = posSlotMap[player.pos?.toUpperCase()]
      if (targetSlot && newSlots.includes(targetSlot) && !newSquad[targetSlot]) {
        newSquad[targetSlot] = player; placed.add(oldSlotId)
      }
    }

    const remaining = Object.entries(squad).filter(([s, p]) => p && !placed.has(s))
      .map(([s, p]) => ({ player: p, cat: POS_CATEGORY[s] || posToCategory(p.pos) || 'midfield' }))
    const byCategory = {}
    for (const r of remaining) { if (!byCategory[r.cat]) byCategory[r.cat] = []; byCategory[r.cat].push(r.player) }
    for (const slotId of newSlots) {
      if (newSquad[slotId]) continue
      const cat = POS_CATEGORY[slotId]
      if (byCategory[cat]?.length > 0) newSquad[slotId] = byCategory[cat].shift()
    }

    setFormation(newFm)
    setSquad(newSquad)
    saveSquad(newSquad, newFm)
  }

  const onRosterDragStart = (player) => setDragPlayer(player)
  const onSlotDragStart = (slotId) => {
    const player = squad[slotId]
    if (!player) return
    setDragPlayer(player)
    const next = { ...squad }; delete next[slotId]; setSquad(next); saveSquad(next)
  }
  const onSlotDrop = (slotId) => {
    if (!dragPlayer) return
    const next = { ...squad, [slotId]: dragPlayer }; setSquad(next); saveSquad(next)
    setDragPlayer(null); setHoverSlot(null)
  }
  const onSlotDragOver = (e, slotId) => { e.preventDefault(); setHoverSlot(slotId) }
  const onSlotDragLeave = () => setHoverSlot(null)
  const onDragEnd = () => { setDragPlayer(null); setHoverSlot(null) }
  const removeFromSlot = (slotId) => {
    const next = { ...squad }; delete next[slotId]; setSquad(next); saveSquad(next)
  }

  return (
    <div style={{ background: C.bg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
        background: C.surface, borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '6px 14px', color: C.textSecondary, fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          &larr; Roster
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Build Formation</div>
          <div style={{ fontSize: 12, color: C.textSecondary }}>Drag players into slots</div>
        </div>
        <select value={formation} onChange={handleFormationChange} style={{
          background: C.surfaceLight, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '6px 30px 6px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', outline: 'none', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238892A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
          {Object.keys(FORMATIONS).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Progress */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, background: C.gradientBlue, transition: 'width 0.3s',
            width: `${allPositions.length > 0 ? (filledCount / allPositions.length) * 100 : 0}%`,
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary }}>{filledCount}/{allPositions.length}</span>
      </div>

      {/* Main: pitch + roster */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', minHeight: 400 }}>
        {/* Pitch */}
        <div style={{
          position: 'relative', padding: isMobile ? 16 : 24,
          display: 'flex', flexDirection: 'column-reverse', gap: isMobile ? 10 : 14,
          background: 'linear-gradient(180deg, #0d2818 0%, #0a1f14 50%, #071a0f 100%)',
          borderRight: isMobile ? 'none' : `1px solid ${C.border}`,
          overflow: 'hidden',
        }}>
          {/* Pitch SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            viewBox="0 0 500 700" preserveAspectRatio="none">
            <rect x={10} y={10} width={480} height={680} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={2}/>
            <line x1={10} y1={350} x2={490} y2={350} stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            <circle cx={250} cy={350} r={70} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5}/>
            <circle cx={250} cy={350} r={3} fill="rgba(255,255,255,0.15)"/>
            <rect x={110} y={10} width={280} height={120} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            <rect x={175} y={10} width={150} height={45} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
            <rect x={110} y={570} width={280} height={120} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            <rect x={175} y={645} width={150} height={45} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={i} x={10} y={10 + i * 97.1} width={480} height={48.6} fill="rgba(255,255,255,0.012)"/>
            ))}
          </svg>

          {fm.lines.map((line, li) => (
            <div key={li} style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 8 : 12, position: 'relative', zIndex: 1 }}>
              {line.map(([posId, posTitle]) => {
                const cat = POS_CATEGORY[posId] || 'midfield'
                const color = CAT_COLORS[cat] || C.blue
                const player = squad[posId]
                const isHover = hoverSlot === posId
                const abbr = posTitle.length > 8 ? posTitle.split(' ').map(w => w[0]).join('') : posTitle

                return (
                  <div key={posId}
                    onDragOver={e => onSlotDragOver(e, posId)}
                    onDragLeave={onSlotDragLeave}
                    onDrop={() => onSlotDrop(posId)}
                    draggable={!!player}
                    onDragStart={() => onSlotDragStart(posId)}
                    onDragEnd={onDragEnd}
                    onClick={() => player && removeFromSlot(posId)}
                    title={player ? `${player.name} — click to remove` : `Drop player (${posTitle})`}
                    style={{
                      width: isMobile ? 78 : 100, minHeight: isMobile ? 68 : 80,
                      borderRadius: 10,
                      border: `2px ${player ? 'solid' : 'dashed'} ${isHover ? color : player ? color + '88' : 'rgba(255,255,255,0.12)'}`,
                      background: player ? `${color}18` : isHover ? `${color}12` : 'rgba(10,20,15,0.65)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 3, padding: '8px 6px', cursor: player ? 'grab' : 'default',
                      transition: 'all 0.15s',
                      boxShadow: isHover ? `0 0 16px ${color}44` : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {player ? (
                      <>
                        <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: C.text, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap' }}>
                          {player.name.split(' ').pop()}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, color, background: `${color}22`, borderRadius: 3, padding: '1px 5px' }}>
                          {player.pos || abbr}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: isHover ? color : 'rgba(255,255,255,0.35)' }}>{abbr}</div>
                        <div style={{ fontSize: 18, opacity: isHover ? 0.8 : 0.25, color: 'rgba(255,255,255,0.5)' }}>+</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Roster panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
            {['all', 'goalkeeper', 'back', 'midfield', 'forward'].map(cat => {
              const label = cat === 'all' ? 'All' : catLabels[cat]
              const active = rosterFilter === cat
              const count = cat === 'all'
                ? roster.filter(p => !placedIds.has(p.id)).length
                : (grouped[cat] || []).filter(p => !placedIds.has(p.id)).length
              return (
                <button key={cat} onClick={() => setRosterFilter(cat)} style={{
                  flex: 1, padding: '8px 4px', border: 'none',
                  background: active ? C.surfaceLight : 'transparent',
                  color: active ? C.text : C.textMuted,
                  fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  {label} ({count})
                </button>
              )
            })}
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', maxHeight: isMobile ? 300 : 460, padding: 8,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 6, alignContent: 'start',
          }}>
            {filteredPlayers.map(player => {
              const placed = placedIds.has(player.id)
              const cat = posToCategory(player.pos)
              const color = CAT_COLORS[cat] || C.blue
              return (
                <div key={player.id}
                  draggable={!placed}
                  onDragStart={() => onRosterDragStart(player)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 3, padding: '10px 6px', borderRadius: 8,
                    border: `1px solid ${placed ? C.border : `${color}33`}`,
                    background: placed ? C.surface : C.surfaceLight,
                    cursor: placed ? 'default' : 'grab', opacity: placed ? 0.3 : 1,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: `${color}18`, color, fontSize: 10, fontWeight: 700 }}>
                    {player.pos || '?'}
                  </span>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {player.name.split(' ').pop()}
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>
                    {player.age ? `Age ${player.age}` : ''}
                  </div>
                  {placed && <span style={{ fontSize: 8, color: C.green, fontWeight: 700 }}>PLACED</span>}
                </div>
              )
            })}
            {filteredPlayers.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: 30, textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                No players in this category
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{
        padding: '10px 20px', borderTop: `1px solid ${C.border}`, background: C.surface,
        fontSize: 12, color: filledCount > 0 ? C.text : C.textMuted, fontWeight: 600, textAlign: 'center',
      }}>
        {filledCount > 0 ? `${filledCount} player${filledCount !== 1 ? 's' : ''} placed` : 'Drag players into formation slots'}
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function SquadBuilderTool() {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE.roster)
    return saved && JSON.parse(saved).length > 0 ? 'roster' : 'roster'
  })
  const [roster, setRoster] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE.roster) || '[]') } catch { return [] }
  })

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
        <button onClick={() => setStep('roster')} style={{
          padding: '8px 18px', borderRadius: 10, border: 'none',
          background: step === 'roster' ? C.blue : C.surfaceLight,
          color: step === 'roster' ? '#fff' : C.textSecondary,
          fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          1. Roster
        </button>
        <span style={{ color: C.textMuted }}>&rarr;</span>
        <button onClick={() => roster.length > 0 && setStep('formation')} style={{
          padding: '8px 18px', borderRadius: 10, border: 'none',
          background: step === 'formation' ? C.green : C.surfaceLight,
          color: step === 'formation' ? '#fff' : roster.length > 0 ? C.textSecondary : C.textMuted,
          fontWeight: 600, fontSize: 13, cursor: roster.length > 0 ? 'pointer' : 'default',
          fontFamily: 'inherit', opacity: roster.length > 0 ? 1 : 0.5,
        }}>
          2. Formation
        </button>
        {roster.length > 0 && (
          <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 'auto' }}>
            {roster.length} players loaded
          </span>
        )}
      </div>

      {step === 'roster' && (
        <RosterStep roster={roster} setRoster={setRoster} onNext={() => setStep('formation')} />
      )}
      {step === 'formation' && (
        <FormationStep roster={roster} onBack={() => setStep('roster')} />
      )}
    </div>
  )
}
