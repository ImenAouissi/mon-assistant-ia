import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import { useConversation } from './hooks/useConversation'

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const {
    sessions,
    activeSession,
    activeId,
    isLoading,
    error,
    setActiveId,
    newSession,
    deleteSession,
    sendMessage,
    clearSession,
  } = useConversation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newSession}
        onDelete={deleteSession}
      />
      <ChatWindow
        session={activeSession}
        isLoading={isLoading}
        error={error}
        onSend={sendMessage}
        onClear={clearSession}
        onThemeToggle={() => setIsDark(d => !d)}
        isDark={isDark}
      />
    </div>
  )
}
