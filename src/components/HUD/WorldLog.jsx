import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY_COLORS = {
  info: '#e8dcc8',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
  quiet: '#6b7280',
  climax: '#a855f7'
}

const SEVERITY_ICONS = {
  info: '◈',
  warning: '⚠',
  danger: '✕',
  success: '✓',
  quiet: '·',
  climax: '◆'
}

export function WorldLog({ entries }) {
  const recent = (entries || []).slice(-20)

  return (
    <div style={{
      position: 'absolute',
      top: 16, right: 16,
      width: 240,
      maxHeight: 320,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: 4
    }}>
      <AnimatePresence initial={false}>
        {recent.map((entry, i) => (
          <motion.div
            key={entry.id || i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(45,27,14,0.82)',
              border: `1px solid ${SEVERITY_COLORS[entry.severity] || '#e8dcc8'}22`,
              borderRadius: 3,
              padding: '5px 8px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span style={{
                color: SEVERITY_COLORS[entry.severity] || '#e8dcc8',
                fontSize: 10,
                marginTop: 1
              }}>
                {SEVERITY_ICONS[entry.severity] || '·'}
              </span>
              <p style={{
                fontFamily: 'Crimson Pro, serif',
                fontSize: 12,
                color: SEVERITY_COLORS[entry.severity] || '#e8dcc8',
                lineHeight: 1.5,
                margin: 0
              }}>
                {entry.message}
              </p>
            </div>
            {entry.day && (
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: 'rgba(232,220,200,0.25)',
                margin: '2px 0 0 16px'
              }}>
                Day {entry.day}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
