import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import C from '../../theme/colors'
import Section from '../../components/Section'
import GradientText from '../../components/GradientText'
import SearchBar from '../../components/database/SearchBar'
import FilterBar from '../../components/database/FilterBar'
import DataTable from '../../components/database/DataTable'
import { SAMPLE_PLAYERS, formatValue, getAttrColor } from '../../data/sampleData'

const positionOptions = ['GK', 'DC', 'DL', 'DR', 'DM', 'MC', 'ML', 'MR', 'AM C', 'AM L', 'AM R', 'ST']
const nationalityOptions = [...new Set(SAMPLE_PLAYERS.map(p => p.country.name))].sort()
const clubOptions = [...new Set(SAMPLE_PLAYERS.map(p => p.basedClub.name))].sort()

const filters = [
  { key: 'position', label: 'Position', options: positionOptions },
  { key: 'nationality', label: 'Nationality', options: nationalityOptions },
  { key: 'club', label: 'Club', options: clubOptions },
]

const columns = [
  { key: 'name', label: 'Player', width: '200px', render: (v, row) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: C.surfaceHover, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: C.textSecondary, flexShrink: 0,
      }}>
        {row.commonName?.[0] || row.name[0]}
      </div>
      <span style={{ fontWeight: 600 }}>{row.commonName || row.name}</span>
    </div>
  )},
  { key: 'age', label: 'Age', width: '60px', align: 'center' },
  { key: 'position', label: 'Pos', width: '70px', align: 'center', render: v => (
    <span style={{
      padding: '3px 8px',
      borderRadius: 6,
      background: `${C.blue}22`,
      color: C.blueLight,
      fontSize: 12,
      fontWeight: 600,
    }}>{v}</span>
  )},
  { key: 'basedClub', label: 'Club', render: v => v?.name || '-' },
  { key: 'country', label: 'Nation', render: v => v?.name || '-' },
  { key: 'currentAbility', label: 'CA', width: '60px', align: 'center', render: v => (
    <span style={{ fontWeight: 700, color: getAttrColor(Math.round(v / 10)) }}>{v}</span>
  )},
  { key: 'potentialAbility', label: 'PA', width: '60px', align: 'center', render: v => (
    <span style={{ fontWeight: 700, color: getAttrColor(Math.round(v / 10)) }}>{v}</span>
  )},
  { key: 'value', label: 'Value', width: '100px', align: 'right', render: v => (
    <span style={{ color: C.green }}>{formatValue(v?.amount)}</span>
  )},
]

export default function Players() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [filterVals, setFilterVals] = useState({})

  const filtered = useMemo(() => {
    return SAMPLE_PLAYERS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (filterVals.position && p.position !== filterVals.position) return false
      if (filterVals.nationality && p.country.name !== filterVals.nationality) return false
      if (filterVals.club && p.basedClub.name !== filterVals.club) return false
      return true
    })
  }, [search, filterVals])

  return (
    <>
      <div style={{ background: C.gradientHero, padding: '60px 24px 40px' }}>
        <Section style={{ padding: 0 }}>
          <Link to="/database" style={{
            color: C.textSecondary, textDecoration: 'none', fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16,
          }}>
            ← Back to Database
          </Link>
          <GradientText as="h1" style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            Players
          </GradientText>
          <p style={{ color: C.textSecondary, fontSize: 16, margin: '12px 0 0' }}>
            Search and explore FM26 player profiles, attributes, and stats.
          </p>
        </Section>
      </div>

      <Section style={{ paddingTop: 32 }}>
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search players..."
          />
          <FilterBar
            filters={filters}
            values={filterVals}
            onChange={(k, v) => setFilterVals(prev => ({ ...prev, [k]: v }))}
          />
        </div>

        <div style={{ marginBottom: 12, color: C.textSecondary, fontSize: 13 }}>
          {filtered.length} player{filtered.length !== 1 ? 's' : ''} found
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          onRowClick={row => nav(`/database/players/${row.id}`)}
        />
      </Section>
    </>
  )
}
