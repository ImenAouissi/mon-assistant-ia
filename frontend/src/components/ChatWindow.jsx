import { useEffect, useRef } from 'react'
import Message, { TypingIndicator } from './Message'
import InputBar from './InputBar'

const SUGGESTIONS = [
  { icon: '🧠', text: 'Explique le machine learning en termes simples' },
  { icon: '🐍', text: 'Écris un tri rapide en Python avec commentaires' },
  { icon: '🌐', text: 'Quelles sont les meilleures pratiques REST API ?' },
  { icon: '📝', text: 'Rédige un email professionnel pour une réunion' },
]

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--bg-chat)',
    transition: 'background 0.3s',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: 'var(--header-h)',
    borderBottom: '0.5px solid var(--border)',
    background: 'var(--bg-sidebar)',
    flexShrink: 0,
    transition: 'background 0.3s',
  },
  topTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 320,
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '0.5px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: 'var(--font)',
    transition: 'background 0.15s, color 0.15s',
  },
  msgCount: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    background: 'var(--bg-tag)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    padding: '3px 9px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '40px 20px',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 4,
    filter: 'grayscale(0.3)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 1.6,
  },
  suggestions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginTop: 16,
    width: '100%',
    maxWidth: 500,
  },
  suggCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '10px 12px',
    background: 'var(--bg-sidebar)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'var(--font)',
    transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
  },
  suggIcon: {
    fontSize: 16,
    flexShrink: 0,
    marginTop: 1,
  },
  suggText: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  errorBanner: {
    margin: '0 20px',
    padding: '10px 14px',
    background: 'rgba(220, 38, 38, 0.06)',
    border: '0.5px solid rgba(220, 38, 38, 0.25)',
    borderRadius: 'var(--radius-md)',
    fontSize: 13,
    color: 'var(--danger)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'fadeIn 0.2s ease',
    flexShrink: 0,
  },
}

export default function ChatWindow({ session, isLoading, error, onSend, onClear, onThemeToggle, isDark }) {
  const bottomRef = useRef(null)
  const messages = session?.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSuggestion = (text) => {
    onSend(text)
  }

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={styles.topTitle}>{session?.title || 'Conversation'}</span>
        <div style={styles.topActions}>
          {messages.length > 0 && (
            <span style={styles.msgCount}>{messages.length} message{messages.length > 1 ? 's' : ''}</span>
          )}
          {messages.length > 0 && (
            <button
              style={styles.iconBtn}
              title="Effacer la conversation"
              onClick={onClear}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--danger)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              🗑
            </button>
          )}
          <button
            style={styles.iconBtn}
            title={isDark ? 'Thème clair' : 'Thème sombre'}
            onClick={onThemeToggle}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Messages or Empty state */}
      {messages.length === 0 && !isLoading ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>✦</div>
          <h2 style={styles.emptyTitle}>Bonjour !</h2>
          <p style={styles.emptySubtitle}>
            Posez une question, lancez une discussion ou essayez l'une des suggestions ci-dessous.
          </p>
          <div style={styles.suggestions}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                style={styles.suggCard}
                onClick={() => handleSuggestion(s.text)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.background = 'var(--accent-light)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-sidebar)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={styles.suggIcon}>{s.icon}</span>
                <span style={styles.suggText}>{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.messages}>
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Input */}
      <InputBar onSend={onSend} disabled={isLoading} />
    </div>
  )
}
