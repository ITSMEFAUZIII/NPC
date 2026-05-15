import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_STEPS = [
  'Raising the mountains...',
  'Growing the forest...',
  'Building the village...',
  'Lighting the hearth...',
  'Hiring the hero...',
  'Forgetting the innkeeper...',
  'Ashenveil is ready.'
]

export function LoadingScreen({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#0d0a07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        fontFamily: 'Cinzel, serif'
      }}
    >
      {/* Tavern silhouette SVG */}
      <svg width="120" height="90" viewBox="0 0 120 90" style={{ marginBottom: 32, opacity: 0.6 }}>
        <polygon points="60,5 10,40 110,40" fill="#f59e0b" opacity="0.4"/>
        <rect x="15" y="40" width="90" height="50" fill="#2d1b0e"/>
        <rect x="20" y="45" width="15" height="20" fill="#f59e0b" opacity="0.6"/>
        <rect x="85" y="45" width="15" height="20" fill="#f59e0b" opacity="0.6"/>
        <rect x="50" y="55" width="20" height="35" fill="#1a0e05"/>
        <rect x="35" y="30" width="6" height="25" fill="#4a3728"/>
        <rect x="58" y="10" width="4" height="20" fill="#4a3728"/>
      </svg>

      <h1 style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 28,
        color: '#f59e0b',
        letterSpacing: '0.2em',
        marginBottom: 8
      }}>NPC</h1>

      <p style={{
        fontFamily: 'Crimson Pro, serif',
        fontStyle: 'italic',
        fontSize: 16,
        color: '#e8dcc8',
        marginBottom: 48,
        opacity: 0.8
      }}>Nobody's Story</p>

      <AnimatePresence mode="wait">
        <motion.p
          key={progress}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: 15,
            color: progress === 'Forgetting the innkeeper...' ? '#6b7280' : '#e8dcc8',
            marginBottom: 24,
            fontStyle: 'italic',
            minHeight: 24
          }}
        >
          {progress || LOADING_STEPS[0]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div style={{
        width: 280,
        height: 2,
        background: 'rgba(245,158,11,0.15)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(LOADING_STEPS.indexOf(progress) + 1) / LOADING_STEPS.length * 100}%`
          }}
          transition={{ duration: 0.6 }}
          style={{
            height: '100%',
            background: '#f59e0b',
            borderRadius: 2
          }}
        />
      </div>
    </motion.div>
  )
}
