import * as THREE from 'three'
import EventBus from './EventBus.js'
import { Renderer } from './Renderer.js'
import { PhysicsWorld } from './PhysicsWorld.js'
import { InputManager } from './InputManager.js'
import { CameraSystem } from './CameraSystem.js'
import { AudioEngine } from './AudioEngine.js'
import { WeatherSystem } from './WeatherSystem.js'
import { WorldBuilder } from './WorldBuilder.js'
import { CharacterSystem } from './CharacterSystem.js'
import { HeroAI } from './HeroAI.js'
import { NPCBehavior } from './NPCBehavior.js'
import { ConsequenceEngine } from './ConsequenceEngine.js'
import { EndingCalculator } from './EndingCalculator.js'
import { DialogueEngine } from './DialogueEngine.js'
import { autosave, load } from '../utils/save.js'
import { INITIAL_STATE } from '../context/GameContext.jsx'

const TICK_INTERVAL = 3000 // 3 real seconds = 1 game hour

export class GameEngine {
  constructor(canvas, dispatch, getState) {
    this.canvas = canvas
    this.dispatch = dispatch
    this.getState = getState

    // Subsystems
    this.renderer = null
    this.physics = null
    this.input = null
    this.camera = null
    this.audio = null
    this.weather = null
    this.worldBuilder = null
    this.characters = null
    this.heroAI = null
    this.npcBehavior = null
    this.consequence = null
    this.endingCalc = null
    this.dialogue = null

    // RAF state
    this._rafId = null
    this._tickInterval = null
    this._lastTime = 0
    this._clock = new THREE.Clock()
    this._isRunning = false

    // Raycaster for interaction
    this._raycaster = new THREE.Raycaster()
    this._interactionObjects = []
    this._interactTarget = null

    // Triggered dialogues
    this._triggeredDialogues = new Set()

    // Event listeners
    this._setupEventListeners()
  }

  _setupEventListeners() {
    EventBus.on('dialogue:trigger', ({ id }) => {
      if (!this._triggeredDialogues.has(id) && this.dialogue) {
        this._triggeredDialogues.add(id)
        this.dialogue.startDialogue(id)
      }
    })

    EventBus.on('sfx', ({ type }) => {
      if (this.audio) this.audio.playSFX(type)
    })

    EventBus.on('ui:narrator', ({ text }) => {
      this.dispatch({ type: 'OPEN_DIALOGUE', payload: { narratorOnly: true, narratorText: text } })
      setTimeout(() => this.dispatch({ type: 'CLOSE_DIALOGUE' }), 4000)
    })

    EventBus.on('ending:triggered', ({ endingId }) => {
      if (this.audio) this.audio.playEndingMusic(endingId)
    })
  }

  async init(onProgress) {
    // Renderer
    this.renderer = new Renderer(this.canvas)
    const { scene, camera } = this.renderer.init()
    this.scene = scene
    this.threeCamera = camera

    // Physics
    this.physics = new PhysicsWorld()
    this.physics.init()

    // Input
    this.input = new InputManager()
    this.input.init()

    // Build world
    this.worldBuilder = new WorldBuilder(scene)
    await this.worldBuilder.build(onProgress)

    if (onProgress) onProgress('Hiring the hero...')
    await this._wait(100)

    // Characters
    this.characters = new CharacterSystem(scene)
    this.characters.build(this.worldBuilder.getTerrainHeight.bind(this.worldBuilder))

    // Camera
    this.camera = new CameraSystem(camera, scene)
    this.camera.setTarget(this.characters.getKael().getMesh())
    this.camera.setAldricRef(this.characters.getAldric().getMesh())

    // Audio
    this.audio = new AudioEngine()
    this.audio.init()

    // Weather
    this.weather = new WeatherSystem(scene)

    // Subsystems
    this.heroAI = new HeroAI(this.dispatch, this.getState)
    this.heroAI.setAldricRef(this.characters.getAldric())

    this.npcBehavior = new NPCBehavior(this.dispatch, this.getState)
    this.npcBehavior.setVillagersRef(this.characters.getVillagers())

    this.consequence = new ConsequenceEngine(this.getState(), this.dispatch)
    this.endingCalc = new EndingCalculator(this.dispatch)
    this.dialogue = new DialogueEngine(this.dispatch, this.getState)

    // Collect all interactables
    this._interactionObjects = [
      ...this.worldBuilder.getInteractables(),
      ...this.characters.getVillagerInteractables()
    ]

    // Load save if exists
    const saved = load()
    if (saved) {
      this.dispatch({ type: 'LOAD_STATE', payload: saved })
    }

    if (onProgress) onProgress('Forgetting the innkeeper...')
    await this._wait(1500)

    if (onProgress) onProgress('Ashenveil is ready.')
    await this._wait(500)

    return this
  }

  start() {
    this.dispatch({ type: 'SET_PHASE', payload: 'playing' })
    this._isRunning = true
    this._clock.start()

    // Start game tick
    this._tickInterval = setInterval(() => this._gameTick(), TICK_INTERVAL)

    // Start render loop
    this._loop()

    // Trigger intro dialogue
    setTimeout(() => {
      if (this.dialogue) {
        this.dialogue.startDialogue('intro_monologue')
      }
    }, 1000)
  }

  _loop() {
    this._rafId = requestAnimationFrame(() => this._loop())
    const delta = Math.min(this._clock.getDelta(), 0.05) // cap at 50ms
    this._update(delta)
  }

  _update(delta) {
    const state = this.getState()
    if (state.phase !== 'playing') return

    // Input
    this.input.update()
    const mouseDelta = this.input.getMouseDelta()
    const scrollDelta = this.input.getScrollDelta()

    // Camera
    this.camera.processMouseInput(mouseDelta.x, mouseDelta.y)
    this.camera.processScroll(scrollDelta)

    // Check if Aldric nearby for camera observe mode
    const kaelPos = this.characters.getKael().getPosition()
    const aldricPos = this.characters.getAldric().getPosition()
    const aldricDist = kaelPos.distanceTo(aldricPos)
    this.camera.mode = aldricDist < 20 ? 'observe' : 'follow'
    this.camera.update(delta)

    // Characters
    this.characters.update(
      delta,
      this.input,
      this.camera.yaw,
      this.worldBuilder.getTerrainHeight.bind(this.worldBuilder),
      state
    )

    // Kael position sync to React state (every 5 frames via tick)
    const newKaelPos = this.characters.getKael().getPosition()

    // World update
    this.worldBuilder.update(delta, state.time, state.world.darkLordPower)

    // Hero AI per-frame update
    this.heroAI.update(delta, state)

    // NPC per-frame
    // (NPCBehavior is tick-based)

    // Weather
    this.weather.update(delta)

    // Audio
    this.audio.update(this.threeCamera.position)
    this.audio.setAldricNearby(aldricDist < 15)

    // Interaction raycast
    this._updateInteractionRaycast(state)

    // Handle E key interaction
    if (this.input.isJustPressed('KeyE') && this._interactTarget && !state.activeDialogue) {
      this._handleInteraction(this._interactTarget, state)
    }

    // Handle Tab for inventory
    if (this.input.isJustPressed('Tab')) {
      this.dispatch({ type: 'SET_FLAG', payload: { key: 'inventoryOpen', value: !state.flags.inventoryOpen } })
    }

    // Handle Escape for pause
    if (this.input.isJustPressed('Escape')) {
      if (state.activeDialogue) {
        // Skip dialogue if pressing escape
      } else {
        this.dispatch({ type: 'SET_PHASE', payload: state.phase === 'paused' ? 'playing' : 'paused' })
      }
    }

    // Dialogue advance (E or click)
    if (state.activeDialogue && !state.activeDialogue.showChoices && !state.activeDialogue.narratorOnly) {
      if (this.input.isJustPressed('KeyE') || this.input.isJustPressed('Space')) {
        if (this.dialogue) this.dialogue.advance()
      }
    }

    // Choice selection 1-4
    if (state.activeDialogue?.showChoices && this.dialogue) {
      if (this.input.isJustPressed('Digit1')) this._selectChoice(0, state)
      if (this.input.isJustPressed('Digit2')) this._selectChoice(1, state)
      if (this.input.isJustPressed('Digit3')) this._selectChoice(2, state)
      if (this.input.isJustPressed('Digit4')) this._selectChoice(3, state)
    }

    // Physics
    this.physics.step(delta)

    // Renderer
    this.renderer.render()
  }

  _selectChoice(index, state) {
    if (!state.activeDialogue?.choices) return
    const choice = state.activeDialogue.choices[index]
    if (choice && this.dialogue) this.dialogue.selectChoice(choice.id)
  }

  _updateInteractionRaycast(state) {
    // Simple distance-based interaction detection
    const kaelPos = this.characters.getKael().getPosition()
    let closest = null
    let closestDist = Infinity

    this._interactionObjects.forEach(obj => {
      const pos = obj.worldPos
      const dx = pos.x - kaelPos.x
      const dz = pos.z - kaelPos.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < (obj.range || 2.5) && dist < closestDist) {
        // Check required flags
        if (obj.requiresFlag && !state.flags[obj.requiresFlag]) return
        closest = obj
        closestDist = dist
      }
    })

    this._interactTarget = closest

    // Update context prompt in React
    if (closest) {
      this.dispatch({ type: 'SET_FLAG', payload: { key: '_contextPrompt', value: closest.prompt || 'Interact' } })
    } else {
      this.dispatch({ type: 'SET_FLAG', payload: { key: '_contextPrompt', value: null } })
    }
  }

  _handleInteraction(target, state) {
    if (target.dialogueId) {
      if (this.dialogue) this.dialogue.startDialogue(target.dialogueId)
    } else if (target.actionType) {
      this._handleActionInteraction(target, state)
    } else if (target.villager) {
      // Talk to villager — generic response
      const vid = target.villager.id
      const specialDialogue = {
        mira: state.flags.miraSubplotStarted ? 'mira_dark_lord_secret' : 'mira_first_contact',
        pip: 'pip_first_meeting'
      }
      const dialogueId = specialDialogue[vid]
      if (dialogueId && this.dialogue && !this._triggeredDialogues.has(dialogueId + '_once')) {
        if (vid === 'pip' || vid === 'mira') {
          this._triggeredDialogues.add(dialogueId + '_once')
          this.dialogue.startDialogue(dialogueId)
        }
      }
    }

    // Handle Aldric interaction
    const aldricPos = this.characters.getAldric().getPosition()
    const kaelPos = this.characters.getKael().getPosition()
    if (kaelPos.distanceTo(aldricPos) < 2.5 && state.hero.noticedKael && !this._triggeredDialogues.has('aldric_notices_kael')) {
      this._triggeredDialogues.add('aldric_notices_kael')
      if (this.dialogue) this.dialogue.startDialogue('aldric_notices_kael')
    }
  }

  _handleActionInteraction(target, state) {
    switch (target.actionType) {
      case 'bar_counter':
        this.dispatch({ type: 'ADD_LOG', payload: {
          id: 'serve_' + Date.now(),
          message: "You tend the bar. Coins trickle in.",
          severity: 'quiet',
          day: state.time.day
        }})
        this.dispatch({ type: 'UPDATE_KAEL_STATS', payload: { coins: state.kael.stats.coins + 2 } })
        this.characters.getKael().playAction('serve')
        EventBus.emit('sfx', { type: 'coin' })
        break

      case 'trade_black_market':
        // Would open trade menu
        this.dispatch({ type: 'ADD_LOG', payload: {
          id: 'trade_' + Date.now(),
          message: "The hooded figure says nothing. Just waits.",
          severity: 'quiet',
          day: state.time.day
        }})
        break
    }
  }

  _gameTick() {
    const state = this.getState()
    if (state.phase !== 'playing') return

    let { day, hour, totalTicks } = state.time

    // Advance time
    hour++
    if (hour >= 24) {
      hour = 0
      day++
      EventBus.emit('world:day_changed', { day })

      // Day changed — new dialogue triggers reset for daily ones
      this._triggeredDialogues.delete('kael_daily_morning')

      // Trigger daily monologue via narrator event (imported dynamically)
      import('../data/dialogues.js').then(({ getDailyMonologue }) => {
        const text = getDailyMonologue(day)
        if (text) EventBus.emit('ui:narrator', { text })
      }).catch(() => {})
    }

    // Time phase
    const phase = this._getTimePhase(hour)

    this.dispatch({ type: 'UPDATE_TIME', payload: { day, hour, totalTicks: totalTicks + 1, phase } })

    // Update lighting
    if (this.renderer) this.renderer.updateLighting(phase, hour)
    if (this.worldBuilder) this.worldBuilder.setTimeOfDay(phase)
    if (this.weather) this.weather.setNightFog?.()

    // Hero AI tick
    const updatedState = this.getState()
    this.heroAI.tick(updatedState)

    // NPC behavior tick
    this.npcBehavior.tick(updatedState)

    // Consequence engine tick
    this.consequence.updateState(updatedState)
    this.consequence.tick(updatedState)

    // Ending check on day 30
    if (day >= 30) {
      this.endingCalc.check(updatedState)
    }

    // Trapdoor discovery on day 10+
    if (day >= 10 && !updatedState.flags.trapdoorDiscovered && (hour === 22 || hour === 23)) {
      if (Math.random() < 0.3) {
        this.dispatch({ type: 'SET_FLAG', payload: { key: 'trapdoorDiscovered', value: true } })
        this.dispatch({ type: 'ADD_LOG', payload: {
          id: 'trapdoor_found',
          message: "You notice a loose board near the fireplace.",
          severity: 'quiet',
          day
        }})
        if (this.worldBuilder) this.worldBuilder.revealTrapdoor()
      }
    }

    // Autosave
    autosave(this.getState())

    // Emit tick event
    EventBus.emit('game:tick', { day, hour, tick: totalTicks + 1 })
  }

  _getTimePhase(hour) {
    if (hour >= 5 && hour < 8) return 'dawn'
    if (hour >= 8 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'dusk'
    return 'night'
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)) }

  pause() {
    this._isRunning = false
    if (this._tickInterval) clearInterval(this._tickInterval)
    if (this._clock) this._clock.stop()
  }

  resume() {
    this._isRunning = true
    this._clock.start()
    this._tickInterval = setInterval(() => this._gameTick(), TICK_INTERVAL)
  }

  destroy() {
    this._isRunning = false
    if (this._rafId) cancelAnimationFrame(this._rafId)
    if (this._tickInterval) clearInterval(this._tickInterval)
    EventBus.clear()
    if (this.input) this.input.dispose()
    if (this.audio) this.audio.destroy()
    if (this.characters) this.characters.dispose()
    if (this.worldBuilder) this.worldBuilder.dispose()
    if (this.renderer) this.renderer.dispose()
  }
}
