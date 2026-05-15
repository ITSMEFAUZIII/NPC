const STORAGE_KEY = 'npc_world_v1'
let autosaveTimer = null

export function save(state) {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (e) {
    console.warn('[Save] Failed to save state:', e)
  }
}

export function autosave(state) {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => {
    save(state)
  }, 5000)
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.warn('[Save] Failed to load state:', e)
    return null
  }
}

export function clear() {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasSave() {
  return localStorage.getItem(STORAGE_KEY) !== null
}

export function exportSave() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'npc_save.json'
  a.click()
  URL.revokeObjectURL(url)
}
