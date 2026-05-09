import { useState } from 'react'

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    minWidth: 'var(--sidebar-w)',
    background: 'var(--bg-sidebar)',
    borderRight: '0.5px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'background 0.3s',
  },
  header: {
    padding: '18px 16px 14px',
    borderBottom: '0.5px solid var(--border)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(44,107,228,0.3)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    marginTop: 1,
  },
  newBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 12px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'var(--font)',
    cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
  },
  sessions: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: 'var(--mono)',
    padding: '8px 8px 4px',
  },
  sessionItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: active ? 'var(--accent-light)' : 'transparent',
    border: active ? '0.5px solid var(--accent)' : '0.5px solid transparent',
    marginBottom: 2,
    transition: 'background 0.15s, border-color 0.15s',
    position: 'relative',
    overflow: 'hidden',
  }),
  sessionIcon: (active) => ({
    fontSize: 14,
    flexShrink: 0,
    color: active ? 'var(--accent)' : 'var(--text-muted)',
  }),
  sessionTitle: (active) => ({
    fontSize: 13,
    color: active ? 'var(--accent-text)' : 'var(--text-primary)',
    fontWeight: active ? 600 : 400,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  deleteBtn: {
    opacity: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: 13,
    padding: '2px 4px',
    borderRadius: 4,
    flexShrink: 0,
    fontFamily: 'var(--font)',
    transition: 'opacity 0.15s, color 0.15s',
  },
  footer: {
    padding: '12px 16px',
    borderTop: '0.5px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  footerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 8px',
    background: 'var(--bg-tag)',
    borderRadius: 'var(--radius-full)',
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    width: 'fit-content',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#16a34a',
  },
}

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>G</div>
          <div style={styles.brandText}>
            <span style={styles.brandName}>Assistant IA</span>
            <span style={styles.brandSub}>Groq · llama-3.3-70b</span>
          </div>
        </div>

        <button
          style={styles.newBtn}
          onClick={onNew}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span>＋</span>
          Nouvelle conversation
        </button>
      </div>

      <div style={styles.sessions}>
        <div style={styles.sectionLabel}>Conversations</div>
        {sessions.map(session => (
          <div
            key={session.id}
            style={styles.sessionItem(session.id === activeId)}
            onClick={() => onSelect(session.id)}
            onMouseEnter={e => {
              setHoveredId(session.id)
              if (session.id !== activeId) {
                e.currentTarget.style.background = 'var(--bg-hover)'
              }
              e.currentTarget.querySelector('.del-btn').style.opacity = '1'
            }}
            onMouseLeave={e => {
              setHoveredId(null)
              if (session.id !== activeId) {
                e.currentTarget.style.background = 'transparent'
              }
              e.currentTarget.querySelector('.del-btn').style.opacity = '0'
            }}
          >
            <span style={styles.sessionIcon(session.id === activeId)}>
              {session.id === activeId ? '◈' : '◇'}
            </span>
            <span style={styles.sessionTitle(session.id === activeId)}>
              {session.title}
            </span>
            <button
              className="del-btn"
              style={styles.deleteBtn}
              onClick={e => { e.stopPropagation(); onDelete(session.id) }}
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerTag}>
          <span style={styles.liveDot} />
          backend actif
        </div>
        <div style={{ ...styles.footerTag, color: 'var(--text-muted)' }}>
          localhost:3000
        </div>
      </div>
    </aside>
  )
}
