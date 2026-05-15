import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChoiceMenu } from './ChoiceMenu.jsx'

const SPEAKER_COLORS = {
  NARRATOR: '#9ca3af',
  KAEL: '#c4956a',
  aldric: '#ffd700',
  mira: '#7a9e7e',
  pip: '#d4956a',
  elder_voss: '#c4a060',
  tom: '#c47050',
  default: '#e8dcc8'
}

const SPEAKER_NAMES = {
  NARRATOR: null,
  KAEL: 'Kael',
  aldric: 'Sir Aldric',
  mira: 'Mira',
  pip: 'Pip',
  elder_voss: 'Elder Voss',
  tom: 'Tom',
}

export function DialogueBox({ dialogue, onAdvance, onChoice }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const timerRef = useRef(null)
  const textRef = useRef('')

  const currentLine = dialogue?.currentLine
  const fullText = currentLine?.text || ''
  const speaker = currentLine?.speaker || 'NARRATOR'
  const speakerColor = SPEAKER_COLORS[speaker] || SPEAKER_COLORS.default
  const speakerName = SPEAKER_NAMES[speaker]

  useEffect(() => {
    if (!fullText) return
    if (timerRef.current) clearInterval(timerRef.current)
    setDisplayText('')
    setIsTyping(true)
    setShowContinue(false)
    textRef.current = ''
    let i = 0
    timerRef.current = setInterval(() => {
      i++
      textRef.current = fullText.slice(0, i)
      setDisplayText(textRef.current)
      if (i >= fullText.length) {
        clearInterval(timerRef.current)
        setIsTyping(false)
        setShowContinue(true)
      }
    }, 30)
    return () => clearInterval(timerRef.current)
  }, [fullText])

  const handleClick = () => {
    if (isTyping) {
      // Skip to end
      if (timerRef.current) clearInterval(timerRef.current)
      setDisplayText(fullText)
      setIsTyping(false)
      setShowContinue(true)
    } else if (!dialogue?.showChoices) {
      onAdvance()
    }
  }

  if (!dialogue || dialogue.narratorOnly) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 24px 24px',
        pointerEvents: 'all',
        cursor: 'pointer'
      }}
    >
      <div style={{
        background: 'rgba(45,27,14,0.95)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 4,
        padding: '16px 20px',
        minHeight: 120,
        position: 'relative',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.5)'
      }}>
        {/* Speaker name */}
        {speakerName && (
          <p style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 12,
            color: speakerColor,
            letterSpacing: '0.15em',
            marginBottom: 8,
            textTransform: 'uppercase'
          }}>
            {speakerName}
          </p>
        )}

        {/* Dialogue text */}
        <p style={{
          fontFamily: 'Crimson Pro, serif',
          fontStyle: speaker === 'NARRATOR' ? 'italic' : 'normal',
          fontSize: 18,
          color: speakerColor,
          lineHeight: 1.6,
          minHeight: 50
        }}>
          {displayText}
          {isTyping && <span style={{ opacity: 0.5 }}>▌</span>}
        </p>

        {/* Continue indicator */}
        {showContinue && !dialogue.showChoices && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              color: '#f59e0b',
              fontSize: 12
            }}
          >▼</motion.span>
        )}

        {/* Choices */}
        {dialogue.showChoices && (
          <ChoiceMenu choices={dialogue.choices} onSelect={onChoice} />
        )}
      </div>
    </motion.div>
  )
}
