/**
 * Player Archetypes — profile-based player types.
 *
 * Each archetype defines a weighted attribute profile that scores
 * how closely a player's stats match a known player type.
 *
 * Score is a weighted average (0–20), same scale as position scores.
 *
 * Fields:
 *   label       — display name
 *   description — one-line summary
 *   positions   — which FM26 position keys are a natural fit
 *   color       — accent color for display
 *   icon        — emoji shorthand
 *   weights     — attribute weights 0–1 (camelCase, flattenAttributes keys)
 *   traits      — PPMs that typify this archetype (informational only)
 *   source      — optional attribution { label, url } for externally-defined archetypes
 *
 * Full-back archetypes (The Pathfinder, The Flyer, The Imposter) are adapted from
 * the Scouted Football full-back framework:
 * https://scoutedftbl.com/an-introduction-to-full-back-archetypes/
 */

export const ARCHETYPES = {

  /* ── Forwards ─────────────────────────────────────────────────────── */

  powerForward: {
    label: 'Power Forward',
    description: 'Physical striker who presses relentlessly, wins second balls, and finishes with power',
    positions: ['ST'],
    color: '#ef4444',
    icon: '💪',
    peakAge: [20, 29],
    agingNote: 'Physical archetype — stamina, strength and pace decline significantly after 30',
    weights: {
      // Physical dominance — the core
      strength: 1.00,
      stamina: 1.00,
      workRate: 1.00,
      pace: 0.80,
      acceleration: 0.70,
      balance: 0.80,
      jumpingReach: 0.50,
      // Finishing & threat
      finishing: 0.90,
      composure: 0.70,
      offTheBall: 0.70,
      anticipation: 0.60,
      heading: 0.60,
      // Mental engine
      bravery: 0.80,
      aggression: 0.70,
      determination: 0.60,
      concentration: 0.40,
    },
    traits: [
      'Moves Into Channels',
      'Likes To Try To Beat Offside Trap',
      'Runs With Ball Often',
    ],
  },

  /* ── Midfielders / Specialists ────────────────────────────────────── */

  thePainter: {
    label: 'The Painter',
    description: 'Technical artist who creates with flair — dribbles, curls the ball, and makes the game look effortless',
    positions: ['AM', 'LW', 'RW', 'LM', 'RM', 'CM'],
    color: '#a855f7',
    icon: '🎨',
    peakAge: [20, 33],
    agingNote: 'Technical archetype — technique, flair and dribbling hold well into the early 30s',
    weights: {
      // The brush strokes
      technique: 1.00,
      flair: 1.00,
      dribbling: 0.90,
      firstTouch: 0.80,
      // Creative delivery
      crossing: 0.70,
      vision: 0.70,
      passing: 0.60,
      // Athletic canvas
      agility: 0.50,
      acceleration: 0.50,
      composure: 0.40,
      offTheBall: 0.30,
      longShots: 0.30,
    },
    traits: [
      'Curls Ball',
      'Runs With Ball Often',
      'Cuts Inside From Left',
      'Cuts Inside From Right',
      'Likes To Beat Offside Trap',
    ],
  },

  theHammer: {
    label: 'The Hammer',
    description: 'Deadly from dead balls and distance — hammers free kicks and long shots with power and precision',
    positions: ['AM', 'CM', 'LM', 'RM', 'LW', 'RW'],
    color: '#f59e0b',
    icon: '🔨',
    peakAge: [22, 35],
    agingNote: 'Technical archetype — free kick ability and technique age well into the mid-30s',
    weights: {
      // Dead ball mastery — the core
      freeKickTaking: 1.00,
      longShots: 1.00,
      technique: 0.90,
      corners: 0.80,
      // Creative delivery
      flair: 0.80,
      crossing: 0.70,
      // Supporting
      vision: 0.50,
      passing: 0.40,
      composure: 0.40,
      dribbling: 0.40,
      acceleration: 0.30,
      agility: 0.30,
    },
    traits: [
      'Tries Long Range Free Kicks',
      'Hits Free Kicks With Power',
      'Shoots From Distance',
      'Curls Ball',
    ],
  },

  /* ── Full-Back Archetypes (adapted from Scouted Football) ────────────
   * Source: https://scoutedftbl.com/an-introduction-to-full-back-archetypes/
   * ──────────────────────────────────────────────────────────────────── */

  thePathfinder: {
    label: 'The Pathfinder',
    description: 'Deep creator who unlocks defences from wide or defensive positions — elite passing range, vision and delivery make them a tactical weapon',
    positions: ['RB', 'LB', 'RWB', 'LWB', 'DM', 'CM'],
    color: '#3b82f6',
    icon: '🧭',
    peakAge: [20, 33],
    agingNote: 'Technical-mental archetype — passing range, vision and delivery hold well into the early 30s',
    source: { label: 'Scouted Football', url: 'https://scoutedftbl.com/an-introduction-to-full-back-archetypes/' },
    weights: {
      // The key — reading and releasing the game
      passing: 1.00,
      vision: 1.00,
      // Delivery weapons
      crossing: 0.90,
      technique: 0.80,
      firstTouch: 0.70,
      freeKickTaking: 0.60,
      corners: 0.60,
      longShots: 0.50,
      // Mental engine
      decisions: 0.70,
      anticipation: 0.60,
      composure: 0.50,
      // Athleticism to carry and press
      acceleration: 0.30,
      stamina: 0.30,
      workRate: 0.30,
    },
    traits: [
      'Tries Long Range Passes',
      'Likes To Switch Ball To Other Flank',
      'Plays Short Simple Passes',
      'Tries First Time Shots',
      'Curls Ball',
    ],
  },

  theFlyer: {
    label: 'The Flyer',
    description: 'Explosive overlapping full-back who attacks relentlessly with pace, stamina and crossing — a constant threat down the flank',
    positions: ['RB', 'LB', 'RWB', 'LWB'],
    color: '#f97316',
    icon: '⚡',
    peakAge: [19, 29],
    agingNote: 'Physical archetype — pace, acceleration and stamina decline significantly after 30',
    source: { label: 'Scouted Football', url: 'https://scoutedftbl.com/an-introduction-to-full-back-archetypes/' },
    weights: {
      // Speed weapons — the core
      pace: 1.00,
      acceleration: 1.00,
      stamina: 0.90,
      // Attacking output
      crossing: 0.80,
      dribbling: 0.70,
      offTheBall: 0.60,
      // Supporting
      agility: 0.50,
      workRate: 0.50,
      firstTouch: 0.40,
      technique: 0.30,
      anticipation: 0.30,
    },
    traits: [
      'Runs With Ball Often',
      'Gets Forward Whenever Possible',
      'Hugs Line',
    ],
  },

  theImposter: {
    label: 'The Imposter',
    description: 'Midfielder inverting from full-back — possession-focused and half-space dominant, building play rather than bombing forward',
    positions: ['RB', 'LB', 'RWB', 'LWB', 'DM', 'CM'],
    color: '#8b5cf6',
    icon: '🎭',
    peakAge: [21, 34],
    agingNote: 'Technical-mental archetype — composure, decisions and passing hold well into the early 30s',
    source: { label: 'Scouted Football', url: 'https://scoutedftbl.com/an-introduction-to-full-back-archetypes/' },
    weights: {
      // Possession engine — the core
      passing: 1.00,
      composure: 0.90,
      decisions: 0.90,
      // Technical quality
      technique: 0.80,
      firstTouch: 0.80,
      dribbling: 0.70,
      vision: 0.70,
      // Mental
      anticipation: 0.50,
      concentration: 0.40,
      positioning: 0.40,
      // Physical base
      stamina: 0.30,
      agility: 0.30,
    },
    traits: [
      'Plays Short Simple Passes',
      'Comes Deep To Get Ball',
      'Moves Into Channels',
    ],
  },

  theLauncher: {
    label: 'The Launcher',
    description: 'Long throw weapon who can hurl the ball deep into the box from the touchline — a tactical set piece threat',
    positions: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'DM'],
    color: '#06b6d4',
    icon: '🚀',
    peakAge: [22, 35],
    agingNote: 'Physical-technical archetype — long throw ability holds well into the mid-30s as strength and technique persist',
    weights: {
      // The throw — the core
      longThrows: 1.00,
      strength: 0.90,
      // Supporting physical
      jumpingReach: 0.60,
      balance: 0.50,
      stamina: 0.40,
      // Technical backing
      technique: 0.50,
      composure: 0.30,
    },
    traits: [
      'Hits Long Throws',
      'Tries Long Throws',
    ],
  },

}

const SET_PIECE_TRAITS = [
  'tries long range free kicks', 'hits free kicks with power', 'curls ball',
  'shoots from distance', 'hits long throws', 'tries long throws',
  'places shots', 'penalties', 'takes penalties',
]

const SET_PIECE_ATTR_THRESHOLD = 14

/**
 * Returns a bonus badge if the player qualifies as a Set Piece Specialist.
 * Requires high set piece attributes AND at least one relevant trait.
 */
export function getSetPieceBonus(flatAttrs, traits) {
  if (!flatAttrs) return null

  const { freeKickTaking = 0, corners = 0, longThrows = 0, penaltyTaking = 0 } = flatAttrs
  const topSetPiece = Math.max(freeKickTaking, corners, longThrows, penaltyTaking)
  if (topSetPiece < SET_PIECE_ATTR_THRESHOLD) return null

  const traitList = (traits || []).map(t => t.toLowerCase())
  const hasSetPieceTrait = SET_PIECE_TRAITS.some(t => traitList.some(pt => pt.includes(t)))
  if (!hasSetPieceTrait) return null

  return {
    key: 'setPieceSpecialist',
    label: 'Set Piece Specialist',
    icon: '⚽',
    color: '#22c55e',
    score: topSetPiece,
    attrs: [
      freeKickTaking >= SET_PIECE_ATTR_THRESHOLD && { key: 'freeKickTaking', label: 'Free Kicks', val: freeKickTaking },
      corners >= SET_PIECE_ATTR_THRESHOLD && { key: 'corners', label: 'Corners', val: corners },
      longThrows >= SET_PIECE_ATTR_THRESHOLD && { key: 'longThrows', label: 'Long Throws', val: longThrows },
      penaltyTaking >= SET_PIECE_ATTR_THRESHOLD && { key: 'penaltyTaking', label: 'Penalties', val: penaltyTaking },
    ].filter(Boolean),
  }
}

/**
 * Calculate how well a player's attributes match an archetype.
 * Returns a weighted average score on the 0–20 scale.
 */
export function calcArchetypeScore(archetypeKey, flatAttrs) {
  const archetype = ARCHETYPES[archetypeKey]
  if (!archetype || !flatAttrs) return 0

  let totalWeighted = 0
  let totalWeight = 0

  for (const [attr, weight] of Object.entries(archetype.weights)) {
    const val = flatAttrs[attr]
    if (val != null) {
      totalWeighted += val * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? Math.round((totalWeighted / totalWeight) * 10) / 10 : 0
}

/**
 * Score all archetypes for a player and return sorted array.
 * Optionally filter to archetypes that fit the player's positions.
 */
export function getTopArchetypes(flatAttrs, limit = 3) {
  return Object.entries(ARCHETYPES)
    .map(([key, arch]) => ({
      key,
      label: arch.label,
      description: arch.description,
      positions: arch.positions,
      color: arch.color,
      icon: arch.icon,
      traits: arch.traits,
      weights: arch.weights,
      peakAge: arch.peakAge,
      agingNote: arch.agingNote,
      source: arch.source || null,
      score: calcArchetypeScore(key, flatAttrs),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
