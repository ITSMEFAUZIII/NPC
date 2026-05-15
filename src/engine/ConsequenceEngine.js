import EventBus from './EventBus.js'

export class ConsequenceEngine {
  constructor(gameState, dispatch) {
    this.queue = []
    this.gameState = gameState
    this.dispatch = dispatch
  }

  updateState(gameState) {
    this.gameState = gameState
  }

  register(consequence) {
    // consequence: { triggerDay, triggerHour, action, description }
    this.queue.push(consequence)
  }

  registerAction(actionType, state) {
    const day = state.time.day
    switch (actionType) {
      case 'serve_spiked_drink':
        this.register({
          triggerDay: day + 1,
          description: "Sir Aldric looks pale today.",
          severity: 'warning',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_HERO', payload: { health: Math.max(0, state.hero.health - 25) } })
            EventBus.emit('world:event', { description: 'Sir Aldric looks pale today', severity: 'warning' })
          }
        })
        break

      case 'spread_rumor_dark_lord':
        this.register({
          triggerDay: day + 3,
          description: "Morale drops in the village.",
          severity: 'warning',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_WORLD', payload: {
              darkLordPower: Math.min(100, state.world.darkLordPower + 15),
              villageHope: Math.max(0, state.world.villageHope - 10)
            }})
            EventBus.emit('world:event', { description: 'Morale drops in the village', severity: 'warning' })
          }
        })
        break

      case 'warn_village_goblins':
        this.register({
          triggerDay: day + 2,
          description: "Villagers seem more prepared.",
          severity: 'success',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_WORLD', payload: {
              goblinThreat: Math.max(0, state.world.goblinThreat - 30)
            }})
            dispatch({ type: 'UPDATE_KAEL_STATS', payload: { influence: Math.min(100, state.kael.stats.influence + 10) } })
            EventBus.emit('world:event', { description: 'Villagers seem more prepared', severity: 'success' })
          }
        })
        break

      case 'give_hero_weapon':
        this.register({
          triggerDay: day + 5,
          description: "The hero seems stronger.",
          severity: 'success',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_HERO', payload: {
              maxHealth: state.hero.maxHealth + 20,
              trust: Math.min(100, state.hero.trust + 10)
            }})
            EventBus.emit('world:event', { description: "The hero seems stronger", severity: 'success' })
          }
        })
        break

      case 'give_false_map':
        this.register({
          triggerDay: 20,
          description: "The hero returns empty-handed.",
          severity: 'warning',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_HERO', payload: {
              arrogance: Math.max(0, state.hero.arrogance - 20),
              trust: Math.max(0, state.hero.trust - 15),
              questStage: Math.max(1, state.hero.questStage - 1)
            }})
            EventBus.emit('world:event', { description: "The hero returns empty-handed", severity: 'warning' })
          }
        })
        break

      case 'help_pip':
        this.register({
          triggerDay: day + 1,
          description: "A child laughs in the village today.",
          severity: 'quiet',
          action: (dispatch) => {
            dispatch({ type: 'UPDATE_WORLD', payload: { villageHope: Math.min(100, state.world.villageHope + 5) }})
          }
        })
        break
    }
  }

  tick(gameState) {
    this.gameState = gameState
    const currentDay = gameState.time.day
    const toExecute = this.queue.filter(c => c.triggerDay <= currentDay)
    const remaining = this.queue.filter(c => c.triggerDay > currentDay)
    this.queue = remaining

    toExecute.forEach(c => {
      if (c.action) {
        try {
          c.action(this.dispatch)
        } catch (e) {
          console.error('[ConsequenceEngine] Error executing consequence:', e)
        }
      }
      if (c.description) {
        this.dispatch({ type: 'ADD_LOG', payload: {
          id: Date.now() + Math.random(),
          message: c.description,
          severity: c.severity || 'info',
          day: currentDay,
          hour: gameState.time.hour
        }})
      }
    })
  }
}
