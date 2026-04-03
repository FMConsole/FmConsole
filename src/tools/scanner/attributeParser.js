/**
 * Attribute Parser — FM Player Profile Screenshot Parser
 *
 * Handles THREE OCR output formats:
 *
 * 1. PAIRED: "Crossing 9" — name and value on same line (Tesseract inline)
 * 2. SEPARATED BLOCKS: names on separate lines, values on separate lines (OCR.space)
 *    "Crossing\nDribbling\n...\n9\n14\n..."
 * 3. POSITIONAL: section headers + values only (fallback)
 *
 * The parser tries all approaches and picks the one that finds the most attributes.
 */

/* ── Attribute definitions ────────────────────────────────────────────── */

const GOALKEEPING_ATTRS = [
  'aerial ability', 'command of area', 'communication', 'eccentricity',
  'handling', 'kicking', 'one on ones', 'reflexes', 'rushing out',
  'tendency to punch', 'throwing',
]

const TECHNICAL_ATTRS = [
  'corners', 'crossing', 'dribbling', 'finishing', 'first touch',
  'free kicks', 'heading', 'long shots', 'long throws', 'marking',
  'passing', 'penalty taking', 'tackling', 'technique',
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

// Build lookup
const ATTR_LOOKUP = {}
function addAttrs(list, group) {
  for (const name of list) ATTR_LOOKUP[name] = { canonical: name, group }
}
addAttrs(GOALKEEPING_ATTRS, 'goalkeeping')
addAttrs(TECHNICAL_ATTRS, 'technical')
addAttrs(MENTAL_ATTRS, 'mental')
addAttrs(PHYSICAL_ATTRS, 'physical')

// Alternate names
const ALTERNATE_NAMES = {
  'free kick taking': 'free kicks',
  'movement': 'off the ball',
  'off the ball': 'off the ball',
  'offthe ball': 'off the ball',
  'offtheball': 'off the ball',
  'offthe ball': 'off the ball', // OCR merges "Off" + "The" into "OffThe"
  'natural fitness': 'natural fitness',
  'goalkeeper rating': null,
  'set pieces': null,
  'set ploces': null,
  'comers': 'corners',
  'coriers': 'corners',
  'tackfing': 'tackling',
  'tackiing': 'tackling',
}

// OCR misreadings
const OCR_FIXES = {
  'first louch': 'first touch', 'first fouch': 'first touch', 'frst touch': 'first touch',
  'penally taking': 'penalty taking', 'penaly taking': 'penalty taking',
  'penalty laking': 'penalty taking',
  'long shols': 'long shots', 'long shois': 'long shots', 'lonq shots': 'long shots',
  'long lhrows': 'long throws',
  'free kicls': 'free kicks', 'free kicis': 'free kicks',
  'free kick laking': 'free kicks', 'free kick taling': 'free kicks',
  'work rale': 'work rate', 'work rafe': 'work rate',
  'jumping feach': 'jumping reach', 'jumping reacn': 'jumping reach',
  'natural filness': 'natural fitness', 'natural fiiness': 'natural fitness',
  'delerminaion': 'determination', 'delermination': 'determination',
  'detemination': 'determination', 'determinafion': 'determination',
  'determincition': 'determination',
  'concenlration': 'concentration', 'conceritration': 'concentration',
  'concentrafion': 'concentration',
  'anlicipation': 'anticipation', 'anticpation': 'anticipation',
  'anticipafion': 'anticipation',
  'command of afea': 'command of area', 'command ol area': 'command of area',
  'one on anes': 'one on ones',
  'rushing oul': 'rushing out',
  'tendency lo punch': 'tendency to punch', 'tendency to puneh': 'tendency to punch',
  'aerial abilily': 'aerial ability', 'aerial abilty': 'aerial ability',
  'injury pronness': 'injury proneness',
  'imporlant matches': 'important matches', 'important malches': 'important matches',
  'off lhe ball': 'off the ball', 'off ihe ball': 'off the ball',
  'off the bali': 'off the ball', 'off tne ball': 'off the ball',
  'dribbiing': 'dribbling', 'dribblinq': 'dribbling',
  'crossinq': 'crossing', 'finishinq': 'finishing', 'headinq': 'heading',
  'markinq': 'marking', 'passinq': 'passing', 'tacklinq': 'tackling',
  'technigue': 'technique', 'aqility': 'agility', 'slamina': 'stamina',
  'strenqth': 'strength', 'aqgression': 'aggression', 'posifioning': 'positioning',
  'accelerafion': 'acceleration', 'composuré': 'composure',
}

// All known names sorted longest-first
const ALL_NAMES = [...new Set([
  ...Object.keys(ATTR_LOOKUP),
  ...Object.keys(ALTERNATE_NAMES),
  ...Object.keys(OCR_FIXES),
])].sort((a, b) => b.length - a.length)

/* ── Helpers ──────────────────────────────────────────────────────────── */

function cleanLine(line) {
  let c = line
  c = c.replace(/[®©™@#§¶¥£€$&*\\{}[\]<>~`^_]/g, '')
  c = c.replace(/[—–]/g, '-')
  c = c.replace(/[.·…]{2,}/g, ' ')
  c = c.replace(/-{2,}/g, ' ')
  c = c.replace(/\s+/g, ' ').trim()
  return c
}

function resolveAttrName(name) {
  const lower = name.toLowerCase().trim()
  if (ATTR_LOOKUP[lower]) return ATTR_LOOKUP[lower]
  if (OCR_FIXES[lower] && ATTR_LOOKUP[OCR_FIXES[lower]]) return ATTR_LOOKUP[OCR_FIXES[lower]]
  if (lower in ALTERNATE_NAMES) {
    const canonical = ALTERNATE_NAMES[lower]
    if (canonical === null) return null
    if (ATTR_LOOKUP[canonical]) return ATTR_LOOKUP[canonical]
  }
  return null
}

/** Check if a line is purely an attribute name (no numbers). */
function isAttrNameLine(line) {
  const cleaned = line.replace(/[|]/g, '').trim()
  return resolveAttrName(cleaned) !== null && resolveAttrName(cleaned) !== undefined
}

/** Check if a line is purely a value (a number 1-20, possibly with | or " junk). */
function isValueLine(line) {
  const cleaned = line.replace(/[|"']/g, '').trim()
  const m = cleaned.match(/^(\d{1,2})$/)
  if (!m) return false
  const val = parseInt(m[1], 10)
  return val >= 1 && val <= 20
}

/** Extract a value from a line that might have junk like "12 |" or '1"'. */
function extractValueFromLine(line) {
  const cleaned = line.replace(/[|"']/g, '').trim()
  const m = cleaned.match(/^(\d{1,2})$/)
  if (!m) return null
  const val = parseInt(m[1], 10)
  return (val >= 1 && val <= 20) ? val : null
}

const SECTION_HEADERS = {
  'technical': 'technical', 'lechnical': 'technical', 'technica': 'technical',
  'technlcal': 'technical', 'technicol': 'technical',
  'mental': 'mental', 'menlal': 'mental', 'menta': 'mental', 'mentai': 'mental',
  'physical': 'physical', 'physica': 'physical', 'physicat': 'physical',
  'physcal': 'physical', 'physicai': 'physical',
  'goalkeeping': 'goalkeeping', 'goalkeepig': 'goalkeeping',
  'goalkeepng': 'goalkeeping', 'goaikeeping': 'goalkeeping',
}

function detectSectionHeader(line) {
  const stripped = line.toLowerCase().replace(/[^a-z]/g, '')
  return SECTION_HEADERS[stripped] || null
}

/* ── Approach 1: Paired name+value on same line (Tesseract) ───────────── */

function findAttrAt(lowerLine, start) {
  const sub = lowerLine.substring(start)
  for (const name of ALL_NAMES) {
    if (sub.startsWith(name)) {
      const charAfter = sub[name.length]
      if (charAfter === undefined || /[\s\d]/.test(charAfter)) {
        const info = resolveAttrName(name)
        if (info === null) return { name, endPos: start + name.length, info: null }
        if (info) return { name, endPos: start + name.length, info }
      }
    }
  }
  return null
}

function parsePairedLine(line) {
  const results = []
  const lower = line.toLowerCase()
  let pos = 0

  while (pos < lower.length) {
    if (lower[pos] === ' ') { pos++; continue }

    const match = findAttrAt(lower, pos)
    if (match) {
      if (match.info === null) { pos = match.endPos; continue }

      const afterName = line.substring(match.endPos)
      // Match number, possibly with trailing junk like " or |
      const numMatch = afterName.match(/^\s*(\d{1,2})["|'|]?/)
      if (numMatch) {
        const val = parseInt(numMatch[1], 10)
        if (val >= 1 && val <= 20) {
          results.push({ info: match.info, value: val })
        }
        pos = match.endPos + numMatch[0].length
        // Skip duplicate value
        const remaining = line.substring(pos)
        const dupMatch = remaining.match(/^\s+(\d{1,2})/)
        if (dupMatch) {
          const dv = parseInt(dupMatch[1], 10)
          if (dv >= 1 && dv <= 20) pos += dupMatch[0].length
        }
        continue
      }
      pos = match.endPos
      continue
    }

    const nextSpace = lower.indexOf(' ', pos)
    pos = nextSpace === -1 ? lower.length : nextSpace + 1
  }
  return results
}

function approachPaired(rawLines) {
  const attrs = { goalkeeping: {}, technical: {}, mental: {}, physical: {} }
  const found = new Set()
  const attrLines = new Set()

  for (let i = 0; i < rawLines.length; i++) {
    if (detectSectionHeader(rawLines[i])) continue
    const pairs = parsePairedLine(rawLines[i])
    for (const pair of pairs) {
      const key = toCamelCase(pair.info.canonical)
      if (!found.has(key)) {
        attrs[pair.info.group][key] = pair.value
        found.add(key)
        attrLines.add(i)
      }
    }
  }

  // Try joining adjacent lines for split names
  if (found.size < 15) {
    for (let i = 0; i < rawLines.length - 1; i++) {
      const combined = rawLines[i] + ' ' + rawLines[i + 1]
      const pairs = parsePairedLine(combined)
      for (const pair of pairs) {
        const key = toCamelCase(pair.info.canonical)
        if (!found.has(key)) {
          attrs[pair.info.group][key] = pair.value
          found.add(key)
        }
      }
    }
  }

  return { attrs, found, attrLines }
}

/* ── Approach 2: Separated blocks (OCR.space style) ───────────────────── */

function approachBlocks(rawLines) {
  const attrs = { goalkeeping: {}, technical: {}, mental: {}, physical: {} }
  const found = new Set()

  // Find all lines that are pure attribute names
  const nameLines = []
  for (let i = 0; i < rawLines.length; i++) {
    const cleaned = rawLines[i].replace(/[|]/g, '').trim()
    const info = resolveAttrName(cleaned)
    if (info && info !== null) {
      nameLines.push({ idx: i, info, name: cleaned })
    }
  }

  // Find all lines that are pure values
  const valueLines = []
  for (let i = 0; i < rawLines.length; i++) {
    const val = extractValueFromLine(rawLines[i])
    if (val !== null) {
      valueLines.push({ idx: i, value: val })
    }
  }

  if (nameLines.length < 5 || valueLines.length < 5) {
    return { attrs, found, attrLines: new Set() }
  }

  // Group consecutive name lines into blocks
  const nameBlocks = []
  let currentBlock = [nameLines[0]]
  for (let i = 1; i < nameLines.length; i++) {
    if (nameLines[i].idx - nameLines[i - 1].idx <= 3) {
      currentBlock.push(nameLines[i])
    } else {
      if (currentBlock.length >= 3) nameBlocks.push([...currentBlock])
      currentBlock = [nameLines[i]]
    }
  }
  if (currentBlock.length >= 3) nameBlocks.push(currentBlock)

  // Group consecutive value lines into blocks
  const valueBlocks = []
  let currentVBlock = [valueLines[0]]
  for (let i = 1; i < valueLines.length; i++) {
    if (valueLines[i].idx - valueLines[i - 1].idx <= 2) {
      currentVBlock.push(valueLines[i])
    } else {
      if (currentVBlock.length >= 3) valueBlocks.push([...currentVBlock])
      currentVBlock = [valueLines[i]]
    }
  }
  if (currentVBlock.length >= 3) valueBlocks.push(currentVBlock)

  // Determine the SECTION (group) of each name block by majority vote
  function blockSection(nBlock) {
    const counts = {}
    for (const n of nBlock) {
      const g = n.info.group
      counts[g] = (counts[g] || 0) + 1
    }
    let best = null, bestCount = 0
    for (const [g, c] of Object.entries(counts)) {
      if (c > bestCount) { bestCount = c; best = g }
    }
    return best
  }

  // For each name block, determine its section
  const blockSections = nameBlocks.map(nb => ({ block: nb, section: blockSection(nb) }))

  // Expected attribute counts per section
  const SECTION_ATTRS = {
    goalkeeping: GOALKEEPING_ATTRS,
    technical: TECHNICAL_ATTRS,
    mental: MENTAL_ATTRS,
    physical: PHYSICAL_ATTRS,
  }

  // Match each name block with the value block for the SAME section
  // Strategy: for each section, find the value block whose size best matches
  // the expected count for that section, among remaining unmatched value blocks
  const usedVBlocks = new Set()

  // Sort by section priority: technical first (most attrs), then mental, physical
  const sectionOrder = ['technical', 'mental', 'physical', 'goalkeeping']

  for (const section of sectionOrder) {
    const sectionBlocks = blockSections.filter(bs => bs.section === section)
    if (sectionBlocks.length === 0) continue

    const nBlock = sectionBlocks[0].block
    const expectedCount = SECTION_ATTRS[section]?.length || 0

    // Find the best matching value block by size
    let bestVIdx = null
    let bestDiff = Infinity

    for (let vi = 0; vi < valueBlocks.length; vi++) {
      if (usedVBlocks.has(vi)) continue
      const diff = Math.abs(valueBlocks[vi].length - expectedCount)
      if (diff < bestDiff) {
        bestDiff = diff
        bestVIdx = vi
      }
    }

    if (bestVIdx !== null && bestDiff <= 5) {
      usedVBlocks.add(bestVIdx)
      const vBlock = valueBlocks[bestVIdx]

      // Map values to the known attribute order for this section
      const attrOrder = SECTION_ATTRS[section]
      for (let j = 0; j < Math.min(vBlock.length, attrOrder.length); j++) {
        const key = toCamelCase(attrOrder[j])
        if (!found.has(key)) {
          attrs[section][key] = vBlock[j].value
          found.add(key)
        }
      }
    }
  }

  return { attrs, found, attrLines: new Set() }
}

/* ── Player name extraction ───────────────────────────────────────────── */

const SKIP_LABELS = new Set([
  'goalkeeping', 'technical', 'mental', 'physical', 'attributes', 'overview',
  'profile', 'information', 'history', 'stats', 'position', 'media', 'contract',
  'personal', 'general', 'training', 'development', 'career', 'transfer',
  'scouting', 'scout report', 'player', 'details', 'ability', 'potential',
  'current ability', 'potential ability', 'reputation', 'value', 'wage',
  'natural', 'accomplished', 'competent', 'unconvincing', 'awkward',
  'club', 'nation', 'nationality', 'set pieces', 'comparison', 'performance',
  'in possession', 'out of possession', 'select', 'role', 'info',
  'positions', 'happiness', 'fitness', 'form', 'discipline', 'eligibility',
  'season stats', 'career stats', 'actions', 'search', 'portal',
  'squad', 'recruitment', 'match day', 'finances', 'responsibilities',
  'bookmarks', 'messages', 'club site', 'club vision',
  'performance feedback', 'staff', 'more',
])

function extractPlayerName(lines) {
  const candidates = []

  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i].trim()
    if (!line || line.length < 2 || line.length > 50) continue

    const lower = line.toLowerCase()
    if (SKIP_LABELS.has(lower)) continue
    if (detectSectionHeader(line)) continue
    if (isAttrNameLine(line)) continue

    const digits = (line.match(/\d/g) || []).length
    if (digits > 0 && digits / line.length > 0.25) continue
    if (/\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}/.test(line)) continue
    if (/[£€$]/.test(line)) continue
    if (/\bp\/[wm]\b/i.test(line)) continue
    if (/future prospect|loan|coach|scout|player report|search results/i.test(line)) continue

    if (!/^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\s.'\-,()]+$/.test(line)) continue

    const words = line.split(/\s+/).filter(w => w.length > 0)
    if (words.length === 1 && line.length < 3) continue

    let score = 100
    if (words.length >= 2) score += 20
    if (/^[A-Z]/.test(line)) score += 15
    if (line.length >= 5) score += 5
    if (words.length === 1 && /^[A-Z][a-z]+$/.test(line)) score += 10
    score -= i * 3

    candidates.push({ line, score })
  }

  if (candidates.length === 0) return 'Unknown Player'
  candidates.sort((a, b) => b.score - a.score)
  return candidates[0].line
}

/* ── Approach 3: Overlay positions (OCR.space with coordinates) ────────── */

function approachOverlay(words) {
  const attrs = { goalkeeping: {}, technical: {}, mental: {}, physical: {} }
  const found = new Set()

  // Step 1: Build multi-word attribute name candidates by grouping nearby words
  // First, find all words that could be attribute name parts
  const nameWords = []
  const valueWords = []

  for (const w of words) {
    const t = w.text.replace(/[|"'*®©]/g, '').trim()
    if (!t) continue

    // Match numbers with possible trailing junk: "12U", "14|", "11'"
    const numMatch = t.match(/^(\d{1,2})[^0-9]*$/)
    if (numMatch) {
      const val = parseInt(numMatch[1], 10)
      if (val >= 1 && val <= 20) {
        valueWords.push({ ...w, value: val, text: numMatch[1] })
      }
    } else if (/^[a-zA-Z]{2,}$/.test(t)) {
      nameWords.push({ ...w, text: t })
    }
  }

  // Step 2: Try to form attribute names from consecutive nameWords on the same row
  // Two words are on the same row if their vertical centers are within 15px
  const ROW_TOLERANCE = 15

  function sameRow(a, b) {
    const aMid = a.top + a.height / 2
    const bMid = b.top + b.height / 2
    return Math.abs(aMid - bMid) < ROW_TOLERANCE
  }

  // Build candidate attribute names (1-4 consecutive words on same row)
  const attrCandidates = [] // { info, right, top, height }

  for (let i = 0; i < nameWords.length; i++) {
    // Try 1 to 4 words starting at i
    for (let len = Math.min(4, nameWords.length - i); len >= 1; len--) {
      // Check all words are on same row
      let allSameRow = true
      for (let j = 1; j < len; j++) {
        if (!sameRow(nameWords[i], nameWords[i + j])) { allSameRow = false; break }
      }
      if (!allSameRow) continue

      const candidateText = nameWords.slice(i, i + len).map(w => w.text).join(' ')
      const info = resolveAttrName(candidateText)
      if (info && info !== null) {
        const lastWord = nameWords[i + len - 1]
        attrCandidates.push({
          info,
          name: candidateText,
          left: nameWords[i].left, // left edge of first word
          right: lastWord.left + lastWord.width, // right edge of last word
          top: nameWords[i].top,
          height: nameWords[i].height,
          wordCount: len,
        })
      }
    }
  }

  // Prefer longer matches (more words) and deduplicate
  attrCandidates.sort((a, b) => b.wordCount - a.wordCount)

  // Step 3: For each attribute name, find the nearest value to its right on the same row
  for (const attr of attrCandidates) {
    const key = toCamelCase(attr.info.canonical)
    if (found.has(key)) continue

    let bestValue = null
    let bestDist = Infinity

    for (const v of valueWords) {
      // Must be on the same row
      if (!sameRow(attr, v)) continue

      // Value can be to the right OR left of the attribute name
      // (Physical column has values to the left in FM's layout)
      const distRight = v.left - attr.right  // value's left edge to name's right edge
      const distLeft = attr.left - (v.left + v.width) // name's left edge to value's right edge
      const dist = Math.min(
        distRight >= -5 ? distRight : 9999,  // prefer right
        distLeft >= -5 ? distLeft + 50 : 9999  // left OK but penalized
      )

      if (dist < bestDist) {
        bestDist = dist
        bestValue = v
      }
    }

    if (bestValue) {
      attrs[attr.info.group][key] = bestValue.value
      found.add(key)
      bestValue._used = true
    }
  }

  // Step 4: Orphan value recovery
  // Find values that weren't matched to any attribute.
  // Group matched attributes by column (x-position) and fill gaps using y-ordering.
  const usedValues = new Set(valueWords.filter(v => v._used).map(v => v.left + ',' + v.top))
  const orphanValues = valueWords.filter(v => !v._used)

  if (orphanValues.length > 0 && found.size > 10) {
    // Build column info: for each group, find the typical x-range of values
    const allGroups = [
      { key: 'technical', attrs: TECHNICAL_ATTRS },
      { key: 'mental', attrs: MENTAL_ATTRS },
      { key: 'physical', attrs: PHYSICAL_ATTRS },
    ]

    for (const group of allGroups) {
      // Get matched attrs in this group with their y-positions
      const matched = []
      for (const attr of attrCandidates) {
        const ck = toCamelCase(attr.info.canonical)
        if (attr.info.group === group.key && found.has(ck)) {
          matched.push({ key: ck, top: attr.top, canonical: attr.info.canonical })
        }
      }
      if (matched.length < 2) continue

      // Find the x-range where values appear for this column
      const matchedValues = valueWords.filter(v => {
        return v._used && matched.some(m => sameRow(m, v))
      })
      if (matchedValues.length === 0) continue

      const valXMin = Math.min(...matchedValues.map(v => v.left)) - 30
      const valXMax = Math.max(...matchedValues.map(v => v.left)) + 30

      // Find orphan values in this x-range
      const columnOrphans = orphanValues.filter(v => v.left >= valXMin && v.left <= valXMax)

      // Find missing attributes in this group
      const missingAttrs = group.attrs.filter(a => !found.has(toCamelCase(a)))
      if (missingAttrs.length === 0 || columnOrphans.length === 0) continue

      // Sort matched by y-position to build an order
      matched.sort((a, b) => a.top - b.top)

      // For each orphan value, find where it fits in the y-order
      // and which missing attribute it likely corresponds to
      for (const orphan of columnOrphans) {
        // Find the matched attr just above and just below this orphan
        let aboveIdx = -1
        for (let i = matched.length - 1; i >= 0; i--) {
          if (matched[i].top < orphan.top - 5) { aboveIdx = i; break }
        }

        // The orphan should be the attribute that comes after the one above it
        // in the known FM attribute order
        if (aboveIdx >= 0) {
          const aboveAttr = matched[aboveIdx].canonical
          const orderIdx = group.attrs.indexOf(aboveAttr)
          if (orderIdx >= 0) {
            // Check subsequent attrs in order for the first missing one
            for (let k = orderIdx + 1; k < group.attrs.length; k++) {
              const candidateKey = toCamelCase(group.attrs[k])
              if (!found.has(candidateKey)) {
                attrs[group.key][candidateKey] = orphan.value
                found.add(candidateKey)
                orphan._used = true
                break
              }
            }
          }
        }
      }
    }

    // Also handle Set Pieces orphans — Corners is the first Set Pieces attr
    // Look for orphan values in the Set Pieces area (below Technique, above Penalty Taking)
    const cornerKey = toCamelCase('corners')
    if (!found.has(cornerKey)) {
      const techniqueAttr = attrCandidates.find(a => a.info.canonical === 'technique')
      const penaltyAttr = attrCandidates.find(a => a.info.canonical === 'penalty taking')
      if (techniqueAttr) {
        const yMin = techniqueAttr.top + 20
        const yMax = penaltyAttr ? penaltyAttr.top : techniqueAttr.top + 200
        const cornerOrphan = orphanValues.find(v =>
          !v._used && v.top > yMin && v.top < yMax && v.left > 700 && v.left < 900
        )
        if (cornerOrphan) {
          attrs.technical[cornerKey] = cornerOrphan.value
          found.add(cornerKey)
        }
      }
    }
  }

  return { attrs, found, attrLines: new Set() }
}

/* ── Main parser ──────────────────────────────────────────────────────── */

export function parseAttributes(text, overlay, visionData) {
  // If Claude Vision returned structured JSON, use it directly — no parsing needed
  if (visionData && typeof visionData === 'object') {
    const attrs = {
      goalkeeping: {},
      technical: visionData.technicalAttributes || {},
      mental: visionData.mentalAttributes || {},
      physical: visionData.physicalAttributes || {},
    }

    // Map freeKickTaking → freeKicks for internal consistency
    if (attrs.technical.freeKickTaking !== undefined && attrs.technical.freeKicks === undefined) {
      attrs.technical.freeKicks = attrs.technical.freeKickTaking
      delete attrs.technical.freeKickTaking
    }

    const playerName = visionData.playerName || 'Unknown Player'
    return { playerName, attributes: attrs }
  }

  // Fallback: OCR text-based parsing
  const rawText = typeof text === 'object' ? text.text || '' : text
  const rawLines = rawText.split('\n').map(cleanLine).filter(l => l.length > 0)

  let overlayResult = null
  if (overlay && overlay.length > 0) {
    overlayResult = approachOverlay(overlay)
  }

  const paired = approachPaired(rawLines)
  const blocks = approachBlocks(rawLines)

  // Pick best approach:
  // ALWAYS prefer overlay when available (>= 10 attrs found) because it uses
  // spatial positions for CORRECT values. Text approaches often mismap values
  // in multi-column FM layouts.
  let best = paired
  if (blocks.found.size > best.found.size) best = blocks
  if (overlayResult && overlayResult.found.size >= 10) {
    // Use overlay as base, then fill gaps from paired approach
    // (paired may have correct values for attrs the overlay missed)
    best = overlayResult
    const pairedFlat = flattenAttributes({ attributes: paired.attrs })
    for (const [key, val] of Object.entries(pairedFlat)) {
      if (!best.found.has(key)) {
        // Determine group for this key
        const group = findGroupForKey(key)
        if (group) {
          best.attrs[group][key] = val
          best.found.add(key)
        }
      }
    }
  }

  const playerName = extractPlayerName(rawLines)
  return { playerName, attributes: best.attrs }
}

/* ── Utilities ────────────────────────────────────────────────────────── */

function toCamelCase(str) {
  return str.replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
}

/** Find which group a camelCase key belongs to. */
function findGroupForKey(key) {
  const allGroups = [
    { group: 'goalkeeping', attrs: GOALKEEPING_ATTRS },
    { group: 'technical', attrs: TECHNICAL_ATTRS },
    { group: 'mental', attrs: MENTAL_ATTRS },
    { group: 'physical', attrs: PHYSICAL_ATTRS },
  ]
  for (const { group, attrs } of allGroups) {
    if (attrs.some(a => toCamelCase(a) === key)) return group
  }
  return null
}

export function flattenAttributes(parsed) {
  return {
    ...parsed.attributes.goalkeeping,
    ...parsed.attributes.technical,
    ...parsed.attributes.mental,
    ...parsed.attributes.physical,
  }
}

export function attrDisplayName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim()
}

export { toCamelCase, GOALKEEPING_ATTRS, TECHNICAL_ATTRS, MENTAL_ATTRS, PHYSICAL_ATTRS }
