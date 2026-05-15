import { motion } from 'framer-motion'
import { useState } from 'react'

export function PauseMenu({ onResume, onSettings, onMenu }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        background: 'rgba(45,27,14,0.95)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 4,
        padding: '40px 60px',
        textAlign: 'center',
        pointerEvents: 'all'
      }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 22,
          color: '#f59e0b',
          letterSpacing: '0.2em',
          marginBottom: 32
        }}>PAUSED</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PauseButton onClick={onResume}>Resume</PauseButton>
          <PauseButton onClick={onSettings}>Settings</PauseButton>
          <PauseButton onClick={onMenu}>Main Menu</PauseButton>
        </div>
      </div>
    </motion.div>
  )
}

function PauseButton({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 48px',
        background: hov ? 'rgba(245,158,11,0.15)' : 'transparent',
        border: `1px solid ${hov ? '#f59e0b' : 'rgba(245,158,11,0.2)'}`,
        borderRadius: 2,
        color: '#e8dcc8',
        fontFamily: 'Cinzel, serif',
        fontSize: 12,
        letterSpacing: '0.15em',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textTransform: 'uppercase'
      }}
    >
      {children}
    </button>
  )
}
