import { useState, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { extractText } from './scanner/ocr.js'
import {
  parseAttributes, flattenAttributes, attrDisplayName,
} from './scanner/attributeParser.js'
import { POSITION_LIST } from '../data/positionWeights.js'
import {
  getRolesForPosition, calcRoleScore, starsDisplay, scoreToStars, ROLES,
} from '../data/roleWeights.js'
import { getAgeProfile, rolePhysicalDemand } from '../data/playerHelpers.js'

/* ── Constants ───────────────────────────────────────────────────────── */

const SQUAD_ROLES = [
  { key: 'starter',  label: 'Starter',     expectedGames: '30+' },
  { key: 'backup',   label: 'Backup',       expectedGames: '20–29' },
  { key: 'rotation', label: 'Rotation',     expectedGames: '10–19' },
  { key: 'depth',    label: 'Squad Depth',  expectedGames: '<10' },
]

const STORAGE_KEY = 'fmc_transfer_analyses'

/* ── Analysis engine (pure function) ────────────────────────────────── */

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
      roleName: ROLES[roleKey]?.label || roleKey,
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

  const costDimension = {
    fee, feeVerdict, feeColor, feeScore,
    wageDelta, annualWageDelta: wageDelta * 52,
    totalCommitment, targetYears,
  }

  // ── Dimension 4: Squad Fit ────────────────────────────────────────────
  let squadVerdict, squadColor, squadScore, squadMessage
  const pv = roleFit.primaryVerdict

  if (pv === 'N/A') {
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

  const squadDimension = {
    currentSquadRole, targetSquadRole,
    verdict: squadVerdict, color: squadColor, score: squadScore, message: squadMessage,
  }

  // ── Overall verdict ───────────────────────────────────────────────────
  let totalScore = ageScore + feeScore + squadScore
  if (roleFit.status === 'included') totalScore += roleFit.primaryScore

  let overallVerdict, overallColor
  if (totalScore >= 2) { overallVerdict = 'Sign Him'; overallColor = C.green }
  else if (totalScore <= -1) { overallVerdict = 'Avoid'; overallColor = '#e05050' }
  else { overallVerdict = 'Proceed with Caution'; overallColor = C.orange }

  return { roleFit, age: ageDimension, cost: costDimension, squad: squadDimension, totalScore, overallVerdict, overallColor }
}

/* ── ScanPanel component ─────────────────────────────────────────────── */

function ScanPanel({
  label, player, position, squadRole, wage, contractYears,
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

  if (!player) return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        background: dragOver ? `${C.blue}10` : 'transparent',
        border: `2px dashed ${dragOver ? C.blue : C.border}`,
        borderRadius: 12, padding: 32, minHeight: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.4 }}>🔬</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
      <div style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center', maxWidth: 220 }}>
        Drop FM player screenshot or click to upload
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
      />
    </div>
  )

  if (player.status === 'scanning') return (
    <div style={{ padding: '24px 0', textAlign: 'center' }}>
      {player.preview && (
        <img src={player.preview} alt="" style={{
          width: '100%', maxHeight: 120, objectFit: 'cover',
          borderRadius: 8, marginBottom: 12, opacity: 0.6,
        }} />
      )}
      <div style={{ height: 5, borderRadius: 3, background: C.surfaceHover, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${player.progress}%`, height: '100%', background: C.blue, transition: 'width 0.3s', borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 12, color: C.textSecondary }}>Analyzing... {player.progress}%</div>
    </div>
  )

  if (player.status === 'error') return (
    <div style={{ padding: '24px 0', textAlign: 'center' }}>
      <div style={{ color: '#e05050', marginBottom: 12, fontSize: 13 }}>Scan failed — try again</div>
      <button onClick={onReset} style={{
        padding: '8px 20px', borderRadius: 8,
        background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer', fontSize: 13,
      }}>
        Retry
      </button>
    </div>
  )

  const inputStyle = {
    display: 'block', marginTop: 4, width: '100%', padding: '7px 10px',
    borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`,
    color: C.text, fontSize: 13, boxSizing: 'border-box',
  }
  const labelStyle = { fontSize: 12, color: C.textSecondary, display: 'block' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{player.name || '—'}</div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
            {[
              player.parsed?.details?.age && `Age ${player.parsed.details.age}`,
              player.parsed?.details?.currentClub,
              player.parsed?.details?.nationality,
            ].filter(Boolean).join(' · ')}
          </div>
        </div>
        <button onClick={onReset} style={{
          fontSize: 11, color: C.textSecondary, background: 'none',
          border: `1px solid ${C.border}`, borderRadius: 6,
          padding: '3px 10px', cursor: 'pointer', flexShrink: 0,
        }}>
          Replace
        </button>
      </div>

      <label style={labelStyle}>
        Position
        <select value={position} onChange={e => onPosition(e.target.value)} style={inputStyle}>
          <option value="">Select position</option>
          {POSITION_LIST.map(p => (
            <option key={p.key} value={p.key}>{p.label} ({p.key})</option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Squad Role
        <select value={squadRole} onChange={e => onSquadRole(e.target.value)} style={inputStyle}>
          {SQUAD_ROLES.map(r => (
            <option key={r.key} value={r.key}>{r.label} ({r.expectedGames} games)</option>
          ))}
        </select>
      </label>

      {showFee && (
        <label style={labelStyle}>
          Transfer Fee <span style={{ color: C.textMuted }}>(0 = free transfer)</span>
          <input
            type="number" min="0" value={fee} onChange={e => onFee(e.target.value)}
            placeholder="e.g. 5000000"
            style={inputStyle}
          />
        </label>
      )}

      <label style={labelStyle}>
        Weekly Wage
        <input
          type="number" min="0" value={wage} onChange={e => onWage(e.target.value)}
          placeholder="e.g. 25000"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Contract Years
        <input
          type="number" min="0" max="10" value={contractYears} onChange={e => onContractYears(e.target.value)}
          placeholder="e.g. 3"
          style={inputStyle}
        />
      </label>
    </div>
  )
}

/* ── VerdictPanel component ──────────────────────────────────────────── */

function VerdictPanel({ analysis, currentPlayer, targetPlayer }) {
  const { roleFit, age, cost, squad, overallVerdict, overallColor } = analysis
  const fmt = n => (n != null ? n.toLocaleString() : '—')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Role Fit */}
      <div style={{ background: C.surface, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          Role Fit
        </div>
        {roleFit.status === 'excluded' ? (
          <div style={{ fontSize: 13, color: C.textSecondary }}>
            These players play different positions — role comparison not available
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
                    <div style={{ fontSize: 12, color: C.textSecondary, minWidth: 72, textAlign: 'right' }}>{starsDisplay(r.currentScore)}</div>
                    <div style={{ fontSize: 14, color: arrowColor, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{arrow}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary, minWidth: 72 }}>{starsDisplay(r.targetScore)}</div>
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
          Age &amp; Contract Value
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>{currentPlayer.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: age.currentColor || C.text }}>{age.currentLabel || '—'}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>£{fmt(age.currentCommitment)} total</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>{targetPlayer.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: age.targetColor || C.text }}>{age.targetLabel || '—'}</div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>£{fmt(age.targetCommitment)} total</div>
          </div>
        </div>
        {age.physWarning && (
          <div style={{ fontSize: 12, color: C.orange, background: `${C.orange}18`, borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.textSecondary }}>Transfer fee</span>
            <span style={{ color: C.text }}>{cost.fee === 0 ? 'Free' : `£${fmt(cost.fee)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.textSecondary }}>Wage change</span>
            <span style={{ color: cost.wageDelta > 0 ? '#e05050' : cost.wageDelta < 0 ? C.green : C.textSecondary }}>
              {cost.wageDelta > 0 ? `+£${fmt(cost.wageDelta)}/wk` : cost.wageDelta < 0 ? `-£${fmt(Math.abs(cost.wageDelta))}/wk` : 'No change'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
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
        <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 6 }}>
          {SQUAD_ROLES.find(r => r.key === squad.currentSquadRole)?.label || squad.currentSquadRole}
          {' → '}
          {SQUAD_ROLES.find(r => r.key === squad.targetSquadRole)?.label || squad.targetSquadRole}
        </div>
        <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 10 }}>{squad.message}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: squad.color }}>{squad.verdict}</div>
      </div>

      {/* Overall verdict */}
      <div style={{
        background: `${overallColor}12`,
        border: `2px solid ${overallColor}`,
        borderRadius: 16, padding: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Verdict
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: overallColor }}>{overallVerdict}</div>
      </div>
    </div>
  )
}

/* ── Main tool component ─────────────────────────────────────────────── */

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
    setCurrentPosition('')
    setCurrentSquadRole('rotation')
    setCurrentWage('')
    setCurrentContractYears('')
    setAnalysis(null)
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
    setTargetPosition('')
    setTargetSquadRole('starter')
    setTargetFee('')
    setTargetWage('')
    setTargetContractYears('')
    setAnalysis(null)
  }, [])

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

  const loadSaved = useCallback((saved) => {
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

  const deleteSaved = useCallback((id) => {
    const updated = savedAnalyses.filter(a => a.id !== id)
    setSavedAnalyses(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [savedAnalyses])

  const exportCSV = useCallback(() => {
    if (!analysis || !currentPlayer?.parsed || !targetPlayer?.parsed) return
    const cf = flattenAttributes(currentPlayer.parsed)
    const tf = flattenAttributes(targetPlayer.parsed)
    const allKeys = [...new Set([...Object.keys(cf), ...Object.keys(tf)])].sort()

    const roleHeaders = analysis.roleFit.status === 'included'
      ? analysis.roleFit.topRoles.flatMap(r => [`${r.roleName} (Current)`, `${r.roleName} (Target)`])
      : []

    const headers = [
      'Type', 'Name', 'Age', 'Position', 'Squad Role',
      'Weekly Wage', 'Contract Years', 'Fee', 'Total Commitment',
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

  const canAnalyse = (
    currentPlayer?.status === 'done' && currentPosition &&
    currentWage && currentContractYears &&
    targetPlayer?.status === 'done' && targetPosition &&
    targetWage && targetContractYears
  )

  const handleAnalyse = useCallback(() => {
    setAnalysis(runAnalysis({
      currentPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears,
      targetPlayer, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears,
    }))
  }, [currentPlayer, currentPosition, currentSquadRole, currentWage, currentContractYears,
    targetPlayer, targetPosition, targetSquadRole, targetFee, targetWage, targetContractYears])

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>

      {/* Two scan panels */}
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
          onClick={handleAnalyse}
          style={{
            padding: '14px 52px', borderRadius: 12, fontSize: 15, fontWeight: 700,
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

      {/* Verdict */}
      {analysis && (
        <>
          <VerdictPanel analysis={analysis} currentPlayer={currentPlayer} targetPlayer={targetPlayer} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
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
        </>
      )}

      {/* Saved analyses */}
      {savedAnalyses.length > 0 && (
        <div style={{ marginTop: 48 }}>
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
                <button onClick={() => loadSaved(s)} style={{
                  fontSize: 12, padding: '4px 14px', borderRadius: 7,
                  background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer',
                }}>
                  Load
                </button>
                <button onClick={() => deleteSaved(s.id)} style={{
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

    </div>
  )
}
