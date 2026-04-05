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
    name: 'Goalkeeper',
    positions: ["GK"],
    duty: 'Defend',
    description: 'Standard goalkeeper focused on shot-stopping and positioning',
    weights: {
      handling: 1.0, oneOnOnes: 1.0, reflexes: 1.0,
      anticipation: 0.6, commandOfArea: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, jumpingReach: 0.6, positioning: 0.6,
      kicking: 0.2, throwing: 0.2,
    },
  },

  noNonsenseGoalkeeper: {
    name: 'No-Nonsense Goalkeeper',
    positions: ["GK"],
    duty: 'Defend',
    description: 'Physical keeper who dominates the box with commanding presence',
    weights: {
      commandOfArea: 1.0, handling: 1.0, jumpingReach: 1.0, reflexes: 1.0,
      anticipation: 0.6, concentration: 0.6, heading: 0.6, oneOnOnes: 0.6, positioning: 0.6,
      composure: 0.2, decisions: 0.2, kicking: 0.2, throwing: 0.2,
    },
  },

  lineHoldingKeeper: {
    name: 'Line-Holding Keeper',
    positions: ["GK"],
    duty: 'Defend',
    description: 'Positional keeper who holds the defensive line to play offside trap',
    weights: {
      concentration: 1.0, handling: 1.0, positioning: 1.0, reflexes: 1.0,
      anticipation: 0.6, commandOfArea: 0.6, decisions: 0.6, oneOnOnes: 0.6,
      kicking: 0.2, throwing: 0.2,
    },
  },

  sweeperKeeper: {
    name: 'Sweeper Keeper',
    positions: ["GK"],
    duty: 'Defend',
    description: 'Aggressive keeper who sweeps behind the defensive line and claims crosses',
    weights: {
      acceleration: 1.0, anticipation: 1.0, handling: 1.0, oneOnOnes: 1.0, pace: 1.0, reflexes: 1.0,
      commandOfArea: 0.6, decisions: 0.6, positioning: 0.6,
    },
  },

  ballPlayingGoalkeeper: {
    name: 'Ball-Playing Goalkeeper',
    positions: ["GK"],
    duty: 'Support',
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
    name: 'Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Reads the game, defends aerially and covers space',
    weights: {
      heading: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0, tackling: 1.0,
      anticipation: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, jumpingReach: 0.6,
      acceleration: 0.2, pace: 0.2,
    },
  },

  noNonsenseCentreback: {
    name: 'No-Nonsense Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Physical no-nonsense defender who clears danger directly',
    weights: {
      heading: 1.0, jumpingReach: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0, tackling: 1.0,
      anticipation: 0.6, bravery: 0.6, concentration: 0.6,
      composure: 0.2, decisions: 0.2,
    },
  },

  coveringCentreback: {
    name: 'Covering Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Covers behind the defensive line and sweeps up loose balls',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0,
      acceleration: 0.6, decisions: 0.6, heading: 0.6, pace: 0.6,
    },
  },

  stoppingCentreback: {
    name: 'Stopping Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Physical stopper who wins aerial duels and tackles',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, strength: 1.0, tackling: 1.0,
      aggression: 0.6, bravery: 0.6, decisions: 0.6, positioning: 0.6,
    },
  },

  ballPlayingCentreback: {
    name: 'Ball-Playing Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Ball-playing defender who distributes from the back',
    weights: {
      composure: 1.0, decisions: 1.0, passing: 1.0,
      anticipation: 0.6, concentration: 0.6, firstTouch: 0.6, heading: 0.6, marking: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
      dribbling: 0.2,
    },
  },

  overlappingCentreback: {
    name: 'Overlapping Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Overlapping centre-back who supports wide attacks',
    weights: {
      acceleration: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, concentration: 0.6, crossing: 0.6, heading: 0.6, marking: 0.6, offTheBall: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6, workRate: 0.6,
    },
  },

  advancedCentreback: {
    name: 'Advanced Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Advanced centre-back with licence to step into midfield',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, concentration: 0.6, dribbling: 0.6, firstTouch: 0.6, heading: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  wideCentreback: {
    name: 'Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Wide centre-back deployed on the flank in a back three',
    weights: {
      marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0, tackling: 1.0,
      acceleration: 0.6, anticipation: 0.6, concentration: 0.6, heading: 0.6, pace: 0.6, workRate: 0.6,
    },
  },

  coveringWideCentreback: {
    name: 'Covering Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
    description: 'Wide covering centre-back who tucks in to protect space',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, strength: 1.0,
      decisions: 0.6, pace: 0.6,
    },
  },

  stoppingWideCentreback: {
    name: 'Stopping Wide Centre-Back',
    positions: ["CB"],
    duty: 'Defend',
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
    name: 'Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    description: 'Overlapping full-back who supports attacks from wide',
    weights: {
      acceleration: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, concentration: 0.6, crossing: 0.6, decisions: 0.6, marking: 0.6, offTheBall: 0.6, positioning: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  holdingFullBack: {
    name: 'Holding Full-Back',
    positions: ["LB", "RB"],
    duty: 'Defend',
    description: 'Holding full-back who maintains defensive shape',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      decisions: 0.6, tackling: 0.6,
      pace: 0.2,
    },
  },

  insideFullBack: {
    name: 'Inside Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    description: 'Inside full-back who tucks into midfield to create overloads',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, concentration: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  invertedFullBack: {
    name: 'Inverted Full-Back',
    positions: ["LB", "RB"],
    duty: 'Support',
    description: 'Inverted full-back who cuts inside into central positions',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, concentration: 0.6, marking: 0.6, pace: 0.6, positioning: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  pressingFullBack: {
    name: 'Pressing Full-Back',
    positions: ["LB", "RB"],
    duty: 'Defend',
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
    name: 'Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    description: 'Dynamic wing-back combining defensive duties with attacking width',
    weights: {
      acceleration: 1.0, crossing: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, decisions: 0.6, firstTouch: 0.6, marking: 0.6, offTheBall: 0.6, tackling: 0.6,
    },
  },

  holdingWingBack: {
    name: 'Holding Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Defend',
    description: 'Holding wing-back who prioritises defensive cover',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      decisions: 0.6, tackling: 0.6,
    },
  },

  insideWingBack: {
    name: 'Inside Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    description: 'Inside wing-back who moves centrally when team has possession',
    weights: {
      concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      acceleration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6, passing: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  invertedWingBack: {
    name: 'Inverted Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    description: 'Inverted wing-back who cuts inside to create overloads',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0,
      acceleration: 0.6, composure: 0.6, marking: 0.6, pace: 0.6, tackling: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  pressingWingBack: {
    name: 'Pressing Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Defend',
    description: 'Pressing wing-back who presses high and tracks wide runners',
    weights: {
      acceleration: 1.0, anticipation: 1.0, pace: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      aggression: 0.6, bravery: 0.6,
    },
  },

  playmakingWingBack: {
    name: 'Playmaking Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Support',
    description: 'Playmaking wing-back who combines distribution with width',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, crossing: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6,
      marking: 0.2, tackling: 0.2,
    },
  },

  advancedWingBack: {
    name: 'Advanced Wing-Back',
    positions: ["LWB", "RWB"],
    duty: 'Attack',
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
    name: 'Defensive Midfielder',
    positions: ["DM"],
    duty: 'Support',
    description: 'Defensive midfielder who screens the back four',
    weights: {
      positioning: 1.0, stamina: 1.0,
      anticipation: 0.6, composure: 0.6, concentration: 0.6, decisions: 0.6, passing: 0.6, strength: 0.6, tackling: 0.6, teamwork: 0.6,
    },
  },

  droppingDefensiveMidfielder: {
    name: 'Dropping Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    description: 'Dropping defensive midfielder who acts as an extra centre-back',
    weights: {
      anticipation: 1.0, concentration: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, strength: 1.0,
      composure: 0.6, decisions: 0.6,
    },
  },

  screeningDefensiveMidfielder: {
    name: 'Screening Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    description: 'Screening defensive midfielder who shields and protects the backline',
    weights: {
      anticipation: 1.0, concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      decisions: 0.6, marking: 0.6, strength: 0.6, tackling: 0.6,
    },
  },

  wideCoveringDefensiveMidfielder: {
    name: 'Wide Covering Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    description: 'Wide-covering defensive midfielder who tracks wide runners',
    weights: {
      anticipation: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, decisions: 0.6, pace: 0.6,
    },
  },

  pressingDefensiveMidfielder: {
    name: 'Pressing Defensive Midfielder',
    positions: ["DM"],
    duty: 'Defend',
    description: 'Pressing defensive midfielder who wins the ball high up the pitch',
    weights: {
      anticipation: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, aggression: 0.6, bravery: 0.6, decisions: 0.6, pace: 0.6,
    },
  },

  halfBack: {
    name: 'Half-Back',
    positions: ["DM", "CB"],
    duty: 'Defend',
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
    name: 'Deep-Lying Playmaker',
    positions: ["CM", "DM"],
    duty: 'Support',
    description: 'Deep-lying playmaker who dictates tempo and distributes from deep',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      anticipation: 0.6, composure: 0.6, positioning: 0.6, strength: 0.6, teamwork: 0.6,
    },
  },

  centralMidfielder: {
    name: 'Central Midfielder',
    positions: ["CM"],
    duty: 'Support',
    description: 'Central midfielder who links defence and attack',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, concentration: 0.6, firstTouch: 0.6, teamwork: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  screeningCentralMidfielder: {
    name: 'Screening Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
    description: 'Screening central midfielder who protects the defensive line',
    weights: {
      anticipation: 1.0, concentration: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0,
      decisions: 0.6, marking: 0.6, strength: 0.6,
    },
  },

  wideCoveringCentralMidfielder: {
    name: 'Wide Covering Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
    description: 'Wide-covering central midfielder who tracks wide channels',
    weights: {
      anticipation: 1.0, marking: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      acceleration: 0.6, pace: 0.6,
    },
  },

  boxToBoxMidfielder: {
    name: 'Box-to-Box Midfielder',
    positions: ["CM"],
    duty: 'Support',
    description: 'Box-to-box midfielder with energy to cover every blade of grass',
    weights: {
      stamina: 1.0, workRate: 1.0,
      acceleration: 0.6, anticipation: 0.6, decisions: 0.6, offTheBall: 0.6, pace: 0.6, passing: 0.6, strength: 0.6, tackling: 0.6, teamwork: 0.6,
      finishing: 0.2,
    },
  },

  boxToBoxPlaymaker: {
    name: 'Box-to-Box Playmaker',
    positions: ["CM"],
    duty: 'Support',
    description: 'Box-to-box playmaker combining ball-carrying with tireless energy',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, dribbling: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  channelMidfielder: {
    name: 'Channel Midfielder',
    positions: ["CM"],
    duty: 'Attack',
    description: 'Channel midfielder who makes forward runs between the lines',
    weights: {
      acceleration: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      anticipation: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6, passing: 0.6, vision: 0.6,
    },
  },

  midfieldPlaymaker: {
    name: 'Midfield Playmaker',
    positions: ["CM"],
    duty: 'Support',
    description: 'Midfield playmaker who controls tempo and creates chances',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      anticipation: 0.6, composure: 0.6, offTheBall: 0.6, teamwork: 0.6,
      dribbling: 0.2,
    },
  },

  pressingCentralMidfielder: {
    name: 'Pressing Central Midfielder',
    positions: ["CM"],
    duty: 'Defend',
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
    name: 'Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Support',
    description: 'Wide midfielder who provides width and crossing from wide areas',
    weights: {
      crossing: 1.0, stamina: 1.0, workRate: 1.0,
      acceleration: 0.6, anticipation: 0.6, decisions: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, passing: 0.6,
    },
  },

  trackingWideMidfielder: {
    name: 'Tracking Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Defend',
    description: 'Tracking wide midfielder who tracks opposition runs diligently',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6,
    },
  },

  wideCentralMidfielder: {
    name: 'Wide Central Midfielder',
    positions: ["LM", "RM"],
    duty: 'Support',
    description: 'Wide central midfielder who operates between the lines',
    weights: {
      decisions: 1.0, passing: 1.0, stamina: 1.0, vision: 1.0, workRate: 1.0,
      acceleration: 0.6, firstTouch: 0.6, offTheBall: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  wideOutletWideMidfielder: {
    name: 'Wide Outlet Wide Midfielder',
    positions: ["LM", "RM"],
    duty: 'Defend',
    description: 'Wide outlet midfielder who provides a pass option in wide areas',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
    },
  },


  /* ═══════════════════════════════════════════════════════
     ATTACKING MIDFIELDER
  ═══════════════════════════════════════════════════════ */

  attackingMidfielder: {
    name: 'Attacking Midfielder',
    positions: ["AM"],
    duty: 'Support',
    description: 'Attacking midfielder who links midfield and the final third',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, offTheBall: 0.6, pace: 0.6, vision: 0.6,
    },
  },

  trackingAttackingMidfielder: {
    name: 'Tracking Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    description: 'Tracking attacking midfielder who presses from the front',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, teamwork: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, tackling: 0.6,
    },
  },

  advancedPlaymaker: {
    name: 'Advanced Playmaker',
    positions: ["AM", "CM"],
    duty: 'Support',
    description: 'Advanced playmaker who creates in the final third',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, flair: 0.6, offTheBall: 0.6, pace: 0.6,
    },
  },

  centralOutletAttackingMidfielder: {
    name: 'Central Outlet Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    description: 'Central outlet attacking midfielder who provides a passing option centrally',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      finishing: 0.6,
    },
  },

  splittingOutletAttackingMidfielder: {
    name: 'Splitting Outlet Attacking Midfielder',
    positions: ["AM"],
    duty: 'Defend',
    description: 'Splitting outlet attacking midfielder who plays killer passes between lines',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, dribbling: 0.6, flair: 0.6,
    },
  },

  freeRole: {
    name: 'Free Role',
    positions: ["AM", "CM"],
    duty: 'Attack',
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
    name: 'Winger',
    positions: ["LW", "RW"],
    duty: 'Support',
    description: 'Winger who provides width and delivers crosses from wide positions',
    weights: {
      acceleration: 1.0, crossing: 1.0, pace: 1.0, stamina: 1.0, workRate: 1.0,
      dribbling: 0.6, firstTouch: 0.6, offTheBall: 0.6, technique: 0.6,
    },
  },

  halfSpaceWinger: {
    name: 'Half-Space Winger',
    positions: ["LW", "RW"],
    duty: 'Attack',
    description: 'Half-space winger who operates in the inside channel',
    weights: {
      acceleration: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      anticipation: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6, passing: 0.6, technique: 0.6, vision: 0.6,
    },
  },

  insideWinger: {
    name: 'Inside Winger',
    positions: ["LW", "RW"],
    duty: 'Attack',
    description: 'Inside winger who cuts inside to shoot or create',
    weights: {
      acceleration: 1.0, dribbling: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, anticipation: 0.6, finishing: 0.6, firstTouch: 0.6, flair: 0.6, technique: 0.6,
    },
  },

  invertingOutletWinger: {
    name: 'Inverting Outlet Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    description: 'Inverting outlet winger who tracks back and provides defensive cover',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      decisions: 0.6, firstTouch: 0.6, vision: 0.6,
    },
  },

  trackingWinger: {
    name: 'Tracking Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    description: 'Tracking winger who presses and recovers defensively',
    weights: {
      anticipation: 1.0, positioning: 1.0, stamina: 1.0, tackling: 1.0, workRate: 1.0,
      concentration: 0.6, decisions: 0.6, marking: 0.6, pace: 0.6,
    },
  },

  wideOutletWinger: {
    name: 'Wide Outlet Winger',
    positions: ["LW", "RW"],
    duty: 'Defend',
    description: 'Wide outlet winger who stays wide to provide passing options',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
    },
  },

  widePlaymaker: {
    name: 'Wide Playmaker',
    positions: ["LW", "RW", "LM", "RM"],
    duty: 'Support',
    description: 'Wide playmaker who creates and distributes from wide positions',
    weights: {
      decisions: 1.0, firstTouch: 1.0, passing: 1.0, stamina: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, dribbling: 0.6, flair: 0.6, offTheBall: 0.6, pace: 0.6,
    },
  },

  wideForward: {
    name: 'Wide Forward',
    positions: ["LW", "RW", "LM", "RM"],
    duty: 'Attack',
    description: 'Wide forward who combines goal threat with width',
    weights: {
      acceleration: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, firstTouch: 0.6, technique: 0.6,
    },
  },

  insideForward: {
    name: 'Inside Forward',
    positions: ["LW", "RW"],
    duty: 'Attack',
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
    name: 'Centre Forward',
    positions: ["ST"],
    duty: 'Support',
    description: 'Complete centre-forward combining aerial and technical goal threat',
    weights: {
      anticipation: 1.0, finishing: 1.0, heading: 1.0, offTheBall: 1.0, strength: 1.0,
      acceleration: 0.6, composure: 0.6, decisions: 0.6, firstTouch: 0.6, jumpingReach: 0.6, pace: 0.6,
    },
  },

  falseNine: {
    name: 'False Nine',
    positions: ["ST"],
    duty: 'Support',
    description: 'False nine who drops deep to create space and link play',
    weights: {
      decisions: 1.0, firstTouch: 1.0, offTheBall: 1.0, passing: 1.0, technique: 1.0, vision: 1.0,
      acceleration: 0.6, anticipation: 0.6, composure: 0.6, dribbling: 0.6, finishing: 0.6,
    },
  },

  deepLyingForward: {
    name: 'Deep-Lying Forward',
    positions: ["ST"],
    duty: 'Support',
    description: 'Deep-lying forward who drops to receive and distribute for teammates',
    weights: {
      composure: 1.0, decisions: 1.0, firstTouch: 1.0, passing: 1.0, technique: 1.0,
      anticipation: 0.6, finishing: 0.6, offTheBall: 0.6, strength: 0.6, vision: 0.6,
    },
  },

  halfSpaceForward: {
    name: 'Half-Space Forward',
    positions: ["ST"],
    duty: 'Attack',
    description: 'Half-space forward who exploits channels between defence and wide',
    weights: {
      acceleration: 1.0, anticipation: 1.0, dribbling: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0,
      agility: 0.6, decisions: 0.6, firstTouch: 0.6, technique: 0.6,
    },
  },

  channelForward: {
    name: 'Channel Forward',
    positions: ["ST"],
    duty: 'Attack',
    description: 'Channel forward who makes runs in behind to exploit space',
    weights: {
      acceleration: 1.0, anticipation: 1.0, finishing: 1.0, offTheBall: 1.0, pace: 1.0,
      agility: 0.6, decisions: 0.6, dribbling: 0.6, firstTouch: 0.6,
    },
  },

  secondStriker: {
    name: 'Second Striker',
    positions: ["ST"],
    duty: 'Attack',
    description: 'Second striker who links midfield and attack with energy',
    weights: {
      anticipation: 1.0, decisions: 1.0, finishing: 1.0, offTheBall: 1.0, stamina: 1.0,
      acceleration: 0.6, composure: 0.6, dribbling: 0.6, firstTouch: 0.6, pace: 0.6, technique: 0.6,
    },
  },

  centralOutletCentreForward: {
    name: 'Central Outlet Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    description: 'Central outlet centre-forward who holds up play for direct passes',
    weights: {
      acceleration: 1.0, anticipation: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      finishing: 0.6,
    },
  },

  splittingOutletCentreForward: {
    name: 'Splitting Outlet Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    description: 'Splitting outlet centre-forward who runs in behind to split the defence',
    weights: {
      acceleration: 1.0, anticipation: 1.0, dribbling: 1.0, offTheBall: 1.0, pace: 1.0, stamina: 1.0,
      agility: 0.6, flair: 0.6,
    },
  },

  trackingCentreForward: {
    name: 'Tracking Centre Forward',
    positions: ["ST"],
    duty: 'Defend',
    description: 'Tracking centre-forward who works hard pressing and defending from the front',
    weights: {
      anticipation: 1.0, stamina: 1.0, teamwork: 1.0, workRate: 1.0,
      acceleration: 0.6, offTheBall: 0.6, pace: 0.6, strength: 0.6,
    },
  },

  targetForward: {
    name: 'Target Forward',
    positions: ["ST"],
    duty: 'Support',
    description: 'Target forward who holds up play aerially and brings teammates in',
    weights: {
      anticipation: 1.0, heading: 1.0, jumpingReach: 1.0, strength: 1.0,
      aggression: 0.6, bravery: 0.6, composure: 0.6, finishing: 0.6, firstTouch: 0.6, offTheBall: 0.6,
    },
  },

  poacher: {
    name: 'Poacher',
    positions: ["ST"],
    duty: 'Attack',
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
