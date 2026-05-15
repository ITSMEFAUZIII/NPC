import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENDINGS } from '../../data/endings.js'
import { clear } from '../../utils/save.js'

function getInfluenceDesc(v) {
  if (v <= 20) return 'a whisper'
  if (v <= 40) return 'a murmur'
  if (v <= 60) return 'a current'
  if (v <= 80) return 'a tide'
  return 'a force'
}

export function GameOver({ endingId, gameState, onRestart, onMenu }) {
  const ending = ENDINGS[endingId] || ENDINGS.nobody
  const [visibleLines, setVisibleLines] = useState(0)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      idx++
      if (idx <= ending.lines.length) {
        setVisibleLines(idx)
      } else {
        clearInterval(interval)
        setTimeout(() => setShowStats(true), 1000)
      }
    }, 2200)
    return () => clearInterval(interval)
  }, [endingId])

  const handleRestart = () => {
    clear()
    onRestart()
  }

  const kael = gameState?.kael || {}
  const stats = kael.stats || {}
  const hero = gameState?.hero || {}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        fontFamily: 'Crimson Pro, serif'
      }}
    >
      <div style={{
        maxWidth: 580,
        width: '90%',
        textAlign: 'center',
        padding: 48
      }}>
        {/* Ending title — Ending 7 has no title */}
        {ending.title && (
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 28,
              color: '#f59e0b',
              letterSpacing: '0.2em',
              marginBottom: 48,
              textTransform: 'uppercase'
            }}
          >
            {ending.title}
          </motion.h2>
        )}

        {/* Ending lines */}
        <div style={{ minHeight: 200, marginBottom: 40 }}>
          {ending.lines.slice(0, visibleLines).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                fontSize: 20,
                color: '#e8dcc8',
                lineHeight: 1.8,
                marginBottom: 8,
                fontStyle: 'italic'
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Stats panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'rgba(45,27,14,0.85)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 4,
                padding: '20px 28px',
                marginBottom: 32,
                textAlign: 'left'
              }}
            >
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: '#f59e0b', letterSpacing: '0.15em', marginBottom: 16 }}>
                ASHENVEIL — AFTER 30 DAYS
              </p>
              <StatLine label="Days survived" value="30" />
              <StatLine label="Influence exerted" value={getInfluenceDesc(stats.influence || 0)} />
              <StatLine label="Times noticed by the hero" value={hero.noticedKael ? '1' : '0'} />
              <StatLine label="Coins earned" value={`${stats.coins || 0}`} />
              <StatLine
                label="Kael's name, spoken aloud"
                value={endingId === 'seen' ? '1' : '0'}
                highlight={endingId === 'seen'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
            >
              <EndingButton onClick={handleRestart}>Play Again</EndingButton>
              <EndingButton onClick={onMenu}>Main Menu</EndingButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function StatLine({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6b7280' }}>{label}</span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        color: highlight ? '#f59e0b' : '#e8dcc8'
      }}>{value}</span>
    </div>
  )
}

function EndingButton({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 24px',
        background: hov ? 'rgba(245,158,11,0.2)' : 'transparent',
        border: `1px solid ${hov ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
        borderRadius: 2,
        color: '#e8dcc8',
        fontFamily: 'Cinzel, serif',
        fontSize: 12,
        letterSpacing: '0.1em',
        cursor: 'pointer',
        transition: 'all 0.2s',
        pointerEvents: 'all'
      }}
    >
      {children}
    </button>
  )
}
