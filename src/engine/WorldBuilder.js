import { TerrainGen } from '../world/terrain/TerrainGen.js'
import { WaterSystem } from '../world/terrain/WaterSystem.js'
import { Vegetation } from '../world/props/Vegetation.js'
import { Village } from '../world/buildings/Village.js'
import { Tavern } from '../world/buildings/Tavern.js'
import { Castle } from '../world/buildings/Castle.js'
import { BlackMarket } from '../world/buildings/BlackMarket.js'
import { Dungeon } from '../world/buildings/Dungeon.js'
import { WorldLighting } from '../world/props/Lighting.js'

export class WorldBuilder {
  constructor(scene) {
    this.scene = scene
    this.terrain = null
    this.water = null
    this.vegetation = null
    this.village = null
    this.tavern = null
    this.castle = null
    this.blackMarket = null
    this.dungeon = null
    this.worldLighting = null
    this.interactables = []
  }

  async build(onProgress) {
    const report = (msg) => { if (onProgress) onProgress(msg) }

    report('Raising the mountains...')
    this.terrain = new TerrainGen(this.scene)
    this.terrain.generate()
    await this._wait(100)

    report('Growing the forest...')
    this.vegetation = new Vegetation(this.scene)
    this.vegetation.generate(this.terrain.getHeightAt.bind(this.terrain))
    await this._wait(100)

    report('Filling the river...')
    this.water = new WaterSystem(this.scene)
    this.water.create()
    await this._wait(50)

    report('Building the village...')
    this.village = new Village(this.scene)
    this.village.build()
    await this._wait(100)

    report('Lighting the hearth...')
    this.tavern = new Tavern(this.scene)
    this.tavern.build()
    await this._wait(100)

    report('Building the castle...')
    this.castle = new Castle(this.scene)
    this.castle.build()
    await this._wait(50)

    report('Hiding the secrets...')
    this.blackMarket = new BlackMarket(this.scene)
    this.blackMarket.build()

    this.dungeon = new Dungeon(this.scene)
    this.dungeon.build()
    await this._wait(50)

    report('Placing the torches...')
    this.worldLighting = new WorldLighting(this.scene)
    this.worldLighting.addVillageTorches()
    await this._wait(50)

    // Collect all interactables
    this.interactables = [
      ...this.village.getInteractables(),
      ...this.tavern.getInteractables(),
      ...this.blackMarket.getInteractables()
    ]

    return this
  }

  update(delta, time, darkLordPower) {
    if (this.water) this.water.update(delta)
    if (this.tavern) this.tavern.update(delta, time)
    if (this.vegetation) this.vegetation.update(delta)
    if (this.castle) this.castle.update(delta, darkLordPower)
    if (this.worldLighting) this.worldLighting.update(delta)
  }

  setTimeOfDay(phase) {
    if (this.worldLighting) this.worldLighting.setTimeOfDay(phase)
    if (this.tavern) this.tavern.setNightMode(phase === 'night' || phase === 'dusk')
  }

  revealTrapdoor() {
    if (this.tavern) this.tavern.revealTrapdoor()
    if (this.blackMarket) this.blackMarket.show()
  }

  getInteractables() {
    return this.interactables
  }

  getTerrainHeight(x, z) {
    return this.terrain ? this.terrain.getHeightAt(x, z) : 0
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  dispose() {
    if (this.terrain) this.terrain.dispose()
    if (this.water) this.water.dispose()
    if (this.vegetation) this.vegetation.dispose()
    if (this.castle) this.castle.dispose?.()
  }
}
