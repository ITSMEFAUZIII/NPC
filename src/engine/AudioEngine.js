export class AudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.musicGain = null
    this.sfxGain = null
    this.ambientGain = null
    this.tavernAmbientNode = null
    this.outdoorAmbientNode = null
    this.musicNodes = []
    this.enabled = true
    this.settings = {
      master: 0.7,
      music: 0.5,
      sfx: 0.8,
      ambient: 0.6
    }
    this._aldricNearby = false
    this._isIndoors = true
    this._oscillators = []
    this._noiseBuffer = null
    this._time = 0
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.settings.master
      this.masterGain.connect(this.ctx.destination)

      this.musicGain = this.ctx.createGain()
      this.musicGain.gain.value = this.settings.music
      this.musicGain.connect(this.masterGain)

      this.sfxGain = this.ctx.createGain()
      this.sfxGain.gain.value = this.settings.sfx
      this.sfxGain.connect(this.masterGain)

      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.value = this.settings.ambient
      this.ambientGain.connect(this.masterGain)

      this._noiseBuffer = this._createNoiseBuffer()
      this._startTavernAmbience()
      this._startTavernMusic()
    } catch (e) {
      console.warn('[AudioEngine] Web Audio not available:', e)
      this.enabled = false
    }
  }

  _createNoiseBuffer() {
    if (!this.ctx) return null
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  _createNoiseSource() {
    if (!this.ctx || !this._noiseBuffer) return null
    const source = this.ctx.createBufferSource()
    source.buffer = this._noiseBuffer
    source.loop = true
    return source
  }

  _startTavernAmbience() {
    if (!this.ctx) return
    // Low crowd murmur: noise through low-pass filter
    const noise = this._createNoiseSource()
    if (!noise) return
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400
    filter.Q.value = 0.5
    const gain = this.ctx.createGain()
    gain.gain.value = 0.04
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ambientGain)
    noise.start()
    this.tavernAmbientNode = { noise, filter, gain }

    // Fireplace crackle
    const crackleNoise = this._createNoiseSource()
    if (crackleNoise) {
      const crackleFilter = this.ctx.createBiquadFilter()
      crackleFilter.type = 'bandpass'
      crackleFilter.frequency.value = 200
      crackleFilter.Q.value = 2
      const crackleGain = this.ctx.createGain()
      crackleGain.gain.value = 0.03
      crackleNoise.connect(crackleFilter)
      crackleFilter.connect(crackleGain)
      crackleGain.connect(this.ambientGain)
      crackleNoise.start()
    }

    // Random glass clinks
    this._scheduleGlassClink()
  }

  _scheduleGlassClink() {
    if (!this.ctx || !this.enabled) return
    const delay = 5000 + Math.random() * 10000
    setTimeout(() => {
      this._playGlassClink()
      this._scheduleGlassClink()
    }, delay)
  }

  _playGlassClink() {
    if (!this.ctx || !this.enabled) return
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.frequency.value = 800 + Math.random() * 400
    osc.type = 'sine'
    env.gain.setValueAtTime(0.1, this.ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3)
    osc.connect(env)
    env.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  _startTavernMusic() {
    if (!this.ctx) return
    // C minor pentatonic: C, Eb, F, G, Bb
    const notes = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13]
    const playArpeggio = () => {
      if (!this.enabled) return
      const noteFreq = notes[Math.floor(Math.random() * notes.length)]
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const env = this.ctx.createGain()
      osc.frequency.value = noteFreq * (Math.random() > 0.5 ? 2 : 1)
      osc.type = 'triangle'
      filter.type = 'lowpass'
      filter.frequency.value = 600
      const now = this.ctx.currentTime
      env.gain.setValueAtTime(0, now)
      env.gain.linearRampToValueAtTime(0.06, now + 0.05)
      env.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
      osc.connect(filter)
      filter.connect(env)
      env.connect(this.musicGain)
      osc.start(now)
      osc.stop(now + 1.5)
      this.musicNodes.push(osc)
    }
    this._musicInterval = setInterval(playArpeggio, 600 + Math.random() * 800)
  }

  playSFX(type) {
    if (!this.ctx || !this.enabled) return
    switch (type) {
      case 'footstep_wood': this._playFootstep(400); break
      case 'footstep_stone': this._playFootstep(250); break
      case 'coin': this._playCoin(); break
      case 'page_turn': this._playPageTurn(); break
      case 'bottle_pour': this._playPour(); break
      case 'heroic_hum': this._playHeroHum(); break
    }
  }

  _playFootstep(freq) {
    if (!this.ctx) return
    const noise = this._createNoiseSource()
    if (!noise) return
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.15, this.ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)
    noise.connect(filter)
    filter.connect(env)
    env.connect(this.sfxGain)
    noise.start()
    noise.stop(this.ctx.currentTime + 0.12)
  }

  _playCoin() {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2)
    osc.type = 'sine'
    env.gain.setValueAtTime(0.2, this.ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)
    osc.connect(env)
    env.connect(this.sfxGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  _playPageTurn() {
    if (!this.ctx) return
    const noise = this._createNoiseSource()
    if (!noise) return
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 3000
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.08, this.ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)
    noise.connect(filter)
    filter.connect(env)
    env.connect(this.sfxGain)
    noise.start()
    noise.stop(this.ctx.currentTime + 0.15)
  }

  _playPour() {
    if (!this.ctx) return
    const noise = this._createNoiseSource()
    if (!noise) return
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 3
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.1, this.ctx.currentTime)
    env.gain.setValueAtTime(0.05, this.ctx.currentTime + 0.8)
    env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.0)
    noise.connect(filter)
    filter.connect(env)
    env.connect(this.sfxGain)
    noise.start()
    noise.stop(this.ctx.currentTime + 1.0)
  }

  _playHeroHum() {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.frequency.value = 220
    osc.type = 'sine'
    env.gain.setValueAtTime(0.02, this.ctx.currentTime)
    env.gain.setValueAtTime(0.02, this.ctx.currentTime + 1.5)
    env.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2)
    osc.connect(env)
    env.connect(this.musicGain)
    osc.start()
    osc.stop(this.ctx.currentTime + 2)
  }

  setAldricNearby(nearby) {
    if (this._aldricNearby === nearby) return
    this._aldricNearby = nearby
    if (!this.musicGain) return
    const targetVolume = nearby ? this.settings.music * 0.8 : this.settings.music
    this.musicGain.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + 2)
    if (nearby) this.playSFX('heroic_hum')
  }

  playEndingMusic(endingId) {
    if (!this.ctx || !this.enabled) return
    if (this._musicInterval) clearInterval(this._musicInterval)
    // Different ending music tones
    const endingTones = {
      seen: [261.63, 329.63, 392.0, 523.25],
      quiet_victory: [261.63, 311.13, 392.0, 466.16],
      architect: [220.0, 261.63, 329.63, 440.0],
      fools_errand: [207.65, 261.63, 311.13, 415.30],
      sacrifice: [196.0, 233.08, 293.66, 392.0],
      mirror: [261.63, 329.63, 369.99, 523.25],
      nobody: [261.63, 311.13, 392.0, 466.16]
    }
    const tones = endingTones[endingId] || endingTones.nobody
    let delay = 0
    tones.forEach(freq => {
      setTimeout(() => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const env = this.ctx.createGain()
        osc.frequency.value = freq
        osc.type = 'sine'
        env.gain.setValueAtTime(0.15, this.ctx.currentTime)
        env.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3)
        osc.connect(env)
        env.connect(this.musicGain)
        osc.start()
        osc.stop(this.ctx.currentTime + 3)
      }, delay)
      delay += 800
    })
  }

  setVolume(type, value) {
    this.settings[type] = value
    if (!this.ctx) return
    const gainMap = {
      master: this.masterGain,
      music: this.musicGain,
      sfx: this.sfxGain,
      ambient: this.ambientGain
    }
    if (gainMap[type]) gainMap[type].gain.value = value
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  update(cameraPosition) {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }

  destroy() {
    if (this._musicInterval) clearInterval(this._musicInterval)
    if (this.ctx) this.ctx.close()
  }
}
