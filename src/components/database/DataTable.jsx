import { useState } from 'react'
import C from '../../theme/colors'

export default function DataTable({ columns, rows, onRowClick }) {
  // columns: [{ key, label, width?, align?, render? }]
  // rows: array of objects
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [hovRow, setHovRow] = useState(null)

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey]
        if (typeof va === 'number') return sortAsc ? va - vb : vb - va
        return sortAsc
          ? String(va || '').localeCompare(String(vb || ''))
          : String(vb || '').localeCompare(String(va || ''))
      })
    : rows

  const handleSort = key => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14,
        fontFamily: 'inherit',
      }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  padding: '14px 16px',
                  textAlign: col.align || 'left',
                  color: C.textSecondary,
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  background: C.surface,
                  borderBottom: `1px solid ${C.border}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  width: col.width || 'auto',
                }}
              >
                {col.label}
                {sortKey === col.key && (
                  <span style={{ marginLeft: 4, fontSize: 10 }}>
                    {sortAsc ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              onMouseEnter={() => setHovRow(i)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                background: hovRow === i ? C.surfaceHover : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.15s ease',
              }}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${C.border}`,
                    color: C.text,
                    textAlign: col.align || 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{
                padding: 40,
                textAlign: 'center',
                color: C.textSecondary,
              }}>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
