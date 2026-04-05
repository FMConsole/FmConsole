/**
 * FM26 Role Weights — In-Possession (IP) roles
 *
 * Weights sourced from FM26 Editor attribute weightings.
 * Normalized to 0–1 scale (FM uses 1–10, divided by 10).
 *
 * Each role defines:
 *   label       — display name
 *   positions   — which position keys this role applies to
 *   duty        — Attack / Support / Defend (primary duty shown)
 *   description — one-line summary
 *   weights     — attribute weights 0–1 (camelCase keys matching flattenAttributes output)
 */

export const ROLES = {

  /* ═══════════════════════════════════════════════════════
     STRIKER (ST)
  ═══════════════════════════════════════════════════════ */

  poacher: {
    label: 'Poacher',
    positions: ['ST'],
    duty: 'Attack',
    description: 'Pure box striker who lives off scraps and through balls',
    // Weights match FM26 Striker position data: Acceleration=10, Finishing=8, Pace=7
    weights: {
      acceleration: 1.0, finishing: 0.8, pace: 0.7,
      composure: 0.6, agility: 0.6, stamina: 0.6, strength: 0.6,
      firstTouch: 0.6, offTheBall: 0.6, heading: 0.6,
      jumpingReach: 0.5, decisions: 0.5, anticipation: 0.5, dribbling: 0.5,
      technique: 0.4, penaltyTaking: 0.3,
      concentration: 0.2, balance: 0.2, workRate: 0.2, positioning: 0.2,
      vision: 0.2, passing: 0.2, longShots: 0.2, crossing: 0.2,
      bravery: 0.1, teamwork: 0.1, tackling: 0.1, marking: 0.1,
    },
  },

  targetForward: {
    label: 'Target Forward',
    positions: ['ST'],
    duty: 'Support',
    description: 'Aerial threat who holds up play and brings others into the game',
    weights: {
      heading: 1.0, jumpingReach: 0.9, strength: 0.9, bravery: 0.8,
      firstTouch: 0.8, composure: 0.7, finishing: 0.7, agility: 0.6,
      decisions: 0.6, anticipation: 0.6, offTheBall: 0.6, technique: 0.5,
      balance: 0.5, stamina: 0.5, workRate: 0.5, teamwork: 0.5,
      acceleration: 0.4, pace: 0.4, dribbling: 0.4, passing: 0.4,
      concentration: 0.3, vision: 0.2, positioning: 0.2, longShots: 0.2,
    },
  },

  centreForward: {
    label: 'Centre Forward',
    positions: ['ST', 'CF'],
    duty: 'Support',
    description: 'Complete striker combining aerial threat with technical quality',
    weights: {
      finishing: 0.9, offTheBall: 0.9, heading: 0.8, firstTouch: 0.8,
      composure: 0.8, acceleration: 0.8, pace: 0.7, strength: 0.7,
      agility: 0.7, technique: 0.7, dribbling: 0.7, decisions: 0.7,
      jumpingReach: 0.6, anticipation: 0.6, passing: 0.6, vision: 0.5,
      balance: 0.5, stamina: 0.5, workRate: 0.5, bravery: 0.5,
      concentration: 0.4, teamwork: 0.4, longShots: 0.4, flair: 0.3,
    },
  },

  deepLyingForward: {
    label: 'Deep-Lying Forward',
    positions: ['ST', 'CF'],
    duty: 'Support',
    description: 'Drops into midfield to link play and create for teammates',
    weights: {
      passing: 1.0, vision: 0.9, technique: 0.9, firstTouch: 0.9,
      decisions: 0.8, dribbling: 0.8, composure: 0.8, offTheBall: 0.7,
      teamwork: 0.7, anticipation: 0.7, finishing: 0.6, strength: 0.6,
      flair: 0.5, balance: 0.5, agility: 0.5, workRate: 0.5,
      pace: 0.4, acceleration: 0.4, stamina: 0.4, concentration: 0.4,
      longShots: 0.3, heading: 0.3, bravery: 0.3,
    },
  },

  channelForward: {
    label: 'Channel Forward',
    positions: ['ST'],
    duty: 'Attack',
    description: 'Exploits the channel between CB and FB — needs movement, touch and composure to finish',
    weights: {
      offTheBall: 0.9, anticipation: 0.9, finishing: 0.9,
      composure: 0.8, firstTouch: 0.8, decisions: 0.8, technique: 0.8,
      positioning: 0.8,
      pace: 0.7, acceleration: 0.6, agility: 0.6, dribbling: 0.6, balance: 0.6,
      concentration: 0.5, stamina: 0.5, strength: 0.5,
      workRate: 0.4, vision: 0.3,
      passing: 0.2, bravery: 0.2,
    },
  },

  falseNine: {
    label: 'False Nine',
    positions: ['ST', 'AM'],
    duty: 'Support',
    description: 'Drops deep to create overloads and play through the lines',
    weights: {
      vision: 1.0, passing: 0.9, technique: 0.9, dribbling: 0.9,
      firstTouch: 0.9, composure: 0.8, decisions: 0.8, anticipation: 0.7,
      flair: 0.7, offTheBall: 0.6, agility: 0.6, balance: 0.6,
      finishing: 0.5, pace: 0.5, acceleration: 0.5, workRate: 0.5,
      teamwork: 0.5, concentration: 0.4, longShots: 0.4, stamina: 0.4,
      bravery: 0.2, strength: 0.2,
    },
  },

  pressingForward: {
    label: 'Pressing Forward',
    positions: ['ST', 'CF'],
    duty: 'Defend',
    description: 'High-energy disruptor who hunts the ball and presses defenders',
    weights: {
      workRate: 1.0, stamina: 0.9, pace: 0.8, acceleration: 0.8,
      determination: 0.8, aggression: 0.7, teamwork: 0.7, anticipation: 0.7,
      offTheBall: 0.7, bravery: 0.6, finishing: 0.6, decisions: 0.6,
      concentration: 0.5, firstTouch: 0.5, strength: 0.5, positioning: 0.5,
      tackling: 0.4, marking: 0.4, dribbling: 0.4, composure: 0.4,
      technique: 0.3, passing: 0.3,
    },
  },

  /* ═══════════════════════════════════════════════════════
     CENTRE FORWARD / ATTACKING MIDFIELDER (CF / AM)
  ═══════════════════════════════════════════════════════ */

  shadowStriker: {
    label: 'Shadow Striker',
    positions: ['AM', 'CF'],
    duty: 'Attack',
    description: 'Ghosting runner who arrives late into the box from deep',
    weights: {
      offTheBall: 1.0, anticipation: 0.9, finishing: 0.9, pace: 0.8,
      acceleration: 0.8, composure: 0.8, decisions: 0.7, dribbling: 0.7,
      firstTouch: 0.7, technique: 0.7, flair: 0.6, agility: 0.6,
      balance: 0.5, vision: 0.5, passing: 0.5, longShots: 0.5,
      concentration: 0.4, stamina: 0.4, workRate: 0.4, bravery: 0.3,
    },
  },

  trequartista: {
    label: 'Trequartista',
    positions: ['AM', 'CF'],
    duty: 'Attack',
    description: 'Creative free role with license to roam and make magic',
    weights: {
      vision: 1.0, technique: 1.0, flair: 0.9, dribbling: 0.9,
      firstTouch: 0.9, composure: 0.8, decisions: 0.8, passing: 0.8,
      offTheBall: 0.7, anticipation: 0.7, agility: 0.7, balance: 0.6,
      finishing: 0.6, longShots: 0.6, pace: 0.5, acceleration: 0.5,
      concentration: 0.4, workRate: 0.2, teamwork: 0.2, stamina: 0.3,
    },
  },

  enganche: {
    label: 'Enganche',
    positions: ['AM'],
    duty: 'Support',
    description: 'Static orchestrator who pulls strings between the lines',
    weights: {
      vision: 1.0, passing: 1.0, technique: 0.9, firstTouch: 0.9,
      composure: 0.9, decisions: 0.8, flair: 0.7, anticipation: 0.7,
      concentration: 0.7, longShots: 0.6, dribbling: 0.5, teamwork: 0.5,
      balance: 0.4, agility: 0.4, workRate: 0.2, stamina: 0.2,
      pace: 0.2, acceleration: 0.2,
    },
  },

  attackingMidfielder: {
    label: 'Attacking Midfielder',
    positions: ['AM'],
    duty: 'Support',
    description: 'Box-to-box creator who links midfield and attack',
    weights: {
      vision: 0.9, passing: 0.9, technique: 0.9, decisions: 0.9,
      firstTouch: 0.9, composure: 0.8, dribbling: 0.8, flair: 0.7,
      offTheBall: 0.7, anticipation: 0.7, finishing: 0.6, longShots: 0.6,
      agility: 0.6, pace: 0.5, balance: 0.5, acceleration: 0.5,
      teamwork: 0.5, stamina: 0.5, workRate: 0.5, concentration: 0.4,
      bravery: 0.3, strength: 0.3,
    },
  },

  /* ═══════════════════════════════════════════════════════
     WINGERS (LW / RW)
  ═══════════════════════════════════════════════════════ */

  winger: {
    label: 'Winger',
    positions: ['LW', 'RW', 'LB', 'RB', 'WB'],
    duty: 'Attack',
    description: 'Traditional wide threat who attacks the byline and crosses',
    weights: {
      pace: 1.0, acceleration: 0.9, crossing: 0.9, dribbling: 0.9,
      technique: 0.8, agility: 0.8, flair: 0.8, offTheBall: 0.7,
      firstTouch: 0.7, balance: 0.7, stamina: 0.6, decisions: 0.5,
      passing: 0.6, workRate: 0.5, finishing: 0.5, vision: 0.5,
      determination: 0.4, teamwork: 0.4, concentration: 0.3, strength: 0.3,
    },
  },

  insideForward: {
    label: 'Inside Forward',
    positions: ['LW', 'RW'],
    duty: 'Attack',
    description: 'Inverted winger who cuts inside to shoot or create',
    weights: {
      finishing: 0.9, dribbling: 0.9, technique: 0.9, pace: 0.9,
      acceleration: 0.8, flair: 0.8, agility: 0.8, firstTouch: 0.8,
      offTheBall: 0.7, longShots: 0.7, composure: 0.7, balance: 0.6,
      decisions: 0.6, vision: 0.6, passing: 0.5, anticipation: 0.5,
      workRate: 0.4, stamina: 0.4, determination: 0.4, teamwork: 0.3,
    },
  },

  invertedWinger: {
    label: 'Inverted Winger',
    positions: ['LW', 'RW'],
    duty: 'Support',
    description: 'Drifts inside to link play and create central opportunities',
    weights: {
      dribbling: 1.0, technique: 0.9, pace: 0.9, acceleration: 0.8,
      flair: 0.8, passing: 0.8, vision: 0.7, firstTouch: 0.7,
      agility: 0.7, balance: 0.6, decisions: 0.6, offTheBall: 0.6,
      finishing: 0.5, longShots: 0.5, composure: 0.5, crossing: 0.4,
      workRate: 0.4, stamina: 0.4, teamwork: 0.4, concentration: 0.3,
    },
  },

  raumdeuter: {
    label: 'Raumdeuter',
    positions: ['LW', 'RW'],
    duty: 'Attack',
    description: 'Space exploiter who reads the game to find pockets behind the line',
    weights: {
      offTheBall: 1.0, anticipation: 0.9, finishing: 0.9, pace: 0.8,
      acceleration: 0.8, concentration: 0.8, decisions: 0.7, composure: 0.7,
      firstTouch: 0.7, agility: 0.6, technique: 0.6, balance: 0.5,
      determination: 0.5, vision: 0.4, dribbling: 0.4, workRate: 0.3,
      teamwork: 0.3, stamina: 0.4,
    },
  },

  widePlaymaker: {
    label: 'Wide Playmaker',
    positions: ['LW', 'RW', 'AM'],
    duty: 'Support',
    description: 'Creative wide option who dictates tempo from the flanks',
    weights: {
      vision: 1.0, passing: 1.0, technique: 0.9, firstTouch: 0.9,
      decisions: 0.9, dribbling: 0.8, composure: 0.8, flair: 0.7,
      anticipation: 0.7, crossing: 0.6, pace: 0.5, agility: 0.5,
      balance: 0.5, teamwork: 0.5, offTheBall: 0.5, workRate: 0.4,
      finishing: 0.3, stamina: 0.4, acceleration: 0.5, concentration: 0.4,
    },
  },

  /* ═══════════════════════════════════════════════════════
     CENTRAL MIDFIELDERS (CM)
  ═══════════════════════════════════════════════════════ */

  boxToBox: {
    label: 'Box-to-Box',
    positions: ['CM'],
    duty: 'Support',
    description: 'Engine who covers every blade of grass in both boxes',
    weights: {
      stamina: 1.0, workRate: 0.9, passing: 0.8, tackling: 0.8,
      decisions: 0.8, teamwork: 0.8, anticipation: 0.7, concentration: 0.7,
      positioning: 0.7, determination: 0.7, offTheBall: 0.7, firstTouch: 0.6,
      technique: 0.6, finishing: 0.5, heading: 0.5, bravery: 0.5,
      strength: 0.5, pace: 0.5, acceleration: 0.5, vision: 0.5,
      balance: 0.4, composure: 0.4, dribbling: 0.4, longShots: 0.3,
    },
  },

  mezzala: {
    label: 'Mezzala',
    positions: ['CM'],
    duty: 'Attack',
    description: 'Attacking midfielder playing from central midfield with license to drive forward',
    weights: {
      technique: 1.0, dribbling: 0.9, passing: 0.9, vision: 0.9,
      offTheBall: 0.8, firstTouch: 0.8, decisions: 0.8, composure: 0.7,
      anticipation: 0.7, longShots: 0.7, flair: 0.7, agility: 0.6,
      balance: 0.6, pace: 0.6, acceleration: 0.6, stamina: 0.6,
      finishing: 0.5, workRate: 0.5, concentration: 0.4, teamwork: 0.4,
    },
  },

  carrilero: {
    label: 'Carrilero',
    positions: ['CM'],
    duty: 'Support',
    description: 'Disciplined runner who shuttles between defensive and central zones',
    weights: {
      teamwork: 1.0, workRate: 0.9, stamina: 0.9, decisions: 0.8,
      passing: 0.8, concentration: 0.8, positioning: 0.8, anticipation: 0.7,
      tackling: 0.7, determination: 0.7, firstTouch: 0.6, technique: 0.6,
      composure: 0.6, marking: 0.5, balance: 0.5, strength: 0.5,
      pace: 0.4, acceleration: 0.4, vision: 0.4, bravery: 0.4,
      offTheBall: 0.3, dribbling: 0.3,
    },
  },

  advancedPlaymaker: {
    label: 'Advanced Playmaker',
    positions: ['CM', 'AM', 'LW', 'RW'],
    duty: 'Support',
    description: 'Creative conductor who picks passes and controls tempo in the final third',
    weights: {
      vision: 1.0, passing: 1.0, technique: 0.9, firstTouch: 0.9,
      composure: 0.9, decisions: 0.9, dribbling: 0.8, flair: 0.8,
      anticipation: 0.7, offTheBall: 0.7, agility: 0.6, balance: 0.6,
      concentration: 0.5, longShots: 0.5, finishing: 0.4, teamwork: 0.4,
      pace: 0.4, acceleration: 0.4, workRate: 0.3, stamina: 0.3,
    },
  },

  roamingPlaymaker: {
    label: 'Roaming Playmaker',
    positions: ['CM', 'DM'],
    duty: 'Support',
    description: 'Free role creator who roams across midfield to find pockets of space',
    weights: {
      vision: 1.0, passing: 0.9, technique: 0.9, decisions: 0.9,
      firstTouch: 0.9, stamina: 0.8, composure: 0.8, workRate: 0.8,
      dribbling: 0.7, anticipation: 0.7, teamwork: 0.7, concentration: 0.6,
      positioning: 0.6, flair: 0.6, balance: 0.5, agility: 0.5,
      pace: 0.4, acceleration: 0.4, strength: 0.3, tackling: 0.3,
    },
  },

  /* ═══════════════════════════════════════════════════════
     DEFENSIVE MIDFIELDERS (DM)
  ═══════════════════════════════════════════════════════ */

  deepLyingPlaymaker: {
    label: 'Deep-Lying Playmaker',
    positions: ['DM', 'CM'],
    duty: 'Defend',
    description: 'Reads the game to distribute and control tempo from deep',
    weights: {
      passing: 1.0, vision: 0.9, technique: 0.9, composure: 0.9,
      decisions: 0.9, firstTouch: 0.8, anticipation: 0.8, concentration: 0.7,
      teamwork: 0.7, positioning: 0.7, stamina: 0.6, workRate: 0.6,
      balance: 0.5, strength: 0.5, tackling: 0.5, marking: 0.4,
      dribbling: 0.4, pace: 0.3, acceleration: 0.3, bravery: 0.3,
      heading: 0.3, aggression: 0.2,
    },
  },

  ballWinningMidfielder: {
    label: 'Ball-Winning Midfielder',
    positions: ['DM', 'CM'],
    duty: 'Defend',
    description: 'Aggressive disruptor who wins possession and protects the back line',
    weights: {
      tackling: 1.0, workRate: 0.9, stamina: 0.9, anticipation: 0.9,
      aggression: 0.8, concentration: 0.8, positioning: 0.8, determination: 0.8,
      teamwork: 0.8, bravery: 0.7, marking: 0.7, decisions: 0.7,
      strength: 0.7, pace: 0.6, acceleration: 0.6, heading: 0.5,
      balance: 0.4, composure: 0.4, passing: 0.4, firstTouch: 0.3,
      technique: 0.3, vision: 0.2,
    },
  },

  anchorMan: {
    label: 'Anchor Man',
    positions: ['DM'],
    duty: 'Defend',
    description: 'Positional screen who holds the defensive line and covers space',
    weights: {
      positioning: 1.0, concentration: 0.9, anticipation: 0.9, tackling: 0.8,
      decisions: 0.8, marking: 0.8, composure: 0.7, teamwork: 0.7,
      workRate: 0.7, strength: 0.7, heading: 0.6, stamina: 0.6,
      bravery: 0.6, determination: 0.5, balance: 0.5, aggression: 0.5,
      passing: 0.4, firstTouch: 0.3, technique: 0.3, pace: 0.3,
      acceleration: 0.3, vision: 0.2,
    },
  },

  halfBack: {
    label: 'Half Back',
    positions: ['DM'],
    duty: 'Defend',
    description: 'Drops between centre backs to create a back three out of possession',
    weights: {
      positioning: 1.0, tackling: 0.9, marking: 0.9, concentration: 0.9,
      composure: 0.8, decisions: 0.8, anticipation: 0.8, heading: 0.7,
      strength: 0.7, teamwork: 0.7, passing: 0.7, bravery: 0.6,
      workRate: 0.6, balance: 0.5, stamina: 0.5, jumpingReach: 0.5,
      firstTouch: 0.4, technique: 0.4, aggression: 0.4, vision: 0.3,
      pace: 0.3, acceleration: 0.2,
    },
  },

  segundoVolante: {
    label: 'Segundo Volante',
    positions: ['DM'],
    duty: 'Attack',
    description: 'Late-running midfielder who drives box-to-box from a defensive base',
    weights: {
      stamina: 1.0, workRate: 0.9, passing: 0.8, tackling: 0.8,
      offTheBall: 0.8, anticipation: 0.8, finishing: 0.7, decisions: 0.7,
      teamwork: 0.7, concentration: 0.7, positioning: 0.7, determination: 0.7,
      pace: 0.6, acceleration: 0.6, strength: 0.6, firstTouch: 0.6,
      technique: 0.5, bravery: 0.5, longShots: 0.5, heading: 0.5,
      composure: 0.4, vision: 0.4,
    },
  },

  /* ═══════════════════════════════════════════════════════
     FULL BACKS / WING BACKS (LB / RB / WB)
  ═══════════════════════════════════════════════════════ */

  fullBack: {
    label: 'Full Back',
    positions: ['LB', 'RB'],
    duty: 'Support',
    description: 'Balanced wide defender who contributes going forward without neglecting defence',
    weights: {
      tackling: 0.9, positioning: 0.8, stamina: 0.9, workRate: 0.9,
      concentration: 0.8, anticipation: 0.8, teamwork: 0.8, decisions: 0.7,
      marking: 0.7, pace: 0.7, acceleration: 0.7, crossing: 0.6,
      strength: 0.6, determination: 0.6, bravery: 0.5, technique: 0.5,
      passing: 0.5, balance: 0.5, agility: 0.5, heading: 0.5,
      dribbling: 0.4, composure: 0.4, offTheBall: 0.4, firstTouch: 0.4,
    },
  },

  invertedFullBack: {
    label: 'Inverted Full Back',
    positions: ['LB', 'RB'],
    duty: 'Defend',
    description: 'Underlapping full back who tucks in to create central overloads',
    weights: {
      positioning: 1.0, passing: 0.9, decisions: 0.9, concentration: 0.9,
      composure: 0.8, technique: 0.8, tackling: 0.8, anticipation: 0.8,
      teamwork: 0.7, marking: 0.7, firstTouch: 0.7, vision: 0.6,
      workRate: 0.6, stamina: 0.6, strength: 0.5, balance: 0.5,
      dribbling: 0.5, pace: 0.5, acceleration: 0.5, bravery: 0.4,
      heading: 0.4, crossing: 0.2,
    },
  },

  wingBack: {
    label: 'Wing Back',
    positions: ['WB', 'LB', 'RB'],
    duty: 'Support',
    description: 'Attack-minded wide player who provides width and crosses from deep',
    weights: {
      pace: 1.0, stamina: 1.0, crossing: 0.9, workRate: 0.9,
      acceleration: 0.9, dribbling: 0.7, tackling: 0.7, teamwork: 0.8,
      positioning: 0.7, technique: 0.7, passing: 0.7, anticipation: 0.7,
      concentration: 0.6, decisions: 0.6, offTheBall: 0.6, agility: 0.6,
      balance: 0.5, strength: 0.5, marking: 0.5, bravery: 0.5,
      determination: 0.5, firstTouch: 0.5, naturalFitness: 0.4,
    },
  },

  completeWingBack: {
    label: 'Complete Wing Back',
    positions: ['WB', 'LB', 'RB'],
    duty: 'Attack',
    description: 'Overlapping attacker who provides offensive threat from wide positions',
    weights: {
      pace: 1.0, stamina: 0.9, acceleration: 0.9, crossing: 0.9,
      dribbling: 0.8, workRate: 0.8, technique: 0.8, passing: 0.7,
      agility: 0.7, flair: 0.7, offTheBall: 0.7, balance: 0.6,
      decisions: 0.6, firstTouch: 0.6, vision: 0.5, anticipation: 0.5,
      tackling: 0.5, teamwork: 0.5, finishing: 0.4, concentration: 0.4,
      marking: 0.4, strength: 0.4, determination: 0.4,
    },
  },

  /* ═══════════════════════════════════════════════════════
     CENTRE BACKS (CB)
  ═══════════════════════════════════════════════════════ */

  centralDefender: {
    label: 'Central Defender',
    positions: ['CB'],
    duty: 'Defend',
    description: 'Traditional stopper who defends the box and wins headers',
    weights: {
      heading: 1.0, tackling: 1.0, positioning: 0.9, marking: 0.9,
      strength: 0.9, jumpingReach: 0.8, composure: 0.8, concentration: 0.8,
      bravery: 0.8, anticipation: 0.7, decisions: 0.7, teamwork: 0.7,
      determination: 0.6, aggression: 0.6, workRate: 0.5, balance: 0.5,
      pace: 0.5, stamina: 0.4, acceleration: 0.4, passing: 0.4,
      firstTouch: 0.3, vision: 0.2, naturalFitness: 0.4,
    },
  },

  ballPlayingDefender: {
    label: 'Ball-Playing Defender',
    positions: ['CB'],
    duty: 'Defend',
    description: 'Composed centre back who builds from the back with quality distribution',
    weights: {
      passing: 0.9, heading: 0.9, tackling: 0.9, composure: 0.9,
      firstTouch: 0.8, positioning: 0.8, technique: 0.8, marking: 0.8,
      concentration: 0.8, decisions: 0.8, anticipation: 0.7, strength: 0.7,
      jumpingReach: 0.7, vision: 0.6, bravery: 0.6, teamwork: 0.6,
      determination: 0.5, balance: 0.5, pace: 0.5, acceleration: 0.4,
      workRate: 0.4, stamina: 0.4, aggression: 0.3,
    },
  },

  libero: {
    label: 'Libero',
    positions: ['CB'],
    duty: 'Support',
    description: 'Sweeper who carries the ball out from defence to join attacks',
    weights: {
      passing: 1.0, composure: 0.9, technique: 0.9, firstTouch: 0.9,
      vision: 0.8, decisions: 0.8, dribbling: 0.8, anticipation: 0.7,
      positioning: 0.7, concentration: 0.7, pace: 0.7, acceleration: 0.6,
      heading: 0.6, tackling: 0.6, marking: 0.6, balance: 0.5,
      agility: 0.5, flair: 0.5, strength: 0.5, bravery: 0.5,
      teamwork: 0.5, stamina: 0.4, jumpingReach: 0.4,
    },
  },

  /* ═══════════════════════════════════════════════════════
     GOALKEEPER (GK)
  ═══════════════════════════════════════════════════════ */

  goalkeeper: {
    label: 'Goalkeeper',
    positions: ['GK'],
    duty: 'Defend',
    description: 'Traditional shot stopper focused on keeping a clean sheet',
    weights: {
      reflexes: 1.0, handling: 1.0, positioning: 0.9, concentration: 0.9,
      anticipation: 0.8, composure: 0.8, oneOnOnes: 0.8, commandOfArea: 0.7,
      aerialAbility: 0.7, decisions: 0.7, agility: 0.7, communication: 0.6,
      kicking: 0.5, throwing: 0.5, rushingOut: 0.5, firstTouch: 0.4,
      passing: 0.4, strength: 0.3, jumpingReach: 0.5,
    },
  },

  sweeperKeeper: {
    label: 'Sweeper Keeper',
    positions: ['GK'],
    duty: 'Support',
    description: 'Proactive keeper who sweeps behind the line and acts as a sweeper',
    weights: {
      reflexes: 0.9, handling: 0.9, rushingOut: 1.0, oneOnOnes: 0.9,
      composure: 0.9, anticipation: 0.9, positioning: 0.8, agility: 0.8,
      concentration: 0.8, decisions: 0.8, kicking: 0.7, passing: 0.6,
      firstTouch: 0.6, communication: 0.6, commandOfArea: 0.6,
      aerialAbility: 0.6, throwing: 0.5, pace: 0.5, acceleration: 0.4,
      vision: 0.4, technique: 0.4,
    },
  },
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

/**
 * Get all roles for a given position key.
 * @param {string} posKey - e.g. 'ST', 'CB', 'GK'
 * @returns {Array<{key: string, role: object}>}
 */
export function getRolesForPosition(posKey) {
  return Object.entries(ROLES)
    .filter(([, r]) => r.positions.includes(posKey))
    .map(([key, role]) => ({ key, ...role }))
}

/**
 * Calculate weighted role score for a player.
 * Returns 0–20 scale (same as calcPositionScore).
 * @param {string} roleKey - e.g. 'poacher', 'deepLyingPlaymaker'
 * @param {object} flatAttrs - flat attribute object { finishing: 18, pace: 19, ... }
 */
export function calcRoleScore(roleKey, flatAttrs) {
  const role = ROLES[roleKey]
  if (!role) return 0

  let totalWeighted = 0
  let totalWeight = 0

  for (const [attr, weight] of Object.entries(role.weights)) {
    const val = flatAttrs[attr]
    if (val != null && val > 0) {
      totalWeighted += val * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? Math.round((totalWeighted / totalWeight) * 10) / 10 : 0
}

/**
 * Get top N roles for a position, scored and ranked.
 * @param {string} posKey
 * @param {object} flatAttrs
 * @param {number} limit
 */
export function getTopRolesForPosition(posKey, flatAttrs, limit = 5) {
  return getRolesForPosition(posKey)
    .map(r => ({ ...r, score: calcRoleScore(r.key, flatAttrs) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Score-to-stars rating (0–5 stars, 0.5 step).
 * Calibrated against FM26 role ratings across 4 players:
 *   ~15.7 = 5★ (Haaland Poacher)
 *   ~14.6 = 4★ (Lewandowski Poacher)
 *   ~13.6 = 3★ (En-Nesyri Poacher)
 *   ~12.9 = 2★ (Nyman Target Forward)
 * Maps score range 10–16 to 0–5 stars.
 */
export function scoreToStars(score) {
  const MIN = 10
  const MAX = 16
  const stars = Math.max(0, (score - MIN) / (MAX - MIN) * 5)
  return Math.round(stars * 2) / 2 // 0.5 step
}

/**
 * Star display string: ★★★★☆ style.
 */
export function starsDisplay(score) {
  const stars = scoreToStars(score)
  const full = Math.floor(stars)
  const half = stars % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export default ROLES
