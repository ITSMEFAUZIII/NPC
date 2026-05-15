export const DIALOGUES = {
  intro_monologue: {
    id: 'intro_monologue',
    trigger: { day: 1, hour: 6, location: null, flags: [], character: null },
    lines: [
      { speaker: 'NARRATOR', text: 'Day one. The sun rises over Ashenveil, same as always.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'You are Kael. Nobody important.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'You run The Grey Flagon. You have run it for eleven years.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'Today, a hero is supposed to arrive.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'They always arrive eventually.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "They never remember your name after they leave.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: 'You have stopped expecting them to.', emotion: 'bitter' },
    ],
    choices: []
  },

  aldric_first_arrival: {
    id: 'aldric_first_arrival',
    trigger: { day: 1, hour: 14, location: 'tavern', flags: [], character: 'aldric' },
    lines: [
      { speaker: 'aldric', text: 'You there! Innkeeper!', emotion: 'neutral' },
      { speaker: 'aldric', text: "Ale. The best you have. I've been walking all day.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "He doesn't say please.", emotion: 'bitter' },
      { speaker: 'NARRATOR', text: 'He never does.', emotion: 'bitter' },
    ],
    choices: [
      {
        id: 'serve_silently',
        text: 'Serve him silently.',
        condition: null,
        effects: { stats: { coins: 2, morale: -1 } },
        nextNode: 'aldric_takes_drink_ignores_kael'
      },
      {
        id: 'say_long_journey',
        text: "Say: 'Long journey?'",
        condition: null,
        effects: { stats: { knowledge: 1 } },
        nextNode: 'aldric_brief_acknowledgment'
      },
      {
        id: 'spiked_drink',
        text: 'Serve him the spiked drink.',
        condition: 'hasItem:poison_vial',
        effects: { flags: { heroWasPoisoned: true }, removeItem: 'poison_vial', stats: { suspicion: 5 } },
        nextNode: 'aldric_takes_drink_ignores_kael'
      }
    ]
  },

  aldric_takes_drink_ignores_kael: {
    id: 'aldric_takes_drink_ignores_kael',
    trigger: null,
    lines: [
      { speaker: 'aldric', text: "Good enough.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'He takes the drink without looking at you.', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'He sits at the best table.', emotion: 'bitter' },
      { speaker: 'NARRATOR', text: "It's the table you usually keep clean for paying guests.", emotion: 'bitter' },
    ],
    choices: []
  },

  aldric_brief_acknowledgment: {
    id: 'aldric_brief_acknowledgment',
    trigger: null,
    lines: [
      { speaker: 'aldric', text: "Long? Ha. Three days from the capital. Destiny doesn't wait.", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "[Aldric turns away]", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "He's already forgotten you said anything.", emotion: 'sad' },
    ],
    choices: []
  },

  mira_first_contact: {
    id: 'mira_first_contact',
    trigger: { day: 5, hour: 10, location: 'village', flags: [], character: 'mira' },
    lines: [
      { speaker: 'mira', text: "You know, I've noticed you.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: 'You almost drop your bucket.', emotion: 'neutral' },
      { speaker: 'mira', text: 'You work harder than anyone in this village.', emotion: 'happy' },
      { speaker: 'mira', text: "The hero gets all the praise. But the tavern doesn't run itself.", emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'thank_mira',
        text: '"Thank you. That means... a lot."',
        condition: null,
        effects: { stats: { morale: 10 }, flags: { miraSubplotStarted: true } },
        nextNode: 'mira_response_warm'
      },
      {
        id: 'philosophical',
        text: '"People see what they want to see."',
        condition: null,
        effects: { stats: { knowledge: 2 }, flags: { miraSubplotStarted: true } },
        nextNode: 'mira_response_philosophical'
      },
      {
        id: 'nod_walk',
        text: 'Say nothing. Nod. Walk away.',
        condition: null,
        effects: { stats: { morale: 3 } },
        nextNode: null
      }
    ]
  },

  mira_response_warm: {
    id: 'mira_response_warm',
    trigger: null,
    lines: [
      { speaker: 'mira', text: "Yes. It does.", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "She smiles. A real one.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You haven't seen one of those in a while.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "Directed at you, I mean.", emotion: 'bitter' },
    ],
    choices: []
  },

  mira_response_philosophical: {
    id: 'mira_response_philosophical',
    trigger: null,
    lines: [
      { speaker: 'mira', text: "That's... a sad way to think.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "She looks at you a moment longer than expected.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Then she goes back to her work.", emotion: 'neutral' },
    ],
    choices: []
  },

  kael_daily_morning: {
    id: 'kael_daily_morning',
    trigger: { day: null, hour: 7, location: null, flags: [], character: 'kael' },
    lines: [], // Lines set dynamically by day
    choices: []
  },

  aldric_notices_kael: {
    id: 'aldric_notices_kael',
    trigger: null, // Triggered by HeroAI when conditions met
    lines: [
      { speaker: 'aldric', text: "You there...", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "[long pause — the world goes quiet]", emotion: 'neutral' },
      { speaker: 'aldric', text: "Have we... met before?", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Your heart stops.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "For one second, in thirty days, he sees you.", emotion: 'sad' },
    ],
    choices: [
      {
        id: 'yes_every_day',
        text: '"Yes. Every day for a month."',
        condition: null,
        effects: { stats: { influence: 20, suspicion: 10 } },
        nextNode: 'aldric_response_confused'
      },
      {
        id: 'no_nobody',
        text: '"No. I\'m nobody."',
        condition: null,
        effects: { stats: { morale: -15, suspicion: -5 } },
        nextNode: 'aldric_response_moves_on'
      },
      {
        id: 'say_nothing',
        text: 'Say nothing. Look at your hands.',
        condition: null,
        effects: { stats: { morale: -5 }, flags: { kaelSaidNothing: true } },
        nextNode: 'aldric_response_moves_on'
      }
    ]
  },

  aldric_response_confused: {
    id: 'aldric_response_confused',
    trigger: null,
    lines: [
      { speaker: 'aldric', text: "Hm. Strange. You look familiar somehow.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "[He squints at you for 3 seconds]", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "[He shakes his head]", emotion: 'neutral' },
      { speaker: 'aldric', text: "Nevermind. Carry on, innkeeper.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Innkeeper.", emotion: 'bitter' },
      { speaker: 'NARRATOR', text: "Not even a name.", emotion: 'sad' },
    ],
    choices: []
  },

  aldric_response_moves_on: {
    id: 'aldric_response_moves_on',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "He nods. He turns. He walks away.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "He will not look at you again.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "This was your one moment.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "You choose how you feel about how you used it.", emotion: 'bitter' },
    ],
    choices: []
  },

  mira_dark_lord_secret: {
    id: 'mira_dark_lord_secret',
    trigger: { day: 15, hour: null, flags: ['miraSubplotStarted'], character: 'mira' },
    lines: [
      { speaker: 'mira', text: "I need to tell you something.", emotion: 'neutral' },
      { speaker: 'mira', text: "Something I've never told the hero.", emotion: 'neutral' },
      { speaker: 'mira', text: "The Dark Lord... he wasn't born evil.", emotion: 'sad' },
      { speaker: 'mira', text: "He was a farmer. A shepherd. A nobody.", emotion: 'sad' },
      { speaker: 'mira', text: "Just like...", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "She stops.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "She doesn't finish the sentence.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "She doesn't have to.", emotion: 'bitter' },
    ],
    choices: [
      {
        id: 'tell_aldric',
        text: '"Tell Aldric. He should know."',
        condition: null,
        effects: { flags: { aldricKnowsWeakness: true, miraSaidDarkLordWasNobody: true }, stats: { knowledge: 15 } },
        nextNode: 'mira_approves'
      },
      {
        id: 'keep_for_yourself',
        text: '"Keep this. It might be more useful with me."',
        condition: null,
        effects: { flags: { miraSaidDarkLordWasNobody: true }, stats: { knowledge: 25, influence: 10 } },
        nextNode: 'mira_uncertain'
      },
      {
        id: 'give_up',
        text: '"It doesn\'t matter. He\'s the hero. Not me."',
        condition: null,
        effects: { stats: { morale: -20 }, flags: { kaelGaveUp: true, miraSaidDarkLordWasNobody: true } },
        nextNode: 'mira_sad'
      }
    ]
  },

  mira_approves: {
    id: 'mira_approves',
    trigger: null,
    lines: [
      { speaker: 'mira', text: "Yes. He needs to know this.", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "She squeezes your arm briefly.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Nobody sees it.", emotion: 'quiet' },
    ],
    choices: []
  },

  mira_uncertain: {
    id: 'mira_uncertain',
    trigger: null,
    lines: [
      { speaker: 'mira', text: "...Alright. Be careful with it.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "She doesn't look entirely convinced.", emotion: 'neutral' },
    ],
    choices: []
  },

  mira_sad: {
    id: 'mira_sad',
    trigger: null,
    lines: [
      { speaker: 'mira', text: "Is that what you really think?", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "She looks at you a long time.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Then she walks away.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "She doesn't come back.", emotion: 'sad' },
    ],
    choices: []
  },

  interact_well: {
    id: 'interact_well',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "The well. Center of the village.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "They say this well was here before the village was.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You've drawn water from it eleven thousand times.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Give or take.", emotion: 'bitter' },
    ],
    choices: []
  },

  interact_notice_board: {
    id: 'interact_notice_board',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "Three notices. All about the hero's quest.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: '"HERO ARRIVES: Sir Aldric of the Golden Order seeks the Sunfire Relic."', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: '"REWARD: 500 gold for any information on northern dungeon."', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: '"WARNING: Goblin activity north of village."', emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "Your name doesn't appear anywhere on this board.", emotion: 'bitter' },
      { speaker: 'NARRATOR', text: "You've added things to it before. People assumed it was Aldric.", emotion: 'sad' },
    ],
    choices: []
  },

  interact_church: {
    id: 'interact_church',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "The shrine. Cool and quiet.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You haven't prayed in years.", emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'pray',
        text: 'Pray. Just once.',
        condition: 'notFlag:kaelPrayed',
        effects: { stats: { morale: 10 }, flags: { kaelPrayed: true } },
        nextNode: 'church_prayer_response'
      },
      {
        id: 'leave',
        text: 'Leave.',
        condition: null,
        effects: {},
        nextNode: null
      }
    ]
  },

  church_prayer_response: {
    id: 'church_prayer_response',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "Silence.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "But a warm silence.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You feel, briefly, like you exist.", emotion: 'sad' },
    ],
    choices: []
  },

  aldric_announces_quest: {
    id: 'aldric_announces_quest',
    trigger: { day: 4, hour: 20, location: 'tavern', flags: [], character: 'aldric' },
    lines: [
      { speaker: 'aldric', text: "People of Ashenveil! I, Sir Aldric, shall find the Sunfire Relic!", emotion: 'happy' },
      { speaker: 'aldric', text: "Your village will be saved! Destiny has chosen me!", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "The tavern erupts in cheers.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You quietly refill empty mugs.", emotion: 'bitter' },
    ],
    choices: []
  },

  pip_first_meeting: {
    id: 'pip_first_meeting',
    trigger: { day: 3, hour: 10, location: 'village', flags: [], character: 'pip' },
    lines: [
      { speaker: 'pip', text: "Hello, Mister Kael!", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "She waves. Big wave. Whole arm.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You wave back. Small wave. Two fingers.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "It's something.", emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'give_coin',
        text: 'Give her a coin. (costs 1 coin)',
        condition: 'hasCoin',
        effects: { stats: { coins: -1, morale: 5 }, flags: { orphanHelped: true } },
        nextNode: 'pip_receives_coin'
      },
      {
        id: 'wave_back',
        text: 'Just wave back.',
        condition: null,
        effects: { stats: { morale: 2 } },
        nextNode: null
      }
    ]
  },

  pip_receives_coin: {
    id: 'pip_receives_coin',
    trigger: null,
    lines: [
      { speaker: 'pip', text: "Oh! Thank you!", emotion: 'happy' },
      { speaker: 'NARRATOR', text: "She runs off.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You watch her go.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "That felt good.", emotion: 'neutral' },
    ],
    choices: []
  },

  mirror_final_choice: {
    id: 'mirror_final_choice',
    trigger: null,
    lines: [
      { speaker: 'NARRATOR', text: "You hold the knowledge in your hands.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "The Dark Lord was nobody once.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "Just like you.", emotion: 'sad' },
      { speaker: 'NARRATOR', text: "Unlike you, he stopped being able to bear it.", emotion: 'neutral' },
      { speaker: 'NARRATOR', text: "You have a choice.", emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'send_info',
        text: 'Send Aldric the information. Save the world.',
        condition: null,
        effects: { flags: { aldricKnowsWeakness: true }, stats: { influence: 20 } },
        nextNode: null
      },
      {
        id: 'burn_it',
        text: "Burn it. Let the mirror break.",
        condition: null,
        effects: { stats: { morale: -30, darkLordPower: 20 } },
        nextNode: null
      },
      {
        id: 'go_yourself',
        text: 'Go yourself. Walk to the castle alone.',
        condition: null,
        effects: { stats: { influence: 30, suspicion: 50 } },
        nextNode: null
      }
    ]
  }
}

export function getDailyMonologue(day) {
  if (day <= 5) return "Another day. Another hero who won't look at you."
  if (day <= 10) return "The goblins are getting closer. He doesn't know yet."
  if (day <= 15) return "You know where the relic is. He's about to find out."
  if (day <= 20) return "He's gone. The village feels different. Lighter. Or maybe that's just you."
  if (day <= 25) return "He's back. Louder than before. Richer than before. Same amount of interest in you. None."
  return "Thirty days. Thirty days of watching someone else's story. Tomorrow it ends. One way or another."
}
