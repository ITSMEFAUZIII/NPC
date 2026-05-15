# NPC: Nobody's Story
### A 3D Open World Browser Game — AI Build Prompt

> *"You are not the hero. You never were. But you were always there."*

---

## What is this?

A complete, step-by-step AI prompt guide to build **NPC: Nobody's Story** —
a 3D open world browser game where **you play as the NPC**, not the hero.

You are **Kael**, a nameless tavern keeper in the medieval village of Ashenveil.
Sir Aldric — the "real" hero — runs his own epic adventure around you.
He has glowing quest markers. He has destiny. He does not know you exist.

Your goal: survive 30 in-game days, make invisible choices, change the world's fate.
Never be noticed. Never be credited. Watch which of **7 endings** your actions create.

---

## Tech Stack

| Layer | Technology |
|---|---|
| 3D Engine | Three.js r165+ |
| Physics | cannon-es |
| UI Framework | React 18 |
| Bundler | Vite 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion + Three.js AnimationMixer |
| Audio | Howler.js + Web Audio API |
| Post-Processing | Three.js EffectComposer (Bloom, SSAO, Film Grain) |
| Storage | localStorage |

---

## How to Use These Files

Each `.txt` file in `/game-prompt/` is one build session with an AI (Claude, GPT, Cursor, etc).

### Workflow

```
Session 1 → Give AI: STEP_1 + STEP_2
            "Read both files. Set up the project."
            Verify: npm run dev starts without errors.

Session 2 → Give AI: STEP_3
            "Build the complete 3D world."
            Verify: World renders, tavern is detailed.

Session 3 → Give AI: STEP_4
            "Build all character systems and AI."
            Verify: Aldric moves, Kael responds to input.

Session 4 → Give AI: STEP_5
            "Build all gameplay systems and UI."
            Verify: Dialogues trigger, HUD shows, inventory works.

Session 5 → Give AI: STEP_6
            "Build all 7 endings and polish."
            Verify: Full playthrough works, 60fps.
```

---

## File Contents

| File | Contents |
|---|---|
| `STEP_1_CONCEPT_AND_STACK.txt` | Game concept, tech stack, package.json, vite.config, index.html, base CSS |
| `STEP_2_FOLDER_AND_ENGINE.txt` | Full folder structure, GameEngine, Renderer, Physics, Camera, EventBus, Save, Context |
| `STEP_3_3D_WORLD_AND_VISUALS.txt` | Terrain gen, water shader, vegetation, Tavern, Village, Castle, BlackMarket, lighting, weather, character visuals |
| `STEP_4_CHARACTERS_AND_AI.txt` | HeroAI (30-day quest), Kael controller, NPC behavior, ConsequenceEngine, items, audio |
| `STEP_5_GAMEPLAY_AND_DIALOGUE.txt` | DialogueEngine, 20+ dialogue trees, 40+ world events, full HUD, DialogueBox, Inventory, MainMenu |
| `STEP_6_ENDINGS_AND_POLISH.txt` | 7 unique endings, EndingCalculator, GameOver screens, Settings, performance guide, Vercel deploy |

---

## The 7 Endings

| # | Ending | Condition |
|---|---|---|
| 1 | **SEEN** | Hero notices you. You speak. The rarest ending. |
| 2 | **THE QUIET VICTORY** | World saved. Nobody credits you. Pip hugs you. |
| 3 | **THE ARCHITECT** | Your invisible hands shaped everything. |
| 4 | **THE FOOL'S ERRAND** | Your interference sent the hero the wrong way. |
| 5 | **THE SACRIFICE** | The Dark Lord's spies noticed you. |
| 6 | **THE MIRROR** | You discover the Dark Lord was once like you. |
| 7 | **NOBODY** | The default honest ending. Most lives are this ending. |

---

## Design Philosophy

- **Kael has no glow.** Aldric always glows. The visual language is the whole game.
- **Coins are the only visible stat.** Everything else — influence, suspicion, morale — is hidden or vague.
- **The world log never mentions Kael.** His actions only appear in his private journal.
- **The camera drifts toward Aldric** even when you're not looking at him.
- **Aldric steps around Kael like furniture.** This is intentional.
- **Ending 7 has no title card.** Nobody narrates "Nobody."

---

*Built with AI. Designed to make you feel small, then powerful, then human.*
