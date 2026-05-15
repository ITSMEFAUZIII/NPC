import { Kael } from '../characters/Kael.js'
import { SirAldric } from '../characters/SirAldric.js'
import { Villagers } from '../characters/Villagers.js'
import { Merchants } from '../characters/Merchants.js'
import * as THREE from 'three'

export class CharacterSystem {
  constructor(scene) {
    this.scene = scene
    this.kael = null
    this.aldric = null
    this.villagers = null
    this.merchants = null
  }

  build(getHeightAt) {
    this.kael = new Kael(this.scene)
    this.aldric = new SirAldric(this.scene)
    this.villagers = new Villagers(this.scene)
    this.villagers.build(getHeightAt)
    this.merchants = new Merchants(this.scene)
    return this
  }

  update(delta, input, cameraYaw, getHeightAt, state) {
    if (this.kael) {
      this.kael.setMonologues(state.time.day)
      this.kael.update(delta, input, cameraYaw, getHeightAt, state)
    }
    if (this.aldric && !state.hero.isInDungeon) {
      this.aldric.update(delta, getHeightAt)
    }
    if (this.villagers) {
      const aldricPos = this.aldric ? this.aldric.getPosition() : null
      this.villagers.update(delta, state.time.phase, aldricPos, getHeightAt)
    }
  }

  getKael() { return this.kael }
  getAldric() { return this.aldric }
  getVillagers() { return this.villagers }

  getVillagerInteractables() {
    return this.villagers ? this.villagers.getInteractables() : []
  }

  dispose() {
    if (this.kael) this.kael.dispose()
    if (this.aldric) this.aldric.dispose()
    if (this.villagers) this.villagers.dispose()
  }
}
