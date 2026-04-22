import { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import MessageBubble from './MessageBubble'

/**
 * ChatWindow — right panel. Renders conversation with a given friend.
 *
 * Props:
 *   friend: Friend | null
 *   messages: Message[]
 *   onSend(text)
 *   onBack?: () => void   (mobile back button to sidebar)
 */
export default function ChatWindow({ friend, messages = [], onSend, onBack }) {
  const { t, lang } = useLang()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  /* Auto-scroll to bottom whenever messages change */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  /* Simulated typing indicator */
  useEffect(() => {
    if (!friend) return
    setTyping(false)
    const id = setInterval(() => {
      setTyping(true)
      setTimeout(() => setTyping(false), 2200)
    }, 12000)
    return () => clearInterval(id)
  }, [friend?.id])

  /* Empty state */
  if (!friend) {
    return (
      <section className="cw-pane cw-empty">
        <div className="cw-empty-box">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="font-bold text-white text-lg mb-1">{t('noConversation')}</h3>
          <p className="text-cream-muted text-sm">{t('noConversationHint')}</p>
        </div>
      </section>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    onSend?.(text)
    setInput('')
    inputRef.current?.focus()
  }

  /* Show "Seen" under the last own message (UI only) */
  const lastOwnIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i].isOwn) return i
    return -1
  })()

  return (
    <section className="cw-pane">
      {/* Header */}
      <header className="cw-head">
        {onBack && (
          <button onClick={onBack} className="cw-back" aria-label={t('backToList')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={lang === 'ar' ? 'M9 6l6 6-6 6' : 'M15 18l-6-6 6-6'} />
            </svg>
          </button>
        )}
        <div className="cw-head-avatar-wrap">
          <div className="cw-head-avatar">{friend.avatar}</div>
          <span className={`fc-dot ${friend.online ? 'fc-dot--on' : 'fc-dot--off'}`} />
        </div>
        <div className="cw-head-info">
          <div className="cw-head-name">{friend.username}</div>
          <div className="cw-head-status">
            {friend.online
              ? <span className="fc-online">● {t('online')}</span>
              : <span className="fc-offline">{t('lastSeen')}: {friend.lastSeen}</span>}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="cw-scroll">
        <div className="cw-messages">
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              showSeen={i === lastOwnIdx}
              seenLabel={t('seen')}
            />
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="cw-typing animate-fade-in">
              <div className="cw-typing-bubble">
                <span className="cw-typing-dot" />
                <span className="cw-typing-dot" />
                <span className="cw-typing-dot" />
              </div>
              <span className="cw-typing-label">{friend.username} {t('typing')}…</span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="cw-input">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('typeMessage')}
          className="field py-2.5 text-sm"
          style={{ borderRadius: '999px', paddingInline: '16px' }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn btn-gold cw-send"
          aria-label={t('send') || 'Send'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={lang === 'ar' ? 'M12 19l-9 2 9-18 9 18-9-2zm0 0v-8' : 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'} />
          </svg>
        </button>
      </form>
    </section>
  )
}
