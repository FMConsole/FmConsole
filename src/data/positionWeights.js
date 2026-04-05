/**
 * Position-based attribute weights for FM26 positions.
 *
 * Positions match FM26 exactly: GK, CB, LB, RB, LWB, RWB, DM, CM, LM, RM, AM, LW, RW, ST
 *
 * Each position maps attributes to a weight (0–1):
 *   1.0 = critical for the position
 *   0.8 = very important
 *   0.6 = important
 *   0.4 = useful
 *   0.2 = minor relevance
 */

const POSITIONS = {
  GK: {
    label: 'Goalkeeper',
    weights: {
      reflexes: 1.0, handling: 1.0, oneOnOnes: 0.9, commandOfArea: 0.9,
      positioning: 0.8, anticipation: 0.8, concentration: 0.8, decisions: 0.7,
      composure: 0.7, jumpingReach: 0.7, kicking: 0.6, throwing: 0.6,
      agility: 0.5, acceleration: 0.4, pace: 0.3,
    },
  },

  CB: {
    label: 'Centre Back',
    weights: {
      heading: 1.0, tackling: 1.0, marking: 0.9, positioning: 0.9,
      strength: 0.9, jumpingReach: 0.8, concentration: 0.8, anticipation: 0.8,
      composure: 0.7, decisions: 0.7, bravery: 0.7, aggression: 0.5,
      pace: 0.5, acceleration: 0.4, passing: 0.4, firstTouch: 0.3,
    },
  },

  LB: {
    label: 'Left Back',
    weights: {
      pace: 0.9, stamina: 0.9, tackling: 0.9, marking: 0.8,
      positioning: 0.8, anticipation: 0.8, concentration: 0.8, workRate: 0.8,
      acceleration: 0.7, crossing: 0.7, decisions: 0.7, strength: 0.6,
      offTheBall: 0.5, passing: 0.5, technique: 0.5, firstTouch: 0.4,
    },
  },

  RB: {
    label: 'Right Back',
    weights: {
      pace: 0.9, stamina: 0.9, tackling: 0.9, marking: 0.8,
      positioning: 0.8, anticipation: 0.8, concentration: 0.8, workRate: 0.8,
      acceleration: 0.7, crossing: 0.7, decisions: 0.7, strength: 0.6,
      offTheBall: 0.5, passing: 0.5, technique: 0.5, firstTouch: 0.4,
    },
  },

  LWB: {
    label: 'Left Wing Back',
    weights: {
      pace: 1.0, stamina: 1.0, crossing: 0.9, workRate: 0.9,
      acceleration: 0.9, tackling: 0.7, offTheBall: 0.7, dribbling: 0.7,
      anticipation: 0.7, decisions: 0.7, firstTouch: 0.6, technique: 0.6,
      passing: 0.6, marking: 0.5, positioning: 0.5,
    },
  },

  RWB: {
    label: 'Right Wing Back',
    weights: {
      pace: 1.0, stamina: 1.0, crossing: 0.9, workRate: 0.9,
      acceleration: 0.9, tackling: 0.7, offTheBall: 0.7, dribbling: 0.7,
      anticipation: 0.7, decisions: 0.7, firstTouch: 0.6, technique: 0.6,
      passing: 0.6, marking: 0.5, positioning: 0.5,
    },
  },

  DM: {
    label: 'Defensive Midfielder',
    weights: {
      tackling: 1.0, positioning: 1.0, anticipation: 0.9, concentration: 0.9,
      stamina: 0.9, decisions: 0.8, teamwork: 0.8, marking: 0.7,
      composure: 0.7, strength: 0.7, passing: 0.7, workRate: 0.7,
      vision: 0.4, firstTouch: 0.4, technique: 0.4,
    },
  },

  CM: {
    label: 'Central Midfielder',
    weights: {
      passing: 1.0, decisions: 0.9, vision: 0.9, stamina: 0.9,
      workRate: 0.9, firstTouch: 0.8, technique: 0.8, teamwork: 0.8,
      anticipation: 0.7, concentration: 0.7, composure: 0.7, tackling: 0.6,
      offTheBall: 0.5, pace: 0.4, acceleration: 0.4, dribbling: 0.4,
    },
  },

  LM: {
    label: 'Left Midfielder',
    weights: {
      crossing: 1.0, stamina: 1.0, workRate: 0.9, pace: 0.8,
      acceleration: 0.8, offTheBall: 0.8, firstTouch: 0.7, decisions: 0.7,
      passing: 0.7, anticipation: 0.7, dribbling: 0.6, technique: 0.6,
      vision: 0.6, tackling: 0.5, positioning: 0.4,
    },
  },

  RM: {
    label: 'Right Midfielder',
    weights: {
      crossing: 1.0, stamina: 1.0, workRate: 0.9, pace: 0.8,
      acceleration: 0.8, offTheBall: 0.8, firstTouch: 0.7, decisions: 0.7,
      passing: 0.7, anticipation: 0.7, dribbling: 0.6, technique: 0.6,
      vision: 0.6, tackling: 0.5, positioning: 0.4,
    },
  },

  AM: {
    label: 'Attacking Midfielder',
    weights: {
      decisions: 1.0, passing: 1.0, firstTouch: 0.9, technique: 0.9,
      vision: 0.9, dribbling: 0.8, composure: 0.8, anticipation: 0.8,
      offTheBall: 0.7, stamina: 0.7, pace: 0.6, acceleration: 0.6,
      flair: 0.6, finishing: 0.5, agility: 0.5,
    },
  },

  LW: {
    label: 'Left Winger',
    weights: {
      pace: 1.0, acceleration: 1.0, dribbling: 0.9, offTheBall: 0.9,
      stamina: 0.9, crossing: 0.8, firstTouch: 0.8, technique: 0.8,
      agility: 0.7, flair: 0.7, finishing: 0.6, anticipation: 0.6,
      decisions: 0.6, workRate: 0.6, passing: 0.5,
    },
  },

  RW: {
    label: 'Right Winger',
    weights: {
      pace: 1.0, acceleration: 1.0, dribbling: 0.9, offTheBall: 0.9,
      stamina: 0.9, crossing: 0.8, firstTouch: 0.8, technique: 0.8,
      agility: 0.7, flair: 0.7, finishing: 0.6, anticipation: 0.6,
      decisions: 0.6, workRate: 0.6, passing: 0.5,
    },
  },

  ST: {
    label: 'Striker',
    weights: {
      finishing: 1.0, offTheBall: 1.0, anticipation: 0.9, composure: 0.9,
      pace: 0.8, acceleration: 0.8, firstTouch: 0.8, decisions: 0.7,
      heading: 0.7, strength: 0.6, dribbling: 0.6, technique: 0.6,
      agility: 0.5, jumpingReach: 0.5, flair: 0.4,
    },
  },
}

/**
 * Get the top attributes for a position, sorted by weight.
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
 */
export function getAttrWeight(posKey, attrKey) {
  return POSITIONS[posKey]?.weights[attrKey] || 0
}

/**
 * Calculate weighted position score for a player.
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

/** List of all FM26 position options for the UI. */
export const POSITION_LIST = Object.entries(POSITIONS).map(([key, val]) => ({
  key,
  label: val.label,
}))

export default POSITIONS
