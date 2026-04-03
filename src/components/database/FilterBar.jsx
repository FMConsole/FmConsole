import { useState } from 'react'
import C from '../../theme/colors'

export default function FilterBar({ filters, values, onChange }) {
  // filters: [{ key, label, options: [string] }]
  // values: { [key]: string }
  // onChange: (key, value) => void
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      {filters.map(f => (
        <FilterSelect
          key={f.key}
          label={f.label}
          options={f.options}
          value={values[f.key] || ''}
          onChange={v => onChange(f.key, v)}
        />
      ))}
    </div>
  )
}

function FilterSelect({ label, options, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: '10px 14px',
        background: C.surface,
        border: `1px solid ${focused ? C.blue : C.border}`,
        borderRadius: 10,
        color: value ? C.text : C.textSecondary,
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        minWidth: 130,
      }}
    >
      <option value="">{label}</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}
