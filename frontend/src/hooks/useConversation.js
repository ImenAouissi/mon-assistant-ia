import { useState, useCallback, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export function useConversation() {
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Nouvelle conversation', messages: [], createdAt: new Date() }
  ])
  const [activeId, setActiveId] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Refs pour accéder aux valeurs à jour dans les callbacks async
  const sessionsRef = useRef(sessions)
  const activeIdRef = useRef(activeId)

  const setSessSync = (updater) => {
    setSessions(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      sessionsRef.current = next
      return next
    })
  }

  const activeSession = sessions.find(s => s.id === activeId) || sessions[0]

  const newSession = useCallback(() => {
    const id = Date.now()
    setSessSync(prev => [
      ...prev,
      { id, title: 'Nouvelle conversation', messages: [], createdAt: new Date() }
    ])
    setActiveId(id)
    activeIdRef.current = id
    setError(null)
  }, [])

  const deleteSession = useCallback((id) => {
    setSessSync(prev => {
      const remaining = prev.filter(s => s.id !== id)
      if (remaining.length === 0) {
        const newId = Date.now()
        setActiveId(newId)
        activeIdRef.current = newId
        return [{ id: newId, title: 'Nouvelle conversation', messages: [], createdAt: new Date() }]
      }
      if (id === activeIdRef.current) {
        setActiveId(remaining[0].id)
        activeIdRef.current = remaining[0].id
      }
      return remaining
    })
  }, [])

  const updateTitle = useCallback((id, firstMessage) => {
    const title = firstMessage.length > 40
      ? firstMessage.slice(0, 38) + '…'
      : firstMessage
    setSessSync(prev => prev.map(s => s.id === id ? { ...s, title } : s))
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return
    setError(null)

    const currentActiveId = activeIdRef.current
    const currentSession = sessionsRef.current.find(s => s.id === currentActiveId)
    if (!currentSession) return

    // IDs uniques garantis
    const userMsgId = `u_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const userMsg = { role: 'user', content, id: userMsgId }

    // Snapshot propre pour l'API (seulement role + content)
    const messagesForApi = [
      ...currentSession.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content }
    ]

    // Ajouter le message user dans l'UI immédiatement
    setSessSync(prev => prev.map(s =>
      s.id === currentActiveId
        ? { ...s, messages: [...s.messages, userMsg] }
        : s
    ))

    // Titre depuis le premier message
    if (currentSession.messages.length === 0) {
      updateTitle(currentActiveId, content)
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForApi })
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || json.message || `Erreur HTTP ${response.status}`)
      }

      const aiMsg = {
        role: 'assistant',
        content: json.data.reply,
        id: `a_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        usage: json.data.usage,
        conversation_length: json.data.conversation_length
      }

      // Ajouter seulement la réponse AI (user déjà dans la liste)
      setSessSync(prev => prev.map(s =>
        s.id === currentActiveId
          ? { ...s, messages: [...s.messages, aiMsg] }
          : s
      ))

    } catch (err) {
      setError(err.message || 'Impossible de joindre le serveur. Vérifiez que le backend tourne sur le port 3000.')
      // Retirer le message user pour permettre de réessayer
      setSessSync(prev => prev.map(s =>
        s.id === currentActiveId
          ? { ...s, messages: s.messages.filter(m => m.id !== userMsgId) }
          : s
      ))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, updateTitle])

  const clearSession = useCallback(() => {
    setSessSync(prev => prev.map(s =>
      s.id === activeIdRef.current
        ? { ...s, messages: [], title: 'Nouvelle conversation' }
        : s
    ))
    setError(null)
  }, [])

  const handleSetActiveId = useCallback((id) => {
    setActiveId(id)
    activeIdRef.current = id
  }, [])

  return {
    sessions,
    activeSession,
    activeId,
    isLoading,
    error,
    setActiveId: handleSetActiveId,
    newSession,
    deleteSession,
    sendMessage,
    clearSession,
  }
}