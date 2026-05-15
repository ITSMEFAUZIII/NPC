import { createContext, useContext, useReducer, useRef } from 'react'

export const INITIAL_STATE = {
  phase: 'menu',
  time: {
    day: 1,
    hour: 6,
    totalTicks: 0,
    phase: 'dawn'
  },
  kael: {
    position: { x: -50, y: 0, z: 10 },
    stats: {
      coins: 15,
      influence: 0,
      suspicion: 0,
      knowledge: 0,
      morale: 50,
    },
    inventory: [],
    actionsToday: [],
    knownSecrets: [],
    reputation: {}
  },
  hero: {
    name: 'Sir Aldric',
    position: { x: 0, y: 0, z: -200 },
    questStage: 1,
    health: 100,
    maxHealth: 100,
    arrogance: 85,
    perception: 20,
    trust: 40,
    gold: 200,
    currentActivity: 'traveling',
    isInTavern: false,
    noticedKael: false,
    noticedCount: 0
  },
  world: {
    goblinThreat: 30,
    darkLordPower: 40,
    villageHope: 60,
    activeEvents: [],
    completedEvents: [],
    deadNPCs: [],
    alteredFacts: {}
  },
  flags: {
    aldricKnowsArtifact: false,
    kaelVisitedBlackMarket: false,
    miraSubplotStarted: false,
    heroWasPoisoned: false,
    trapdoorDiscovered: false,
    heroGivenFalseMap: false,
    villageWarned: false,
    orphanHelped: false,
    secretSold: false,
    heroWeaponGiven: false,
    aldricKnowsWeakness: false,
    kaelSaidNothing: false,
    kaelGaveUp: false,
    miraSaidDarkLordWasNobody: false,
    tomeFound: false
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload }
    case 'UPDATE_KAEL':
      return { ...state, kael: { ...state.kael, ...action.payload } }
    case 'UPDATE_KAEL_STATS':
      return { ...state, kael: { ...state.kael, stats: { ...state.kael.stats, ...action.payload } } }
    case 'UPDATE_HERO':
      return { ...state, hero: { ...state.hero, ...action.payload } }
    case 'UPDATE_WORLD':
      return { ...state, world: { ...state.world, ...action.payload } }
    case 'UPDATE_TIME':
      return { ...state, time: { ...state.time, ...action.payload } }
    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.payload.key]: action.payload.value } }
    case 'ADD_LOG': {
      const newLog = [...(state.worldLog || []), action.payload]
      return { ...state, worldLog: newLog.slice(-50) }
    }
    case 'OPEN_DIALOGUE':
      return { ...state, activeDialogue: action.payload }
    case 'CLOSE_DIALOGUE':
      return { ...state, activeDialogue: null }
    case 'ADD_INVENTORY':
      return { ...state, kael: { ...state.kael, inventory: [...state.kael.inventory, action.payload] } }
    case 'REMOVE_INVENTORY':
      return { ...state, kael: { ...state.kael, inventory: state.kael.inventory.filter(i => i.id !== action.payload) } }
    case 'TRIGGER_ENDING':
      return { ...state, phase: 'ended', endingId: action.payload }
    case 'ADD_SECRET':
      return { ...state, kael: { ...state.kael, knownSecrets: [...state.kael.knownSecrets, action.payload] } }
    case 'LOAD_STATE':
      return { ...action.payload, worldLog: [] }
    default:
      return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, {
    ...INITIAL_STATE,
    worldLog: [],
    activeDialogue: null,
    endingId: null,
    contextPrompt: null,
    narratorText: null
  })

  const engineRef = useRef(null)

  return (
    <GameContext.Provider value={{ gameState, dispatch, engineRef }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
