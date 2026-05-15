import EventBus from './EventBus.js'
import { WORLD_EVENTS } from '../data/worldEvents.js'

export class NPCBehavior {
  constructor(dispatch, getState) {
    this.dispatch = dispatch
    this.getState = getState
    this.villagersRef = null
    this._triggeredEvents = new Set()
    this._schedulePhase = 'morning'
  }

  setVillagersRef(villagers) {
    this.villagersRef = villagers
  }

  tick(state) {
    const { day, hour, phase } = state.time

    // Update schedule when phase changes
    if (phase !== this._schedulePhase) {
      this._schedulePhase = phase
      if (this.villagersRef) {
        this.villagersRef.setSchedule(phase)
      }
    }

    // Check world events
    WORLD_EVENTS.forEach(event => {
      if (this._triggeredEvents.has(event.id)) return

      // Check day
      let dayMatch = false
      if (Array.isArray(event.day)) {
        dayMatch = event.day.includes(day)
      } else if (event.day) {
        dayMatch = event.day === day
      } else {
        dayMatch = true
      }

      // Check hour
      let hourMatch = true
      if (event.hour !== undefined && event.hour !== null) {
        if (Array.isArray(event.hour)) {
          hourMatch = event.hour.includes(hour)
        } else {
          hourMatch = event.hour === hour
        }
      }

      if (!dayMatch || !hourMatch) return

      // Check condition
      if (event.condition && !event.condition(state)) return

      // Trigger event
      this._triggeredEvents.add(event.id)
      this._applyEvent(event, state)
    })
  }

  _applyEvent(event, state) {
    // Log to world log
    this.dispatch({
      type: 'ADD_LOG',
      payload: {
        id: event.id + '_' + state.time.day,
        message: event.description,
        severity: event.severity || 'info',
        day: state.time.day,
        hour: state.time.hour
      }
    })

    EventBus.emit('world:event', {
      id: event.id,
      description: event.description,
      severity: event.severity
    })

    // Apply effects
    if (event.effects) {
      const e = event.effects
      if (e.goblinThreat !== undefined) {
        this.dispatch({ type: 'UPDATE_WORLD', payload: {
          goblinThreat: Math.max(0, Math.min(100, state.world.goblinThreat + e.goblinThreat))
        }})
      }
      if (e.villageHope !== undefined) {
        this.dispatch({ type: 'UPDATE_WORLD', payload: {
          villageHope: Math.max(0, Math.min(100, state.world.villageHope + e.villageHope))
        }})
      }
      if (e.darkLordPower !== undefined) {
        this.dispatch({ type: 'UPDATE_WORLD', payload: {
          darkLordPower: Math.max(0, Math.min(100, state.world.darkLordPower + e.darkLordPower))
        }})
      }
      if (e.influence !== undefined) {
        this.dispatch({ type: 'UPDATE_KAEL_STATS', payload: {
          influence: Math.max(0, Math.min(100, state.kael.stats.influence + e.influence))
        }})
      }
    }

    // Mira subplot
    if (event.id === 'mira_greets' && !state.flags.miraSubplotStarted) {
      EventBus.emit('dialogue:trigger', { id: 'mira_first_contact' })
    }
  }

  update(delta, state) {
    // Nothing per-frame for now — all tick-based
  }

  reset() {
    this._triggeredEvents.clear()
    this._schedulePhase = 'morning'
  }
}
