import C from '../theme/colors'

export const ATTRIBUTE_GROUPS = {
  technical: [
    { key: 'corners', label: 'Corners' },
    { key: 'crossing', label: 'Crossing' },
    { key: 'dribbling', label: 'Dribbling' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'firstTouch', label: 'First Touch' },
    { key: 'freeKickTaking', label: 'Free Kick Taking' },
    { key: 'heading', label: 'Heading' },
    { key: 'longShots', label: 'Long Shots' },
    { key: 'longThrows', label: 'Long Throws' },
    { key: 'marking', label: 'Marking' },
    { key: 'passing', label: 'Passing' },
    { key: 'penaltyTaking', label: 'Penalty Taking' },
    { key: 'tackling', label: 'Tackling' },
    { key: 'technique', label: 'Technique' },
  ],
  mental: [
    { key: 'aggression', label: 'Aggression' },
    { key: 'anticipation', label: 'Anticipation' },
    { key: 'bravery', label: 'Bravery' },
    { key: 'composure', label: 'Composure' },
    { key: 'concentration', label: 'Concentration' },
    { key: 'decisions', label: 'Decisions' },
    { key: 'determination', label: 'Determination' },
    { key: 'flair', label: 'Flair' },
    { key: 'leadership', label: 'Leadership' },
    { key: 'offTheBall', label: 'Off the Ball' },
    { key: 'positioning', label: 'Positioning' },
    { key: 'teamwork', label: 'Teamwork' },
    { key: 'vision', label: 'Vision' },
    { key: 'workRate', label: 'Work Rate' },
  ],
  physical: [
    { key: 'acceleration', label: 'Acceleration' },
    { key: 'agility', label: 'Agility' },
    { key: 'balance', label: 'Balance' },
    { key: 'jumpingReach', label: 'Jumping Reach' },
    { key: 'naturalFitness', label: 'Natural Fitness' },
    { key: 'pace', label: 'Pace' },
    { key: 'stamina', label: 'Stamina' },
    { key: 'strength', label: 'Strength' },
  ],
}

export const CATEGORY_COLORS = {
  Technique: C.blue,
  Dribbling: C.green,
  Finishing: C.orange,
  Movement: C.purple,
  Passing: C.blueLight,
  Defensive: '#E05050',
  Mental: '#FFD600',
}

export const ATTR_KEY_TO_LABEL = {}
for (const group of Object.values(ATTRIBUTE_GROUPS)) {
  for (const attr of group) {
    ATTR_KEY_TO_LABEL[attr.key] = attr.label
  }
}

export const TRAITS = [
  // Technique (4)
  { name: 'Curls Ball', category: 'Technique', requiredAttributes: ['technique', 'flair', 'bravery', 'composure'], description: "Improves the player's ability to curl the ball above and beyond his ability as already determined by his attributes." },
  { name: 'Tries Tricks', category: 'Technique', requiredAttributes: ['flair', 'technique', 'bravery', 'determination', 'workRate'], description: 'Increases the chances of a player displaying more flair during matches and can result in a greater array of skills being used.' },
  { name: 'Uses Outside of Foot', category: 'Technique', requiredAttributes: ['flair', 'bravery', 'technique', 'passing', 'finishing', 'determination', 'vision', 'agility'], description: 'Increases the likelihood of a player trying to use the outside of his stronger foot rather than his weaker foot, even if the weaker foot is the more natural option for his body position.' },

  // Defensive (4)
  { name: 'Brings Ball Out of Defense', category: 'Defensive', requiredAttributes: ['dribbling', 'vision', 'bravery', 'composure', 'technique'], description: 'Increases the likelihood of a defender running with the ball into midfield positions.' },
  { name: 'Dives Into Tackles', category: 'Defensive', requiredAttributes: ['anticipation', 'decisions', 'positioning', 'tackling', 'strength', 'teamwork', 'determination'], description: 'Increases the frequency with which a player will engage in a tackle. It does not simply mean the player goes to ground when challenging for the ball.' },
  { name: 'Does Not Dive Into Tackles', category: 'Defensive', requiredAttributes: ['tackling', 'positioning', 'teamwork', 'acceleration', 'balance', 'pace', 'strength', 'stamina', 'jumpingReach'], description: 'Decreases the frequency with which a player will engage into a tackle. It does not simply mean the player stays on his feet when challenging for the ball.' },
  { name: 'Marks Opponent Tightly', category: 'Defensive', requiredAttributes: ['marking', 'anticipation', 'acceleration', 'agility', 'pace', 'heading', 'tackling', 'balance', 'strength', 'workRate', 'aggression', 'jumpingReach'], description: "Increases the chances of a player being successful when asked to adopt tight marking, but his overall success is still controlled by his full set of attributes." },

  // Passing (7)
  { name: 'Crosses Early', category: 'Passing', requiredAttributes: ['crossing', 'passing', 'technique', 'vision', 'teamwork', 'concentration', 'decisions'], description: 'Increases the chances of a player crossing from a deeper position, rather than seeking to find a better opportunity higher up the pitch.' },
  { name: 'Likes to Switch Ball to Other Flank', category: 'Passing', requiredAttributes: ['anticipation', 'passing', 'technique', 'decisions', 'teamwork', 'vision'], description: 'Increases the frequency of a player looking to move the ball from one side of the pitch to the other.' },
  { name: 'Looks for Pass Rather than Attempting to Score', category: 'Passing', requiredAttributes: ['passing', 'anticipation', 'decisions', 'technique', 'vision', 'teamwork'], description: "Increases the chances of a player opting to give a scoring chance to a team-mate rather than take it on himself. The success of the decision will be based off the player's attributes." },
  { name: 'Plays One-Twos', category: 'Passing', requiredAttributes: ['passing', 'anticipation', 'teamwork', 'acceleration', 'offTheBall', 'firstTouch', 'technique', 'determination', 'strength', 'balance'], description: 'Increases the frequency with which a player will make a pass and immediately want to receive the ball again, having moved into an advantageous position.' },
  { name: 'Tries Killer Balls Often', category: 'Passing', requiredAttributes: ['anticipation', 'passing', 'technique', 'teamwork', 'flair', 'vision', 'decisions'], description: 'Increases the frequency with which a player will attempt through balls.' },
  { name: 'Tries Long Range Passes', category: 'Passing', requiredAttributes: ['passing', 'technique', 'teamwork', 'vision', 'decisions', 'anticipation'], description: 'Increases the chances of a player attempting to pass the ball over longer distances.' },

  // Dribbling (5)
  { name: 'Knocks Ball Past Opponents', category: 'Dribbling', requiredAttributes: ['workRate', 'acceleration', 'agility', 'pace', 'firstTouch', 'technique'], description: 'Increases the chances of a player looking to beat his immediate opponent for sheer pace and athleticism to get into a more advantageous position.' },
  { name: 'Likes to Beat Opponent Repeatedly', category: 'Dribbling', requiredAttributes: ['pace', 'dribbling', 'acceleration', 'balance', 'strength', 'determination', 'concentration', 'stamina', 'workRate', 'technique'], description: 'Increases the likelihood of a player opting to dribble with the ball regardless of how many opponents are positioned to try to dispossess him.' },
  { name: 'Runs With Ball Often', category: 'Dribbling', requiredAttributes: ['dribbling', 'technique', 'flair', 'balance', 'anticipation', 'acceleration', 'workRate', 'agility', 'pace'], description: 'Increases the chances of a player choosing to run with the ball rather than pass it.' },
  { name: 'Runs With Ball Rarely', category: 'Dribbling', requiredAttributes: ['decisions', 'vision', 'passing', 'anticipation'], description: 'Decreases the chances of a player choosing to run with the ball instead looking to make a pass at every turn.' },
  { name: 'Tries to Play Way Out of Trouble', category: 'Dribbling', requiredAttributes: ['dribbling', 'technique', 'flair', 'balance', 'agility', 'anticipation', 'decisions'], description: 'Increases the chances of a player looking to pass or dribble against pressure in a defensive position, rather than opting for the safety-first approach of clearing the ball.' },

  // Finishing (7)
  { name: 'Attempts Overhead Kicks', category: 'Finishing', requiredAttributes: ['flair', 'finishing', 'technique', 'anticipation'], description: 'Increases the chances of a player attempting a spectacular overhead kick rather than a header at goal or to a team-mate when in an attacking position.' },
  { name: 'Likes to Lob Keeper', category: 'Finishing', requiredAttributes: ['finishing', 'technique', 'vision', 'anticipation', 'composure', 'decisions'], description: 'Increases the likelihood of a player looking to lift the ball over the goalkeeper when presented with a chance at goal.' },
  { name: 'Likes to Round Keeper', category: 'Finishing', requiredAttributes: ['finishing', 'dribbling', 'anticipation', 'composure', 'flair', 'agility', 'pace', 'acceleration'], description: 'Increases the likelihood of a player looking to go around the goalkeeper in one-on-one situations.' },
  { name: 'Places Shots', category: 'Finishing', requiredAttributes: ['finishing', 'technique', 'composure', 'decisions', 'anticipation', 'vision', 'flair'], description: 'Increases the chances of a player opting to place his shots with accuracy rather than power them.' },
  { name: 'Shoots From Distance', category: 'Finishing', requiredAttributes: ['longShots', 'technique', 'vision', 'finishing'], description: 'Increases the frequency with which a player will attempt shots from outside the penalty area.' },
  { name: 'Shoots With Power', category: 'Finishing', requiredAttributes: ['finishing', 'technique', 'strength'], description: 'Increases the chances of a player opting to shoot with power over placement. It also increases the likelihood of a player attempting long-range shots, particularly where his Flair is better than his decisions.' },
  { name: 'Tries First Time Shots', category: 'Finishing', requiredAttributes: ['finishing', 'technique', 'composure', 'vision', 'anticipation', 'decisions'], description: "Increases the likelihood of a player taking a shot before considering a touch to settle himself, unless he's one-on-one, at which point he will take the best course of action for that situation." },

  // Movement (11)
  { name: "Arrives Late in Opponent's Area", category: 'Movement', requiredAttributes: ['workRate', 'anticipation', 'vision', 'decisions', 'offTheBall', 'teamwork', 'finishing', 'technique'], description: 'Increases the frequency with which a player makes forward runs, adjusting for team mentality.' },
  { name: 'Comes Deep to Get Ball', category: 'Movement', requiredAttributes: ['vision', 'workRate', 'decisions', 'offTheBall', 'dribbling', 'passing', 'technique', 'anticipation'], description: 'Increases the frequency of a forward player dropping into midfield to get possession against a team playing with a deep defensive line.' },
  { name: 'Cuts Inside from Both Wings', category: 'Movement', requiredAttributes: ['pace', 'dribbling', 'technique', 'teamwork', 'vision'], description: 'Increases the frequency with which a player will attack central areas from a nominal wider starting position.' },
  { name: 'Gets Forward Whenever Possible', category: 'Movement', requiredAttributes: ['workRate', 'naturalFitness', 'offTheBall', 'anticipation', 'teamwork'], description: 'Increases the frequency with which a player makes forward runs, adjusting for team mentality.' },
  { name: 'Gets into Opposition Area', category: 'Movement', requiredAttributes: ['anticipation', 'aggression', 'offTheBall', 'strength', 'teamwork', 'decisions'], description: 'Mostly governs how often a player makes forward runs but the frequency can also be affected by player tactical instructions.' },
  { name: 'Hugs Line', category: 'Movement', requiredAttributes: ['crossing', 'pace', 'technique', 'vision', 'positioning', 'dribbling', 'teamwork'], description: 'Ensures the player will remain in wide areas of the pitch whenever possible.' },
  { name: 'Likes to Try to Beat Offside Trap', category: 'Movement', requiredAttributes: ['acceleration', 'pace', 'naturalFitness', 'agility', 'firstTouch', 'technique', 'anticipation', 'decisions', 'offTheBall', 'teamwork'], description: 'Increases the frequency with which a player will look to make runs in behind the defense. The success is determined by his other attributes.' },
  { name: 'Moves into Channels', category: 'Movement', requiredAttributes: ['anticipation', 'offTheBall', 'acceleration', 'agility', 'teamwork', 'decisions', 'vision', 'firstTouch'], description: 'Increases the frequency with which central players will move into the space between their position and a wide attacking position. It also allows wide players in certain roles to move inside into that space.' },
  { name: 'Plays With Back to Goal', category: 'Movement', requiredAttributes: ['technique', 'firstTouch', 'teamwork', 'strength', 'balance', 'anticipation', 'passing', 'jumpingReach', 'vision', 'flair', 'decisions'], description: 'Player will look to hold up the ball in attacking areas.' },
  { name: 'Stays Back at All Times', category: 'Movement', requiredAttributes: ['marking', 'anticipation', 'decisions', 'positioning', 'teamwork', 'vision', 'workRate', 'determination'], description: 'Player will make no forward runs, adjusted for team mentality.' },

  // Mental (1)
  { name: 'Dictates Tempo', category: 'Mental', requiredAttributes: ['anticipation', 'decisions', 'flair', 'teamwork', 'vision', 'passing', 'technique', 'leadership'], description: "Increases the chances of the player taking charge predominantly in midfield situations and using their attributes to influence the team's performance and pace." },
]
