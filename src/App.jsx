import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GameProvider, useGame } from './context/GameContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import { GameEngine } from './engine/GameEngine.js'
import { MainMenu } from './components/Screens/MainMenu.jsx'
import { LoadingScreen } from './components/Screens/LoadingScreen.jsx'
import { PauseMenu } from './components/Screens/PauseMenu.jsx'
import { GameOver } from './components/Screens/GameOver.jsx'
import { Settings } from './components/Screens/Settings.jsx'
import { GameHUD } from './components/HUD/GameHUD.jsx'

function GameApp() {
  const { gameState, dispatch, engineRef } = useGame()
  const canvasRef = useRef(null)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const getState = useCallback(() => {
    // This gets called from GameEngine — needs live state
    // We use a ref to always get current state
    return stateRef.current
  }, [])

  const stateRef = useRef(gameState)
  useEffect(() => {
    stateRef.current = gameState
  })

  const startNewGame = async () => {
    dispatch({ type: 'SET_PHASE', payload: 'loading' })

    const engine = new GameEngine(
      canvasRef.current,
      dispatch,
      () => stateRef.current
    )
    engineRef.current = engine

    try {
      await engine.init((progress) => {
        setLoadingProgress(progress)
      })
      engine.start()
    } catch (err) {
      console.error('[App] Engine init failed:', err)
      dispatch({ type: 'SET_PHASE', payload: 'menu' })
    }
  }

  const continueGame = async () => {
    await startNewGame()
  }

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.destroy()
      engineRef.current = null
    }
    dispatch({ type: 'LOAD_STATE', payload: {
      phase: 'menu',
      time: { day: 1, hour: 6, totalTicks: 0, phase: 'dawn' },
      kael: { position: { x: -50, y: 0, z: 10 }, stats: { coins: 15, influence: 0, suspicion: 0, knowledge: 0, morale: 50 }, inventory: [], actionsToday: [], knownSecrets: [], reputation: {} },
      hero: { name: 'Sir Aldric', position: { x: 0, y: 0, z: -200 }, questStage: 1, health: 100, maxHealth: 100, arrogance: 85, perception: 20, trust: 40, gold: 200, currentActivity: 'traveling', isInTavern: false, noticedKael: false, noticedCount: 0 },
      world: { goblinThreat: 30, darkLordPower: 40, villageHope: 60, activeEvents: [], completedEvents: [], deadNPCs: [], alteredFacts: {} },
      flags: {}
    }})
  }

  const handleResume = () => {
    dispatch({ type: 'SET_PHASE', payload: 'playing' })
    if (engineRef.current) engineRef.current.resume()
  }

  const handlePauseMenu = () => {
    if (engineRef.current) engineRef.current.pause()
  }

  useEffect(() => {
    if (gameState.phase === 'paused' && engineRef.current) {
      engineRef.current.pause()
    }
  }, [gameState.phase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])

  const { phase } = gameState

  return (
    <>
      {/* THREE.js canvas — always present */}
      <canvas id="game-canvas" ref={canvasRef} />

      {/* React UI overlay */}
      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <MainMenu
            key="menu"
            onNewGame={startNewGame}
            onContinue={continueGame}
            onSettings={() => setSettingsOpen(true)}
          />
        )}
        {phase === 'loading' && (
          <LoadingScreen key="loading" progress={loadingProgress} />
        )}
        {phase === 'playing' && <GameHUD key="hud" />}
        {phase === 'paused' && (
          <PauseMenu
            key="pause"
            onResume={handleResume}
            onSettings={() => setSettingsOpen(true)}
            onMenu={() => {
              if (engineRef.current) engineRef.current.destroy()
              dispatch({ type: 'SET_PHASE', payload: 'menu' })
            }}
          />
        )}
        {phase === 'ended' && (
          <GameOver
            key="gameover"
            endingId={gameState.endingId}
            gameState={gameState}
            onRestart={handleRestart}
            onMenu={() => dispatch({ type: 'SET_PHASE', payload: 'menu' })}
          />
        )}
      </AnimatePresence>

      {/* Settings overlay (can show on top of any screen) */}
      <AnimatePresence>
        {settingsOpen && (
          <Settings key="settings" onClose={() => setSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <UIProvider>
        <GameApp />
      </UIProvider>
    </GameProvider>
  )
}
