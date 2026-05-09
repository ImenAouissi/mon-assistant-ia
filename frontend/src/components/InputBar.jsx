import { useState, useRef, useEffect } from 'react'

const styles = {
  wrapper: {
    padding: '12px 20px 16px',
    borderTop: '0.5px solid var(--border)',
    background: 'var(--bg-input)',
    flexShrink: 0,
    transition: 'background 0.3s',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    background: 'var(--bg-app)',
    border: '0.5px solid var(--border-strong)',
    borderRadius: 'var(--radius-lg)',
    padding: '10px 12px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font)',
    fontSize: 14,
    resize: 'none',
    lineHeight: 1.65,
    minHeight: 22,
    maxHeight: 140,
    overflowY: 'auto',
  },
  sendBtn: (enabled) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    border: 'none',
    background: enabled ? 'var(--accent)' : 'var(--bg-tag)',
    color: enabled ? '#fff' : 'var(--text-muted)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 0,
    transition: 'background 0.2s, transform 0.1s',
    fontFamily: 'var(--font)',
    boxShadow: enabled ? '0 2px 6px rgba(44,107,228,0.25)' : 'none',
  }),
  hint: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--mono)',
    marginTop: 8,
    textAlign: 'center',
  }
}

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const canSend = value.trim().length > 0 && !disabled

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!canSend) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  const rowStyle = {
    ...styles.row,
    borderColor: focused ? 'var(--accent)' : 'var(--border-strong)',
    boxShadow: focused ? '0 0 0 3px var(--accent-light)' : 'none',
  }

  return (
    <div style={styles.wrapper}>
      <div style={rowStyle}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Écrivez votre message…"
          disabled={disabled}
          style={{
            ...styles.textarea,
            color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
          }}
        />
        <button
          style={styles.sendBtn(canSend)}
          onClick={handleSend}
          disabled={!canSend}
          title="Envoyer (Entrée)"
          onMouseEnter={e => { if (canSend) e.currentTarget.style.transform = 'scale(1.06)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseDown={e => { if (canSend) e.currentTarget.style.transform = 'scale(0.95)' }}
        >
          ↑
        </button>
      </div>
      <div style={styles.hint}>
        Entrée pour envoyer · Shift+Entrée pour une nouvelle ligne
      </div>
    </div>
  )
}
