import EventBus from './EventBus.js'
import { ENDINGS } from '../data/endings.js'

export class EndingCalculator {
  constructor(dispatch) {
    this.dispatch = dispatch
    this.triggered = false
  }

  check(state) {
    if (this.triggered) return
    if (state.time.day < 30) return

    const endingId = this.calculateEnding(state)
    this.triggered = true

    // Delay slightly for cinematic feel
    setTimeout(() => {
      EventBus.emit('ending:triggered', { endingId })
      this.dispatch({ type: 'TRIGGER_ENDING', payload: endingId })
    }, 3000)
  }

  calculateEnding(state) {
    const { hero, kael, world, flags } = state

    // ENDING 1: SEEN — rarest, most emotional
    if (
      hero.noticedKael === true &&
      kael.stats.influence >= 80 &&
      flags.kaelSaidNothing === false &&
      hero.trust >= 60
    ) {
      return 'seen'
    }

    // ENDING 2: THE QUIET VICTORY
    if (
      world.darkLordPower <= 30 &&
      world.villageHope >= 70 &&
      kael.stats.influence >= 60 &&
      flags.villageWarned === true
    ) {
      return 'quiet_victory'
    }

    // ENDING 3: THE ARCHITECT
    if (
      kael.stats.influence >= 90 &&
      flags.heroGivenFalseMap === false &&
      flags.aldricKnowsWeakness === true &&
      flags.miraSubplotStarted === true
    ) {
      return 'architect'
    }

    // ENDING 4: THE FOOL'S ERRAND
    if (
      flags.heroGivenFalseMap === true &&
      world.darkLordPower >= 70 &&
      hero.health <= 40
    ) {
      return 'fools_errand'
    }

    // ENDING 5: THE SACRIFICE
    if (
      kael.stats.suspicion >= 100 ||
      (kael.stats.suspicion >= 75 && flags.secretSold === true)
    ) {
      return 'sacrifice'
    }

    // ENDING 6: THE MIRROR
    if (
      flags.miraSaidDarkLordWasNobody === true &&
      kael.stats.knowledge >= 80 &&
      flags.kaelGaveUp === false &&
      world.darkLordPower >= 50
    ) {
      return 'mirror'
    }

    // ENDING 7: NOBODY — catch-all
    return 'nobody'
  }

  getEndingData(endingId) {
    return ENDINGS[endingId] || ENDINGS.nobody
  }

  reset() {
    this.triggered = false
  }
}
