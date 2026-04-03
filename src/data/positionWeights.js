/**
 * Position-based attribute weights for FM player comparison.
 *
 * Each position maps attributes to a weight (0–1):
 *   1.0 = critical for the position
 *   0.8 = very important
 *   0.6 = important
 *   0.4 = useful
 *   0.2 = minor relevance
 *   0   = not included (irrelevant)
 *
 * Weights are based on FM26 attribute importance per position/role.
 */

const POSITIONS = {
  ST: {
    label: 'Striker',
    weights: {
      finishing: 1.0, composure: 0.9, offTheBall: 0.9, firstTouch: 0.8,
      pace: 0.8, acceleration: 0.8, heading: 0.7, dribbling: 0.7,
      technique: 0.7, anticipation: 0.7, decisions: 0.6, strength: 0.6,
      balance: 0.5, agility: 0.5, determination: 0.5, flair: 0.4,
      longShots: 0.4, vision: 0.3, passing: 0.3, stamina: 0.4,
      workRate: 0.4, bravery: 0.4, concentration: 0.3,
    },
  },

  CF: {
    label: 'Centre Forward',
    weights: {
      finishing: 1.0, firstTouch: 0.9, offTheBall: 0.9, composure: 0.9,
      technique: 0.8, heading: 0.8, strength: 0.8, dribbling: 0.7,
      passing: 0.7, vision: 0.7, pace: 0.6, anticipation: 0.7,
      decisions: 0.7, balance: 0.6, acceleration: 0.6, flair: 0.6,
      determination: 0.5, bravery: 0.5, teamwork: 0.5, longShots: 0.4,
      stamina: 0.5, workRate: 0.5, agility: 0.4,
    },
  },

  AM: {
    label: 'Attacking Midfielder',
    weights: {
      vision: 1.0, passing: 0.9, technique: 0.9, decisions: 0.9,
      firstTouch: 0.9, dribbling: 0.8, composure: 0.8, flair: 0.8,
      offTheBall: 0.7, anticipation: 0.7, finishing: 0.6, acceleration: 0.6,
      agility: 0.6, pace: 0.5, balance: 0.5, longShots: 0.6,
      determination: 0.5, teamwork: 0.5, workRate: 0.5, stamina: 0.5,
      concentration: 0.4, bravery: 0.3, strength: 0.3,
    },
  },

  CM: {
    label: 'Central Midfielder',
    weights: {
      passing: 1.0, decisions: 0.9, vision: 0.9, technique: 0.8,
      firstTouch: 0.8, teamwork: 0.8, stamina: 0.8, composure: 0.7,
      anticipation: 0.7, concentration: 0.7, workRate: 0.7, tackling: 0.6,
      positioning: 0.6, determination: 0.6, balance: 0.5, strength: 0.5,
      dribbling: 0.5, offTheBall: 0.5, bravery: 0.5, pace: 0.4,
      acceleration: 0.4, agility: 0.4, flair: 0.4, longShots: 0.4,
    },
  },

  DM: {
    label: 'Defensive Midfielder',
    weights: {
      tackling: 1.0, positioning: 0.9, anticipation: 0.9, decisions: 0.8,
      teamwork: 0.8, concentration: 0.8, composure: 0.7, passing: 0.7,
      workRate: 0.7, strength: 0.7, stamina: 0.7, marking: 0.6,
      bravery: 0.6, determination: 0.6, firstTouch: 0.5, balance: 0.5,
      aggression: 0.5, heading: 0.5, technique: 0.4, vision: 0.4,
      pace: 0.3, acceleration: 0.3, jumpingReach: 0.4,
    },
  },

  LW: {
    label: 'Left Winger',
    weights: {
      pace: 1.0, dribbling: 1.0, acceleration: 0.9, technique: 0.8,
      crossing: 0.8, flair: 0.8, agility: 0.8, offTheBall: 0.7,
      firstTouch: 0.7, finishing: 0.7, passing: 0.6, balance: 0.6,
      vision: 0.6, anticipation: 0.6, decisions: 0.5, composure: 0.5,
      stamina: 0.5, workRate: 0.5, determination: 0.4, teamwork: 0.4,
      concentration: 0.3, strength: 0.3,
    },
  },

  RW: {
    label: 'Right Winger',
    weights: {
      pace: 1.0, dribbling: 1.0, acceleration: 0.9, technique: 0.8,
      crossing: 0.8, flair: 0.8, agility: 0.8, offTheBall: 0.7,
      firstTouch: 0.7, finishing: 0.7, passing: 0.6, balance: 0.6,
      vision: 0.6, anticipation: 0.6, decisions: 0.5, composure: 0.5,
      stamina: 0.5, workRate: 0.5, determination: 0.4, teamwork: 0.4,
      concentration: 0.3, strength: 0.3,
    },
  },

  LB: {
    label: 'Left Back',
    weights: {
      tackling: 0.9, positioning: 0.8, pace: 0.8, stamina: 0.8,
      crossing: 0.7, teamwork: 0.8, workRate: 0.8, anticipation: 0.7,
      concentration: 0.7, marking: 0.7, acceleration: 0.7, decisions: 0.6,
      strength: 0.6, technique: 0.5, passing: 0.5, dribbling: 0.5,
      balance: 0.5, agility: 0.5, heading: 0.5, bravery: 0.5,
      determination: 0.5, composure: 0.4, jumpingReach: 0.4,
    },
  },

  RB: {
    label: 'Right Back',
    weights: {
      tackling: 0.9, positioning: 0.8, pace: 0.8, stamina: 0.8,
      crossing: 0.7, teamwork: 0.8, workRate: 0.8, anticipation: 0.7,
      concentration: 0.7, marking: 0.7, acceleration: 0.7, decisions: 0.6,
      strength: 0.6, technique: 0.5, passing: 0.5, dribbling: 0.5,
      balance: 0.5, agility: 0.5, heading: 0.5, bravery: 0.5,
      determination: 0.5, composure: 0.4, jumpingReach: 0.4,
    },
  },

  CB: {
    label: 'Centre Back',
    weights: {
      heading: 1.0, tackling: 1.0, positioning: 0.9, marking: 0.9,
      strength: 0.9, jumpingReach: 0.8, composure: 0.8, concentration: 0.8,
      bravery: 0.8, anticipation: 0.7, decisions: 0.7, teamwork: 0.7,
      determination: 0.6, aggression: 0.6, pace: 0.5, balance: 0.5,
      acceleration: 0.4, passing: 0.4, firstTouch: 0.3, vision: 0.3,
      workRate: 0.5, stamina: 0.4, naturalFitness: 0.4,
    },
  },

  WB: {
    label: 'Wing Back',
    weights: {
      pace: 0.9, stamina: 0.9, crossing: 0.9, workRate: 0.9,
      acceleration: 0.8, tackling: 0.7, dribbling: 0.7, teamwork: 0.8,
      positioning: 0.7, technique: 0.6, passing: 0.6, anticipation: 0.7,
      concentration: 0.6, decisions: 0.6, offTheBall: 0.6, agility: 0.6,
      balance: 0.5, strength: 0.5, marking: 0.5, bravery: 0.5,
      determination: 0.5, firstTouch: 0.5, naturalFitness: 0.5,
    },
  },

  GK: {
    label: 'Goalkeeper',
    weights: {
      // GK-specific attributes (from goalkeeping group)
      reflexes: 1.0, handling: 1.0, commandOfArea: 0.9, communication: 0.8,
      oneOnOnes: 0.8, aerialAbility: 0.8, kicking: 0.7, throwing: 0.7,
      rushingOut: 0.6, eccentricity: 0.3, tendencyToPunch: 0.4,
      // Outfield attributes relevant to GKs
      positioning: 0.7, composure: 0.7, concentration: 0.8,
      anticipation: 0.7, decisions: 0.6, agility: 0.6,
      firstTouch: 0.4, passing: 0.4, strength: 0.3,
    },
  },
}

/**
 * Get the top attributes for a position, sorted by weight.
 * @param {string} posKey - Position key (e.g. 'ST', 'CB')
 * @param {number} [limit=12] - Max attributes to return
 * @returns {Array<{key: string, weight: number}>}
 */
export function getKeyAttrsForPosition(posKey, limit = 12) {
  const pos = POSITIONS[posKey]
  if (!pos) return []

  return Object.entries(pos.weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, weight]) => ({ key, weight }))
}

/**
 * Get the weight of an attribute for a position.
 * Returns 0 if not defined.
 */
export function getAttrWeight(posKey, attrKey) {
  return POSITIONS[posKey]?.weights[attrKey] || 0
}

/**
 * Calculate weighted position score for a player.
 * @param {string} posKey - Position key
 * @param {object} flatAttrs - Flat attribute object { finishing: 14, pace: 12, ... }
 * @returns {number} Weighted average (0-20)
 */
export function calcPositionScore(posKey, flatAttrs) {
  const pos = POSITIONS[posKey]
  if (!pos) return 0

  let totalWeighted = 0
  let totalWeight = 0

  for (const [attr, weight] of Object.entries(pos.weights)) {
    const val = flatAttrs[attr]
    if (val !== undefined && val !== null) {
      totalWeighted += val * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? Math.round((totalWeighted / totalWeight) * 10) / 10 : 0
}

/** List of all position options for the UI dropdown. */
export const POSITION_LIST = Object.entries(POSITIONS).map(([key, val]) => ({
  key,
  label: val.label,
}))

export default POSITIONS
