import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hasSave } from '../../utils/save.js'

const TAGLINES = [
  "You are not the hero.",
  "You never were.",
  "But you were always there."
]

export function MainMenu({ onNewGame, onContinue, onSettings }) {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [hasSaveFile, setHasSaveFile] = useState(false)

  useEffect(() => {
    setHasSaveFile(hasSave())
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % TAGLINES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(13,10,7,0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 16 }}
      >
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 72,
          fontWeight: 700,
          color: '#e8dcc8',
          letterSpacing: '0.15em',
          lineHeight: 1,
          textShadow: '0 0 40px rgba(245,158,11,0.2)'
        }}>NPC</h1>
        <p style={{
          fontFamily: 'Crimson Pro, serif',
          fontStyle: 'italic',
          fontSize: 22,
          color: '#f59e0b',
          letterSpacing: '0.1em',
          marginTop: 4
        }}>Nobody's Story</p>
      </motion.div>

      {/* Tagline */}
      <motion.div style={{ height: 32, marginBottom: 56 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontStyle: 'italic',
              fontSize: 16,
              color: 'rgba(232,220,200,0.55)',
              letterSpacing: '0.05em'
            }}
          >
            {TAGLINES[taglineIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}
      >
        <MenuButton onClick={onNewGame} primary>New Game</MenuButton>
        {hasSaveFile && <MenuButton onClick={onContinue}>Continue</MenuButton>}
        <MenuButton onClick={onSettings}>Options</MenuButton>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: 24,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: 'rgba(232,220,200,0.2)',
          letterSpacing: '0.1em'
        }}
      >
        WASD TO MOVE · E TO INTERACT · TAB FOR JOURNAL
      </motion.p>
    </motion.div>
  )
}

function MenuButton({ children, onClick, primary }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 220,
        padding: '12px 24px',
        background: hovered
          ? primary ? 'rgba(245,158,11,0.2)' : 'rgba(232,220,200,0.1)'
          : 'transparent',
        border: `1px solid ${hovered ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
        borderRadius: 2,
        color: hovered ? '#f5c842' : '#e8dcc8',
        fontFamily: 'Cinzel, serif',
        fontSize: 13,
        letterSpacing: '0.15em',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        pointerEvents: 'all'
      }}
    >
      {children}
    </button>
  )
}
