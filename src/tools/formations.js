// Formation data & position math — no React, no theme dependencies

export const FORMATIONS = {
  "4-3-3":   { desc: "Attacking \u00b7 Wide play", lines: [
    [["gk",  "Goalkeeper"]],
    [["lb","Left Back"],["cb1","Centre Back"],["cb2","Centre Back"],["rb","Right Back"]],
    [["cm1","Midfielder"],["cm2","Midfielder"],["cm3","Midfielder"]],
    [["lw","Left Wing"],["st","Striker"],["rw","Right Wing"]],
  ]},
  "4-2-3-1": { desc: "Controlled \u00b7 Double pivot", lines: [
    [["gk","Goalkeeper"]],
    [["lb","Left Back"],["cb1","Centre Back"],["cb2","Centre Back"],["rb","Right Back"]],
    [["dm1","Def. Mid"],["dm2","Def. Mid"]],
    [["lam","Left AM"],["cam","Att. Mid"],["ram","Right AM"]],
    [["st","Striker"]],
  ]},
  "4-4-2":   { desc: "Classic \u00b7 Balanced", lines: [
    [["gk","Goalkeeper"]],
    [["lb","Left Back"],["cb1","Centre Back"],["cb2","Centre Back"],["rb","Right Back"]],
    [["lm","Left Mid"],["cm1","Midfielder"],["cm2","Midfielder"],["rm","Right Mid"]],
    [["st1","Striker"],["st2","Striker"]],
  ]},
  "3-5-2":   { desc: "Wing-backs \u00b7 Midfield control", lines: [
    [["gk","Goalkeeper"]],
    [["cb1","Centre Back"],["cb2","Centre Back"],["cb3","Centre Back"]],
    [["lwb","Left Wing B."],["cm1","Midfielder"],["cm2","Midfielder"],["cm3","Midfielder"],["rwb","Right Wing B."]],
    [["st1","Striker"],["st2","Striker"]],
  ]},
  "5-3-2":   { desc: "Defensive \u00b7 Counter-attack", lines: [
    [["gk","Goalkeeper"]],
    [["lwb","Left Wing B."],["cb1","Centre Back"],["cb2","Centre Back"],["cb3","Centre Back"],["rwb","Right Wing B."]],
    [["cm1","Midfielder"],["cm2","Midfielder"],["cm3","Midfielder"]],
    [["st1","Striker"],["st2","Striker"]],
  ]},
  "3-4-3":   { desc: "High press \u00b7 Attack-minded", lines: [
    [["gk","Goalkeeper"]],
    [["cb1","Centre Back"],["cb2","Centre Back"],["cb3","Centre Back"]],
    [["lm","Left Mid"],["cm1","Midfielder"],["cm2","Midfielder"],["rm","Right Mid"]],
    [["lw","Left Wing"],["st","Striker"],["rw","Right Wing"]],
  ]},
  "4-1-4-1": { desc: "Single pivot \u00b7 Midfield press", lines: [
    [["gk","Goalkeeper"]],
    [["lb","Left Back"],["cb1","Centre Back"],["cb2","Centre Back"],["rb","Right Back"]],
    [["dm","Def. Mid"]],
    [["lm","Left Mid"],["cm1","Midfielder"],["cm2","Midfielder"],["rm","Right Mid"]],
    [["st","Striker"]],
  ]},
  "4-3-2-1": { desc: "Christmas Tree \u00b7 Tight central", lines: [
    [["gk","Goalkeeper"]],
    [["lb","Left Back"],["cb1","Centre Back"],["cb2","Centre Back"],["rb","Right Back"]],
    [["cm1","Midfielder"],["cm2","Midfielder"],["cm3","Midfielder"]],
    [["lss","Shadow St."],["rss","Shadow St."]],
    [["st","Striker"]],
  ]},
}

// Pitch dimensions
export const VW = 480, VH = 820   // vertical
export const HW = 1100, HH = 680  // horizontal

// Vertical position calculation
const CW_V = 86, GAP_V = 5
const ZONE_Y4 = [790, 660, 450, 125]
const ZONE_Y5 = [790, 660, 558, 318, 125]

export function getVertPositions(lines) {
  const ys = lines.length === 5 ? ZONE_Y5 : ZONE_Y4
  return lines.flatMap((line, li) => {
    const totalW = line.length * CW_V + (line.length - 1) * GAP_V
    const startX = (VW - totalW) / 2
    return line.map(([id, title], si) => ({
      id, title,
      x: Math.round(startX + si * (CW_V + GAP_V)),
      y: Math.round(ys[li] - 22),
    }))
  })
}

// Horizontal position calculation
const ZONE_X4 = [12, 168, 460, 900]
const ZONE_X5 = [12, 168, 370, 640, 900]
const centerY = (i, n) => {
  const pad = 44, s = (HH - pad * 2) / n
  return Math.round(pad + s * i + s / 2 - 26)
}

export function getHorzPositions(lines) {
  const xs = lines.length === 5 ? ZONE_X5 : ZONE_X4
  return lines.flatMap((line, li) =>
    line.map(([id, title], si) => ({ id, title, x: xs[li], y: centerY(si, line.length) }))
  )
}

// ── FM26 Roles ────────────────────────────────────────────────────────────────
// Each role belongs to a category that maps to position slots on the pitch.

export const ROLES = {
  goalkeeper: [
    'Goalkeeper',
    'Sweeper Keeper',
    'Line-Holding Keeper',
    'Ball Playing Goalkeeper',
    'No-Nonsense Goalkeeper',
  ],
  back: [
    'Centre-Back',
    'Full-Back',
    'Wing-Back',
    'Sweeper',
    'Advanced Centre-Back',
    'Ball Playing Centre-Back',
    'No-Nonsense Centre-Back',
    'Defensive Winger',
    'No-Nonsense Full-Back',
    'Advanced Wing-Back',
    'Inverted Wing-Back',
    'Wide Centre-Back',
    'Inverted Full-Back',
    'Overlapping Centre-Back',
    'Stopping Centre-Back',
    'Covering Centre-Back',
    'Playmaking Wing-Back',
    'Holding Full-Back',
    'Stopping Wide Centre-Back',
    'Covering Wide Centre-Back',
    'Holding Wing-Back',
    'Pressing Full-Back',
    'Pressing Wing-Back',
  ],
  midfield: [
    'Defensive Midfielder',
    'Central Midfielder',
    'Wide Midfielder',
    'Attacking Midfielder',
    'Deep-Lying Playmaker',
    'Ball-Winning Midfielder',
    'Box-to-Box Midfielder',
    'Advanced Playmaker',
    'Anchor',
    'Half-Back',
    'Regista',
    'Wide Playmaker',
    'Box-to-Box Playmaker',
    'Mezzala',
    'Wide Central Midfielder',
    'Segundo Volante',
    'Midfield Playmaker',
    'Channel Midfielder',
    'Pressing Defensive Midfielder',
    'Dropping Defensive Midfielder',
    'Screening Defensive Midfielder',
    'Wide Covering Central Midfielder',
    'Pressing Central Midfielder',
    'Screening Central Midfielder',
    'Wide Covering Defensive Midfielder',
  ],
  forward: [
    'Winger',
    'Half-Space Forward',
    'Deep-Lying Forward',
    'Centre Forward',
    'Target Forward',
    'Poacher',
    'Complete Forward',
    'Pressing Forward',
    'Free Role',
    'Wide Target Forward',
    'Enganche',
    'False Nine',
    'Second Striker',
    'Wide Forward',
    'Half-Space Winger',
    'Wide Outlet Winger',
    'Splitting Outlet Centre Forward',
    'Tracking Attacking Midfielder',
    'Wide Outlet Wide Midfielder',
    'Inverting Outlet Winger',
    'Channel Forward',
    'Central Outlet Attacking Midfielder',
    'Splitting Outlet Attacking Midfielder',
    'Tracking Wide Midfielder',
    'Tracking Winger',
    'Tracking Centre Forward',
    'Central Outlet Centre Forward',
  ],
}

// Map each position slot ID to which role category it can use
export const POS_CATEGORY = {
  gk:  'goalkeeper',
  lb:  'back', rb:  'back',
  cb1: 'back', cb2: 'back', cb3: 'back',
  lwb: 'back', rwb: 'back',
  dm:  'midfield', dm1: 'midfield', dm2: 'midfield',
  cm1: 'midfield', cm2: 'midfield', cm3: 'midfield',
  lm:  'midfield', rm:  'midfield',
  lam: 'forward', cam: 'forward', ram: 'forward',
  lw:  'forward', rw:  'forward',
  lss: 'forward', rss: 'forward',
  st:  'forward', st1: 'forward', st2: 'forward',
}
