import { useState, useEffect, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { FORMATIONS, POS_CATEGORY } from './formations'
import { extractText, SQUAD_EXTRACTION_PROMPT } from './scanner/ocr.js'
import { parseStatsLines } from './scanner/parser.js'
import { matchAll, bestPlayerMatch } from './scanner/matcher.js'

const SQUAD_KEY = 'fmc_scanner_squad'
const FORMATION_KEY = 'fmc_scanner_formation'
const RESULTS_KEY = 'fmc_scanner_results'
const TEAM_KEY = 'fmc_scanner_team'

/* ── League / team data ────────────────────────────────────────────────── */

const LEAGUE_META = {
  pl:"Premier League|ENG", elc:"Championship|ENG", lo:"League One|ENG", lt:"League Two|ENG",
  enl:"National League|ENG", enln:"National League North|ENG", enls:"National League South|ENG",
  bl1:"Bundesliga|GER", bl2:"2. Bundesliga|GER", bl3:"3. Liga|GER",
  sa:"Serie A|ITA", sb:"Serie B|ITA", sca:"Serie C A|ITA", scb:"Serie C B|ITA", scc:"Serie C C|ITA",
  pd:"La Liga|ESP", l2:"La Liga 2|ESP",
  fl1:"Ligue 1|FRA", fl2:"Ligue 2|FRA", fna:"National|FRA",
  ded:"Eredivisie|NED", ed:"Eerste Divisie|NED", td:"Tweede Divisie|NED",
  ppl:"Liga Portugal|POR", pp2:"Liga Portugal 2|POR", pp3:"Liga 3|POR",
  ssl:"Super Lig|TUR", tl1:"1. Lig|TUR",
  bpl:"Pro League|BEL", bcp:"Challenger Pro League|BEL", bd1:"Division 1|BEL",
  spl:"Premiership|SCO", sc2:"Championship|SCO", sl1:"League One|SCO", sl2:"League Two|SCO",
  mls:"Major League Soccer|USA", lmx:"Liga MX|MEX", arg:"Primera Division|ARG", ar2:"Primera Nacional|ARG",
  bsa:"Serie A|BRA", bsb:"Serie B|BRA", bsc:"Serie C|BRA",
  jl:"J1 League|JPN", j2:"J2 League|JPN", j3:"J3 League|JPN",
  kl:"K League 1|KOR", k2:"K League 2|KOR", k3:"K3 League|KOR",
  csl:"Super League|CHN",
  ukr:"Premier League|UKR", rpl:"Premier League|RUS", rfn:"FNL|RUS",
  irl:"Premier Division|IRL", ir1:"First Division|IRL",
  wal:"Cymru Premier|WAL", nir:"Premiership|NIR", ni2:"Championship|NIR",
  rsa:"Premier League|RSA", rs2:"1st Division|RSA",
  egy:"Premier League|EGY", alg:"Ligue 1|ALG", sen:"Ligue 1|SEN",
  abl:"Bundesliga|AUT", al2:"2. Liga|AUT",
  sl:"Super League|SUI",
  chl:"Primera Division|CHI", col:"Primera A|COL", ecu:"Serie A|ECU",
  par:"Division Profesional|PAR", per:"Liga 1|PER", uru:"Primera Division|URU",
  ven:"Primera Division|VEN", can:"Premier League|CAN",
  hnl:"Prva HNL|CRO", h2l:"Druga HNL|CRO",
  ekl:"Superliga|DEN", df1:"1. Division|DEN",
  srl:"Superliga|SRB", sr1:"Prva Liga|SRB",
  rsl:"SuperLiga|ROM", rl2:"Liga 2|ROM",
  bg1:"First League|BUL", bg2:"Second League|BUL",
  pl1:"Ekstraklasa|POL", pl2:"I Liga|POL",
  gs2:"Super League|GRE", cy1:"First Division|CYP",
  nb1:"Eliteserien|NOR", nb2:"OBOS-ligaen|NOR",
  swe:"Allsvenskan|SWE", sw2:"Superettan|SWE",
  fin:"Veikkausliiga|FIN",
  isr:"Premier League|ISR",
  bih:"Premier League|BIH",
  mlt:"Premier League|MLT",
  lux:"National Division|LUX", gib:"National League|GIB",
  isl:"Urvalsdeild|ISL",
  est:"Meistriliiga|EST", ltu:"A Lyga|LTU", lva:"Virsliga|LAT",
  mda:"Super Liga|MDA",
  mkd:"First League|MKD",
  geo:"Erovnuli Liga|GEO", svk:"Super Liga|SVK", svn:"PrvaLiga|SLO",
  aal:"A-League|AUS", arc:"Primera B|ARG",
}

const COUNTRY_FLAGS = {
  ENG:"\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", SCO:"\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", WAL:"\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", NIR:"\uD83C\uDDEC\uD83C\uDDE7",
  GER:"\uD83C\uDDE9\uD83C\uDDEA", ITA:"\uD83C\uDDEE\uD83C\uDDF9", ESP:"\uD83C\uDDEA\uD83C\uDDF8", FRA:"\uD83C\uDDEB\uD83C\uDDF7", NED:"\uD83C\uDDF3\uD83C\uDDF1", POR:"\uD83C\uDDF5\uD83C\uDDF9", TUR:"\uD83C\uDDF9\uD83C\uDDF7",
  BEL:"\uD83C\uDDE7\uD83C\uDDEA", AUT:"\uD83C\uDDE6\uD83C\uDDF9", SUI:"\uD83C\uDDE8\uD83C\uDDED", GRE:"\uD83C\uDDEC\uD83C\uDDF7", CYP:"\uD83C\uDDE8\uD83C\uDDFE", UKR:"\uD83C\uDDFA\uD83C\uDDE6", RUS:"\uD83C\uDDF7\uD83C\uDDFA",
  POL:"\uD83C\uDDF5\uD83C\uDDF1", ROM:"\uD83C\uDDF7\uD83C\uDDF4", BUL:"\uD83C\uDDE7\uD83C\uDDEC", SRB:"\uD83C\uDDF7\uD83C\uDDF8", CRO:"\uD83C\uDDED\uD83C\uDDF7", BIH:"\uD83C\uDDE7\uD83C\uDDE6", MNE:"\uD83C\uDDF2\uD83C\uDDEA",
  MKD:"\uD83C\uDDF2\uD83C\uDDF0", SLO:"\uD83C\uDDF8\uD83C\uDDEE", SVK:"\uD83C\uDDF8\uD83C\uDDF0", GEO:"\uD83C\uDDEC\uD83C\uDDEA", MDA:"\uD83C\uDDF2\uD83C\uDDE9",
  NOR:"\uD83C\uDDF3\uD83C\uDDF4", SWE:"\uD83C\uDDF8\uD83C\uDDEA", DEN:"\uD83C\uDDE9\uD83C\uDDF0", FIN:"\uD83C\uDDEB\uD83C\uDDEE", ISL:"\uD83C\uDDEE\uD83C\uDDF8", FRO:"\uD83C\uDDEB\uD83C\uDDF4",
  EST:"\uD83C\uDDEA\uD83C\uDDEA", LTU:"\uD83C\uDDF1\uD83C\uDDF9", LAT:"\uD83C\uDDF1\uD83C\uDDFB", LUX:"\uD83C\uDDF1\uD83C\uDDFA", GIB:"\uD83C\uDDEC\uD83C\uDDEE", MLT:"\uD83C\uDDF2\uD83C\uDDF9",
  IRL:"\uD83C\uDDEE\uD83C\uDDEA", ISR:"\uD83C\uDDEE\uD83C\uDDF1",
  USA:"\uD83C\uDDFA\uD83C\uDDF8", MEX:"\uD83C\uDDF2\uD83C\uDDFD", CAN:"\uD83C\uDDE8\uD83C\uDDE6",
  BRA:"\uD83C\uDDE7\uD83C\uDDF7", ARG:"\uD83C\uDDE6\uD83C\uDDF7", CHI:"\uD83C\uDDE8\uD83C\uDDF1", COL:"\uD83C\uDDE8\uD83C\uDDF4", ECU:"\uD83C\uDDEA\uD83C\uDDE8", PAR:"\uD83C\uDDF5\uD83C\uDDFE", PER:"\uD83C\uDDF5\uD83C\uDDEA", URU:"\uD83C\uDDFA\uD83C\uDDFE", VEN:"\uD83C\uDDFB\uD83C\uDDEA",
  JPN:"\uD83C\uDDEF\uD83C\uDDF5", KOR:"\uD83C\uDDF0\uD83C\uDDF7", CHN:"\uD83C\uDDE8\uD83C\uDDF3", AUS:"\uD83C\uDDE6\uD83C\uDDFA",
  RSA:"\uD83C\uDDFF\uD83C\uDDE6", EGY:"\uD83C\uDDEA\uD83C\uDDEC", ALG:"\uD83C\uDDE9\uD83C\uDDFF", SEN:"\uD83C\uDDF8\uD83C\uDDF3",
}

function getLeagueInfo(code) {
  const meta = LEAGUE_META[code]
  if (!meta) return null
  const [name, country] = meta.split('|')
  return { code, name, country, flag: COUNTRY_FLAGS[country] || '' }
}

// Group leagues by country for the picker
const LEAGUE_LIST = Object.keys(LEAGUE_META).map(getLeagueInfo).filter(Boolean)
const LEAGUES_BY_COUNTRY = {}
for (const l of LEAGUE_LIST) {
  if (!LEAGUES_BY_COUNTRY[l.country]) LEAGUES_BY_COUNTRY[l.country] = []
  LEAGUES_BY_COUNTRY[l.country].push(l)
}

// Dynamic import helpers for club/squad data
const clubModules = import.meta.glob('../data/fm/*-clubs.json')
const squadModules = import.meta.glob('../data/fm/*-squads.json')

async function loadClubs(leagueCode) {
  const key = `../data/fm/${leagueCode}-clubs.json`
  if (!clubModules[key]) return []
  const mod = await clubModules[key]()
  return mod.default || mod
}

async function loadSquad(leagueCode) {
  const key = `../data/fm/${leagueCode}-squads.json`
  if (!squadModules[key]) return {}
  const mod = await squadModules[key]()
  return mod.default || mod
}

const CAT_COLORS = {
  goalkeeper: C.orange, back: C.green, midfield: C.blue, forward: C.purple,
}

/* ── Team Selection Phase ──────────────────────────────────────────────── */

function TeamSelector({ onSelect, savedTeam }) {
  const [search, setSearch] = useState('')
  const [selectedLeague, setSelectedLeague] = useState(savedTeam?.leagueCode || null)
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(false)

  // Load clubs when league is selected
  useEffect(() => {
    if (!selectedLeague) { setClubs([]); return }
    setLoading(true)
    loadClubs(selectedLeague).then(c => { setClubs(c); setLoading(false) }).catch(() => setLoading(false))
  }, [selectedLeague])

  const filteredLeagues = search.trim()
    ? LEAGUE_LIST.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.country.toLowerCase().includes(search.toLowerCase())
      )
    : LEAGUE_LIST

  // Group filtered leagues by country
  const grouped = {}
  for (const l of filteredLeagues) {
    if (!grouped[l.country]) grouped[l.country] = []
    grouped[l.country].push(l)
  }
  // Sort countries: major ones first
  const majorOrder = ['ENG', 'ESP', 'GER', 'ITA', 'FRA', 'NED', 'POR', 'BEL', 'SCO', 'TUR']
  const sortedCountries = Object.keys(grouped).sort((a, b) => {
    const ai = majorOrder.indexOf(a), bi = majorOrder.indexOf(b)
    if (ai >= 0 && bi >= 0) return ai - bi
    if (ai >= 0) return -1
    if (bi >= 0) return 1
    return a.localeCompare(b)
  })

  const handleClubSelect = async (club) => {
    setLoading(true)
    try {
      const squads = await loadSquad(selectedLeague)
      const players = squads[club.id] || []
      const leagueInfo = getLeagueInfo(selectedLeague)
      const teamData = {
        leagueCode: selectedLeague,
        leagueName: leagueInfo.name,
        clubId: club.id,
        clubName: club.name,
        clubShort: club.shortName || club.tla || club.name,
        players,
      }
      localStorage.setItem(TEAM_KEY, JSON.stringify({ leagueCode: selectedLeague, clubId: club.id, clubName: club.name }))
      onSelect(teamData)
    } catch (err) {
      console.error('Failed to load squad:', err)
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: C.bg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${C.border}`,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', background: C.surface,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Step 1: Select Your Team</div>
        <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
          Choose a league and club — your squad will be loaded automatically from the FM26 database
        </div>
      </div>

      {!selectedLeague ? (
        <>
          {/* League search */}
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
            <input
              type="text"
              placeholder="Search leagues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: C.surfaceLight, color: C.text,
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '10px 14px', fontSize: 13, fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = C.blue}
              onBlur={e => e.currentTarget.style.borderColor = C.border}
            />
          </div>

          {/* League list grouped by country */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {sortedCountries.map(country => (
              <div key={country}>
                <div style={{
                  padding: '6px 20px', background: C.surface,
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 11, fontWeight: 700, color: C.textMuted,
                  textTransform: 'uppercase', letterSpacing: 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>{COUNTRY_FLAGS[country] || ''}</span>
                  <span>{country}</span>
                </div>
                {grouped[country].map(league => (
                  <div
                    key={league.code}
                    onClick={() => setSelectedLeague(league.code)}
                    style={{
                      padding: '10px 20px', cursor: 'pointer',
                      borderBottom: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{league.name}</span>
                    <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 'auto' }}>{league.code}</span>
                  </div>
                ))}
              </div>
            ))}
            {sortedCountries.length === 0 && (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
                No leagues match your search
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Back to leagues + league name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
            borderBottom: `1px solid ${C.border}`, background: C.surface,
          }}>
            <button
              onClick={() => { setSelectedLeague(null); setClubs([]); setSearch('') }}
              style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textSecondary, padding: '4px 10px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              &larr; Leagues
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
              {getLeagueInfo(selectedLeague)?.flag} {getLeagueInfo(selectedLeague)?.name}
            </span>
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 'auto' }}>
              {clubs.length} clubs
            </span>
          </div>

          {/* Club list */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
                Loading clubs...
              </div>
            ) : (
              clubs.map(club => (
                <div
                  key={club.id}
                  onClick={() => handleClubSelect(club)}
                  style={{
                    padding: '12px 20px', cursor: 'pointer',
                    borderBottom: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: club.kitHome || C.blue,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#fff',
                    flexShrink: 0,
                  }}>
                    {(club.tla || club.shortName || club.name.slice(0, 3)).toUpperCase().slice(0, 3)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{club.name}</div>
                    {club.stadium && (
                      <div style={{ fontSize: 11, color: C.textMuted }}>{club.stadium}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ── CSV / clipboard export ─────────────────────────────────────────────── */

function generateCSV(results) {
  const headers = ['Player', 'Position', 'Apps', 'Goals', 'xG', 'Assists', 'Avg Rating', 'Clean Sheets']
  const rows = results.map(r => [
    r.playerName, r.pos, r.apps, r.goals, r.xg, r.assists, r.avgRating, r.cleanSheets,
  ])
  return [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
}

function downloadCSV(results, username) {
  const csv = generateCSV(results)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fm-stats-${username.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function copyToClipboard(results) {
  const headers = 'Player\tPos\tApps\tGoals\txG\tAssists\tAvg Rating\tCS'
  const rows = results.map(r =>
    `${r.playerName}\t${r.pos}\t${r.apps}\t${r.goals}\t${r.xg}\t${r.assists}\t${r.avgRating}\t${r.cleanSheets}`
  )
  return navigator.clipboard.writeText([headers, ...rows].join('\n'))
}

/* ── Star rating from fmCA ─────────────────────────────────────────────── */

function caToStars(ca) {
  if (!ca) return 0
  // 0-79 = 0.5, 80-99 = 1, 100-119 = 1.5, 120-134 = 2, 135-144 = 2.5,
  // 145-154 = 3, 155-164 = 3.5, 165-174 = 4, 175-184 = 4.5, 185+ = 5
  if (ca >= 185) return 5
  if (ca >= 175) return 4.5
  if (ca >= 165) return 4
  if (ca >= 155) return 3.5
  if (ca >= 145) return 3
  if (ca >= 135) return 2.5
  if (ca >= 120) return 2
  if (ca >= 100) return 1.5
  if (ca >= 80) return 1
  return 0.5
}

function StarRating({ stars, size = 12 }) {
  if (!stars) return null
  const full = Math.floor(stars)
  const half = stars % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span style={{ display: 'inline-flex', gap: 1, lineHeight: 1 }}>
      {Array.from({ length: full }, (_, i) => (
        <span key={`f${i}`} style={{ color: '#f5a623', fontSize: size }}>&#9733;</span>
      ))}
      {half && <span style={{ color: '#f5a623', fontSize: size, opacity: 0.55 }}>&#9733;</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e${i}`} style={{ color: '#333', fontSize: size }}>&#9733;</span>
      ))}
    </span>
  )
}

/* ── Drag-and-Drop Squad Builder ───────────────────────────────────────── */

function SquadBuilder({ squad, setSquad, formation, setFormation, players, onReady }) {
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

  // Track which player IDs are placed in slots
  const placedIds = new Set(Object.values(squad).filter(Boolean).map(p => p.id))

  // Group players by position category
  const grouped = { goalkeeper: [], back: [], midfield: [], forward: [] }
  for (const p of players) {
    const cat = posToCategory(p.pos)
    if (cat && grouped[cat]) grouped[cat].push(p)
    else grouped.midfield.push(p)
  }

  const catLabels = { goalkeeper: 'GK', back: 'DEF', midfield: 'MID', forward: 'FWD' }
  const catLabelsFull = { goalkeeper: 'Goalkeepers', back: 'Defenders', midfield: 'Midfielders', forward: 'Forwards' }

  const filteredPlayers = rosterFilter === 'all'
    ? players
    : players.filter(p => posToCategory(p.pos) === rosterFilter)

  const handleFormationChange = (e) => {
    const newFm = e.target.value
    const newFormation = FORMATIONS[newFm]
    if (!newFormation) return

    const newSlots = newFormation.lines.flatMap(line => line.map(([id]) => id))
    const newSquad = {}
    const placed = new Set()

    // Pass 1: exact slot ID match (rb→rb, gk→gk, cb1→cb1, etc.)
    for (const slotId of newSlots) {
      if (squad[slotId]) {
        newSquad[slotId] = squad[slotId]
        placed.add(slotId)
      }
    }

    // Pass 2: match by player's actual position to slot name
    // e.g., a player with pos "RB" should go to slot "rb" if available
    const posSlotMap = { GK: 'gk', LB: 'lb', RB: 'rb', LWB: 'lwb', RWB: 'rwb',
      LW: 'lw', RW: 'rw', LM: 'lm', RM: 'rm', ST: 'st' }
    for (const [oldSlotId, player] of Object.entries(squad)) {
      if (!player || placed.has(oldSlotId)) continue
      const targetSlot = posSlotMap[player.pos?.toUpperCase()]
      if (targetSlot && newSlots.includes(targetSlot) && !newSquad[targetSlot]) {
        newSquad[targetSlot] = player
        placed.add(oldSlotId)
      }
    }

    // Pass 3: remaining unplaced players matched by category
    const remaining = Object.entries(squad)
      .filter(([slotId, p]) => p && !placed.has(slotId))
      .map(([slotId, p]) => ({ slotId, player: p, cat: POS_CATEGORY[slotId] || posToCategory(p.pos) || 'midfield' }))

    const byCategory = {}
    for (const r of remaining) {
      if (!byCategory[r.cat]) byCategory[r.cat] = []
      byCategory[r.cat].push(r.player)
    }

    for (const slotId of newSlots) {
      if (newSquad[slotId]) continue
      const cat = POS_CATEGORY[slotId]
      if (byCategory[cat]?.length > 0) {
        newSquad[slotId] = byCategory[cat].shift()
      }
    }

    setFormation(newFm)
    setSquad(newSquad)
    localStorage.setItem(FORMATION_KEY, newFm)
    localStorage.setItem(SQUAD_KEY, JSON.stringify(newSquad))
  }

  // Drag from roster
  const onRosterDragStart = (player) => setDragPlayer(player)

  // Drag from a filled slot (to move or remove)
  const onSlotDragStart = (slotId) => {
    const player = squad[slotId]
    if (!player) return
    setDragPlayer(player)
    // Remove from slot immediately
    const next = { ...squad }
    delete next[slotId]
    setSquad(next)
    localStorage.setItem(SQUAD_KEY, JSON.stringify(next))
  }

  const onSlotDrop = (slotId) => {
    if (!dragPlayer) return
    const next = { ...squad, [slotId]: dragPlayer }
    setSquad(next)
    localStorage.setItem(SQUAD_KEY, JSON.stringify(next))
    setDragPlayer(null)
    setHoverSlot(null)
  }

  const onSlotDragOver = (e, slotId) => {
    e.preventDefault()
    setHoverSlot(slotId)
  }

  const onSlotDragLeave = () => setHoverSlot(null)

  const onDragEnd = () => {
    setDragPlayer(null)
    setHoverSlot(null)
  }

  // Click to remove from slot
  const removeFromSlot = (slotId) => {
    const next = { ...squad }
    delete next[slotId]
    setSquad(next)
    localStorage.setItem(SQUAD_KEY, JSON.stringify(next))
  }

  const selectStyle = {
    background: C.surfaceLight, color: C.text,
    border: `1px solid ${C.border}`, borderRadius: 8,
    padding: '6px 30px 6px 12px', fontFamily: 'inherit',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238892A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
    minWidth: 110,
  }

  return (
    <div style={{
      background: C.bg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${C.border}`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Build Your Squad</div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
            Drag players from the roster into formation slots
          </div>
        </div>
        <select value={formation} onChange={handleFormationChange} style={selectStyle}>
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
            height: '100%', borderRadius: 2,
            width: `${allPositions.length > 0 ? (filledCount / allPositions.length) * 100 : 0}%`,
            background: C.gradientBlue, transition: 'width 0.3s',
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary }}>
          {filledCount}/{allPositions.length} placed
        </span>
      </div>

      {/* Main content: formation grid + roster panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        minHeight: 400,
      }}>
        {/* Formation grid with pitch background */}
        <div style={{
          position: 'relative',
          padding: isMobile ? 16 : 24,
          display: 'flex', flexDirection: 'column-reverse', gap: isMobile ? 10 : 14,
          background: `linear-gradient(180deg, #0d2818 0%, #0a1f14 50%, #071a0f 100%)`,
          borderRight: isMobile ? 'none' : `1px solid ${C.border}`,
          borderBottom: isMobile ? `1px solid ${C.border}` : 'none',
          overflow: 'hidden',
        }}>
          {/* Pitch markings SVG overlay */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            viewBox="0 0 500 700" preserveAspectRatio="none">
            {/* Outer boundary */}
            <rect x={10} y={10} width={480} height={680} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={2}/>
            {/* Halfway line */}
            <line x1={10} y1={350} x2={490} y2={350} stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            {/* Centre circle */}
            <circle cx={250} cy={350} r={70} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5}/>
            <circle cx={250} cy={350} r={3} fill="rgba(255,255,255,0.15)"/>
            {/* Top penalty area */}
            <rect x={110} y={10} width={280} height={120} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            <rect x={175} y={10} width={150} height={45} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
            <path d="M 180 130 A 70 70 0 0 0 320 130" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}/>
            {/* Bottom penalty area */}
            <rect x={110} y={570} width={280} height={120} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>
            <rect x={175} y={645} width={150} height={45} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
            <path d="M 180 570 A 70 70 0 0 1 320 570" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}/>
            {/* Grass stripe effect */}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={i} x={10} y={10 + i * 97.1} width={480} height={48.6} fill="rgba(255,255,255,0.012)"/>
            ))}
          </svg>

          {fm.lines.map((line, li) => {
            const positions = line.map(([id, title]) => ({ id, title }))
            return (
              <div key={li} style={{
                display: 'flex', justifyContent: 'center', gap: isMobile ? 8 : 12,
                position: 'relative', zIndex: 1,
              }}>
                {positions.map(pos => {
                  const cat = POS_CATEGORY[pos.id] || 'midfield'
                  const color = CAT_COLORS[cat] || C.blue
                  const player = squad[pos.id]
                  const isHover = hoverSlot === pos.id
                  const abbr = pos.title.length > 8 ? pos.title.split(' ').map(w => w[0]).join('') : pos.title

                  return (
                    <div
                      key={pos.id}
                      onDragOver={e => onSlotDragOver(e, pos.id)}
                      onDragLeave={onSlotDragLeave}
                      onDrop={() => onSlotDrop(pos.id)}
                      draggable={!!player}
                      onDragStart={() => onSlotDragStart(pos.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => player && removeFromSlot(pos.id)}
                      title={player ? `${player.name} — click to remove` : `Drop player here (${pos.title})`}
                      style={{
                        width: isMobile ? 78 : 100, minHeight: isMobile ? 68 : 80,
                        borderRadius: 10,
                        border: `2px ${player ? 'solid' : 'dashed'} ${isHover ? color : player ? color + '88' : 'rgba(255,255,255,0.12)'}`,
                        background: player
                          ? `${color}18`
                          : isHover ? `${color}12` : 'rgba(10,20,15,0.65)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 3, padding: '8px 6px',
                        cursor: player ? 'grab' : 'default',
                        transition: 'all 0.15s',
                        boxShadow: isHover ? `0 0 16px ${color}44` : '0 2px 8px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {player ? (
                        <>
                          <div style={{
                            fontSize: isMobile ? 11 : 12, fontWeight: 700, color: C.text,
                            textAlign: 'center', lineHeight: 1.2,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: '100%', whiteSpace: 'nowrap',
                          }}>
                            {player.name.split(' ').pop()}
                          </div>
                          <div style={{
                            fontSize: 9, fontWeight: 600, color,
                            background: `${color}22`, borderRadius: 3,
                            padding: '1px 5px',
                          }}>
                            {player.pos || abbr}
                          </div>
                          {player.fmCA && <StarRating stars={caToStars(player.fmCA)} size={isMobile ? 8 : 9} />}
                        </>
                      ) : (
                        <>
                          <div style={{
                            fontSize: isMobile ? 11 : 12, fontWeight: 700,
                            color: isHover ? color : 'rgba(255,255,255,0.35)',
                          }}>
                            {abbr}
                          </div>
                          <div style={{ fontSize: 18, opacity: isHover ? 0.8 : 0.25, color: 'rgba(255,255,255,0.5)' }}>+</div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Roster panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Roster filter tabs */}
          <div style={{
            display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`,
            background: C.surface,
          }}>
            {['all', 'goalkeeper', 'back', 'midfield', 'forward'].map(cat => {
              const label = cat === 'all' ? 'All' : catLabels[cat]
              const active = rosterFilter === cat
              const count = cat === 'all'
                ? players.filter(p => !placedIds.has(p.id)).length
                : (grouped[cat] || []).filter(p => !placedIds.has(p.id)).length
              return (
                <button key={cat} onClick={() => setRosterFilter(cat)}
                  style={{
                    flex: 1, padding: '8px 4px', border: 'none',
                    background: active ? C.surfaceLight : 'transparent',
                    color: active ? C.text : C.textMuted,
                    fontSize: 10, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent',
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                  {label} ({count})
                </button>
              )
            })}
          </div>

          {/* Player grid */}
          <div style={{
            flex: 1, overflowY: 'auto', maxHeight: isMobile ? 300 : 460,
            padding: 8,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(130px, 1fr))' : 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 6, alignContent: 'start',
          }}>
            {filteredPlayers.map(player => {
              const placed = placedIds.has(player.id)
              const cat = posToCategory(player.pos)
              const color = CAT_COLORS[cat] || C.blue
              return (
                <div
                  key={player.id}
                  draggable={!placed}
                  onDragStart={() => onRosterDragStart(player)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 3, padding: '10px 6px',
                    borderRadius: 8,
                    border: `1px solid ${placed ? C.border : `${color}33`}`,
                    background: placed ? C.surface : C.surfaceLight,
                    cursor: placed ? 'default' : 'grab',
                    opacity: placed ? 0.3 : 1,
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => { if (!placed) { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10` } }}
                  onMouseLeave={e => { if (!placed) { e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.background = C.surfaceLight } }}
                >
                  <span style={{
                    padding: '2px 8px', borderRadius: 4,
                    background: `${color}18`, color, fontSize: 10, fontWeight: 700,
                  }}>
                    {player.pos || '?'}
                  </span>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: C.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}>
                    {player.name.split(' ').pop()}
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>
                    {player.name.split(' ').slice(0, -1).join(' ').slice(0, 12) || ''}
                    {player.age ? `, ${player.age}` : ''}
                  </div>
                  {player.fmCA && <StarRating stars={caToStars(player.fmCA)} size={9} />}
                  {placed && (
                    <span style={{ fontSize: 8, color: C.green, fontWeight: 700 }}>PLACED</span>
                  )}
                </div>
              )
            })}
            {filteredPlayers.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '30px 16px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                No players in this category
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '10px 20px', borderTop: `1px solid ${C.border}`, background: C.surface,
        fontSize: 12, color: filledCount > 0 ? C.text : C.textMuted, fontWeight: 600, textAlign: 'center',
      }}>
        {filledCount > 0
          ? `${filledCount} player${filledCount !== 1 ? 's' : ''} placed — upload a screenshot below to scan stats`
          : 'Drag players into formation slots to get started'}
      </div>
    </div>
  )
}

/* ── Scanner Phase ──────────────────────────────────────────────────────── */

function ScannerPhase({ roster, user, onBack }) {
  const [image, setImage] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [ocrText, setOcrText] = useState('')
  const [parsed, setParsed] = useState([])
  const [selected, setSelected] = useState({})
  const [toast, setToast] = useState(null)
  const [allResults, setAllResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RESULTS_KEY)) || [] } catch { return [] }
  })
  const fileRef = useRef()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      setOcrText(''); setParsed([]); setSelected({})
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        handleFile(item.getAsFile())
        return
      }
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }, [])

  const runScan = async () => {
    if (!image) return
    setScanning(true); setProgress(0)
    try {
      const ocrResult = await extractText(image, {
        onProgress: setProgress,
        prompt: SQUAD_EXTRACTION_PROMPT,
      })
      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      setOcrText(text)

      // Try Vision AI structured data first
      const visionData = ocrResult.visionData
      if (visionData && visionData.players && visionData.players.length > 0) {
        // Convert Vision AI squad data to the existing row format
        const rows = visionData.players.map(p => ({
          nameText: p.playerName || '',
          pos: p.position || '',
          apps: 0,
          goals: 0,
          xg: 0,
          assists: 0,
          avgRating: 0,
          cleanSheets: 0,
          raw: '',
          // Extra squad data from Vision AI
          age: p.age,
          nationality: p.nationality,
          transferValue: p.transferValue,
          wage: p.wage,
          playingTime: p.playingTime,
          contractExpiry: p.contractExpiry,
          status: p.status,
          ability: p.ability,
          potential: p.potential,
        }))
        const matched = roster.length > 0 ? matchAll(rows, roster) : rows.map(r => ({ ...r, match: null, matched: false }))
        setParsed(matched)
        const sel = {}
        matched.forEach((r, i) => { if (r.matched) sel[i] = true })
        setSelected(sel)
        if (visionData.clubName) {
          setToast(`Found ${rows.length} players from ${visionData.clubName}`)
        }
      } else {
        // Fallback to text parsing
        const rows = parseStatsLines(text)
        const matched = roster.length > 0 ? matchAll(rows, roster) : rows.map(r => ({ ...r, match: null, matched: false }))
        setParsed(matched)
        const sel = {}
        matched.forEach((r, i) => { if (r.matched) sel[i] = true })
        setSelected(sel)
      }
    } catch (err) {
      console.error('OCR error:', err)
      setToast('OCR failed — try a clearer screenshot')
    }
    setScanning(false)
  }

  const updateRow = (i, field, value) => {
    setParsed(prev => { const next = [...prev]; next[i] = { ...next[i], [field]: value }; return next })
  }

  const changePlayerMatch = (i, playerId) => {
    const player = roster.find(p => p.id === playerId)
    if (!player) return
    setParsed(prev => {
      const next = [...prev]
      next[i] = { ...next[i], match: { player, score: 1.0 }, matched: true, pos: next[i].pos || player.pos || '' }
      return next
    })
  }

  const toggle = (i) => setSelected(s => ({ ...s, [i]: !s[i] }))
  const selectedCount = parsed.filter((_, i) => selected[i]).filter(r => r.matched).length

  const handleAddResults = () => {
    const newResults = parsed
      .filter((_, i) => selected[i])
      .filter(r => r.matched)
      .map(r => ({
        playerId: r.match.player.id,
        playerName: r.match.player.name,
        pos: r.pos || r.match.player.pos || '',
        apps: r.apps, goals: r.goals, xg: r.xg || 0,
        assists: r.assists, avgRating: r.avgRating, cleanSheets: r.cleanSheets,
      }))

    // Merge: overwrite existing entries for same player
    const merged = [...allResults]
    for (const nr of newResults) {
      const idx = merged.findIndex(r => r.playerId === nr.playerId)
      if (idx >= 0) merged[idx] = nr
      else merged.push(nr)
    }
    setAllResults(merged)
    localStorage.setItem(RESULTS_KEY, JSON.stringify(merged))
    setToast(`Added ${newResults.length} player${newResults.length !== 1 ? 's' : ''}`)
    setImage(null); setOcrText(''); setParsed([]); setSelected({})
  }

  const handleClearResults = () => {
    setAllResults([])
    localStorage.removeItem(RESULTS_KEY)
    setToast('Results cleared')
  }

  const reset = () => { setImage(null); setOcrText(''); setParsed([]); setSelected({}); setProgress(0) }

  const inputStyle = (width) => ({
    width, padding: '4px 2px', borderRadius: 4, textAlign: 'center',
    background: C.bgLight, color: C.text, border: `1px solid ${C.border}`,
    fontFamily: 'inherit', fontSize: 12, outline: 'none',
  })

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 20, zIndex: 9999,
          background: C.green, color: '#080808', padding: '8px 18px',
          borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: C.shadow,
        }}>{toast}</div>
      )}

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.textSecondary, padding: '8px 14px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            &larr; Edit Squad
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ color: C.textMuted, fontSize: 12 }}>{roster.length} players in roster</span>
      </div>

      {/* Accumulated results panel */}
      {allResults.length > 0 && (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
          marginBottom: 16, overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1 }}>
              Collected Stats ({allResults.length} player{allResults.length !== 1 ? 's' : ''})
            </div>
            <button onClick={() => { downloadCSV(allResults, user) }}
              style={{
                background: C.gradientBlue, border: 'none', borderRadius: 6,
                color: '#fff', padding: '6px 14px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Download CSV
            </button>
            <button onClick={() => { copyToClipboard(allResults); setToast('Copied to clipboard!') }}
              style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textSecondary, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Copy
            </button>
            <button onClick={handleClearResults}
              style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textMuted, padding: '6px 10px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Clear
            </button>
          </div>

          {/* Mini table of collected results */}
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Player', 'Pos', 'Apps', 'Gls', 'xG', 'Ast', 'AvR', 'CS'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textMuted, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allResults.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '6px 8px', color: C.text, fontWeight: 600 }}>{r.playerName}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.pos}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.apps}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.goals}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.xg}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.assists}</td>
                    <td style={{ padding: '6px 8px', color: C.orange, fontWeight: 600 }}>{r.avgRating}</td>
                    <td style={{ padding: '6px 8px', color: C.textSecondary }}>{r.cleanSheets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scanner card */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: 20,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>
          {allResults.length > 0 ? 'Scan Another Screenshot' : 'Step 2: Upload Stats Screenshot'}
        </div>
        <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 16 }}>
          Drop, paste, or click to upload your FM squad stats screen
        </div>

        {/* Drop zone */}
        {!image && (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onPaste={handlePaste}
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${C.border}`, borderRadius: 10,
              padding: '50px 30px', textAlign: 'center', cursor: 'pointer',
              background: C.surfaceLight, transition: 'border-color 0.2s',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Drop, paste, or click to upload
            </div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>
              Works with FM squad stats screens showing player names + numbers
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {/* Image preview */}
        {image && !ocrText && (
          <div>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 12 }}>
              <img src={image} alt="Screenshot" style={{ width: '100%', maxHeight: 400, objectFit: 'contain', display: 'block', background: '#000' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={runScan} disabled={scanning}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  background: scanning ? C.surfaceLight : C.gradientBlue,
                  color: scanning ? C.textMuted : '#fff', fontSize: 13, fontWeight: 700,
                  cursor: scanning ? 'default' : 'pointer', fontFamily: 'inherit',
                }}>
                {scanning ? `Scanning... ${progress}%` : 'Scan Stats'}
              </button>
              <button onClick={reset} style={{
                padding: '10px 20px', borderRadius: 8,
                background: 'none', border: `1px solid ${C.border}`,
                color: C.textSecondary, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Clear</button>
            </div>
            {scanning && (
              <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: C.surfaceLight, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: C.gradientBlue, borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
            )}
          </div>
        )}

        {/* Parsed results */}
        {parsed.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                Found {parsed.length} player{parsed.length !== 1 ? 's' : ''} — {selectedCount} selected
              </div>
              <button onClick={reset} style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textMuted, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Reset</button>
            </div>

            {/* Headers */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              borderBottom: `1px solid ${C.border}`, marginBottom: 4,
              fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              <span style={{ width: 28 }} />
              <span style={{ flex: 1, minWidth: 80 }}>Player</span>
              <span style={{ width: 36, textAlign: 'center' }}>Pos</span>
              <span style={{ width: 40, textAlign: 'center' }}>Apps</span>
              <span style={{ width: 36, textAlign: 'center' }}>Gls</span>
              <span style={{ width: 42, textAlign: 'center' }}>xG</span>
              <span style={{ width: 36, textAlign: 'center' }}>Ast</span>
              <span style={{ width: 44, textAlign: 'center' }}>AvR</span>
              <span style={{ width: 36, textAlign: 'center' }}>CS</span>
              <span style={{ width: 40, textAlign: 'right' }} />
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {parsed.map((r, i) => {
                const isSelected = !!selected[i]
                const canSelect = r.matched
                return (
                  <div key={i} onClick={() => canSelect && toggle(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 8, cursor: canSelect ? 'pointer' : 'default',
                      background: isSelected ? `${C.blue}15` : C.surfaceLight,
                      border: `1px solid ${isSelected ? C.blue + '55' : !canSelect ? '#e0505044' : C.border}`,
                      opacity: canSelect ? 1 : 0.6, transition: 'all 0.15s',
                    }}>
                    {/* Checkbox */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${isSelected ? C.blue : C.border}`,
                      background: isSelected ? C.blue : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12, fontWeight: 900,
                    }}>{isSelected && '✓'}</div>

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {r.matched ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.match.player.name}</span>
                          {r.nameText !== r.match.player.name && (
                            <span style={{ color: C.textMuted, fontSize: 10, fontStyle: 'italic' }}>({r.nameText})</span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span style={{ color: '#e05050', fontSize: 13, fontWeight: 600 }}>{r.nameText}</span>
                          {roster.length > 0 && (
                            <select onClick={e => e.stopPropagation()}
                              onChange={e => { e.stopPropagation(); changePlayerMatch(i, e.target.value) }}
                              value="" style={{
                                marginLeft: 8, padding: '2px 4px', borderRadius: 4,
                                background: C.bgLight, color: C.text, border: `1px solid ${C.border}`,
                                fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                              }}>
                              <option value="">Assign...</option>
                              {roster.map(p => <option key={p.id} value={p.id}>{p.name}{p.pos ? ` (${p.pos})` : ''}</option>)}
                            </select>
                          )}
                        </div>
                      )}
                    </div>

                    <span style={{ width: 36, textAlign: 'center', fontSize: 10, fontWeight: 700, color: C.textSecondary }}>{r.pos || '—'}</span>
                    <input type="number" min="0" value={r.apps} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'apps', parseInt(e.target.value) || 0) }} style={inputStyle(40)} />
                    <input type="number" min="0" value={r.goals} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'goals', parseInt(e.target.value) || 0) }} style={inputStyle(36)} />
                    <input type="number" step="0.01" min="0" value={r.xg} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'xg', parseFloat(e.target.value) || 0) }} style={inputStyle(42)} />
                    <input type="number" min="0" value={r.assists} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'assists', parseInt(e.target.value) || 0) }} style={inputStyle(36)} />
                    <input type="number" step="0.1" min="0" max="10" value={r.avgRating} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'avgRating', parseFloat(e.target.value) || 0) }}
                      style={{ ...inputStyle(44), color: C.orange, fontWeight: 700 }} />
                    <input type="number" min="0" value={r.cleanSheets} onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); updateRow(i, 'cleanSheets', parseInt(e.target.value) || 0) }} style={inputStyle(36)} />

                    <div style={{ width: 40, textAlign: 'right', flexShrink: 0 }}>
                      {r.matched ? (
                        <span style={{ color: C.green, fontSize: 10, fontWeight: 700 }}>{Math.round(r.match.score * 100)}%</span>
                      ) : (
                        <span style={{ color: '#e05050', fontSize: 10, fontWeight: 700 }}>No match</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add to results */}
            {selectedCount > 0 && (
              <div style={{ marginTop: 14 }}>
                <button onClick={handleAddResults} style={{
                  padding: '12px 24px', borderRadius: 8, border: 'none',
                  background: C.gradientBlue, color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Add {selectedCount} Player{selectedCount > 1 ? 's' : ''} to Results
                </button>
              </div>
            )}

            {/* Raw OCR */}
            <details style={{ marginTop: 14 }}>
              <summary style={{ color: C.textMuted, fontSize: 11, cursor: 'pointer' }}>Show raw OCR text</summary>
              <pre style={{
                marginTop: 8, padding: 12, background: C.surfaceLight,
                border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textMuted, fontSize: 11, whiteSpace: 'pre-wrap',
                fontFamily: 'monospace', maxHeight: 200, overflow: 'auto',
              }}>{ocrText}</pre>
            </details>
          </div>
        )}

        {/* No results */}
        {ocrText && parsed.length === 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: '#e05050', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>No player stats detected</div>
            <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 12 }}>
              Make sure the screenshot shows the squad stats table with player names and numbers
            </div>
            <button onClick={reset} style={{
              background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
              color: C.textSecondary, padding: '8px 16px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Try Another Screenshot</button>
            <details style={{ marginTop: 12 }}>
              <summary style={{ color: C.textMuted, fontSize: 11, cursor: 'pointer' }}>Show raw OCR text</summary>
              <pre style={{
                marginTop: 8, padding: 12, background: C.surfaceLight,
                border: `1px solid ${C.border}`, borderRadius: 6,
                color: C.textMuted, fontSize: 11, whiteSpace: 'pre-wrap',
                fontFamily: 'monospace', maxHeight: 200, overflow: 'auto',
              }}>{ocrText}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Tool Component ────────────────────────────────────────────────── */

// Map DB player positions to formation slot categories
function posToCategory(pos) {
  if (!pos) return null
  const p = pos.toUpperCase()
  if (p === 'GK') return 'goalkeeper'
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p)) return 'back'
  if (['ST', 'CF', 'LW', 'RW', 'LF', 'RF'].includes(p)) return 'forward'
  return 'midfield'
}


export default function StatsScannerTool({ user }) {
  const [phase, setPhase] = useState(() => {
    // If we have a saved team, skip team selection
    try {
      const saved = JSON.parse(localStorage.getItem(TEAM_KEY))
      if (saved?.clubName) return 'squad'
    } catch {}
    return 'team'
  })
  const [teamData, setTeamData] = useState(null)
  const [formation, setFormation] = useState(() => localStorage.getItem(FORMATION_KEY) || '4-3-3')
  const [squad, setSquad] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SQUAD_KEY)) || {}
      // Migrate old string-based squad to new object-based format
      const first = Object.values(saved)[0]
      if (typeof first === 'string') return {}
      return saved
    } catch { return {} }
  })

  const savedTeam = (() => { try { return JSON.parse(localStorage.getItem(TEAM_KEY)) } catch { return null } })()

  // Re-load team data from DB when returning from a saved session
  useEffect(() => {
    if (teamData || !savedTeam?.leagueCode || !savedTeam?.clubId) return
    loadSquad(savedTeam.leagueCode).then(squads => {
      const players = squads[savedTeam.clubId] || []
      const leagueInfo = getLeagueInfo(savedTeam.leagueCode)
      setTeamData({
        leagueCode: savedTeam.leagueCode,
        leagueName: leagueInfo?.name || '',
        clubId: savedTeam.clubId,
        clubName: savedTeam.clubName,
        players,
      })
    }).catch(err => console.error('Failed to reload squad:', err))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Build roster from placed squad players (squad values are now player objects)
  const fm = FORMATIONS[formation]
  const roster = teamData?.players?.length > 0
    ? teamData.players.map(p => ({
        id: p.id || p.name,
        name: p.name,
        pos: p.pos || '',
      }))
    : Object.values(squad)
        .filter(Boolean)
        .map(p => ({
          id: p.id || p.name,
          name: p.name,
          pos: p.pos || '',
        }))

  const handleTeamSelect = (data) => {
    setTeamData(data)
    // Start with empty squad — user drags players in
    setSquad({})
    localStorage.removeItem(SQUAD_KEY)
    setPhase('squad')
  }

  const handleChangeTeam = () => {
    localStorage.removeItem(TEAM_KEY)
    localStorage.removeItem(SQUAD_KEY)
    setTeamData(null)
    setSquad({})
    setPhase('team')
  }

  if (phase === 'team') {
    return <TeamSelector onSelect={handleTeamSelect} savedTeam={savedTeam} />
  }

  // Both squad and scan phases render together
  return (
    <div>
      {/* Team info bar */}
      {(teamData || savedTeam) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
          padding: '10px 16px', background: C.surface, borderRadius: 10,
          border: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {teamData?.clubName || savedTeam?.clubName}
          </span>
          <span style={{ fontSize: 11, color: C.textMuted }}>
            {teamData?.leagueName || ''}
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={handleChangeTeam} style={{
            background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
            color: C.textMuted, fontSize: 11, padding: '4px 10px', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 600,
          }}>
            Change Team
          </button>
        </div>
      )}

      <SquadBuilder
        squad={squad}
        setSquad={setSquad}
        formation={formation}
        setFormation={setFormation}
        players={teamData?.players || []}
        onReady={() => {}}
      />

      {/* Scanner section — always visible below squad builder */}
      <div style={{ marginTop: 16 }}>
        <ScannerPhase
          roster={roster}
          user={user}
          onBack={null}
        />
      </div>
    </div>
  )
}
