import { motion, AnimatePresence } from 'framer-motion'

const PHASE_LABELS = {
  dawn: 'Dawn', morning: 'Morning', afternoon: 'Afternoon', dusk: 'Dusk', night: 'Night'
}

export function DayTimer({ time }) {
  const { day, hour, phase } = time || {}
  const phaseLabel = PHASE_LABELS[phase] || 'Morning'

  return (
    <div style={{
      position: 'absolute',
      top: 16, left: 16,
      background: 'rgba(45,27,14,0.88)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 4,
      padding: '8px 14px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M6 0L6 14M2 2L10 2M2 12L10 12M0 7L12 7" stroke="#f59e0b" strokeWidth="1" opacity="0.6"/>
        </svg>
        <AnimatePresence mode="wait">
          <motion.span
            key={day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 13,
              color: '#f5c842',
              letterSpacing: '0.08em'
            }}
          >
            Day {day}
          </motion.span>
        </AnimatePresence>
        <span style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: 13,
          color: 'rgba(232,220,200,0.6)',
          fontStyle: 'italic'
        }}>
          — {phaseLabel}
        </span>
      </div>
    </div>
  )
}
