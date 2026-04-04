import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import C from '../theme/colors'
import { ATTRIBUTE_GROUPS, TRAITS, CATEGORY_COLORS, ATTR_KEY_TO_LABEL } from '../data/traitData'
import { extractText } from './scanner/ocr.js'
import { parseAttributes, flattenAttributes } from './scanner/attributeParser.js'

const GROUP_META = {
  technical: { label: 'Technical', color: C.blue },
  mental: { label: 'Mental', color: '#FFD600' },
  physical: { label: 'Physical', color: C.green },
}

function getValueColor(value, threshold) {
  if (!value && value !== 0) return C.textMuted
  if (value >= threshold) return C.green
  if (value >= threshold - 2) return C.orange
  return '#e05050'
}

function AttributeGroup({ groupKey, attrs, values, onChange, collapsed, onToggle }) {
  const meta = GROUP_META[groupKey]
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: `${meta.color}12`, border: `1px solid ${meta.color}30`,
          borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{attrs.length}</span>
          <span style={{ color: C.textMuted, fontSize: 12, transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
      </button>
      {!collapsed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px', padding: '10px 4px 4px' }}>
          {attrs.map(attr => (
            <div key={attr.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <label style={{ fontSize: 12, color: C.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 8 }}>
                {attr.label}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={values[attr.key]}
                onChange={e => onChange(attr.key, e.target.value)}
                inputMode="numeric"
                style={{
                  width: 46, padding: '5px 4px', textAlign: 'center',
                  background: C.surfaceLight, color: C.text, border: `1px solid ${C.border}`,
                  borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif',
                  outline: 'none', flexShrink: 0,
                }}
                onFocus={e => e.currentTarget.style.borderColor = meta.color}
                onBlur={e => e.currentTarget.style.borderColor = C.border}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TraitCard({ trait, threshold }) {
  const catColor = CATEGORY_COLORS[trait.category] || C.blue
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: 20, marginBottom: 12, transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
            padding: '3px 10px', borderRadius: 6, background: `${catColor}18`, color: catColor,
          }}>
            {trait.category}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{trait.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Avg</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{trait.avg.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Max</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{trait.max}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Min</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: getValueColor(trait.min, threshold) }}>{trait.min}</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12,
      }}>
        {trait.attrDetails.map(a => (
          <div key={a.key} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6, background: C.bgLight,
            border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 11, color: C.textSecondary }}>{a.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: getValueColor(a.value, threshold) }}>{a.value || '—'}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, margin: 0 }}>{trait.description}</p>
    </div>
  )
}

export default function TraitRecommenderTool() {
  const [attributes, setAttributes] = useState(() => {
    const initial = {}
    for (const group of Object.values(ATTRIBUTE_GROUPS)) {
      for (const attr of group) {
        initial[attr.key] = ''
      }
    }
    return initial
  })

  const [threshold, setThreshold] = useState(11)
  const [collapsed, setCollapsed] = useState({ technical: false, mental: false, physical: false })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleAttrChange = (key, value) => {
    if (value === '') {
      setAttributes(prev => ({ ...prev, [key]: '' }))
      return
    }
    const num = parseInt(value)
    if (isNaN(num)) return
    setAttributes(prev => ({ ...prev, [key]: Math.min(20, Math.max(1, num)) }))
  }

  const [scanStatus, setScanStatus] = useState(null) // null | 'scanning' | 'done' | 'error'
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMessage, setScanMessage] = useState('')
  const fileInputRef = useRef(null)

  // Map parser output keys to trait recommender keys
  const PARSER_TO_TRAIT = {
    freeKicks: 'freeKickTaking', // parser uses "freeKicks", trait tool uses "freeKickTaking"
  }

  const handleScreenshotUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return

    setScanStatus('scanning')
    setScanProgress(0)
    setScanMessage('Processing screenshot...')

    try {
      const ocrResult = await extractText(file, {
        onProgress: (pct) => setScanProgress(pct),
        onStatus: (msg) => setScanMessage(msg),
      })

      const text = typeof ocrResult === 'string' ? ocrResult : (ocrResult.text || '')
      const overlay = ocrResult.overlay || null
      const visionData = ocrResult.visionData || null
      const parsed = parseAttributes(text, overlay, visionData)
      const flat = flattenAttributes(parsed)

      // Map parsed attributes into the trait recommender's attribute keys
      const newAttrs = { ...attributes }
      let filled = 0

      for (const [parserKey, value] of Object.entries(flat)) {
        const traitKey = PARSER_TO_TRAIT[parserKey] || parserKey
        if (traitKey in newAttrs) {
          newAttrs[traitKey] = value
          filled++
        }
      }

      setAttributes(newAttrs)
      setScanStatus('done')
      setScanMessage(`Found ${filled} attributes`)
      setScanProgress(100)

      // Auto-clear status after 3s
      setTimeout(() => setScanStatus(null), 3000)
    } catch {
      setScanStatus('error')
      setScanMessage('Failed to scan. Try a clearer screenshot.')
      setTimeout(() => setScanStatus(null), 4000)
    }
  }, [attributes])

  const clearAll = () => {
    const cleared = {}
    for (const group of Object.values(ATTRIBUTE_GROUPS)) {
      for (const attr of group) {
        cleared[attr.key] = ''
      }
    }
    setAttributes(cleared)
    setScanStatus(null)
  }

  const hasAnyValue = Object.values(attributes).some(v => v !== '' && v > 0)

  const recommendations = useMemo(() => {
    if (!hasAnyValue) return []

    return TRAITS.map(trait => {
      const values = trait.requiredAttributes.map(key => {
        const val = attributes[key]
        return val === '' ? 0 : Number(val)
      })

      const nonZero = values.filter(v => v > 0)
      if (nonZero.length === 0) return null

      const avg = values.reduce((s, v) => s + v, 0) / trait.requiredAttributes.length
      const max = Math.max(...nonZero)
      const min = Math.min(...nonZero)

      const attrDetails = trait.requiredAttributes.map(key => ({
        key,
        label: ATTR_KEY_TO_LABEL[key] || key,
        value: attributes[key] === '' ? null : Number(attributes[key]),
      }))

      return { ...trait, avg, max, min, attrDetails }
    })
      .filter(r => r !== null && r.avg >= threshold)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 15)
  }, [attributes, threshold, hasAnyValue])

  const filledCount = Object.values(attributes).filter(v => v !== '').length
  const totalCount = Object.values(ATTRIBUTE_GROUPS).reduce((s, g) => s + g.length, 0)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
      gap: 32,
      alignItems: 'start',
    }}>
      {/* Left: Input Panel */}
      <div style={isMobile ? {} : { position: 'sticky', top: 90 }}>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 20, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Player Attributes</h3>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{filledCount}/{totalCount}</span>
          </div>

          {/* Threshold */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: `${C.orange}12`, border: `1px solid ${C.orange}30`,
            borderRadius: 10, marginBottom: 16,
          }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.orange }}>Desired Min Att.</label>
            <input
              type="number"
              min={1}
              max={20}
              value={threshold}
              onChange={e => {
                const v = parseInt(e.target.value)
                if (!isNaN(v)) setThreshold(Math.min(20, Math.max(1, v)))
              }}
              style={{
                width: 50, padding: '5px 4px', textAlign: 'center',
                background: C.surfaceLight, color: C.orange, border: `1px solid ${C.orange}40`,
                borderRadius: 6, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Screenshot Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) handleScreenshotUpload(file)
            }}
            style={{
              padding: '14px 16px', marginBottom: 16,
              background: scanStatus === 'scanning' ? `${C.blue}12` : `${C.purple}08`,
              border: `1px dashed ${scanStatus === 'done' ? C.green : scanStatus === 'error' ? C.orange : C.purple}40`,
              borderRadius: 10, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            {scanStatus === 'scanning' ? (
              <>
                <div style={{ width: '100%', height: 4, borderRadius: 2, background: C.surfaceHover, overflow: 'hidden' }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', background: C.blue, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: C.textMuted }}>{scanMessage}</span>
              </>
            ) : scanStatus === 'done' ? (
              <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{scanMessage}</span>
            ) : scanStatus === 'error' ? (
              <span style={{ fontSize: 12, color: C.orange }}>{scanMessage}</span>
            ) : (
              <>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>Upload FM Screenshot</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>Drop or click to auto-fill attributes</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleScreenshotUpload(file)
                e.target.value = ''
              }}
            />
          </div>

          {/* Attribute Groups */}
          {Object.entries(ATTRIBUTE_GROUPS).map(([groupKey, attrs]) => (
            <AttributeGroup
              key={groupKey}
              groupKey={groupKey}
              attrs={attrs}
              values={attributes}
              onChange={handleAttrChange}
              collapsed={collapsed[groupKey]}
              onToggle={() => setCollapsed(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))}
            />
          ))}

          <button
            onClick={clearAll}
            style={{
              width: '100%', padding: '10px 0', marginTop: 8,
              background: 'none', border: `1px solid ${C.border}`, borderRadius: 10,
              color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.textSecondary}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Right: Results Panel */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Recommended Traits</h3>
          {hasAnyValue && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 6,
              background: `${C.green}18`, color: C.green,
            }}>
              {recommendations.length} trait{recommendations.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {!hasAnyValue && (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧬</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Enter Player Attributes</h4>
            <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
              Fill in the player's attributes on the left panel and set your desired minimum attribute threshold to see which traits are recommended.
            </p>
          </div>
        )}

        {hasAnyValue && recommendations.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>No Traits Match</h4>
            <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
              No traits meet the minimum threshold of {threshold}. Try lowering the desired minimum attribute or entering more attribute values.
            </p>
          </div>
        )}

        {recommendations.map(trait => (
          <TraitCard key={trait.name} trait={trait} threshold={threshold} />
        ))}
      </div>
    </div>
  )
}
