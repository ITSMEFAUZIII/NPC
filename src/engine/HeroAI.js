import * as THREE from 'three'
import EventBus from './EventBus.js'
import { QUEST_TIMELINE, ALDRIC_WAYPOINTS } from '../data/questScript.js'

export class HeroAI {
  constructor(dispatch, getState) {
    this.dispatch = dispatch
    this.getState = getState
    this.aldricRef = null // SirAldric instance
    this._lastActivity = null
    this._noticeCheckTimer = 0
    this._noticeFired = false
    this._speechTimer = 0
    this._arrivalDone = false
  }

  setAldricRef(aldric) {
    this.aldricRef = aldric
  }

  tick(state) {
    if (!this.aldricRef) return
    const day = state.time.day
    const hour = state.time.hour

    const timeline = QUEST_TIMELINE.find(t => t.days.includes(day))
    if (!timeline) return

    const activity = timeline.activity

    // Update waypoints when activity changes
    if (activity !== this._lastActivity) {
      this._lastActivity = activity
      const waypoints = ALDRIC_WAYPOINTS[activity] || []
      this.aldricRef.setWaypoints(waypoints)
      this.aldricRef.setActivity(activity)
      this.dispatch({ type: 'UPDATE_HERO', payload: { currentActivity: activity } })

      // Emit events for key transitions
      if (activity === 'arriving' && !this._arrivalDone) {
        this._arrivalDone = true
        EventBus.emit('hero:moved', { location: 'village', position: this.aldricRef.getPosition() })
      }
      if (activity === 'in_dungeon') {
        this.dispatch({ type: 'UPDATE_HERO', payload: { isInTavern: false } })
      }
      if (activity === 'triumphant') {
        EventBus.emit('hero:action', { action: 'return_triumphant', target: null })
        this.dispatch({ type: 'UPDATE_WORLD', payload: { villageHope: Math.min(100, state.world.villageHope + 30) }})
      }
    }

    // Tavern detection (if near tavern coords)
    const heroPos = this.aldricRef.getPosition()
    const tavernDist = heroPos.distanceTo(new THREE.Vector3(-50, 0, 10))
    const isInTavern = tavernDist < 12
    if (isInTavern !== state.hero.isInTavern) {
      this.dispatch({ type: 'UPDATE_HERO', payload: { isInTavern } })
      if (isInTavern) {
        EventBus.emit('hero:moved', { location: 'tavern', position: heroPos })
      }
    }

    // Update hero health drain if poisoned
    if (state.flags.heroWasPoisoned && state.time.totalTicks % 8 === 0) {
      const newHealth = Math.max(10, state.hero.health - 2)
      this.dispatch({ type: 'UPDATE_HERO', payload: { health: newHealth } })
    }

    // Quest stage advancement based on activity
    const questStageMap = {
      arriving: 1, quest_begins: 2, scouting: 3, researching: 4,
      in_dungeon: 5, triumphant: 6, marching: 7, reckoning: 8
    }
    const newStage = questStageMap[activity] || state.hero.questStage
    if (newStage !== state.hero.questStage) {
      this.dispatch({ type: 'UPDATE_HERO', payload: { questStage: newStage } })
    }
  }

  update(delta, state) {
    if (!this.aldricRef) return

    // Perception check — can Aldric notice Kael?
    this._noticeCheckTimer += delta
    if (this._noticeCheckTimer >= 3 && !this._noticeFired) {
      this._noticeCheckTimer = 0
      const chance = (state.hero.perception / 100) * 0.01 +
                     (state.kael.stats.influence / 100) * 0.05

      if (Math.random() < chance && state.hero.noticedCount === 0) {
        this._noticeFired = true
        this.dispatch({ type: 'UPDATE_HERO', payload: { noticedKael: true, noticedCount: 1 } })
        EventBus.emit('hero:noticed_kael', {})
        EventBus.emit('dialogue:trigger', { id: 'aldric_notices_kael' })
      }
    }

    // Speech timer — Aldric announces things in tavern
    if (state.hero.isInTavern && state.time.day === 4 && state.time.hour === 20) {
      EventBus.emit('dialogue:trigger', { id: 'aldric_announces_quest' })
    }
  }
}
