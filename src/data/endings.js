export const ENDINGS = {
  seen: {
    id: 'seen',
    title: 'SEEN',
    lines: [
      "The battle is won. The Dark Lord is defeated.",
      "Aldric walks through the cheering crowd.",
      "He stops. He looks at you.",
      '"The innkeeper," he says. "I don\'t know your name."',
      "He says your name. Once.",
      "He walks away.",
      "It was enough."
    ],
    musicKey: 'seen',
    worldState: 'victory_warm'
  },
  quiet_victory: {
    id: 'quiet_victory',
    title: 'THE QUIET VICTORY',
    lines: [
      "The world was saved.",
      "You helped.",
      "Nobody will ever know.",
      "The child knows."
    ],
    musicKey: 'quiet_victory',
    worldState: 'victory_normal'
  },
  architect: {
    id: 'architect',
    title: 'THE ARCHITECT',
    lines: [
      "He said destiny guided him.",
      "You said nothing.",
      "Some people build the stage.",
      "Others just perform on it."
    ],
    musicKey: 'architect',
    worldState: 'victory_montage'
  },
  fools_errand: {
    id: 'fools_errand',
    title: "THE FOOL'S ERRAND",
    lines: [
      "The world changed hands.",
      "Your hours are the same.",
      "Dawn. Serve. Dusk. Sleep.",
      "Some things don't change even when everything does."
    ],
    musicKey: 'fools_errand',
    worldState: 'defeat_occupied'
  },
  sacrifice: {
    id: 'sacrifice',
    title: 'THE SACRIFICE',
    lines: [
      "They won.",
      "You're gone.",
      "The tavern is closed now.",
      "There's a new innkeeper.",
      "He doesn't know the regulars."
    ],
    musicKey: 'sacrifice',
    worldState: 'victory_empty_tavern'
  },
  mirror: {
    id: 'mirror',
    title: 'THE MIRROR',
    lines: [
      "You pieced it together.",
      "The Dark Lord was once like you.",
      "Nobody. Background character. Ignored for decades.",
      "Unlike you... he couldn't bear it.",
      "You chose differently than he did.",
      "That was enough."
    ],
    musicKey: 'mirror',
    worldState: 'philosophical'
  },
  nobody: {
    id: 'nobody',
    title: null, // No title card — intentional
    lines: [
      "Day 31.",
      "The hero has gone.",
      "You are still here.",
      "This is the most honest ending.",
      "Most lives are this ending.",
      "You lived yours."
    ],
    musicKey: 'nobody',
    worldState: 'normal'
  }
}
