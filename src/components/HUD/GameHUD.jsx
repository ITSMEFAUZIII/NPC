import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../context/GameContext.jsx'
import { DayTimer } from './DayTimer.jsx'
import { WorldLog } from './WorldLog.jsx'
import { StatusPanel } from './StatusPanel.jsx'
import { Minimap } from './Minimap.jsx'
import { DialogueBox } from '../Dialogue/DialogueBox.jsx'
import { Narrator } from '../Dialogue/Narrator.jsx'
import { InventoryPanel } from '../Inventory/InventoryPanel.jsx'

export function GameHUD() {
  const { gameState, dispatch, engineRef } = useGame()

  const showInventory = gameState.flags?.inventoryOpen

  const handleDialogueAdvance = () => {
    if (engineRef.current?.dialogue) {
      engineRef.current.dialogue.advance()
    }
  }

  const handleChoiceSelect = (choiceId) => {
    if (engineRef.current?.dialogue) {
      engineRef.current.dialogue.selectChoice(choiceId)
    }
  }

  return (
    <div id="ui-overlay">
      {/* Top-left: Day timer */}
      <DayTimer time={gameState.time} />

      {/* Top-right: World log */}
      <WorldLog entries={gameState.worldLog} />

      {/* Bottom-left: Status panel */}
      <StatusPanel kael={gameState.kael} />

      {/* Bottom-right: Minimap */}
      <Minimap gameState={gameState} />

      {/* Context prompt */}
      <AnimatePresence>
        {gameState.flags?._contextPrompt && !gameState.activeDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            style={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(45,27,14,0.88)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 4,
              padding: '6px 14px'
            }}
          >
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 12,
              color: '#f5c842',
              letterSpacing: '0.1em'
            }}>
              [E] — {gameState.flags._contextPrompt}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrator (internal monologue) */}
      <Narrator text={gameState.activeDialogue?.narratorOnly ? gameState.activeDialogue?.narratorText : null} />

      {/* Dialogue box */}
      <AnimatePresence>
        {gameState.activeDialogue && !gameState.activeDialogue.narratorOnly && (
          <DialogueBox
            dialogue={gameState.activeDialogue}
            onAdvance={handleDialogueAdvance}
            onChoice={handleChoiceSelect}
          />
        )}
      </AnimatePresence>

      {/* Inventory */}
      <AnimatePresence>
        {showInventory && (
          <InventoryPanel
            kael={gameState.kael}
            onClose={() => dispatch({ type: 'SET_FLAG', payload: { key: 'inventoryOpen', value: false } })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
