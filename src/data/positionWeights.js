/**
 * Position-based attribute weights for FM26 positions.
 * Source: "Weighted Attributes.xlsx" — raw weights normalised to 0–1 per position (÷ max).
 *
 * Excel positions mapped to FM26 keys:
 *   GK→GK, DR→RB, DL→LB, DC→CB, DM→DM, MC→CM,
 *   AMR→RM, AML→LM, AMRLC/ST→AM, STC→ST
 *   LWB/RWB derived as average of FB + wide-mid columns.
 *   LW/RW use the same wide-mid profile as LM/RM.
 *
 * Note: GK-specific attributes (reflexes, handling, oneOnOnes, etc.) will be absent
 * from outfield player scans, so outfield players will score low at GK naturally.
 */

// side: which foot dominates for this position ('left'|'right'|'neutral')
// weakerFootWeight: how much the weaker/opposite foot matters (from Excel, normalised)
const POSITIONS = {
  GK: {
    label: 'Goalkeeper', side: 'neutral', weakerFootWeight: 0.29,
    // Raw max = 14 (One on Ones)
    weights: {
      oneOnOnes: 1.00, decisions: 0.71, reflexes: 0.57, handling: 0.57,
      agility: 0.57, aerialAbility: 0.43, commandOfArea: 0.43,
      concentration: 0.43, bravery: 0.43, acceleration: 0.43,
      communication: 0.36, positioning: 0.36, kicking: 0.36,
      strength: 0.29, throwing: 0.21, passing: 0.21, pace: 0.21,
      composure: 0.14, balance: 0.14, leadership: 0.14, teamwork: 0.14,
    },
  },

  CB: {
    label: 'Centre Back', side: 'neutral', weakerFootWeight: 0.45,
    // Raw max = 10 (Decisions)
    weights: {
      decisions: 1.00, marking: 0.80, positioning: 0.80,
      acceleration: 0.60, agility: 0.60, strength: 0.60, jumpingReach: 0.60,
      heading: 0.50, tackling: 0.50, pace: 0.50, anticipation: 0.50,
      concentration: 0.40, stamina: 0.30,
      composure: 0.20, bravery: 0.20, firstTouch: 0.20, passing: 0.20,
      balance: 0.20, leadership: 0.20, workRate: 0.20,
    },
  },

  LB: {
    label: 'Left Back', side: 'left', weakerFootWeight: 0.50,
    // Raw max = 8 (Acceleration)
    weights: {
      acceleration: 1.00, stamina: 0.88, pace: 0.75,
      agility: 0.63, decisions: 0.63, strength: 0.50,
      concentration: 0.38, anticipation: 0.38, crossing: 0.38,
      firstTouch: 0.38, positioning: 0.38, passing: 0.38,
      tackling: 0.38, technique: 0.38,
      offTheBall: 0.25, composure: 0.25, balance: 0.25,
      teamwork: 0.25, vision: 0.25, marking: 0.25,
      workRate: 0.25, dribbling: 0.25,
    },
  },

  RB: {
    label: 'Right Back', side: 'right', weakerFootWeight: 0.50,
    // Raw max = 8 (Acceleration)
    weights: {
      acceleration: 1.00, stamina: 0.88, pace: 0.75,
      agility: 0.63, decisions: 0.63, strength: 0.50,
      concentration: 0.38, anticipation: 0.38, crossing: 0.38,
      firstTouch: 0.38, positioning: 0.38, passing: 0.38,
      tackling: 0.38, technique: 0.38,
      offTheBall: 0.25, composure: 0.25, balance: 0.25,
      teamwork: 0.25, vision: 0.25, marking: 0.25,
      workRate: 0.25, dribbling: 0.25,
    },
  },

  LWB: {
    label: 'Left Wing Back', side: 'left', weakerFootWeight: 0.53,
    // Derived: average of LB (DL) and LM (AML) raw weights, max = 9
    weights: {
      acceleration: 1.00, pace: 0.89, stamina: 0.78,
      agility: 0.61, decisions: 0.56, crossing: 0.44, firstTouch: 0.44,
      technique: 0.39, strength: 0.39, dribbling: 0.39,
      anticipation: 0.33, composure: 0.28, concentration: 0.28,
      workRate: 0.28, vision: 0.28, passing: 0.28, tackling: 0.28,
      positioning: 0.22, offTheBall: 0.22, balance: 0.22, teamwork: 0.22,
    },
  },

  RWB: {
    label: 'Right Wing Back', side: 'right', weakerFootWeight: 0.53,
    // Derived: average of RB (DR) and RM (AMR) raw weights, max = 9
    weights: {
      acceleration: 1.00, pace: 0.89, stamina: 0.78,
      agility: 0.61, decisions: 0.56, crossing: 0.44, firstTouch: 0.44,
      technique: 0.39, strength: 0.39, dribbling: 0.39,
      anticipation: 0.33, composure: 0.28, concentration: 0.28,
      workRate: 0.28, vision: 0.28, passing: 0.28, tackling: 0.28,
      positioning: 0.22, offTheBall: 0.22, balance: 0.22, teamwork: 0.22,
    },
  },

  DM: {
    label: 'Defensive Midfielder', side: 'neutral', weakerFootWeight: 0.63,
    // Raw max = 8 (Decisions)
    weights: {
      decisions: 1.00, tackling: 0.88,
      acceleration: 0.75, agility: 0.75,
      anticipation: 0.63, strength: 0.63, positioning: 0.63,
      pace: 0.50, stamina: 0.50, firstTouch: 0.50, vision: 0.50,
      passing: 0.50, workRate: 0.50,
      concentration: 0.38, technique: 0.38, marking: 0.38, longShots: 0.38,
      composure: 0.25, dribbling: 0.25, balance: 0.25, teamwork: 0.25,
    },
  },

  CM: {
    label: 'Central Midfielder', side: 'neutral', weakerFootWeight: 0.83,
    // Raw max = 9 (Acceleration)
    weights: {
      acceleration: 1.00, pace: 0.78,
      agility: 0.67, stamina: 0.67, decisions: 0.67, vision: 0.67,
      firstTouch: 0.56, technique: 0.56,
      passing: 0.44,
      composure: 0.33, dribbling: 0.33, finishing: 0.33,
      offTheBall: 0.33, workRate: 0.33, anticipation: 0.33, strength: 0.33,
      concentration: 0.22, positioning: 0.22, tackling: 0.22,
      balance: 0.22, teamwork: 0.22,
    },
  },

  LM: {
    label: 'Left Midfielder', side: 'left', weakerFootWeight: 0.55,
    // From AML column, raw max = 10
    weights: {
      acceleration: 1.00, pace: 1.00, stamina: 0.70, agility: 0.60,
      crossing: 0.50, dribbling: 0.50, firstTouch: 0.50, decisions: 0.50,
      technique: 0.40,
      strength: 0.30, vision: 0.30, anticipation: 0.30,
      workRate: 0.30, composure: 0.30,
      finishing: 0.20, tackling: 0.20, longShots: 0.20,
      offTheBall: 0.20, balance: 0.20, teamwork: 0.20, concentration: 0.20,
    },
  },

  RM: {
    label: 'Right Midfielder', side: 'right', weakerFootWeight: 0.55,
    // From AMR column, raw max = 10
    weights: {
      acceleration: 1.00, pace: 1.00, stamina: 0.70, agility: 0.60,
      crossing: 0.50, dribbling: 0.50, firstTouch: 0.50, decisions: 0.50,
      technique: 0.40,
      strength: 0.30, vision: 0.30, anticipation: 0.30,
      workRate: 0.30, composure: 0.30,
      finishing: 0.20, tackling: 0.20, longShots: 0.20,
      offTheBall: 0.20, balance: 0.20, teamwork: 0.20, concentration: 0.20,
    },
  },

  AM: {
    label: 'Attacking Midfielder', side: 'neutral', weakerFootWeight: 0.55,
    // From AMRLC/ST column (same as wide-mid in user's Excel), raw max = 10
    weights: {
      acceleration: 1.00, pace: 1.00, stamina: 0.70, agility: 0.60,
      crossing: 0.50, dribbling: 0.50, firstTouch: 0.50, decisions: 0.50,
      technique: 0.40,
      strength: 0.30, vision: 0.30, anticipation: 0.30,
      workRate: 0.30, composure: 0.30,
      finishing: 0.20, tackling: 0.20, longShots: 0.20,
      offTheBall: 0.20, balance: 0.20, teamwork: 0.20, concentration: 0.20,
    },
  },

  LW: {
    label: 'Left Winger', side: 'left', weakerFootWeight: 0.55,
    // Same wide-mid profile as LM in user's Excel
    weights: {
      acceleration: 1.00, pace: 1.00, stamina: 0.70, agility: 0.60,
      crossing: 0.50, dribbling: 0.50, firstTouch: 0.50, decisions: 0.50,
      technique: 0.40,
      strength: 0.30, vision: 0.30, anticipation: 0.30,
      workRate: 0.30, composure: 0.30,
      finishing: 0.20, tackling: 0.20, longShots: 0.20,
      offTheBall: 0.20, balance: 0.20, teamwork: 0.20, concentration: 0.20,
    },
  },

  RW: {
    label: 'Right Winger', side: 'right', weakerFootWeight: 0.55,
    // Same wide-mid profile as RM in user's Excel
    weights: {
      acceleration: 1.00, pace: 1.00, stamina: 0.70, agility: 0.60,
      crossing: 0.50, dribbling: 0.50, firstTouch: 0.50, decisions: 0.50,
      technique: 0.40,
      strength: 0.30, vision: 0.30, anticipation: 0.30,
      workRate: 0.30, composure: 0.30,
      finishing: 0.20, tackling: 0.20, longShots: 0.20,
      offTheBall: 0.20, balance: 0.20, teamwork: 0.20, concentration: 0.20,
    },
  },

  ST: {
    label: 'Striker', side: 'neutral', weakerFootWeight: 0.75,
    // From STC column, raw max = 10 (Acceleration)
    weights: {
      acceleration: 1.00, finishing: 0.80, pace: 0.70,
      agility: 0.60, composure: 0.60, heading: 0.60, firstTouch: 0.60,
      offTheBall: 0.60, strength: 0.60, stamina: 0.60,
      anticipation: 0.50, dribbling: 0.50, jumpingReach: 0.50, decisions: 0.50,
      technique: 0.40,
      workRate: 0.20, concentration: 0.20, positioning: 0.20,
      vision: 0.20, passing: 0.20, longShots: 0.20, balance: 0.20,
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

/**
 * Multiplier (0–1) applied to a position score based on foot preference.
 * - Left-sided positions penalise right-footed players (weaker left foot).
 * - Right-sided positions penalise left-footed players (weaker right foot).
 * - Neutral positions use the average of both feet.
 * Returns 1.0 if foot data is unavailable.
 */
export function footAdjustment(posKey, preferredFoot) {
  const pos = POSITIONS[posKey]
  if (!pos || !preferredFoot || typeof preferredFoot !== 'object') return 1.0
  const { leftFoot, rightFoot } = preferredFoot
  if (leftFoot == null || rightFoot == null) return 1.0

  let footScore
  if (pos.side === 'left') {
    footScore = leftFoot / 5
  } else if (pos.side === 'right') {
    footScore = rightFoot / 5
  } else {
    footScore = (leftFoot + rightFoot) / 10
  }

  return Math.max(0.5, 1 - pos.weakerFootWeight * (1 - footScore))
}

/** List of all FM26 position options for the UI. */
export const POSITION_LIST = Object.entries(POSITIONS).map(([key, val]) => ({
  key,
  label: val.label,
}))
