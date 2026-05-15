export const ITEMS = {
  poison_vial: {
    id: 'poison_vial',
    name: 'Vial of Nightshade',
    description: "Tasteless. Effective. Heavy in the pocket.",
    cost: 15,
    useOn: ['drink', 'food'],
    effect: { target: 'hero', stat: 'health', value: -25, delay: 1 },
    stackable: false,
    icon: '🧪'
  },
  false_map: {
    id: 'false_map',
    name: 'Forged Dungeon Map',
    description: "Expertly wrong. He'll never know.",
    cost: 25,
    useOn: ['aldric_bag', 'notice_board'],
    effect: { target: 'hero', flag: 'heroGivenFalseMap', delay: 0 },
    stackable: false,
    icon: '🗺️'
  },
  hero_sword: {
    id: 'hero_sword',
    name: 'Enchanted Blade',
    description: "You could give it to him. Or keep it. Why give it?",
    cost: 50,
    useOn: ['aldric'],
    effect: { target: 'hero', stat: 'maxHealth', value: 20, delay: 0 },
    keepEffect: { target: 'kael', stat: 'morale', value: -10 },
    stackable: false,
    icon: '⚔️'
  },
  informant_token: {
    id: 'informant_token',
    name: "Informant's Token",
    description: "Pay daily, receive secrets. A fair trade.",
    cost: 10,
    effect: { target: 'kael', stat: 'knowledge', value: 5, perDay: true },
    stackable: false,
    icon: '🪙'
  },
  ancient_tome: {
    id: 'ancient_tome',
    name: 'Ancient Tome',
    description: "Contains the Dark Lord's real weakness.",
    cost: 40,
    useOn: ['mira', 'aldric_bag', 'keep'],
    effect: { flag: 'tomeFound', knowledge: 30 },
    stackable: false,
    icon: '📜'
  },
  coin: {
    id: 'coin',
    name: 'Coin',
    description: "You earn these. Nobody notices.",
    stackable: true,
    icon: '💰'
  },
  rumor_note: {
    id: 'rumor_note',
    name: 'Rumor Note',
    description: "Written in careful, forgettable handwriting.",
    cost: 5,
    stackable: true,
    icon: '📝'
  },
  healing_herb: {
    id: 'healing_herb',
    name: 'Healing Herb',
    description: "From Mira. She gave it freely.",
    useOn: ['aldric', 'villager'],
    effect: { target: 'hero', stat: 'health', value: 20, delay: 0 },
    stackable: false,
    icon: '🌿'
  }
}
