export const WORLD_EVENTS = [
  {
    id: 'goblin_scout',
    day: 7, hour: 10,
    description: 'Goblin scouts spotted near north road.',
    severity: 'warning',
    effects: { goblinThreat: 15 }
  },
  {
    id: 'goblin_raid',
    day: [9, 12], hour: 14,
    condition: (state) => state.world.goblinThreat >= 70,
    description: 'Goblins attack the market!',
    severity: 'danger',
    effects: { villageHope: -20, npcInjured: 'tom' }
  },
  {
    id: 'goblin_raid_prevented',
    day: [9, 12],
    condition: (state) => state.world.goblinThreat < 40 && state.flags.villageWarned,
    description: 'Villagers repelled a goblin scouting party.',
    severity: 'success',
    effects: { villageHope: 15, influence: 10 }
  },
  {
    id: 'aldric_arrives',
    day: 1, hour: 14,
    description: 'A hero has arrived in Ashenveil.',
    severity: 'info'
  },
  {
    id: 'aldric_quest_begins',
    day: 4, hour: 9,
    description: 'Sir Aldric has accepted a quest from Elder Voss.',
    severity: 'info'
  },
  {
    id: 'aldric_injured',
    day: 7, hour: 18,
    description: 'Sir Aldric returns from the forest. He looks pale.',
    severity: 'warning'
  },
  {
    id: 'aldric_departs',
    day: 16, hour: 6,
    description: 'Sir Aldric has left for the northern dungeon.',
    severity: 'info'
  },
  {
    id: 'village_quiet',
    day: 17, hour: 12,
    description: 'The village feels strangely quiet today.',
    severity: 'quiet'
  },
  {
    id: 'dark_lord_advances',
    day: 18, hour: 0,
    description: 'Darkness spreads further from the castle.',
    severity: 'warning',
    effects: { darkLordPower: 10 }
  },
  {
    id: 'merchant_arrives',
    day: [5, 8, 15, 22], hour: 9,
    description: 'A traveling merchant sets up in the market.',
    severity: 'info',
    shopAvailable: true
  },
  {
    id: 'storm_night',
    day: [11, 20], hour: 20,
    description: 'A violent storm keeps everyone indoors tonight.',
    effects: { weather: 'storm', aldricStaysInTavern: true },
    severity: 'warning'
  },
  {
    id: 'aldric_return',
    day: 21, hour: 14,
    description: 'Sir Aldric returns triumphant from the dungeon.',
    severity: 'success',
    effects: { villageHope: 30 }
  },
  {
    id: 'celebration',
    day: 21, hour: 16,
    description: 'The village erupts in celebration. Gold coins fly. None reach the tavern keeper.',
    severity: 'quiet'
  },
  {
    id: 'orphan_pip_birthday',
    day: 12, hour: 8,
    description: "It's Pip's birthday. Nobody noticed.",
    severity: 'quiet',
    effects: {}
  },
  {
    id: 'final_march',
    day: 26, hour: 8,
    description: "Sir Aldric departs for the Dark Lord's castle. Villagers line the road.",
    severity: 'climax',
    effects: { phase: 'endgame' }
  },
  {
    id: 'kael_watches',
    day: 26, hour: 8,
    description: "Nobody waves at Kael.",
    severity: 'quiet'
  },
  {
    id: 'mira_greets',
    day: 5, hour: 10,
    condition: (state) => !state.flags.miraSubplotStarted,
    description: 'Mira the healer noticed you working hard today.',
    severity: 'quiet'
  },
  {
    id: 'dark_lord_power_surge',
    day: 23, hour: 0,
    condition: (state) => state.world.darkLordPower > 60,
    description: 'The sky above the distant castle flickered purple last night.',
    severity: 'warning',
    effects: { darkLordPower: 10 }
  },
  {
    id: 'village_hope_low',
    day: [14, 20, 25], hour: 18,
    condition: (state) => state.world.villageHope < 40,
    description: 'Morale is low. Fewer people at the market today.',
    severity: 'warning'
  },
  {
    id: 'aldric_loud_speech',
    day: 21, hour: 19,
    description: "Aldric gives a speech in the tavern about destiny. You pour drinks.",
    severity: 'info'
  },
  {
    id: 'day_30_dawn',
    day: 30, hour: 6,
    description: "Day 30. Whatever happens today has already been decided.",
    severity: 'climax'
  },
  {
    id: 'trapdoor_found',
    day: [10, 11, 12], hour: [22, 23],
    condition: (state) => !state.flags.trapdoorDiscovered,
    description: "You noticed a loose board near the fireplace.",
    severity: 'quiet'
  },
  {
    id: 'suspicion_rising',
    day: [15, 20, 25],
    condition: (state) => state.kael.stats.suspicion > 50 && state.kael.stats.suspicion < 100,
    description: "Someone has been asking questions about the tavern keeper.",
    severity: 'danger'
  },
  {
    id: 'new_day_reminder',
    day: [5, 10, 15, 20, 25], hour: 7,
    description: "Another week passes in Ashenveil.",
    severity: 'info'
  }
]
