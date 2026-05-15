import { AnimatePresence, motion } from 'framer-motion'

export function Narrator({ text }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            maxWidth: 600,
            padding: '0 32px'
          }}
        >
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'rgba(232,220,200,0.85)',
            lineHeight: 1.6
          }}>
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
