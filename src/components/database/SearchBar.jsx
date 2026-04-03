import { useState } from 'react'
import C from '../../theme/colors'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
    }}>
      <span style={{
        position: 'absolute',
        left: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 18,
        color: C.textSecondary,
        pointerEvents: 'none',
      }}>&#128269;</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '12px 16px 12px 42px',
          background: C.surface,
          border: `1px solid ${focused ? C.blue : C.border}`,
          borderRadius: 12,
          color: C.text,
          fontSize: 15,
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
