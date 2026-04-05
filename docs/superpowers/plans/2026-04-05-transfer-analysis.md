# Transfer Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Transfer Analysis tool that compares a current squad player vs. a transfer target across role fit, age/contract value, cost, and squad fit — producing a Sign Him / Caution / Avoid verdict.

**Architecture:** Single self-contained tool file (`TransferAnalysisTool.jsx`) plus a new shared helpers module (`playerHelpers.js`). All state lifted to the parent component following the PlayerComparisonTool pattern. Analysis engine is pure functions called on demand.

**Tech Stack:** React, Vite, localStorage, existing Vision AI scanner pipeline, `src/data/roleWeights.js` role scoring system.

**Spec:** `docs/superpowers/specs/2026-04-05-transfer-analysis-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Create** | `src/data/playerHelpers.js` | Shared `getAgeProfile`, `rolePhysicalDemand` (extracted from PlayerAnalyserTool) |
| **Create** | `src/tools/TransferAnalysisTool.jsx` | Full tool: scan panels, analysis engine, verdict, export, saved sessions |
| **Create** | `src/pages/TransferAnalysis.jsx` | Page wrapper (hero header + tool) — copy PlayerAnalyser.jsx pattern |
| **Modify** | `src/App.jsx` | Add route `/tools/transfer-analysis` |
| **Modify** | `src/pages/Tools.jsx` | Replace "Transfer Tracker" Coming Soon card with live Transfer Analysis card |
| **Modify** | `src/tools/PlayerAnalyserTool.jsx` | Import `getAgeProfile`/`rolePhysicalDemand` from shared module instead of defining locally |

---

## Task 1: Extract Shared Player Helpers

**Files:**
- Create: `src/data/playerHelpers.js`
- Modify: `src/tools/PlayerAnalyserTool.jsx` lines 54–75 (remove local definitions, add import)

- [ ] **Step 1: Create `src/data/playerHelpers.js`**

```js
// src/data/playerHelpers.js
import C from '../theme/colors'

const PHYSICAL_SPEED_KEYS = ['pace', 'acceleration', 'agility', 'stamina']

export function getAgeProfile(age) {
  if (!age) return null
  if (age <= 20) return { bracket: 'developing', label: 'Developing (U21)', color: C.blue, physNote: 'Physical attributes are still developing — expect improvement with training.' }
  if (age <= 27) return { bracket: 'peak', label: 'Peak (21–27)', color: C.green, physNote: null }
  if (age <= 31) return { bracket: 'prime', label: 'Prime (28–31)', color: C.greenLight, physNote: 'Minor physical decline may be beginning — monitor pace and acceleration.' }
  if (age <= 34) return { bracket: 'veteran', label: 'Veteran (32–34)', color: C.orange, physNote: 'Physical decline is expected at this age. Pace and acceleration scores may understate peak ability.' }
  return { bracket: 'declining', label: `Experienced (${age})`, color: '#e05050', physNote: 'Significant age-related physical decline. Scores reflect current form — consider technical and mental strengths when choosing a role.' }
}

export function rolePhysicalDemand(roleWeights) {
  const speedWeight = PHYSICAL_SPEED_KEYS.reduce((s, k) => s + (roleWeights[k] || 0), 0)
  const total = Object.values(roleWeights).reduce((s, w) => s + w, 0)
  return total > 0 ? speedWeight / total : 0
}
```

- [ ] **Step 2: Update `PlayerAnalyserTool.jsx` to import from shared module**

At line 12 (after existing roleWeights import), add:
```js
import { getAgeProfile, rolePhysicalDemand } from '../data/playerHelpers.js'
```

Then remove lines 54–75 (the `PHYSICAL_SPEED_KEYS` const, `getAgeProfile` function, `rolePhysicalDemand` function, and the `/* ── Age helpers ── */` comment).

- [ ] **Step 3: Verify the app still builds with no errors**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```
Expected: `✓ built in ...`

- [ ] **Step 4: Commit**

```bash
git add src/data/playerHelpers.js src/tools/PlayerAnalyserTool.jsx
git commit -m "refactor: extract getAgeProfile and rolePhysicalDemand to shared playerHelpers"
```

---

## Task 2: Page Wrapper + Route + Tools Hub Card

**Files:**
- Create: `src/pages/TransferAnalysis.jsx`
- Modify: `src/App.jsx`
- Modify: `src/pages/Tools.jsx`

- [ ] **Step 1: Create `src/pages/TransferAnalysis.jsx`**

Copy the PlayerAnalyser page pattern exactly (`src/pages/PlayerAnalyser.jsx`), changing the title, description, gradient, and tool import:

```jsx
import { Link } from 'react-router-dom'
import C from '../theme/colors'
import Section from '../components/Section'
import GradientText from '../components/GradientText'
import TransferAnalysisTool from '../tools/TransferAnalysisTool'

export default function TransferAnalysis() {
  return (
    <>
      <div style={{ background: C.gradientHero }}>
        <Section style={{ textAlign: 'center', paddingBottom: 32, paddingTop: 48 }}>
          <Link to="/tools" style={{
            fontSize: 13, color: C.textSecondary, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>&larr;</span> Back to Tools
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
            <GradientText gradient={C.gradientOrange}>Transfer Analysis</GradientText>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Compare your squad player against a transfer target. Analyse role fit, age value, cost, and squad hierarchy to make confident signing decisions.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32, paddingBottom: 48 }}>
        <TransferAnalysisTool />
      </Section>
    </>
  )
}
```

Note: `C.gradientOrange` — check `src/theme/colors.js` for the correct orange gradient key. If it doesn't exist, use `C.gradientCard` or any existing gradient.

- [ ] **Step 2: Add route to `src/App.jsx`**

After line 14 (`import PlayerAnalyser`), add:
```js
import TransferAnalysis from './pages/TransferAnalysis'
```

After line 42 (`<Route path="/tools/player-analyser" ...>`), add:
```jsx
<Route path="/tools/transfer-analysis" element={<TransferAnalysis />} />
```

- [ ] **Step 3: Update Tools hub card in `src/pages/Tools.jsx`**

Replace lines 55–62 (the "Transfer Tracker" object):
```js
{
  icon: '💰',
  title: 'Transfer Tracker',
  desc: 'Track transfer rumors, valuations, and market trends across all top leagues.',
  color: C.orange,
  glow: C.glowOrange,
  status: 'Coming Soon',
},
```
With:
```js
{
  icon: '💰',
  title: 'Transfer Analysis',
  desc: 'Compare squad players vs. transfer targets. Analyse role fit, cost, age value, and squad fit for confident signing decisions.',
  color: C.orange,
  glow: C.glowOrange,
  status: 'Live',
  href: '/tools/transfer-analysis',
},
```

- [ ] **Step 4: Create a stub `TransferAnalysisTool.jsx` so the page imports resolve**

```jsx
// src/tools/TransferAnalysisTool.jsx  (stub — replaced in Task 3)
import C from '../theme/colors'

export default function TransferAnalysisTool() {
  return (
    <div style={{ textAlign: 'center', color: C.textSecondary, padding: 48 }}>
      Transfer Analysis — coming soon
    </div>
  )
}
```

- [ ] **Step 5: Build and verify no errors**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```
Expected: `✓ built in ...`

- [ ] **Step 6: Commit**

```bash
git add src/pages/TransferAnalysis.jsx src/App.jsx src/pages/Tools.jsx src/tools/TransferAnalysisTool.jsx
git commit -m "feat: add Transfer Analysis route, page wrapper, and tools hub card"
```

---

## Task 3: Scanner Panels + Financial Inputs (no analysis yet)

**Files:**
- Modify: `src/tools/TransferAnalysisTool.jsx` (replace stub with full scan+input UI)

This task builds the two-panel input UI. No verdict yet — just the scan, position select, squad role, and financial fields, plus the disabled Analyse button.

- [ ] **Step 1: Replace stub with full component shell + constants**

```jsx
import { useState, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { extractText } from './scanner/ocr.js'
import {
  parseAttributes, flattenAttributes, attrDisplayName,
} from './scanner/attributeParser.js'
import {
  POSITION_LIST,
} from '../data/positionWeights.js'
import {
  getRolesForPosition, calcRoleScore, starsDisplay, scoreToStars,
} from '../data/roleWeights.js'
import { getAgeProfile, rolePhysicalDemand } from '../data/playerHelpers.js'

const SQUAD_ROLES = [
  { key: 'starter',   label: 'Starter',      expectedGames: '30+' },
  { key: 'backup',    label: 'Backup',        expectedGames: '20–29' },
  { key: 'rotation',  label: 'Rotation',      expectedGames: '10–19' },
  { key: 'depth',     label: 'Squad Depth',   expectedGames: '<10' },
]

const STORAGE_KEY = 'fmc_transfer_analyses'
```

- [ ] **Step 2: Add the `useScanPanel` hook (handles scan state for one player side)**

```jsx
// Returns [player, setPlayer, scanFn, resetFn] for one side
function useScanPanel() {
  const [player, setPlayer] = useState(null)
  const inputRef = useRef(null)

  const scan = useCallback(async (file) => {
    const preview = URL.createObjectURL(file)
    setPlayer({ file, preview, name: '', parsed: null, status: 'scanning', progress: 0 })
    try {
      const ocrResult = await extractText(file, {
        onProgress: pct => setPlayer(prev => prev ? { ...prev, progress: pct } : prev),
      })
      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      const parsed = parseAttributes(text, ocrResult.overlay || null, ocrResult.visionData || null)
      setPlayer(prev => prev ? { ...prev, status: 'done', progress: 100, name: parsed.playerName, parsed } : prev)
    } catch {
      URL.revokeObjectURL(preview)
      setPlayer(prev => prev ? { ...prev, status: 'error' } : prev)
    }
  }, [])

  const reset = useCallback(() => {
    setPlayer(prev => { if (prev?.preview) URL.revokeObjectURL(prev.preview); return null })
  }, [])

  return [player, setPlayer, scan, reset, inputRef]
}
```

- [ ] **Step 3: Add the `ScanPanel` display component**

```jsx
function ScanPanel({ label, player, position, squadRole, wage, contractYears,
  onFile, onPosition, onSquadRole, onWage, onContractYears, onReset,
  showFee, fee, onFee,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) onFile(file)
  }, [onFile])

  // Upload state
  if (!player) return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        background: dragOver ? `${C.blue}10` : C.gradientCard,
        border: `2px dashed ${dragOver ? C.blue : C.border}`,
        borderRadius: 16, padding: 32, minHeight: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ fontSize: 36, opacity: 0.5 }}>🔬</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
      <div style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center', maxWidth: 240 }}>
        Drop FM player screenshot or click to upload
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
      />
    </div>
  )

  // Scanning state
  if (player.status === 'scanning') return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      {player.preview && (
        <img src={player.preview} alt="" style={{
          width: '100%', maxHeight: 140, objectFit: 'cover',
          borderRadius: 10, marginBottom: 12, opacity: 0.6,
        }} />
      )}
      <div style={{ height: 6, borderRadius: 3, background: C.surfaceHover, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${player.progress}%`, height: '100%', background: C.blue, transition: 'width 0.3s', borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary }}>Analyzing... {player.progress}%</div>
    </div>
  )

  // Error state
  if (player.status === 'error') return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ color: '#e05050', marginBottom: 12, fontSize: 13 }}>Scan failed — try again</div>
      <button onClick={onReset} style={{ padding: '8px 20px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer', fontSize: 13 }}>
        Retry
      </button>
    </div>
  )

  // Done state — show player card + inputs
  const autoPositions = player.parsed?.details?.positions || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Player name + age */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{player.name || '—'}</div>
        <button onClick={onReset} style={{
          fontSize: 11, color: C.textSecondary, background: 'none',
          border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
        }}>
          Replace
        </button>
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary }}>
        {[player.parsed?.details?.age && `Age ${player.parsed.details.age}`,
          player.parsed?.details?.currentClub,
          player.parsed?.details?.nationality,
        ].filter(Boolean).join(' · ')}
      </div>

      {/* Position selector */}
      <label style={{ fontSize: 12, color: C.textSecondary }}>
        Position
        <select value={position} onChange={e => onPosition(e.target.value)}
          style={{ display: 'block', marginTop: 4, width: '100%', padding: '7px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13 }}>
          <option value="">Select position</option>
          {POSITION_LIST.map(p => (
            <option key={p.key} value={p.key}>{p.label} ({p.key})</option>
          ))}
        </select>
      </label>

      {/* Squad role */}
      <label style={{ fontSize: 12, color: C.textSecondary }}>
        Squad Role
        <select value={squadRole} onChange={e => onSquadRole(e.target.value)}
          style={{ display: 'block', marginTop: 4, width: '100%', padding: '7px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13 }}>
          {SQUAD_ROLES.map(r => (
            <option key={r.key} value={r.key}>{r.label} ({r.expectedGames} games)</option>
          ))}
        </select>
      </label>

      {/* Fee (target only) */}
      {showFee && (
        <label style={{ fontSize: 12, color: C.textSecondary }}>
          Transfer Fee (0 = free)
          <input type="number" min="0" value={fee} onChange={e => onFee(e.target.value)}
            placeholder="e.g. 5000000"
            style={{ display: 'block', marginTop: 4, width: '100%', padding: '7px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, boxSizing: 'border-box' }} />
        </label>
      )}

      {/* Weekly wage */}
      <label style={{ fontSize: 12, color: C.textSecondary }}>
        Weekly Wage
        <input type="number" min="0" value={wage} onChange={e => onWage(e.target.value)}
          placeholder="e.g. 25000"
          style={{ display: 'block', marginTop: 4, width: '100%', padding: '7px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, boxSizing: 'border-box' }} />
      </label>

      {/* Contract years */}
      <label style={{ fontSize: 12, color: C.textSecondary }}>
        Contract Years
        <input type="number" min="0" max="10" value={contractYears} onChange={e => onContractYears(e.target.value)}
          placeholder="e.g. 3"
          style={{ display: 'block', marginTop: 4, width: '100%', padding: '7px 10px', borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, boxSizing: 'border-box' }} />
      </label>
    </div>
  )
}
```

- [ ] **Step 4: Wire up the main `TransferAnalysisTool` component with two panels**

All `useState` declarations come first — before any `useCallback` that references their setters.

```jsx
export default function TransferAnalysisTool() {
  // ── All state declarations first (before any callbacks that use setters) ──
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [currentPosition, setCurrentPosition] = useState('')
  const [currentSquadRole, setCurrentSquadRole] = useState('rotation')
  const [currentWage, setCurrentWage] = useState('')
  const [currentContractYears, setCurrentContractYears] = useState('')

  const [targetPlayer, setTargetPlayer] = useState(null)
  const [targetPosition, setTargetPosition] = useState('')
  const [targetSquadRole, setTargetSquadRole] = useState('starter')
  const [targetFee, setTargetFee] = useState('')
  const [targetWage, setTargetWage] = useState('')
  const [targetContractYears, setTargetContractYears] = useState('')

  const [analysis, setAnalysis] = useState(null)
  const [savedAnalyses, setSavedAnalyses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })

  // ── Callbacks (after all state setters are declared) ──
  const scanCurrent = useCallback(async (file) => {
    const preview = URL.createObjectURL(file)
    setCurrentPlayer({ file, preview, name: '', parsed: null, status: 'scanning', progress: 0 })
    try {
      const ocrResult = await extractText(file, {
        onProgress: pct => setCurrentPlayer(prev => prev ? { ...prev, progress: pct } : prev),
      })
      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      const parsed = parseAttributes(text, ocrResult.overlay || null, ocrResult.visionData || null)
      setCurrentPlayer(prev => prev ? { ...prev, status: 'done', progress: 100, name: parsed.playerName, parsed } : prev)
      if (parsed.details?.positions?.length) setCurrentPosition(parsed.details.positions[0])
    } catch {
      URL.revokeObjectURL(preview)
      setCurrentPlayer(prev => prev ? { ...prev, status: 'error' } : prev)
    }
  }, [])

  const resetCurrent = useCallback(() => {
    setCurrentPlayer(prev => { if (prev?.preview) URL.revokeObjectURL(prev.preview); return null })
    setCurrentPosition(''); setCurrentSquadRole('rotation'); setCurrentWage(''); setCurrentContractYears('')
  }, [])

  const scanTarget = useCallback(async (file) => {
    const preview = URL.createObjectURL(file)
    setTargetPlayer({ file, preview, name: '', parsed: null, status: 'scanning', progress: 0 })
    try {
      const ocrResult = await extractText(file, {
        onProgress: pct => setTargetPlayer(prev => prev ? { ...prev, progress: pct } : prev),
      })
      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      const parsed = parseAttributes(text, ocrResult.overlay || null, ocrResult.visionData || null)
      setTargetPlayer(prev => prev ? { ...prev, status: 'done', progress: 100, name: parsed.playerName, parsed } : prev)
      if (parsed.details?.positions?.length) setTargetPosition(parsed.details.positions[0])
    } catch {
      URL.revokeObjectURL(preview)
      setTargetPlayer(prev => prev ? { ...prev, status: 'error' } : prev)
    }
  }, [])

  const resetTarget = useCallback(() => {
    setTargetPlayer(prev => { if (prev?.preview) URL.revokeObjectURL(prev.preview); return null })
    setTargetPosition(''); setTargetSquadRole('rotation'); setTargetFee(''); setTargetWage(''); setTargetContractYears('')
  }, [])

  const [targetPosition, setTargetPosition] = useState('')
  const [targetSquadRole, setTargetSquadRole] = useState('starter')
  const [targetFee, setTargetFee] = useState('')
  const [targetWage, setTargetWage] = useState('')
  const [targetContractYears, setTargetContractYears] = useState('')

  // Analysis result + saved sessions
  const [analysis, setAnalysis] = useState(null)
  const [savedAnalyses, setSavedAnalyses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })

  // Can we analyse?
  const canAnalyse = (
    currentPlayer?.status === 'done' && currentPosition &&
    currentWage && currentContractYears &&
    targetPlayer?.status === 'done' && targetPosition &&
    targetWage && targetContractYears
  )

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Two panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24, marginBottom: 24,
      }}>
        <div style={{ background: C.gradientCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Your Player
          </div>
          <ScanPanel
            label="Upload Your Player"
            player={currentPlayer}
            position={currentPosition}
            squadRole={currentSquadRole}
            wage={currentWage}
            contractYears={currentContractYears}
            onFile={scanCurrent}
            onPosition={setCurrentPosition}
            onSquadRole={setCurrentSquadRole}
            onWage={setCurrentWage}
            onContractYears={setCurrentContractYears}
            onReset={resetCurrent}
            showFee={false}
          />
        </div>

        <div style={{ background: C.gradientCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Transfer Target
          </div>
          <ScanPanel
            label="Upload Transfer Target"
            player={targetPlayer}
            position={targetPosition}
            squadRole={targetSquadRole}
            wage={targetWage}
            contractYears={targetContractYears}
            onFile={scanTarget}
            onPosition={setTargetPosition}
            onSquadRole={setTargetSquadRole}
            onWage={setTargetWage}
            onContractYears={setTargetContractYears}
            onReset={resetTarget}
            showFee={true}
            fee={targetFee}
            onFee={setTargetFee}
          />
        </div>
      </div>

      {/* Analyse button */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <button
          disabled={!canAnalyse}
          onClick={() => setAnalysis(runAnalysis())}
          style={{
            padding: '14px 48px', borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: canAnalyse ? C.blue : C.surface,
            color: canAnalyse ? '#fff' : C.textMuted,
            border: `1px solid ${canAnalyse ? C.blue : C.border}`,
            cursor: canAnalyse ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          Analyse Transfer
        </button>
        {!canAnalyse && (
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
            Scan both players and fill in all financial fields to continue
          </div>
        )}
      </div>

      {/* Analysis result — placeholder until Task 4 */}
      {analysis && (
        <div style={{ background: C.gradientCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <pre style={{ color: C.textSecondary, fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )

  function runAnalysis() { return { placeholder: true } }
}
```

- [ ] **Step 5: Build and verify**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/TransferAnalysisTool.jsx
git commit -m "feat: add Transfer Analysis scan panels and financial input UI"
```

---

## Task 4: Analysis Engine

**Files:**
- Modify: `src/tools/TransferAnalysisTool.jsx` — replace `runAnalysis` stub with full engine

The engine is a pure function `runAnalysis(inputs)` that returns all four dimension results plus the overall verdict. No UI changes in this task — the JSON debug output from Task 3 shows it working.

- [ ] **Step 1: Add the `runAnalysis` function before the component**

Update the top-of-file import to include `ROLES` (consolidating into the existing roleWeights import line from Task 3):
```js
import { getRolesForPosition, calcRoleScore, starsDisplay, scoreToStars, ROLES } from '../data/roleWeights.js'
```

Then add the `runAnalysis` pure function above the component:

```jsx
// Place above the TransferAnalysisTool component

function runAnalysis({
  currentPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears,
  targetPlayer, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears,
}) {
  const currentFlat = flattenAttributes(currentPlayer.parsed)
  const targetFlat = flattenAttributes(targetPlayer.parsed)

  // ── Dimension 1: Role Fit ──────────────────────────────────────────────
  const currentRoles = getRolesForPosition(currentPosition).map(r => r.key)
  const targetRoles = getRolesForPosition(targetPosition).map(r => r.key)
  const sharedRoleKeys = currentRoles.filter(k => targetRoles.includes(k))

  let roleFit
  if (sharedRoleKeys.length === 0) {
    roleFit = { status: 'excluded', topRoles: [], primaryVerdict: 'N/A', primaryColor: C.textMuted, primaryScore: 0 }
  } else {
    const scored = sharedRoleKeys.map(roleKey => ({
      roleKey,
      roleName: ROLES[roleKey]?.name || roleKey,
      currentScore: calcRoleScore(roleKey, currentFlat),
      targetScore: calcRoleScore(roleKey, targetFlat),
    })).sort((a, b) => b.targetScore - a.targetScore).slice(0, 5)

    const primary = scored[0]
    const diff = primary.targetScore - primary.currentScore
    const verdict = diff >= 0.5 ? 'Upgrade' : diff <= -0.5 ? 'Downgrade' : 'Lateral'
    const color = verdict === 'Upgrade' ? C.green : verdict === 'Downgrade' ? '#e05050' : C.orange
    const score = verdict === 'Upgrade' ? 1 : verdict === 'Downgrade' ? -1 : 0

    roleFit = { status: 'included', topRoles: scored, primaryVerdict: verdict, primaryColor: color, primaryScore: score }
  }

  // ── Dimension 2: Age & Contract Value ─────────────────────────────────
  const currentAge = currentPlayer.parsed.details?.age
  const targetAge = targetPlayer.parsed.details?.age
  const currentYears = parseInt(currentContractYears) || 0
  const targetYears = parseInt(targetContractYears) || 0
  const currentWeekly = parseInt(currentWage) || 0
  const targetWeekly = parseInt(targetWage) || 0
  const fee = parseInt(targetFee) || 0

  const currentProfile = getAgeProfile(currentAge)
  const targetProfile = getAgeProfile(targetAge)
  const currentCommitment = currentWeekly * 52 * currentYears
  const targetCommitment = targetWeekly * 52 * targetYears

  let ageVerdict = 'Acceptable', ageColor = C.orange, ageScore = 0
  const tb = targetProfile?.bracket
  if ((tb === 'veteran' || tb === 'declining') && targetYears >= 3) {
    ageVerdict = 'Risky'; ageColor = '#e05050'; ageScore = -1
  } else if (tb === 'prime' && targetYears >= 4) {
    ageVerdict = 'Risky'; ageColor = '#e05050'; ageScore = -1
  } else if (tb === 'developing' && targetYears >= 2) {
    ageVerdict = 'Good Value'; ageColor = C.green; ageScore = 1
  }

  // Physical demand warning for primary role
  let physWarning = null
  if (roleFit.status === 'included' && targetProfile?.physNote) {
    const primaryRoleWeights = ROLES[roleFit.topRoles[0]?.roleKey]?.weights || {}
    if (rolePhysicalDemand(primaryRoleWeights) > 0.35) physWarning = targetProfile.physNote
  }

  const ageDimension = {
    currentAge, currentLabel: currentProfile?.label, currentColor: currentProfile?.color,
    targetAge, targetLabel: targetProfile?.label, targetColor: targetProfile?.color,
    currentCommitment, targetCommitment,
    verdict: ageVerdict, color: ageColor, score: ageScore,
    physWarning,
  }

  // ── Dimension 3: Cost ─────────────────────────────────────────────────
  const annualTargetWage = targetWeekly * 52
  let feeVerdict, feeColor, feeScore
  if (fee === 0) {
    feeVerdict = 'Free Transfer'; feeColor = C.green; feeScore = 1
  } else if (fee <= annualTargetWage) {
    feeVerdict = 'Affordable'; feeColor = C.green; feeScore = 1
  } else if (fee <= 3 * annualTargetWage) {
    feeVerdict = 'Stretched'; feeColor = C.orange; feeScore = 0
  } else {
    feeVerdict = 'Overpriced'; feeColor = '#e05050'; feeScore = -1
  }

  const wageDelta = targetWeekly - currentWeekly
  const totalCommitment = fee + targetCommitment

  const costDimension = { fee, feeVerdict, feeColor, feeScore, wageDelta, annualWageDelta: wageDelta * 52, totalCommitment, targetYears }

  // ── Dimension 4: Squad Fit ────────────────────────────────────────────
  let squadVerdict, squadColor, squadScore, squadMessage
  const pv = roleFit.primaryVerdict

  if (pv === 'N/A') {
    // Role Fit excluded (different positions) — squad fit is neutral, not scored
    squadVerdict = 'N/A'; squadColor = C.textMuted; squadScore = 0
    squadMessage = 'Squad fit assessment requires matching positions'
  } else if (pv === 'Downgrade' && targetSquadRole === 'starter') {
    squadVerdict = 'Mismatched'; squadColor = '#e05050'; squadScore = 0
    squadMessage = 'Signing a weaker player into a starting role'
  } else if ((pv === 'Upgrade' || pv === 'Lateral') && (targetSquadRole === 'backup' || targetSquadRole === 'rotation')) {
    squadVerdict = 'Mismatched'; squadColor = C.orange; squadScore = 0
    squadMessage = 'Risk of player unrest — upgrade quality deserves starter minutes'
  } else {
    squadVerdict = 'Right Role'; squadColor = C.green; squadScore = 1
    squadMessage = pv === 'Upgrade' ? 'Upgrade justifies the role' : 'Quality matches expected usage'
  }

  const squadDimension = { currentSquadRole, targetSquadRole, verdict: squadVerdict, color: squadColor, score: squadScore, message: squadMessage }

  // ── Overall verdict ───────────────────────────────────────────────────
  let totalScore = ageScore + feeScore + squadScore
  if (roleFit.status === 'included') totalScore += roleFit.primaryScore

  let overallVerdict, overallColor
  if (totalScore >= 2) { overallVerdict = 'Sign Him'; overallColor = C.green }
  else if (totalScore <= -1) { overallVerdict = 'Avoid'; overallColor = '#e05050' }
  else { overallVerdict = 'Proceed with Caution'; overallColor = C.orange }

  return { roleFit, age: ageDimension, cost: costDimension, squad: squadDimension, totalScore, overallVerdict, overallColor }
}
```

- [ ] **Step 2: Wire `runAnalysis` into the component's Analyse button click**

Inside `TransferAnalysisTool`, replace:
```js
onClick={() => setAnalysis(runAnalysis())}
```
With:
```js
onClick={() => setAnalysis(runAnalysis({
  currentPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears,
  targetPlayer, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears,
}))}
```

Also add the missing import at the top of the file (ROLES is needed by runAnalysis):
```js
import { getRolesForPosition, calcRoleScore, starsDisplay, scoreToStars, ROLES } from '../data/roleWeights.js'
```

- [ ] **Step 3: Build and verify (JSON output should show structured analysis)**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/tools/TransferAnalysisTool.jsx
git commit -m "feat: add Transfer Analysis engine (role fit, age, cost, squad dimensions)"
```

---

## Task 5: Verdict UI

**Files:**
- Modify: `src/tools/TransferAnalysisTool.jsx` — replace JSON debug output with full verdict UI

- [ ] **Step 1: Add `VerdictPanel` component (place before `TransferAnalysisTool`)**

```jsx
function VerdictPanel({ analysis, currentPlayer, targetPlayer }) {
  const { roleFit, age, cost, squad, overallVerdict, overallColor } = analysis
  const fmt = n => n != null ? n.toLocaleString() : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Role Fit */}
      <div style={{ background: C.surface, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Role Fit
        </div>
        {roleFit.status === 'excluded' ? (
          <div style={{ fontSize: 13, color: C.textSecondary }}>
            Different positions — role comparison not available
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roleFit.topRoles.map(r => {
                const diff = r.targetScore - r.currentScore
                const arrow = diff >= 0.5 ? '↑' : diff <= -0.5 ? '↓' : '→'
                const arrowColor = diff >= 0.5 ? C.green : diff <= -0.5 ? '#e05050' : C.orange
                return (
                  <div key={r.roleKey} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, fontSize: 13, color: C.text }}>{r.roleName}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary, minWidth: 60 }}>
                      {starsDisplay(r.currentScore)}
                    </div>
                    <div style={{ fontSize: 14, color: arrowColor, fontWeight: 700, minWidth: 16 }}>{arrow}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary, minWidth: 60 }}>
                      {starsDisplay(r.targetScore)}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: roleFit.primaryColor }}>
              {roleFit.primaryVerdict} on primary role
            </div>
          </>
        )}
      </div>

      {/* Age & Contract Value */}
      <div style={{ background: C.surface, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Age & Contract Value
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>{currentPlayer.name}</div>
            <div style={{ fontSize: 13, color: age.currentColor || C.text, fontWeight: 600 }}>{age.currentLabel || '—'}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>£{fmt(age.currentCommitment)} total</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>{targetPlayer.name}</div>
            <div style={{ fontSize: 13, color: age.targetColor || C.text, fontWeight: 600 }}>{age.targetLabel || '—'}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>£{fmt(age.targetCommitment)} total</div>
          </div>
        </div>
        {age.physWarning && (
          <div style={{ fontSize: 12, color: C.orange, background: `${C.orange}15`, borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
            ⚡ {age.physWarning}
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 600, color: age.color }}>{age.verdict}</div>
      </div>

      {/* Cost */}
      <div style={{ background: C.surface, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Cost
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textSecondary }}>Transfer fee</span>
            <span style={{ color: C.text }}>{cost.fee === 0 ? 'Free' : `£${fmt(cost.fee)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textSecondary }}>Wage change</span>
            <span style={{ color: cost.wageDelta > 0 ? '#e05050' : C.green }}>
              {cost.wageDelta > 0 ? `+£${fmt(cost.wageDelta)}/wk` : cost.wageDelta < 0 ? `-£${fmt(Math.abs(cost.wageDelta))}/wk` : 'No change'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textSecondary }}>Total commitment</span>
            <span style={{ color: C.text }}>£{fmt(cost.totalCommitment)} over {cost.targetYears}yr</span>
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: cost.feeColor }}>{cost.feeVerdict}</div>
      </div>

      {/* Squad Fit */}
      <div style={{ background: C.surface, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Squad Fit
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>
          {SQUAD_ROLES.find(r => r.key === squad.currentSquadRole)?.label || squad.currentSquadRole}
          {' → '}
          {SQUAD_ROLES.find(r => r.key === squad.targetSquadRole)?.label || squad.targetSquadRole}
        </div>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>{squad.message}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: squad.color }}>{squad.verdict}</div>
      </div>

      {/* Overall verdict */}
      <div style={{
        background: `${overallColor}15`,
        border: `2px solid ${overallColor}`,
        borderRadius: 16, padding: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Verdict
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: overallColor }}>{overallVerdict}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace the JSON debug output in `TransferAnalysisTool` with `VerdictPanel`**

Replace:
```jsx
{analysis && (
  <div style={{ background: C.gradientCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
    <pre style={{ color: C.textSecondary, fontSize: 12, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(analysis, null, 2)}
    </pre>
  </div>
)}
```
With:
```jsx
{analysis && (
  <VerdictPanel analysis={analysis} currentPlayer={currentPlayer} targetPlayer={targetPlayer} />
)}
```

- [ ] **Step 3: Build and verify**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/tools/TransferAnalysisTool.jsx
git commit -m "feat: add Transfer Analysis verdict UI with role fit, cost, age, and squad panels"
```

---

## Task 6: Save, Load, Delete Sessions + Export CSV

**Files:**
- Modify: `src/tools/TransferAnalysisTool.jsx`

- [ ] **Step 1: Add save/load/delete callbacks inside `TransferAnalysisTool`**

Add after the `analysis` state declaration:

```jsx
const saveAnalysis = useCallback(() => {
  if (!analysis) return
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    label: `${currentPlayer.name} vs ${targetPlayer.name}`,
    overallVerdict: analysis.overallVerdict,
    currentPlayer: {
      parsed: currentPlayer.parsed,
      selectedPosition: currentPosition,
      squadRole: currentSquadRole,
      wage: parseInt(currentWage) || 0,
      contractYears: parseInt(currentContractYears) || 0,
    },
    transferTarget: {
      parsed: targetPlayer.parsed,
      selectedPosition: targetPosition,
      squadRole: targetSquadRole,
      fee: parseInt(targetFee) || 0,
      wage: parseInt(targetWage) || 0,
      contractYears: parseInt(targetContractYears) || 0,
    },
  }
  const updated = [entry, ...savedAnalyses].slice(0, 10)
  setSavedAnalyses(updated)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}, [analysis, currentPlayer, targetPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears, savedAnalyses])

const loadAnalysis = useCallback((saved) => {
  const cp = saved.currentPlayer
  const tp = saved.transferTarget
  setCurrentPlayer({ file: null, preview: null, name: cp.parsed.playerName, parsed: cp.parsed, status: 'done', progress: 100 })
  setCurrentPosition(cp.selectedPosition)
  setCurrentSquadRole(cp.squadRole)
  setCurrentWage(String(cp.wage))
  setCurrentContractYears(String(cp.contractYears))
  setTargetPlayer({ file: null, preview: null, name: tp.parsed.playerName, parsed: tp.parsed, status: 'done', progress: 100 })
  setTargetPosition(tp.selectedPosition)
  setTargetSquadRole(tp.squadRole)
  setTargetFee(String(tp.fee))
  setTargetWage(String(tp.wage))
  setTargetContractYears(String(tp.contractYears))
  setAnalysis(runAnalysis({
    currentPlayer: { parsed: cp.parsed },
    currentPosition: cp.selectedPosition,
    currentSquadRole: cp.squadRole,
    currentWage: String(cp.wage),
    currentContractYears: String(cp.contractYears),
    targetPlayer: { parsed: tp.parsed },
    targetPosition: tp.selectedPosition,
    targetSquadRole: tp.squadRole,
    targetFee: String(tp.fee),
    targetWage: String(tp.wage),
    targetContractYears: String(tp.contractYears),
  }))
}, [])

const deleteAnalysis = useCallback((id) => {
  const updated = savedAnalyses.filter(a => a.id !== id)
  setSavedAnalyses(updated)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}, [savedAnalyses])
```

- [ ] **Step 2: Add `exportCSV` callback**

```jsx
const exportCSV = useCallback(() => {
  if (!analysis || !currentPlayer?.parsed || !targetPlayer?.parsed) return
  const cf = flattenAttributes(currentPlayer.parsed)
  const tf = flattenAttributes(targetPlayer.parsed)
  const allKeys = [...new Set([...Object.keys(cf), ...Object.keys(tf)])].sort()

  const roleHeaders = analysis.roleFit.status === 'included'
    ? analysis.roleFit.topRoles.flatMap(r => [`${r.roleName} (Current)`, `${r.roleName} (Target)`])
    : []

  const headers = [
    'Type', 'Name', 'Age', 'Position', 'Squad Role', 'Weekly Wage', 'Contract Years',
    'Fee', 'Total Commitment',
    ...allKeys.map(k => attrDisplayName(k)),
    ...roleHeaders,
    'Role Verdict', 'Age Verdict', 'Fee Verdict', 'Squad Verdict', 'Overall Verdict',
  ]

  const currentRow = [
    'Current', currentPlayer.name,
    currentPlayer.parsed.details?.age || '', currentPosition, currentSquadRole,
    currentWage, currentContractYears, '',
    (parseInt(currentWage) || 0) * 52 * (parseInt(currentContractYears) || 0),
    ...allKeys.map(k => cf[k] ?? ''),
    ...(analysis.roleFit.status === 'included'
      ? analysis.roleFit.topRoles.flatMap(r => [r.currentScore.toFixed(2), ''])
      : []),
    analysis.roleFit.primaryVerdict, analysis.age.verdict, analysis.cost.feeVerdict, analysis.squad.verdict, analysis.overallVerdict,
  ]

  const targetRow = [
    'Target', targetPlayer.name,
    targetPlayer.parsed.details?.age || '', targetPosition, targetSquadRole,
    targetWage, targetContractYears, targetFee,
    analysis.cost.totalCommitment,
    ...allKeys.map(k => tf[k] ?? ''),
    ...(analysis.roleFit.status === 'included'
      ? analysis.roleFit.topRoles.flatMap(r => ['', r.targetScore.toFixed(2)])
      : []),
    '', '', '', '', '',
  ]

  const csv = [headers, currentRow, targetRow]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fmc-transfer-${(targetPlayer.name || 'target').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}, [analysis, currentPlayer, targetPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears])
```

- [ ] **Step 3: Add Save and Export buttons below VerdictPanel + saved sessions list**

Below `{analysis && <VerdictPanel .../>}`, add:

```jsx
{analysis && (
  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
    <button onClick={saveAnalysis} style={{
      padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer',
    }}>
      Save Analysis
    </button>
    <button onClick={exportCSV} style={{
      padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer',
    }}>
      Export CSV
    </button>
  </div>
)}

{/* Saved sessions */}
{savedAnalyses.length > 0 && (
  <div style={{ marginTop: 40 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.textSecondary, marginBottom: 12 }}>
      Previous Analyses
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {savedAnalyses.map(s => (
        <div key={s.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: C.gradientCard, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '10px 16px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: C.text }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.textSecondary }}>
              {new Date(s.createdAt).toLocaleDateString()} · {s.overallVerdict}
            </div>
          </div>
          <button onClick={() => loadAnalysis(s)} style={{
            fontSize: 12, padding: '4px 14px', borderRadius: 7,
            background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer',
          }}>
            Load
          </button>
          <button onClick={() => deleteAnalysis(s.id)} style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 7,
            background: 'none', border: `1px solid ${C.border}`, color: C.textSecondary, cursor: 'pointer',
          }}>
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Build and verify**

```bash
PATH="/opt/homebrew/bin:$PATH" npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/tools/TransferAnalysisTool.jsx
git commit -m "feat: add Transfer Analysis save/load/delete sessions and CSV export"
```

---

## Task 7: Push and Smoke Test

- [ ] **Step 1: Push to remote**

```bash
git push
```

- [ ] **Step 2: Manual smoke test checklist**

Open the deployed app and verify:

1. `/tools` page — Transfer Analysis card shows as Live, link works
2. `/tools/transfer-analysis` — page loads with hero header and two scan panels
3. Upload a player screenshot to "Your Player" panel
   - Name + age + club extracted and displayed
   - Position auto-populated from parsed data
   - Replace button clears the panel
4. Upload a screenshot to "Transfer Target" panel
5. Fill all financial fields → Analyse button becomes active
6. Click Analyse — VerdictPanel renders with:
   - Role Fit section (stars for both, upgrade/lateral/downgrade labels)
   - Age & Contract Value (age bracket labels, total commitments)
   - Cost section (fee verdict, wage delta, total commitment)
   - Squad Fit (current role → target role, verdict message)
   - Overall verdict box (Sign Him / Proceed with Caution / Avoid)
7. Click Save Analysis → appears in Previous Analyses list
8. Reload page → Previous Analyses list persists
9. Load a saved analysis → all fields restore, analysis re-runs
10. Delete a saved analysis → removed from list
11. Export CSV → downloads `fmc-transfer-[name]-[date].csv` with correct headers and data
12. Test edge case: scan two players from different positions → "Different positions" message in Role Fit, overall verdict still shows

---

## Variable Ordering Note

Per project conventions: declare `const`/`let` variables before any callbacks that reference them. In `TransferAnalysisTool.jsx`, state setters (`setCurrentPosition`, etc.) must be declared before `scanCurrent`/`scanTarget` callbacks that call them. Keep all `useState` declarations at the top of the component before any `useCallback` hooks.
