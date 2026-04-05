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

/**
 * Physical demand of a role: ratio of (pace + acceleration + agility + stamina) weights
 * to total weight. Returns 0–1.
 */
export function rolePhysicalDemand(roleWeights) {
  const speedWeight = PHYSICAL_SPEED_KEYS.reduce((s, k) => s + (roleWeights[k] || 0), 0)
  const total = Object.values(roleWeights).reduce((s, w) => s + w, 0)
  return total > 0 ? speedWeight / total : 0
}
