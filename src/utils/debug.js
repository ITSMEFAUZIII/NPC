const DEBUG = import.meta.env.DEV

export const debug = {
  log(...args) { if (DEBUG) console.log('[NPC]', ...args) },
  warn(...args) { if (DEBUG) console.warn('[NPC]', ...args) },
  error(...args) { console.error('[NPC]', ...args) },
  group(label, fn) {
    if (DEBUG) { console.group('[NPC] ' + label); fn(); console.groupEnd() }
  }
}
