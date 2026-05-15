class EventBus {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
  }

  emit(event, data) {
    if (!this.listeners[event]) return
    this.listeners[event].forEach(cb => {
      try { cb(data) } catch (e) { console.error('[EventBus] Error in listener for', event, e) }
    })
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  clear(event) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = {}
    }
  }
}

export default new EventBus()
