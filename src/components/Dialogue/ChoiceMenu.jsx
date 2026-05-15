import { useState } from 'react'
import { motion } from 'framer-motion'

export function ChoiceMenu({ choices, onSelect }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1)

  if (!choices || choices.length === 0) return null

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {choices.map((choice, i) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          onClick={(e) => { e.stopPropagation(); onSelect(choice.id) }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(-1)}
          style={{
            background: hoveredIdx === i ? 'rgba(245,158,11,0.12)' : 'rgba(45,27,14,0.6)',
            border: `1px solid ${hoveredIdx === i ? 'rgba(245,158,11,0.5)' : 'rgba(245,158,11,0.15)'}`,
            borderRadius: 3,
            padding: '8px 12px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            transition: 'all 0.15s',
            pointerEvents: 'all'
          }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#f59e0b',
            minWidth: 16
          }}>[{i + 1}]</span>
          <span style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: 16,
            color: hoveredIdx === i ? '#f5c842' : '#e8dcc8',
            fontStyle: 'italic'
          }}>
            {choice.text}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
