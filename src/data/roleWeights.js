/**
 * FM26 Role Weights — sourced directly from FM26_ROLES_DATA (fm26_player_scoring_system_v2_0)
 *
 * Weights normalized from FM26 scale: 5→1.0, 3→0.6, 1→0.2
 * 72 roles covering all positions (GK, CB, FB, WB, DM, CM, WM, AM, W, ST)
 *
 * Each role defines:
 *   name        — display name
 *   positions   — which position keys this role applies to
 *   duty        — Attack / Support / Defend
 *   description — one-line summary
 *   weights     — attribute weights 0–1 (camelCase, matching flattenAttributes output)
 */

export const ROLES = {

  /* ═══════════════════════════════════════════════════════
     GOALKEEPER
  ═══════════════════════════════════════════════════════ */

  goalkeeper: {
    label: 'Goalkeeper',
    positions: ["GK"],
    duty: 'Defend',
    phase: 'GK',
    description: 'Standard goalkeeper focused on shot-stopping and positioning',
    weights: {
      handling: 1.0, oneOnOnes: 1.0, reflexes: 1.0,
      anticipation: 0.6, commandOfArea: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, jumpingReach: 0.6, positioning: 0.6,
      kicking: 0.2, throwing: 0.2,
    },
  },

  noNonsenseGoalkeeper: {
    label: 'No-Nonsense Goalkeeper',
    positions: ["GK"],
    duty: 'Defend',
    phase: 'GK',
    description: 'Physical keeper who dominates the box with commanding presence',
    weights: {
      commandOfArea: 1.0, handling: 1.0, jumpingReach: 1.0, reflexes: 1.0,
      anticipation: 0.6, concentration: 0.6, heading: 0.6, oneOnOnes: 0.6, positioning: 0.6,
      composure: 0.2, decisions: 0.2, kicking: 0.2, throwing: 0.2,
    },
  },

  lineHoldingKeeper: {
    label: 'Line-Holding Keeper',
    positions: ["GK"],
    duty: 'Defend',
    phase: 'GK',
    description: 'Positional keeper who holds the defensive line to play offside trap',
    weights: {
      concentration: 1.0, handling: 1.0, positioning: 1.0, reflexes: 1.0,
      anticipation: 0.6, commandOfArea: 0.6, decisions: 0.6, oneOnOnes: 0.6,
      kicking: 0.2, throwing: 0.2,
    },
  },

  sweeperKeeper: {
    label: 'Sweeper Keeper',
    positions: ["GK"],
    duty: 'Defend',
    phase: 'GK',
    description: 'Aggressive keeper who sweeps behind the defensive line and claims crosses',
    weights: {
      acceleration: 1.0, anticipation: 1.0, handling: 1.0, oneOnOnes: 1.0, pace: 1.0, reflexes: 1.0,
      commandOfArea: 0.6, decisions: 0.6, positioning: 0.6,
    },
  },

  ballPlayingGoalkeeper: {
    label: 'Ball-Playing Goalkeeper',
    positions: ["GK"],
    duty: 'Support',
    phase: 'GK',
    description: 'Technically gifted keeper who distributes short and builds from the back',
    weights: {
      composure: 1.0, handling: 1.0, kicking: 1.0, reflexes: 1.0, throwing: 1.0,
      anticipation: 0.6, commandOfArea: 0.6, decisions: 0.6, oneOnOnes: 0.6, passing: 0.6,
      concentration: 0.2, positioning: 0.2,
    },
  },


  /* ═══════════════════════════════════════════════════════
     CENTRE-BACK
  ═══════════════════════════════════════════════════════ */

  centreback: {
    label: 'Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Reads the game, defends aerially and covers space',
    weights: {
      heading: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0, tackling: 1.0,
      anticipation: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, jumpingReach: 0.6,
      acceleration: 0.2, pace: 0.2,
    },
  },

  noNonsenseCentreback: {
    label: 'No-Nonsense Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Physical no-nonsense defender who clears danger directly',
    weights: {
      heading: 1.0, jumpingReach: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0, tackling: 1.0,
      anticipation: 0.6, bravery: 0.6, concentration: 0.6,
      composure: 0.2, decisions: 0.2,
    },
  },

  coveringCentreback: {
    label: 'Covering Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Covers behind the defensive line and sweeps up loose balls',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0,
      acceleration: 0.6, decisions: 0.6, heading: 0.6, pace: 0.6,
    },
  },

  stoppingCentreback: {
    label: 'Stopping Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Physical stopper who wins aerial duels and tackles',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, strength: 1.0, tackling: 1.0,
      aggression: 0.6, bravery: 0.6, decisions: 0.6, positioning: 0.6,
    },
  },

  ballPlayingCentreback: {
    label: 'Ball-Playing Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Ball-playing defender who distributes from the back',
    weights: {
      composure: 1.0, decisions: 1.0, passing: 1.0,
      anticipation: 0.6, concentration: 0.6, firstTouch: 0.6, heading: 0.6, marking: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
      dribbling: 0.2,
    },
  },

  overlappingCentreback: {
    label: 'Overlapping Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Overlapping centre-back who supports wide attacks',
    weights: {
      acceleration: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, concentration: 0.6, crossing: 0.6, heading: 0.6, marking: 0.6, offTheBall: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6, workRate: 0.6,
    },
  },

  advancedCentreback: {
    label: 'Advanced Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Advanced centre-back with licence to step into midfield',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, concentration: 0.6, dribbling: 0.6, firstTouch: 0.6, heading: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  wideCentreback: {
    label: 'Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Wide centre-back deployed on the flank in a back three',
    weights: {
      marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0, tackling: 1.0,
      acceleration: 0.6, anticipation: 0.6, concentration: 0.6, heading: 0.6, pace: 0.6, workRate: 0.6,
    },
  },

  coveringWideCentreback: {
    label: 'Covering Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide covering centre-back who tucks in to protect space',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0,
      decisions: 0.6, pace: 0.6,
    },
  },

  stoppingWideCentreback: {
    label: 'Stopping Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide stopping centre-back focused on defensive duties',
    weights: {
      acceleration: 1.0, aggression: 1.0, anticipation: 1.0, pace: 1.0, tackling: 1.0,
      bravery: 0.6, decisions: 0.6, positioning: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     FULL-BACK
  ═══════════════════════════════════════════════════════ */

  fullBack: {
    label: 'Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Overlapping full-back who supports attacks from wide',
    weights: {
      acceleration: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, concentration: 0.6, crossing: 0.6, decisions: 0.6, marking: 0.6, offTheBall: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  holdingFullBack: {
    label: 'Holding Full-Back',
    positions: ["LB", "RB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Holding full-back who maintains defensive shape',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      decisions: 0.6, tackling: 0.6,
      pace: 0.2,
    },
  },

  insideFullBack: {
    label: 'Inside Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Inside full-back who tucks into midfield to create overloads',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, concentration: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  invertedFullBack: {
    label: 'Inverted Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Inverted full-back who cuts inside into central positions',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, concentration: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  pressingFullBack: {
    label: 'Pressing Full-Back',
    positions: ["LB", "RB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Pressing full-back who presses high up the pitch',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      aggression: 0.6, bravery: 0.6, concentration: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     WING-BACK
  ═══════════════════════════════════════════════════════ */

  wingBack: {
    label: 'Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Dynamic wing-back combining defensive duties with attacking width',
    weights: {
      acceleration: 1.0, crossing: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, decisions: 0.6, firstTouch: 0.6, marking: 0.6, offTheBall: 0.6, tackling: 0.6,
    },
  },

  holdingWingBack: {
    label: 'Holding Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Holding wing-back who prioritises defensive cover',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      decisions: 0.6, tackling: 0.6,
    },
  },

  insideWingBack: {
    label: 'Inside Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    phase: 'OOP',
    description: 'Inside wing-back who moves centrally when team has possession',
    weights: {
      concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      acceleration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6, passing: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  invertedWingBack: {
    label: 'Inverted Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Inverted wing-back who cuts inside to create overloads',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, composure: 0.6, marking: 0.6, pace: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  pressingWingBack: {
    label: 'Pressing Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Pressing wing-back who presses high and tracks wide runners',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      aggression: 0.6, bravery: 0.6,
    },
  },

  playmakingWingBack: {
    label: 'Playmaking Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    phase: 'IP',
    description: 'Playmaking wing-back who combines distribution with width',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, crossing: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6,
      marking: 0.2, tackling: 0.2,
    },
  },

  advancedWingBack: {
    label: 'Advanced Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Advanced wing-back who acts almost as a winger going forward',
    weights: {
      acceleration: 1.0, crossing: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, dribbling: 0.6, firstTouch: 0.6,
      marking: 0.2, tackling: 0.2,
    },
  },


  /* ═══════════════════════════════════════════════════════
     DEFENSIVE MIDFIELDER
  ═══════════════════════════════════════════════════════ */

  defensiveMidfielder: {
    label: 'Defensive Midfielder',
    positions: ["DM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Defensive midfielder who screens the back four',
    weights: {
      positioning: 1.0, stamina: 1.0,
      anticipation: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, passing: 0.6, strength: 0.6, tackling: 0.6, teamwork: 0.6,
    },
  },

  droppingDefensiveMidfielder: {
    label: 'Dropping Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Dropping defensive midfielder who acts as an extra centre-back',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      composure: 0.6, decisions: 0.6,
    },
  },

  screeningDefensiveMidfielder: {
    label: 'Screening Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Screening defensive midfielder who shields and protects the backline',
    weights: {
      anticipation: 1.0, concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      decisions: 0.6, marking: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  wideCoveringDefensiveMidfielder: {
    label: 'Wide Covering Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide-covering defensive midfielder who tracks wide runners',
    weights: {
      anticipation: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, decisions: 0.6, pace: 0.6,
    },
  },

  pressingDefensiveMidfielder: {
    label: 'Pressing Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Pressing defensive midfielder who wins the ball high up the pitch',
    weights: {
      anticipation: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, aggression: 0.6, bravery: 0.6, decisions: 0.6, pace: 0.6,
    },
  },

  halfBack: {
    label: 'Half-Back',
    positions: ["DM", "CB"],
    duty: 'Defend',
    phase: 'IP',
    description: 'Half-back who drops between the centre-backs to receive in possession',
    weights: {
      composure: 1.0, decisions: 1.0, passing: 1.0, positioning: 1.0, stamina: 1.0,
      anticipation: 0.6, concentration: 0.6, marking: 0.6, strength: 0.6, tackling: 0.6, vision: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     CENTRAL MIDFIELDER
  ═══════════════════════════════════════════════════════ */

  deepLyingPlaymaker: {
    label: 'Deep-Lying Playmaker',
    positions: ["CM", "DM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Deep-lying playmaker who dictates tempo and distributes from deep',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      anticipation: 0.6, composure: 0.6, positioning: 0.6, strength: 0.6, teamwork: 0.6,
    },
  },

  centralMidfielder: {
    label: 'Central Midfielder',
    positions: ["CM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Central midfielder who links defence and attack',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, concentration: 0.6, firstTouch: 0.6, teamwork: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  screeningCentralMidfielder: {
    label: 'Screening Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Screening central midfielder who protects the defensive line',
    weights: {
      anticipation: 1.0, concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      decisions: 0.6, marking: 0.6, strength: 0.6,
    },
  },

  wideCoveringCentralMidfielder: {
    label: 'Wide Covering Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide-covering central midfielder who tracks wide channels',
    weights: {
      anticipation: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, pace: 0.6,
    },
  },

  boxToBoxMidfielder: {
    label: 'Box-to-Box Midfielder',
    positions: ["CM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Box-to-box midfielder with energy to cover every blade of grass',
    weights: {
      stamina: 1.0, workRate: 1.0,
      acceleration: 0.6, anticipation: 0.6, decisions: 0.6, offTheBall: 0.6, pace: 0.6, passing: 0.6, strength: 0.6, tackling: 0.6, teamwork: 0.6,
      finishing: 0.2,
    },
  },

  boxToBoxPlaymaker: {
    label: 'Box-to-Box Playmaker',
    positions: ["CM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Box-to-box playmaker combining ball-carrying with tireless energy',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, dribbling: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  channelMidfielder: {
    label: 'Channel Midfielder',
    positions: ["CM"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Channel midfielder who makes forward runs between the lines',
    weights: {
      acceleration: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6, passing: 0.6, vision: 0.6,
    },
  },

  midfieldPlaymaker: {
    label: 'Midfield Playmaker',
    positions: ["CM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Midfield playmaker who controls tempo and creates chances',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      anticipation: 0.6, composure: 0.6, offTheBall: 0.6, teamwork: 0.6,
      dribbling: 0.2,
    },
  },

  pressingCentralMidfielder: {
    label: 'Pressing Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Pressing central midfielder who wins the ball in advanced positions',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      aggression: 0.6, bravery: 0.6, decisions: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     WIDE MIDFIELDER
  ═══════════════════════════════════════════════════════ */

  wideMidfielder: {
    label: 'Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Wide midfielder who provides width and crossing from wide areas',
    weights: {
      crossing: 1.0, stamina: 1.0, workRate: 1.0,
      acceleration: 0.6, anticipation: 0.6, decisions: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, passing: 0.6,
    },
  },

  trackingWideMidfielder: {
    label: 'Tracking Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Tracking wide midfielder who tracks opposition runs diligently',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6,
    },
  },

  wideCentralMidfielder: {
    label: 'Wide Central Midfielder',
    positions: ["LM", "RM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Wide central midfielder who operates between the lines',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  wideOutletWideMidfielder: {
    label: 'Wide Outlet Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide outlet midfielder who provides a pass option in wide areas',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
    },
  },


  /* ═══════════════════════════════════════════════════════
     ATTACKING MIDFIELDER
  ═══════════════════════════════════════════════════════ */

  attackingMidfielder: {
    label: 'Attacking Midfielder',
    positions: ["AM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Attacking midfielder who links midfield and the final third',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, offTheBall: 0.6, pace: 0.6, vision: 0.6,
    },
  },

  trackingAttackingMidfielder: {
    label: 'Tracking Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Tracking attacking midfielder who presses from the front',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, tackling: 0.6,
    },
  },

  advancedPlaymaker: {
    label: 'Advanced Playmaker',
    positions: ["AM", "CM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Advanced playmaker who creates in the final third',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, flair: 0.6, offTheBall: 0.6, pace: 0.6,
    },
  },

  centralOutletAttackingMidfielder: {
    label: 'Central Outlet Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Central outlet attacking midfielder who provides a passing option centrally',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      finishing: 0.6,
    },
  },

  splittingOutletAttackingMidfielder: {
    label: 'Splitting Outlet Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Splitting outlet attacking midfielder who plays killer passes between lines',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, dribbling: 0.6, flair: 0.6,
    },
  },

  freeRole: {
    label: 'Free Role',
    positions: ["AM", "CM"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Free role player with licence to roam and create throughout the pitch',
    weights: {
      decisions: 1.0, firstTouch: 1.0, flair: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, composure: 0.6, dribbling: 0.6, offTheBall: 0.6, pace: 0.6, passing: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     WINGER
  ═══════════════════════════════════════════════════════ */

  winger: {
    label: 'Winger',
    positions: ["LW", "RW"],
    duty: 'Support',
    phase: 'IP',
    description: 'Winger who provides width and delivers crosses from wide positions',
    weights: {
      acceleration: 1.0, crossing: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      dribbling: 0.6, firstTouch: 0.6, offTheBall: 0.6, technique: 0.6,
    },
  },

  halfSpaceWinger: {
    label: 'Half-Space Winger',
    positions: ["LW", "RW"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Half-space winger who operates in the inside channel',
    weights: {
      acceleration: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6, passing: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  insideWinger: {
    label: 'Inside Winger',
    positions: ["LW", "RW"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Inside winger who cuts inside to shoot or create',
    weights: {
      acceleration: 1.0, dribbling: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, anticipation: 0.6, finishing: 0.6, firstTouch: 0.6, flair: 0.6, technique: 0.6,
    },
  },

  invertingOutletWinger: {
    label: 'Inverting Outlet Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Inverting outlet winger who tracks back and provides defensive cover',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      decisions: 0.6, firstTouch: 0.6, vision: 0.6,
    },
  },

  trackingWinger: {
    label: 'Tracking Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Tracking winger who presses and recovers defensively',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6,
    },
  },

  wideOutletWinger: {
    label: 'Wide Outlet Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Wide outlet winger who stays wide to provide passing options',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
    },
  },

  widePlaymaker: {
    label: 'Wide Playmaker',
    positions: ["LW", "RW", "LM", "RM"],
    duty: 'Support',
    phase: 'IP',
    description: 'Wide playmaker who creates and distributes from wide positions',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, dribbling: 0.6, flair: 0.6, offTheBall: 0.6, pace: 0.6,
    },
  },

  wideForward: {
    label: 'Wide Forward',
    positions: ["LW", "RW", "LM", "RM"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Wide forward who combines goal threat with width',
    weights: {
      acceleration: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, firstTouch: 0.6, technique: 0.6,
    },
  },

  insideForward: {
    label: 'Inside Forward',
    positions: ["LW", "RW"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Inside forward who cuts inside from wide to threaten goal',
    weights: {
      acceleration: 1.0, dribbling: 1.0, finishing: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, anticipation: 0.6, firstTouch: 0.6, flair: 0.6, offTheBall: 0.6, technique: 0.6,
    },
  },


  /* ═══════════════════════════════════════════════════════
     STRIKER / FORWARD
  ═══════════════════════════════════════════════════════ */

  centreForward: {
    label: 'Centre Forward',
    positions: ["ST"],
    duty: 'Support',
    phase: 'IP',
    description: 'Complete centre-forward combining aerial and technical goal threat',
    weights: {
      anticipation: 1.0, finishing: 1.0, heading: 1.0, offTheBall: 1.0, strength: 1.0,
      acceleration: 0.6, composure: 0.6, decisions: 0.6, firstTouch: 0.6, jumpingReach: 0.6, pace: 0.6,
    },
  },

  falseNine: {
    label: 'False Nine',
    positions: ["ST"],
    duty: 'Support',
    phase: 'IP',
    description: 'False nine who drops deep to create space and link play',
    weights: {
      decisions: 1.0, firstTouch: 1.0, offTheBall: 1.0, passing: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, finishing: 0.6,
    },
  },

  deepLyingForward: {
    label: 'Deep-Lying Forward',
    positions: ["ST"],
    duty: 'Support',
    phase: 'IP',
    description: 'Deep-lying forward who drops to receive and distribute for teammates',
    weights: {
      composure: 1.0, decisions: 1.0, firstTouch: 1.0, passing: 1.0, technique: 1.0,
      anticipation: 0.6, finishing: 0.6, offTheBall: 0.6, strength: 0.6, vision: 0.6,
    },
  },

  halfSpaceForward: {
    label: 'Half-Space Forward',
    positions: ["ST"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Half-space forward who exploits channels between defence and wide',
    weights: {
      acceleration: 1.0, anticipation: 1.0, dribbling: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0,
      agility: 0.6, decisions: 0.6, firstTouch: 0.6, technique: 0.6,
    },
  },

  channelForward: {
    label: 'Channel Forward',
    positions: ["ST"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Channel forward who makes runs in behind to exploit space',
    weights: {
      acceleration: 1.0, anticipation: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0,
      agility: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6,
    },
  },

  secondStriker: {
    label: 'Second Striker',
    positions: ["ST"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Second striker who links midfield and attack with energy',
    weights: {
      anticipation: 1.0, decisions: 1.0, finishing: 1.0, offTheBall: 1.0, stamina: 1.0,
      acceleration: 0.6, composure: 0.6, dribbling: 0.6, firstTouch: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  centralOutletCentreForward: {
    label: 'Central Outlet Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Central outlet centre-forward who holds up play for direct passes',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      finishing: 0.6,
    },
  },

  splittingOutletCentreForward: {
    label: 'Splitting Outlet Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Splitting outlet centre-forward who runs in behind to split the defence',
    weights: {
      acceleration: 1.0, anticipation: 1.0, dribbling: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, flair: 0.6,
    },
  },

  trackingCentreForward: {
    label: 'Tracking Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    phase: 'OOP',
    description: 'Tracking centre-forward who works hard pressing and defending from the front',
    weights: {
      anticipation: 1.0, stamina: 1.0, teamwork: 1.0, workRate: 1.0,
      acceleration: 0.6, offTheBall: 0.6, pace: 0.6, strength: 0.6,
    },
  },

  targetForward: {
    label: 'Target Forward',
    positions: ["ST"],
    duty: 'Support',
    phase: 'IP',
    description: 'Target forward who holds up play aerially and brings teammates in',
    weights: {
      anticipation: 1.0, heading: 1.0, jumpingReach: 1.0, strength: 1.0,
      aggression: 0.6, bravery: 0.6, composure: 0.6, finishing: 0.6, firstTouch: 0.6, offTheBall: 0.6,
    },
  },

  poacher: {
    label: 'Poacher',
    positions: ["ST"],
    duty: 'Attack',
    phase: 'IP',
    description: 'Poacher who lurks in the box to finish off chances',
    weights: {
      anticipation: 1.0, composure: 1.0, finishing: 1.0, offTheBall: 1.0,
      acceleration: 0.6, agility: 0.6, decisions: 0.6, firstTouch: 0.6, pace: 0.6,
    },
  },

}

/* ── Helpers ─────────────────────────────────────────────────────────── */

/**
 * Get all roles available for a given position key.
 * @param {string} posKey - e.g. 'ST', 'CB', 'GK'
 * @returns {Array<{key: string, ...role}>}
 */
export function getRolesForPosition(posKey) {
  return Object.entries(ROLES)
    .filter(([, r]) => r.positions.includes(posKey))
    .map(([key, role]) => ({ key, ...role }))
}

/**
 * Calculate weighted role score for a player.
 * Returns 0–20 scale.
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
