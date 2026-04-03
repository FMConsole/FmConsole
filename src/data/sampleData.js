// Sample data modeled after FMDB API structure
// Replace with real data (static JSON or API) when ready

export const SAMPLE_PLAYERS = [
  {
    id: 'p1', name: 'Erling Haaland', firstName: 'Erling', secondName: 'Haaland',
    commonName: 'Haaland', age: 25, dateOfBirth: '2000-07-21',
    country: { id: 'n1', name: 'Norway' }, secondCountry: null,
    basedClub: { id: 'c1', name: 'Manchester City' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'ST', bestPosition: 'Striker', bestRole: 'Advanced Forward',
    currentAbility: 185, potentialAbility: 195,
    preferredFoot: 'Left', height: 194,
    value: { amount: 175000000, currency: 'EUR' },
    wage: { amount: 375000, currency: 'GBP' },
    reputation: { home: 190, current: 195, world: 195 },
    technicalAttributes: {
      corners: 8, crossing: 10, dribbling: 14, finishing: 19, firstTouch: 15,
      freeKicks: 9, heading: 16, longShots: 14, longThrows: 7, marking: 4,
      passing: 12, penaltyTaking: 15, tackling: 5, technique: 15, versatility: 9
    },
    mentalAttributes: {
      aggression: 11, anticipation: 17, bravery: 15, composure: 18,
      concentration: 14, consistency: 16, decisions: 15, determination: 18,
      dirtiness: 5, flair: 12, importantMatches: 17, leadership: 10,
      movement: 18, positioning: 6, teamWork: 11, vision: 12, workRate: 14
    },
    physicalAttributes: {
      acceleration: 16, agility: 13, balance: 14, injuryProneness: 6,
      jumpingReach: 16, naturalFitness: 16, pace: 17, stamina: 15, strength: 17
    },
    positions: [
      { position: 'ST', rating: 20 },
      { position: 'AML', rating: 10 },
      { position: 'AMR', rating: 10 }
    ]
  },
  {
    id: 'p2', name: 'Jude Bellingham', firstName: 'Jude', secondName: 'Bellingham',
    commonName: 'Bellingham', age: 22, dateOfBirth: '2003-06-29',
    country: { id: 'n2', name: 'England' }, secondCountry: null,
    basedClub: { id: 'c4', name: 'Real Madrid' },
    clubCompetition: { id: 'comp3', name: 'La Liga' },
    position: 'AM C', bestPosition: 'Attacking Midfielder', bestRole: 'Mezzala',
    currentAbility: 178, potentialAbility: 190,
    preferredFoot: 'Right', height: 186,
    value: { amount: 150000000, currency: 'EUR' },
    wage: { amount: 320000, currency: 'GBP' },
    reputation: { home: 185, current: 190, world: 188 },
    technicalAttributes: {
      corners: 11, crossing: 13, dribbling: 16, finishing: 15, firstTouch: 16,
      freeKicks: 12, heading: 13, longShots: 15, longThrows: 8, marking: 11,
      passing: 16, penaltyTaking: 13, tackling: 14, technique: 17, versatility: 15
    },
    mentalAttributes: {
      aggression: 13, anticipation: 16, bravery: 16, composure: 16,
      concentration: 15, consistency: 16, decisions: 16, determination: 19,
      dirtiness: 4, flair: 15, importantMatches: 16, leadership: 14,
      movement: 16, positioning: 12, teamWork: 15, vision: 15, workRate: 17
    },
    physicalAttributes: {
      acceleration: 15, agility: 14, balance: 14, injuryProneness: 5,
      jumpingReach: 14, naturalFitness: 16, pace: 15, stamina: 17, strength: 15
    },
    positions: [
      { position: 'AM C', rating: 20 },
      { position: 'MC', rating: 17 },
      { position: 'AM R', rating: 14 }
    ]
  },
  {
    id: 'p3', name: 'Florian Wirtz', firstName: 'Florian', secondName: 'Wirtz',
    commonName: 'Wirtz', age: 22, dateOfBirth: '2003-05-03',
    country: { id: 'n3', name: 'Germany' }, secondCountry: null,
    basedClub: { id: 'c5', name: 'Bayer Leverkusen' },
    clubCompetition: { id: 'comp4', name: 'Bundesliga' },
    position: 'AM C', bestPosition: 'Attacking Midfielder', bestRole: 'Trequartista',
    currentAbility: 172, potentialAbility: 188,
    preferredFoot: 'Right', height: 176,
    value: { amount: 130000000, currency: 'EUR' },
    wage: { amount: 180000, currency: 'GBP' },
    reputation: { home: 178, current: 180, world: 175 },
    technicalAttributes: {
      corners: 13, crossing: 14, dribbling: 18, finishing: 15, firstTouch: 17,
      freeKicks: 14, heading: 8, longShots: 16, longThrows: 5, marking: 6,
      passing: 17, penaltyTaking: 14, tackling: 8, technique: 19, versatility: 14
    },
    mentalAttributes: {
      aggression: 8, anticipation: 16, bravery: 12, composure: 17,
      concentration: 14, consistency: 14, decisions: 16, determination: 16,
      dirtiness: 3, flair: 18, importantMatches: 15, leadership: 10,
      movement: 16, positioning: 7, teamWork: 13, vision: 18, workRate: 13
    },
    physicalAttributes: {
      acceleration: 16, agility: 17, balance: 16, injuryProneness: 5,
      jumpingReach: 9, naturalFitness: 14, pace: 15, stamina: 13, strength: 10
    },
    positions: [
      { position: 'AM C', rating: 20 },
      { position: 'AM R', rating: 16 },
      { position: 'AM L', rating: 15 }
    ]
  },
  {
    id: 'p4', name: 'Vinicius Junior', firstName: 'Vinicius', secondName: 'Junior',
    commonName: 'Vinicius Jr', age: 25, dateOfBirth: '2000-07-12',
    country: { id: 'n4', name: 'Brazil' }, secondCountry: null,
    basedClub: { id: 'c4', name: 'Real Madrid' },
    clubCompetition: { id: 'comp3', name: 'La Liga' },
    position: 'AM L', bestPosition: 'Left Winger', bestRole: 'Inside Forward',
    currentAbility: 180, potentialAbility: 188,
    preferredFoot: 'Right', height: 176,
    value: { amount: 180000000, currency: 'EUR' },
    wage: { amount: 350000, currency: 'GBP' },
    reputation: { home: 185, current: 192, world: 190 },
    technicalAttributes: {
      corners: 10, crossing: 14, dribbling: 19, finishing: 16, firstTouch: 17,
      freeKicks: 12, heading: 9, longShots: 13, longThrows: 6, marking: 4,
      passing: 13, penaltyTaking: 13, tackling: 7, technique: 18, versatility: 12
    },
    mentalAttributes: {
      aggression: 10, anticipation: 16, bravery: 14, composure: 15,
      concentration: 13, consistency: 14, decisions: 14, determination: 17,
      dirtiness: 6, flair: 19, importantMatches: 16, leadership: 9,
      movement: 17, positioning: 5, teamWork: 12, vision: 14, workRate: 14
    },
    physicalAttributes: {
      acceleration: 19, agility: 18, balance: 16, injuryProneness: 5,
      jumpingReach: 10, naturalFitness: 15, pace: 18, stamina: 14, strength: 11
    },
    positions: [
      { position: 'AM L', rating: 20 },
      { position: 'ST', rating: 14 },
      { position: 'AM R', rating: 13 }
    ]
  },
  {
    id: 'p5', name: 'Rodri', firstName: 'Rodrigo', secondName: 'Hernandez',
    commonName: 'Rodri', age: 29, dateOfBirth: '1996-06-22',
    country: { id: 'n5', name: 'Spain' }, secondCountry: null,
    basedClub: { id: 'c1', name: 'Manchester City' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'DM', bestPosition: 'Defensive Midfielder', bestRole: 'Deep-Lying Playmaker',
    currentAbility: 182, potentialAbility: 184,
    preferredFoot: 'Right', height: 191,
    value: { amount: 120000000, currency: 'EUR' },
    wage: { amount: 300000, currency: 'GBP' },
    reputation: { home: 185, current: 188, world: 186 },
    technicalAttributes: {
      corners: 10, crossing: 11, dribbling: 14, finishing: 12, firstTouch: 16,
      freeKicks: 11, heading: 12, longShots: 15, longThrows: 7, marking: 14,
      passing: 18, penaltyTaking: 12, tackling: 16, technique: 16, versatility: 13
    },
    mentalAttributes: {
      aggression: 11, anticipation: 17, bravery: 14, composure: 18,
      concentration: 17, consistency: 18, decisions: 18, determination: 16,
      dirtiness: 3, flair: 12, importantMatches: 18, leadership: 16,
      movement: 14, positioning: 17, teamWork: 17, vision: 17, workRate: 16
    },
    physicalAttributes: {
      acceleration: 12, agility: 12, balance: 14, injuryProneness: 10,
      jumpingReach: 13, naturalFitness: 15, pace: 12, stamina: 16, strength: 15
    },
    positions: [
      { position: 'DM', rating: 20 },
      { position: 'MC', rating: 17 },
      { position: 'DC', rating: 12 }
    ]
  },
  {
    id: 'p6', name: 'Kylian Mbappe', firstName: 'Kylian', secondName: 'Mbappe',
    commonName: 'Mbappe', age: 27, dateOfBirth: '1998-12-20',
    country: { id: 'n6', name: 'France' }, secondCountry: null,
    basedClub: { id: 'c4', name: 'Real Madrid' },
    clubCompetition: { id: 'comp3', name: 'La Liga' },
    position: 'ST', bestPosition: 'Striker', bestRole: 'Advanced Forward',
    currentAbility: 186, potentialAbility: 192,
    preferredFoot: 'Right', height: 178,
    value: { amount: 180000000, currency: 'EUR' },
    wage: { amount: 400000, currency: 'GBP' },
    reputation: { home: 192, current: 195, world: 195 },
    technicalAttributes: {
      corners: 8, crossing: 13, dribbling: 18, finishing: 19, firstTouch: 16,
      freeKicks: 11, heading: 12, longShots: 15, longThrows: 6, marking: 3,
      passing: 14, penaltyTaking: 15, tackling: 5, technique: 17, versatility: 11
    },
    mentalAttributes: {
      aggression: 10, anticipation: 18, bravery: 14, composure: 17,
      concentration: 14, consistency: 16, decisions: 16, determination: 18,
      dirtiness: 4, flair: 17, importantMatches: 18, leadership: 12,
      movement: 19, positioning: 5, teamWork: 11, vision: 14, workRate: 13
    },
    physicalAttributes: {
      acceleration: 20, agility: 17, balance: 15, injuryProneness: 6,
      jumpingReach: 12, naturalFitness: 17, pace: 20, stamina: 15, strength: 14
    },
    positions: [
      { position: 'ST', rating: 20 },
      { position: 'AM L', rating: 18 },
      { position: 'AM R', rating: 15 }
    ]
  },
  {
    id: 'p7', name: 'William Saliba', firstName: 'William', secondName: 'Saliba',
    commonName: 'Saliba', age: 24, dateOfBirth: '2001-03-24',
    country: { id: 'n6', name: 'France' }, secondCountry: null,
    basedClub: { id: 'c3', name: 'Arsenal' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'DC', bestPosition: 'Centre Back', bestRole: 'Ball-Playing Defender',
    currentAbility: 170, potentialAbility: 180,
    preferredFoot: 'Right', height: 192,
    value: { amount: 90000000, currency: 'EUR' },
    wage: { amount: 200000, currency: 'GBP' },
    reputation: { home: 170, current: 172, world: 168 },
    technicalAttributes: {
      corners: 3, crossing: 5, dribbling: 10, finishing: 4, firstTouch: 13,
      freeKicks: 4, heading: 15, longShots: 5, longThrows: 6, marking: 16,
      passing: 14, penaltyTaking: 5, tackling: 17, technique: 12, versatility: 10
    },
    mentalAttributes: {
      aggression: 12, anticipation: 16, bravery: 16, composure: 16,
      concentration: 16, consistency: 16, decisions: 15, determination: 15,
      dirtiness: 4, flair: 8, importantMatches: 15, leadership: 13,
      movement: 8, positioning: 17, teamWork: 15, vision: 11, workRate: 14
    },
    physicalAttributes: {
      acceleration: 14, agility: 13, balance: 13, injuryProneness: 5,
      jumpingReach: 16, naturalFitness: 16, pace: 15, stamina: 14, strength: 16
    },
    positions: [
      { position: 'DC', rating: 20 },
      { position: 'DM', rating: 12 }
    ]
  },
  {
    id: 'p8', name: 'Bukayo Saka', firstName: 'Bukayo', secondName: 'Saka',
    commonName: 'Saka', age: 24, dateOfBirth: '2001-09-05',
    country: { id: 'n2', name: 'England' }, secondCountry: null,
    basedClub: { id: 'c3', name: 'Arsenal' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'AM R', bestPosition: 'Right Winger', bestRole: 'Inverted Winger',
    currentAbility: 174, potentialAbility: 185,
    preferredFoot: 'Left', height: 178,
    value: { amount: 120000000, currency: 'EUR' },
    wage: { amount: 250000, currency: 'GBP' },
    reputation: { home: 178, current: 180, world: 175 },
    technicalAttributes: {
      corners: 13, crossing: 16, dribbling: 17, finishing: 15, firstTouch: 16,
      freeKicks: 13, heading: 9, longShots: 13, longThrows: 6, marking: 8,
      passing: 15, penaltyTaking: 14, tackling: 12, technique: 17, versatility: 14
    },
    mentalAttributes: {
      aggression: 10, anticipation: 15, bravery: 14, composure: 15,
      concentration: 14, consistency: 15, decisions: 15, determination: 17,
      dirtiness: 3, flair: 16, importantMatches: 15, leadership: 11,
      movement: 16, positioning: 8, teamWork: 14, vision: 15, workRate: 16
    },
    physicalAttributes: {
      acceleration: 17, agility: 16, balance: 15, injuryProneness: 5,
      jumpingReach: 10, naturalFitness: 15, pace: 16, stamina: 15, strength: 12
    },
    positions: [
      { position: 'AM R', rating: 20 },
      { position: 'WB R', rating: 15 },
      { position: 'AM L', rating: 14 }
    ]
  },
  {
    id: 'p9', name: 'Lamine Yamal', firstName: 'Lamine', secondName: 'Yamal',
    commonName: 'Lamine Yamal', age: 18, dateOfBirth: '2007-07-13',
    country: { id: 'n5', name: 'Spain' }, secondCountry: null,
    basedClub: { id: 'c6', name: 'Barcelona' },
    clubCompetition: { id: 'comp3', name: 'La Liga' },
    position: 'AM R', bestPosition: 'Right Winger', bestRole: 'Inside Forward',
    currentAbility: 165, potentialAbility: 196,
    preferredFoot: 'Left', height: 180,
    value: { amount: 150000000, currency: 'EUR' },
    wage: { amount: 150000, currency: 'GBP' },
    reputation: { home: 175, current: 178, world: 176 },
    technicalAttributes: {
      corners: 12, crossing: 15, dribbling: 18, finishing: 14, firstTouch: 17,
      freeKicks: 13, heading: 7, longShots: 14, longThrows: 5, marking: 4,
      passing: 16, penaltyTaking: 12, tackling: 6, technique: 18, versatility: 13
    },
    mentalAttributes: {
      aggression: 8, anticipation: 15, bravery: 13, composure: 16,
      concentration: 13, consistency: 12, decisions: 15, determination: 16,
      dirtiness: 3, flair: 19, importantMatches: 14, leadership: 8,
      movement: 15, positioning: 5, teamWork: 12, vision: 17, workRate: 12
    },
    physicalAttributes: {
      acceleration: 18, agility: 17, balance: 16, injuryProneness: 4,
      jumpingReach: 9, naturalFitness: 16, pace: 17, stamina: 13, strength: 9
    },
    positions: [
      { position: 'AM R', rating: 20 },
      { position: 'AM L', rating: 16 },
      { position: 'AM C', rating: 13 }
    ]
  },
  {
    id: 'p10', name: 'Alisson Becker', firstName: 'Alisson', secondName: 'Becker',
    commonName: 'Alisson', age: 33, dateOfBirth: '1992-10-02',
    country: { id: 'n4', name: 'Brazil' }, secondCountry: null,
    basedClub: { id: 'c2', name: 'Liverpool' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'GK', bestPosition: 'Goalkeeper', bestRole: 'Sweeper Keeper',
    currentAbility: 178, potentialAbility: 180,
    preferredFoot: 'Right', height: 191,
    value: { amount: 35000000, currency: 'EUR' },
    wage: { amount: 250000, currency: 'GBP' },
    reputation: { home: 180, current: 182, world: 180 },
    goalkeepingAttributes: {
      aerialAbility: 16, commandOfArea: 17, communication: 16, eccentricity: 6,
      handling: 18, kicking: 15, oneOnOnes: 17, reflexes: 18,
      rushingOut: 14, tendencyToPunch: 5, throwing: 15
    },
    technicalAttributes: {
      corners: 1, crossing: 1, dribbling: 4, finishing: 1, firstTouch: 13,
      freeKicks: 1, heading: 3, longShots: 1, longThrows: 8, marking: 1,
      passing: 14, penaltyTaking: 5, tackling: 3, technique: 8, versatility: 1
    },
    mentalAttributes: {
      aggression: 6, anticipation: 17, bravery: 15, composure: 18,
      concentration: 17, consistency: 17, decisions: 16, determination: 15,
      dirtiness: 2, flair: 10, importantMatches: 17, leadership: 14,
      movement: 4, positioning: 6, teamWork: 13, vision: 14, workRate: 10
    },
    physicalAttributes: {
      acceleration: 12, agility: 14, balance: 13, injuryProneness: 5,
      jumpingReach: 14, naturalFitness: 14, pace: 12, stamina: 12, strength: 13
    },
    positions: [
      { position: 'GK', rating: 20 }
    ]
  },
  {
    id: 'p11', name: 'Phil Foden', firstName: 'Phil', secondName: 'Foden',
    commonName: 'Foden', age: 25, dateOfBirth: '2000-05-28',
    country: { id: 'n2', name: 'England' }, secondCountry: null,
    basedClub: { id: 'c1', name: 'Manchester City' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'AM L', bestPosition: 'Left Winger', bestRole: 'Inside Forward',
    currentAbility: 174, potentialAbility: 184,
    preferredFoot: 'Left', height: 171,
    value: { amount: 110000000, currency: 'EUR' },
    wage: { amount: 280000, currency: 'GBP' },
    reputation: { home: 178, current: 176, world: 174 },
    technicalAttributes: {
      corners: 14, crossing: 14, dribbling: 18, finishing: 16, firstTouch: 17,
      freeKicks: 14, heading: 8, longShots: 16, longThrows: 5, marking: 6,
      passing: 16, penaltyTaking: 13, tackling: 8, technique: 18, versatility: 15
    },
    mentalAttributes: {
      aggression: 8, anticipation: 16, bravery: 12, composure: 16,
      concentration: 14, consistency: 15, decisions: 16, determination: 16,
      dirtiness: 3, flair: 17, importantMatches: 15, leadership: 10,
      movement: 17, positioning: 6, teamWork: 14, vision: 16, workRate: 14
    },
    physicalAttributes: {
      acceleration: 16, agility: 17, balance: 17, injuryProneness: 5,
      jumpingReach: 8, naturalFitness: 14, pace: 15, stamina: 14, strength: 10
    },
    positions: [
      { position: 'AM L', rating: 20 },
      { position: 'AM C', rating: 18 },
      { position: 'MC', rating: 15 }
    ]
  },
  {
    id: 'p12', name: 'Virgil van Dijk', firstName: 'Virgil', secondName: 'van Dijk',
    commonName: 'Van Dijk', age: 34, dateOfBirth: '1991-07-08',
    country: { id: 'n7', name: 'Netherlands' }, secondCountry: null,
    basedClub: { id: 'c2', name: 'Liverpool' },
    clubCompetition: { id: 'comp1', name: 'Premier League' },
    position: 'DC', bestPosition: 'Centre Back', bestRole: 'Ball-Playing Defender',
    currentAbility: 176, potentialAbility: 178,
    preferredFoot: 'Right', height: 193,
    value: { amount: 30000000, currency: 'EUR' },
    wage: { amount: 280000, currency: 'GBP' },
    reputation: { home: 180, current: 182, world: 180 },
    technicalAttributes: {
      corners: 3, crossing: 6, dribbling: 10, finishing: 5, firstTouch: 14,
      freeKicks: 5, heading: 18, longShots: 6, longThrows: 8, marking: 17,
      passing: 15, penaltyTaking: 6, tackling: 18, technique: 12, versatility: 9
    },
    mentalAttributes: {
      aggression: 13, anticipation: 17, bravery: 17, composure: 18,
      concentration: 17, consistency: 17, decisions: 16, determination: 17,
      dirtiness: 5, flair: 8, importantMatches: 18, leadership: 18,
      movement: 7, positioning: 18, teamWork: 16, vision: 12, workRate: 14
    },
    physicalAttributes: {
      acceleration: 13, agility: 12, balance: 14, injuryProneness: 6,
      jumpingReach: 18, naturalFitness: 14, pace: 14, stamina: 14, strength: 18
    },
    positions: [
      { position: 'DC', rating: 20 }
    ]
  }
]

export const SAMPLE_CLUBS = [
  {
    id: 'c1', name: 'Manchester City', nameShort: 'Man City',
    country: { id: 'n2', name: 'England' }, continent: 'Europe',
    competition: { id: 'comp1', name: 'Premier League' },
    city: 'Manchester', yearFounded: 1880,
    reputation: 190, professionalStatus: 'Professional',
    stadium: { id: 's1', name: 'Etihad Stadium', capacity: 53400 },
    youth: { facilities: 18, coaching: 18, recruitment: 18, importance: 16 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#6CABDD', shorts: '#FFFFFF', trim: '#1C2C5B' },
    captain: { id: 'p5', name: 'Rodri' },
    balance: 150000000, transferBudget: 200000000
  },
  {
    id: 'c2', name: 'Liverpool', nameShort: 'Liverpool',
    country: { id: 'n2', name: 'England' }, continent: 'Europe',
    competition: { id: 'comp1', name: 'Premier League' },
    city: 'Liverpool', yearFounded: 1892,
    reputation: 188, professionalStatus: 'Professional',
    stadium: { id: 's2', name: 'Anfield', capacity: 61276 },
    youth: { facilities: 17, coaching: 17, recruitment: 17, importance: 16 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#C8102E', shorts: '#C8102E', trim: '#FFFFFF' },
    captain: { id: 'p12', name: 'Virgil van Dijk' },
    balance: 100000000, transferBudget: 150000000
  },
  {
    id: 'c3', name: 'Arsenal', nameShort: 'Arsenal',
    country: { id: 'n2', name: 'England' }, continent: 'Europe',
    competition: { id: 'comp1', name: 'Premier League' },
    city: 'London', yearFounded: 1886,
    reputation: 186, professionalStatus: 'Professional',
    stadium: { id: 's3', name: 'Emirates Stadium', capacity: 60704 },
    youth: { facilities: 17, coaching: 17, recruitment: 16, importance: 16 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#EF0107', shorts: '#FFFFFF', trim: '#FFFFFF' },
    captain: { id: 'p8', name: 'Bukayo Saka' },
    balance: 80000000, transferBudget: 120000000
  },
  {
    id: 'c4', name: 'Real Madrid', nameShort: 'Real Madrid',
    country: { id: 'n5', name: 'Spain' }, continent: 'Europe',
    competition: { id: 'comp3', name: 'La Liga' },
    city: 'Madrid', yearFounded: 1902,
    reputation: 196, professionalStatus: 'Professional',
    stadium: { id: 's4', name: 'Santiago Bernabeu', capacity: 83186 },
    youth: { facilities: 18, coaching: 18, recruitment: 18, importance: 14 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#FFFFFF', shorts: '#FFFFFF', trim: '#FFB800' },
    captain: { id: 'p6', name: 'Kylian Mbappe' },
    balance: 200000000, transferBudget: 300000000
  },
  {
    id: 'c5', name: 'Bayer Leverkusen', nameShort: 'Leverkusen',
    country: { id: 'n3', name: 'Germany' }, continent: 'Europe',
    competition: { id: 'comp4', name: 'Bundesliga' },
    city: 'Leverkusen', yearFounded: 1904,
    reputation: 172, professionalStatus: 'Professional',
    stadium: { id: 's5', name: 'BayArena', capacity: 30210 },
    youth: { facilities: 16, coaching: 16, recruitment: 15, importance: 14 },
    trainingFacilities: 'Great',
    kitColors: { shirt: '#E32221', shorts: '#000000', trim: '#000000' },
    captain: null,
    balance: 60000000, transferBudget: 80000000
  },
  {
    id: 'c6', name: 'Barcelona', nameShort: 'Barcelona',
    country: { id: 'n5', name: 'Spain' }, continent: 'Europe',
    competition: { id: 'comp3', name: 'La Liga' },
    city: 'Barcelona', yearFounded: 1899,
    reputation: 194, professionalStatus: 'Professional',
    stadium: { id: 's6', name: 'Spotify Camp Nou', capacity: 99354 },
    youth: { facilities: 19, coaching: 19, recruitment: 18, importance: 18 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#004D98', shorts: '#004D98', trim: '#A50044' },
    captain: null,
    balance: 30000000, transferBudget: 100000000
  },
  {
    id: 'c7', name: 'Bayern Munich', nameShort: 'Bayern',
    country: { id: 'n3', name: 'Germany' }, continent: 'Europe',
    competition: { id: 'comp4', name: 'Bundesliga' },
    city: 'Munich', yearFounded: 1900,
    reputation: 192, professionalStatus: 'Professional',
    stadium: { id: 's7', name: 'Allianz Arena', capacity: 75024 },
    youth: { facilities: 18, coaching: 18, recruitment: 17, importance: 14 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#DC052D', shorts: '#DC052D', trim: '#FFFFFF' },
    captain: null,
    balance: 180000000, transferBudget: 200000000
  },
  {
    id: 'c8', name: 'Paris Saint-Germain', nameShort: 'PSG',
    country: { id: 'n6', name: 'France' }, continent: 'Europe',
    competition: { id: 'comp5', name: 'Ligue 1' },
    city: 'Paris', yearFounded: 1970,
    reputation: 188, professionalStatus: 'Professional',
    stadium: { id: 's8', name: 'Parc des Princes', capacity: 47929 },
    youth: { facilities: 17, coaching: 17, recruitment: 16, importance: 12 },
    trainingFacilities: 'Excellent',
    kitColors: { shirt: '#004170', shorts: '#004170', trim: '#DA291C' },
    captain: null,
    balance: 250000000, transferBudget: 300000000
  },
  {
    id: 'c9', name: 'Inter Milan', nameShort: 'Inter',
    country: { id: 'n8', name: 'Italy' }, continent: 'Europe',
    competition: { id: 'comp6', name: 'Serie A' },
    city: 'Milan', yearFounded: 1908,
    reputation: 182, professionalStatus: 'Professional',
    stadium: { id: 's9', name: 'San Siro', capacity: 75923 },
    youth: { facilities: 16, coaching: 16, recruitment: 15, importance: 14 },
    trainingFacilities: 'Great',
    kitColors: { shirt: '#010E80', shorts: '#000000', trim: '#000000' },
    captain: null,
    balance: 40000000, transferBudget: 60000000
  },
  {
    id: 'c10', name: 'Borussia Dortmund', nameShort: 'Dortmund',
    country: { id: 'n3', name: 'Germany' }, continent: 'Europe',
    competition: { id: 'comp4', name: 'Bundesliga' },
    city: 'Dortmund', yearFounded: 1909,
    reputation: 178, professionalStatus: 'Professional',
    stadium: { id: 's10', name: 'Signal Iduna Park', capacity: 81365 },
    youth: { facilities: 17, coaching: 16, recruitment: 17, importance: 16 },
    trainingFacilities: 'Great',
    kitColors: { shirt: '#FDE100', shorts: '#000000', trim: '#000000' },
    captain: null,
    balance: 50000000, transferBudget: 70000000
  }
]

export const SAMPLE_COMPETITIONS = [
  {
    id: 'comp1', name: 'Premier League', nameShort: 'EPL', type: 'club',
    country: { id: 'n2', name: 'England' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 20, reputation: 195
  },
  {
    id: 'comp2', name: 'EFL Championship', nameShort: 'Championship', type: 'club',
    country: { id: 'n2', name: 'England' }, continent: 'Europe',
    tier: 2, format: 'League', teams: 24, reputation: 140
  },
  {
    id: 'comp3', name: 'La Liga', nameShort: 'La Liga', type: 'club',
    country: { id: 'n5', name: 'Spain' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 20, reputation: 190
  },
  {
    id: 'comp4', name: 'Bundesliga', nameShort: 'Bundesliga', type: 'club',
    country: { id: 'n3', name: 'Germany' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 18, reputation: 185
  },
  {
    id: 'comp5', name: 'Ligue 1', nameShort: 'Ligue 1', type: 'club',
    country: { id: 'n6', name: 'France' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 18, reputation: 170
  },
  {
    id: 'comp6', name: 'Serie A', nameShort: 'Serie A', type: 'club',
    country: { id: 'n8', name: 'Italy' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 20, reputation: 182
  },
  {
    id: 'comp7', name: 'Eredivisie', nameShort: 'Eredivisie', type: 'club',
    country: { id: 'n7', name: 'Netherlands' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 18, reputation: 145
  },
  {
    id: 'comp8', name: 'Liga Portugal', nameShort: 'Liga Portugal', type: 'club',
    country: { id: 'n9', name: 'Portugal' }, continent: 'Europe',
    tier: 1, format: 'League', teams: 18, reputation: 148
  },
  {
    id: 'comp9', name: 'UEFA Champions League', nameShort: 'UCL', type: 'club',
    country: null, continent: 'Europe',
    tier: 0, format: 'Cup', teams: 36, reputation: 200
  },
  {
    id: 'comp10', name: 'UEFA Europa League', nameShort: 'UEL', type: 'club',
    country: null, continent: 'Europe',
    tier: 0, format: 'Cup', teams: 36, reputation: 170
  },
  {
    id: 'ncomp1', name: 'FIFA World Cup', nameShort: 'World Cup', type: 'national',
    country: null, continent: null,
    tier: 0, format: 'Cup', teams: 48, reputation: 200
  },
  {
    id: 'ncomp2', name: 'UEFA European Championship', nameShort: 'Euros', type: 'national',
    country: null, continent: 'Europe',
    tier: 0, format: 'Cup', teams: 24, reputation: 195
  },
  {
    id: 'ncomp3', name: 'Copa America', nameShort: 'Copa America', type: 'national',
    country: null, continent: 'South America',
    tier: 0, format: 'Cup', teams: 16, reputation: 185
  },
  {
    id: 'ncomp4', name: 'Africa Cup of Nations', nameShort: 'AFCON', type: 'national',
    country: null, continent: 'Africa',
    tier: 0, format: 'Cup', teams: 24, reputation: 160
  }
]

export const SAMPLE_NATIONS = [
  {
    id: 'n1', name: 'Norway', continent: 'Europe',
    fifaRanking: 45, reputation: 90,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n2', name: 'England', continent: 'Europe',
    fifaRanking: 4, reputation: 185,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n3', name: 'Germany', continent: 'Europe',
    fifaRanking: 11, reputation: 182,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n4', name: 'Brazil', continent: 'South America',
    fifaRanking: 5, reputation: 190,
    competitions: ['ncomp1', 'ncomp3']
  },
  {
    id: 'n5', name: 'Spain', continent: 'Europe',
    fifaRanking: 3, reputation: 188,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n6', name: 'France', continent: 'Europe',
    fifaRanking: 2, reputation: 192,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n7', name: 'Netherlands', continent: 'Europe',
    fifaRanking: 7, reputation: 178,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n8', name: 'Italy', continent: 'Europe',
    fifaRanking: 9, reputation: 180,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n9', name: 'Portugal', continent: 'Europe',
    fifaRanking: 6, reputation: 182,
    competitions: ['ncomp1', 'ncomp2']
  },
  {
    id: 'n10', name: 'Argentina', continent: 'South America',
    fifaRanking: 1, reputation: 192,
    competitions: ['ncomp1', 'ncomp3']
  },
  {
    id: 'n11', name: 'Nigeria', continent: 'Africa',
    fifaRanking: 28, reputation: 130,
    competitions: ['ncomp1', 'ncomp4']
  },
  {
    id: 'n12', name: 'Japan', continent: 'Asia',
    fifaRanking: 15, reputation: 120,
    competitions: ['ncomp1']
  }
]

// Position display names for UI
export const POSITION_LABELS = {
  'GK': 'Goalkeeper',
  'DC': 'Centre Back',
  'DL': 'Left Back',
  'DR': 'Right Back',
  'WBL': 'Wing Back (L)',
  'WBR': 'Wing Back (R)',
  'DM': 'Defensive Mid',
  'MC': 'Central Mid',
  'ML': 'Left Mid',
  'MR': 'Right Mid',
  'AMC': 'Att. Mid (C)',
  'AML': 'Att. Mid (L)',
  'AMR': 'Att. Mid (R)',
  'AM C': 'Att. Mid (C)',
  'AM L': 'Left Winger',
  'AM R': 'Right Winger',
  'WB L': 'Wing Back (L)',
  'WB R': 'Wing Back (R)',
  'ST': 'Striker',
  'STC': 'Striker'
}

// Continent list for filters
export const CONTINENTS = ['Europe', 'South America', 'North America', 'Africa', 'Asia', 'Oceania']

// Helper: format currency values
export function formatValue(amount) {
  if (!amount) return '-'
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`
  return `€${amount}`
}

// Helper: format wage
export function formatWage(wage) {
  if (!wage?.amount) return '-'
  return `£${(wage.amount / 1000).toFixed(0)}K p/w`
}

// Helper: get attribute color based on value (1-20)
export function getAttrColor(val) {
  if (val >= 16) return '#00C853'
  if (val >= 12) return '#0066FF'
  if (val >= 8) return '#FF6B00'
  return '#FF2D47'
}

// Helper: star rating from reputation (1-200 → 0.5-5 stars)
export function getStarRating(rep) {
  if (!rep) return 0
  return Math.round((rep / 200) * 10) / 2
}
