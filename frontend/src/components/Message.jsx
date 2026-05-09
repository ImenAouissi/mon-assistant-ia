import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatTime(date) {
  return new Date(date || Date.now()).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const styles = {
  row: (role) => ({
    display: 'flex',
    gap: 12,
    flexDirection: role === 'user' ? 'row-reverse' : 'row',
    animation: 'fadeUp 0.28s ease forwards',
    opacity: 0,
    padding: '0 4px',
  }),
  avatar: (role) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    background: role === 'user'
      ? 'var(--accent)'
      : 'var(--bg-tag)',
    border: role === 'assistant' ? '0.5px solid var(--border-strong)' : 'none',
    color: role === 'user' ? '#fff' : 'var(--text-secondary)',
    boxShadow: role === 'user' ? '0 2px 6px rgba(44,107,228,0.25)' : 'none',
  }),
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: '72%',
  },
  bubble: (role) => ({
    padding: '12px 16px',
    borderRadius: role === 'user'
      ? 'var(--radius-lg) var(--radius-lg) 6px var(--radius-lg)'
      : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 6px',
    background: role === 'user' ? 'var(--bg-bubble-user)' : 'var(--bg-bubble-ai)',
    color: role === 'user' ? 'var(--text-user-bubble)' : 'var(--text-ai-bubble)',
    fontSize: 14,
    lineHeight: 1.7,
    boxShadow: 'var(--shadow-sm)',
    border: role === 'user'
      ? '0.5px solid rgba(44,107,228,0.2)'
      : '0.5px solid var(--border)',
    whiteSpace: role === 'user' ? 'pre-wrap' : undefined,
    wordBreak: 'break-word',
  }),
  meta: (role) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  metaText: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
  },
  usageBadge: {
    fontSize: 9,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    background: 'var(--bg-tag)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    padding: '2px 7px',
  },
  cursor: {
    display: 'inline-block',
    width: 2,
    height: 14,
    background: 'var(--accent)',
    borderRadius: 1,
    marginLeft: 2,
    verticalAlign: 'middle',
    animation: 'blink 0.9s step-end infinite',
  }
}

export default function Message({ message }) {
  const { role, content, id, usage, conversation_length } = message
  const isUser = role === 'user'

  return (
    <div style={styles.row(role)} key={id}>
      <div style={styles.avatar(role)}>
        {isUser ? 'V' : 'AI'}
      </div>
      <div style={styles.col}>
        <div style={styles.bubble(role)}>
          {isUser ? (
            content
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div style={styles.meta(role)}>
          <span style={styles.metaText}>{formatTime()}</span>
          {!isUser && usage && (
            <span style={styles.usageBadge}>
              {usage.total_tokens} tokens
            </span>
          )}
          {!isUser && conversation_length && (
            <span style={styles.usageBadge}>
              {conversation_length} msgs
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div style={styles.row('assistant')}>
      <div style={styles.avatar('assistant')}>AI</div>
      <div style={styles.col}>
        <div style={{ ...styles.bubble('assistant'), padding: '14px 18px' }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                  display: 'inline-block',
                  animation: `dotBounce 1.1s ease infinite`,
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
