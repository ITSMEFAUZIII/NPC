import { useState } from 'react'
import { motion } from 'framer-motion'

const SETTINGS_KEY = 'npc_settings_v1'
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} } catch { return {} }
}
function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch {}
}

export function Settings({ onClose }) {
  const [s, setS] = useState(() => ({
    shadowQuality: 'High',
    drawDistance: 'Medium',
    grassDensity: 'High',
    postProcessing: 'Full',
    bloom: true,
    filmGrain: true,
    masterVolume: 70,
    musicVolume: 50,
    sfxVolume: 80,
    ambientVolume: 60,
    textSpeed: 'Normal',
    dialogueSkip: false,
    autosave: true,
    showHints: true,
    subtitleSize: 'Medium',
    highContrast: false,
    reduceMotion: false,
    ...loadSettings()
  }))

  const update = (key, val) => {
    const next = { ...s, [key]: val }
    setS(next)
    saveSettings(next)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        backdropFilter: 'blur(4px)',
        pointerEvents: 'all'
      }}
    >
      <div style={{
        background: 'rgba(45,27,14,0.98)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 4,
        padding: '32px 40px',
        width: 500,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#f59e0b', letterSpacing: '0.15em' }}>SETTINGS</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#e8dcc8', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <Section title="GRAPHICS">
          <SelectRow label="Shadow Quality" value={s.shadowQuality} options={['Off','Low','High']} onChange={v => update('shadowQuality', v)} />
          <SelectRow label="Draw Distance" value={s.drawDistance} options={['Near','Medium','Far']} onChange={v => update('drawDistance', v)} />
          <SelectRow label="Grass Density" value={s.grassDensity} options={['Off','Low','High']} onChange={v => update('grassDensity', v)} />
          <SelectRow label="Post-Processing" value={s.postProcessing} options={['Off','Medium','Full']} onChange={v => update('postProcessing', v)} />
          <ToggleRow label="Bloom" value={s.bloom} onChange={v => update('bloom', v)} />
          <ToggleRow label="Film Grain" value={s.filmGrain} onChange={v => update('filmGrain', v)} />
        </Section>

        <Section title="AUDIO">
          <SliderRow label="Master Volume" value={s.masterVolume} onChange={v => update('masterVolume', v)} />
          <SliderRow label="Music Volume" value={s.musicVolume} onChange={v => update('musicVolume', v)} />
          <SliderRow label="SFX Volume" value={s.sfxVolume} onChange={v => update('sfxVolume', v)} />
          <SliderRow label="Ambient Volume" value={s.ambientVolume} onChange={v => update('ambientVolume', v)} />
        </Section>

        <Section title="GAMEPLAY">
          <SelectRow label="Text Speed" value={s.textSpeed} options={['Slow','Normal','Fast','Instant']} onChange={v => update('textSpeed', v)} />
          <ToggleRow label="Dialogue Skip" value={s.dialogueSkip} onChange={v => update('dialogueSkip', v)} />
          <ToggleRow label="Autosave" value={s.autosave} onChange={v => update('autosave', v)} />
          <ToggleRow label="Show Hints" value={s.showHints} onChange={v => update('showHints', v)} />
        </Section>

        <Section title="ACCESSIBILITY">
          <SelectRow label="Subtitle Size" value={s.subtitleSize} options={['Small','Medium','Large']} onChange={v => update('subtitleSize', v)} />
          <ToggleRow label="High Contrast" value={s.highContrast} onChange={v => update('highContrast', v)} />
          <ToggleRow label="Reduce Motion" value={s.reduceMotion} onChange={v => update('reduceMotion', v)} />
        </Section>
      </div>
    </motion.div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#f59e0b', letterSpacing: '0.2em', marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  )
}

function SelectRow({ label, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, color: '#e8dcc8' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: '#1a1008', border: '1px solid rgba(245,158,11,0.3)', color: '#e8dcc8', padding: '4px 8px', fontFamily: 'Crimson Pro, serif', fontSize: 13 }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SliderRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, color: '#e8dcc8' }}>{label}</span>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 120, accentColor: '#f59e0b' }}
      />
    </div>
  )
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontFamily: 'Crimson Pro, serif', fontSize: 14, color: '#e8dcc8' }}>{label}</span>
      <button onClick={() => onChange(!value)}
        style={{
          padding: '4px 16px',
          background: value ? 'rgba(245,158,11,0.2)' : 'transparent',
          border: `1px solid ${value ? '#f59e0b' : 'rgba(245,158,11,0.2)'}`,
          color: value ? '#f59e0b' : '#6b7280',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          cursor: 'pointer',
          borderRadius: 2,
          pointerEvents: 'all'
        }}>
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
