// Aldric's 30-day quest timeline — defines waypoints and activities per day
export const QUEST_TIMELINE = [
  // Day 1-3: Arrival
  { days: [1, 2, 3], activity: 'arriving', description: 'Aldric walks into Ashenveil from south road' },
  // Day 4-6: Quest begins
  { days: [4, 5, 6], activity: 'quest_begins', description: 'Aldric receives quest from Elder Voss' },
  // Day 7-10: Goblin troubles
  { days: [7, 8, 9, 10], activity: 'scouting', description: 'Aldric scouts forest, returns injured' },
  // Day 11-15: Artifact hunt
  { days: [11, 12, 13, 14, 15], activity: 'researching', description: 'Aldric studies maps in tavern' },
  // Day 16-20: Dungeon
  { days: [16, 17, 18, 19, 20], activity: 'in_dungeon', description: 'Aldric is in the dungeon' },
  // Day 21-25: Return
  { days: [21, 22, 23, 24, 25], activity: 'triumphant', description: 'Aldric returns with relic' },
  // Day 26-29: March
  { days: [26, 27, 28, 29], activity: 'marching', description: 'Aldric marches to castle' },
  // Day 30: Reckoning
  { days: [30], activity: 'reckoning', description: 'The final battle' }
]

export const ALDRIC_WAYPOINTS = {
  arriving: [
    { x: 0, z: -800 },   // south road
    { x: 0, z: -200 },   // approaching village
    { x: -50, z: 10 },   // tavern
  ],
  quest_begins: [
    { x: 0, z: 0 },      // town well
    { x: -10, z: -20 },  // elder voss
    { x: -50, z: 10 },   // back to tavern
    { x: 20, z: -15 },   // blacksmith
  ],
  scouting: [
    { x: -50, z: 10 },   // tavern start
    { x: 0, z: 150 },    // forest edge
    { x: -50, z: 10 },   // return injured
  ],
  researching: [
    { x: -50, z: 10 },   // tavern corner table
    { x: 0, z: 0 },      // well/village center
    { x: -50, z: 10 },   // back to tavern
  ],
  in_dungeon: [
    { x: 200, z: 350 },  // dungeon entrance — stays there
  ],
  triumphant: [
    { x: 0, z: 0 },      // village center
    { x: -50, z: 10 },   // tavern celebration
    { x: 30, z: 20 },    // market
  ],
  marching: [
    { x: 800, z: 600 },  // castle
  ],
  reckoning: [
    { x: 800, z: 600 },  // castle
  ]
}
