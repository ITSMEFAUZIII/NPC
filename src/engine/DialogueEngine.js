import EventBus from './EventBus.js'
import { DIALOGUES } from '../data/dialogues.js'

export class DialogueEngine {
  constructor(dispatch, getState) {
    this.dispatch = dispatch
    this.getState = getState
    this.currentDialogue = null
    this.currentLineIndex = 0
    this.isActive = false
    this.onComplete = null
  }

  processText(text, state) {
    if (!state) return text
    const influenceDesc = this._getInfluenceDesc(state.kael?.stats?.influence || 0)
    return text
      .replace(/\{day\}/g, state.time?.day || 1)
      .replace(/\{coins\}/g, state.kael?.stats?.coins || 0)
      .replace(/\{heroName\}/g, state.hero?.name || 'Sir Aldric')
      .replace(/\{influence\}/g, influenceDesc)
  }

  _getInfluenceDesc(value) {
    if (value <= 20) return 'nothing'
    if (value <= 40) return 'a whisper'
    if (value <= 60) return 'a current'
    if (value <= 80) return 'a tide'
    return 'a force'
  }

  checkCondition(condition, state) {
    if (!condition) return true
    if (condition.startsWith('hasItem:')) {
      const itemId = condition.replace('hasItem:', '')
      return state.kael.inventory.some(i => i.id === itemId)
    }
    if (condition.startsWith('notFlag:')) {
      const flag = condition.replace('notFlag:', '')
      return !state.flags[flag]
    }
    if (condition.startsWith('flag:')) {
      const flag = condition.replace('flag:', '')
      return !!state.flags[flag]
    }
    if (condition === 'hasCoin') {
      return state.kael.stats.coins >= 1
    }
    return true
  }

  startDialogue(id, onComplete) {
    const dialogue = DIALOGUES[id]
    if (!dialogue) {
      console.warn('[DialogueEngine] Dialogue not found:', id)
      return
    }
    this.currentDialogue = dialogue
    this.currentLineIndex = 0
    this.isActive = true
    this.onComplete = onComplete || null

    const state = this.getState()
    const firstLine = dialogue.lines[0]

    this.dispatch({
      type: 'OPEN_DIALOGUE',
      payload: {
        id: dialogue.id,
        currentLine: firstLine ? {
          ...firstLine,
          text: this.processText(firstLine.text, state)
        } : null,
        lineIndex: 0,
        totalLines: dialogue.lines.length,
        choices: [],
        showChoices: false
      }
    })

    EventBus.emit('dialogue:start', { dialogueId: id })
  }

  advance() {
    if (!this.isActive || !this.currentDialogue) return
    const state = this.getState()
    const lines = this.currentDialogue.lines
    const nextIndex = this.currentLineIndex + 1

    if (nextIndex < lines.length) {
      this.currentLineIndex = nextIndex
      const line = lines[nextIndex]
      this.dispatch({
        type: 'OPEN_DIALOGUE',
        payload: {
          id: this.currentDialogue.id,
          currentLine: {
            ...line,
            text: this.processText(line.text, state)
          },
          lineIndex: nextIndex,
          totalLines: lines.length,
          choices: [],
          showChoices: false
        }
      })
    } else {
      // End of lines — show choices if any
      const choices = this.currentDialogue.choices || []
      if (choices.length > 0) {
        const availableChoices = choices.filter(c => this.checkCondition(c.condition, state))
        this.dispatch({
          type: 'OPEN_DIALOGUE',
          payload: {
            id: this.currentDialogue.id,
            currentLine: null,
            lineIndex: nextIndex,
            totalLines: lines.length,
            choices: availableChoices,
            showChoices: true
          }
        })
      } else {
        this.endDialogue()
      }
    }
  }

  selectChoice(choiceId) {
    if (!this.currentDialogue) return
    const state = this.getState()
    const choices = this.currentDialogue.choices || []
    const choice = choices.find(c => c.id === choiceId)
    if (!choice) return

    // Apply effects
    if (choice.effects) {
      const { stats, flags, removeItem, addItem } = choice.effects
      if (stats) {
        const newStats = { ...state.kael.stats }
        Object.entries(stats).forEach(([key, val]) => {
          if (key in newStats) {
            newStats[key] = Math.max(0, Math.min(100, (newStats[key] || 0) + val))
          }
        })
        this.dispatch({ type: 'UPDATE_KAEL', payload: { stats: newStats } })
      }
      if (flags) {
        Object.entries(flags).forEach(([key, val]) => {
          this.dispatch({ type: 'SET_FLAG', payload: { key, value: val } })
        })
      }
      if (removeItem) {
        this.dispatch({ type: 'REMOVE_INVENTORY', payload: removeItem })
      }
      if (addItem) {
        this.dispatch({ type: 'ADD_INVENTORY', payload: addItem })
      }
    }

    EventBus.emit('kael:action', { action: choiceId, choiceId })

    if (choice.nextNode) {
      this.startDialogue(choice.nextNode, this.onComplete)
    } else {
      this.endDialogue()
    }
  }

  endDialogue() {
    const id = this.currentDialogue?.id
    this.currentDialogue = null
    this.currentLineIndex = 0
    this.isActive = false
    this.dispatch({ type: 'CLOSE_DIALOGUE' })
    EventBus.emit('dialogue:end', { dialogueId: id })
    if (this.onComplete) {
      this.onComplete()
      this.onComplete = null
    }
  }

  triggerIfConditionsMet(dialogueId, state) {
    const dialogue = DIALOGUES[dialogueId]
    if (!dialogue || !dialogue.trigger) return false
    const { trigger } = dialogue
    if (trigger.day !== null && trigger.day !== undefined) {
      if (Array.isArray(trigger.day)) {
        if (!trigger.day.includes(state.time.day)) return false
      } else {
        if (state.time.day !== trigger.day) return false
      }
    }
    if (trigger.hour !== null && trigger.hour !== undefined) {
      if (state.time.hour !== trigger.hour) return false
    }
    if (trigger.flags && trigger.flags.length > 0) {
      for (const flag of trigger.flags) {
        if (!state.flags[flag]) return false
      }
    }
    // Check already triggered
    const alreadyTriggered = state.world.completedEvents?.includes('dialogue_' + dialogueId)
    if (alreadyTriggered) return false
    return true
  }
}
