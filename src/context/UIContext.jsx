import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [contextPrompt, setContextPrompt] = useState(null)
  const [narratorText, setNarratorText] = useState(null)
  const [activeTab, setActiveTab] = useState('inventory')

  return (
    <UIContext.Provider value={{
      inventoryOpen, setInventoryOpen,
      settingsOpen, setSettingsOpen,
      contextPrompt, setContextPrompt,
      narratorText, setNarratorText,
      activeTab, setActiveTab
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
