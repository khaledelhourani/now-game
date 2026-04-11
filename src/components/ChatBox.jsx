import { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { mockMessages } from '../data/mockData'

export default function ChatBox({ className = '' }) {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate other player typing
  useEffect(() => {
    const interval = setInterval(() => {
      setTyping(true)
      setTimeout(() => setTyping(false), 2000)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const send = e => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'You', text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      isOwn: true,
    }])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-noir-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(39,174,96,0.5)' }} />
          <span className="text-sm font-bold text-white">{t('chat')}</span>
        </div>
        <span className="text-[10px] text-cream-dim">{messages.length} {lang === 'ar' ? 'رسالة' : 'msgs'}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
        {messages.map((msg, i) => {
          const showSender = !msg.isOwn && (i === 0 || messages[i - 1]?.sender !== msg.sender)
          return (
            <div key={msg.id} className={`flex flex-col gap-0.5 animate-fade-in ${msg.isOwn ? 'items-end' : 'items-start'}`}>
              {showSender && (
                <span className="text-[11px] font-bold text-gold px-1 mb-0.5">{msg.sender}</span>
              )}
              <div className={`max-w-[85%] px-3.5 py-2 text-[13px] leading-relaxed
                ${msg.isOwn ? 'bubble-own' : 'bubble-other'}`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-cream-dim/40 px-1">{msg.time}</span>
            </div>
          )
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-1.5 px-1 animate-fade-in">
            <span className="text-[10px] text-cream-dim italic">
              {lang === 'ar' ? 'شخص يكتب' : 'Someone is typing'}
            </span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-cream-dim animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-cream-dim animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-cream-dim animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex gap-2 p-3 border-t border-noir-border shrink-0">
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder={t('sendMessage')}
          className="field flex-1 py-2 text-sm" style={{ borderRadius: '10px' }} />
        <button type="submit" disabled={!input.trim()}
          className="btn btn-gold w-9 h-9 p-0 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d={lang === 'ar' ? 'M12 19l-9 2 9-18 9 18-9-2zm0 0v-8' : 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'} />
          </svg>
        </button>
      </form>
    </div>
  )
}
