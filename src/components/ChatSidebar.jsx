import { useState, useMemo } from 'react'
import { useLang } from '../context/LanguageContext'

/**
 * ChatSidebar — left column listing chat previews (friends ordered by last msg).
 *
 * Props:
 *   conversations: [{ friend, lastMessage, time, unread }]
 *   activeId
 *   onSelect(id)
 */
export default function ChatSidebar({ conversations, activeId, onSelect }) {
  const { t } = useLang()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(c => c.friend.username.toLowerCase().includes(q))
  }, [conversations, search])

  return (
    <aside className="cs-sidebar">
      {/* Header */}
      <div className="cs-head">
        <div className="cs-head-title">
          <span>💬</span>
          <span>{t('chats')}</span>
        </div>
        <span className="cs-count">{conversations.length}</span>
      </div>

      {/* Search */}
      <div className="cs-search">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim opacity-50"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('searchChats')}
          className="field ps-9 py-2 text-sm"
        />
      </div>

      {/* List */}
      <div className="cs-list">
        {filtered.length === 0 ? (
          <div className="cs-empty">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-cream-muted text-sm">{t('noResults')}</p>
          </div>
        ) : (
          filtered.map(conv => {
            const f = conv.friend
            const active = activeId === f.id
            return (
              <button
                key={f.id}
                onClick={() => onSelect(f.id)}
                className={`cs-item ${active ? 'cs-item--active' : ''}`}
              >
                <div className="cs-avatar-wrap">
                  <div className="cs-avatar">{f.avatar}</div>
                  <span className={`fc-dot ${f.online ? 'fc-dot--on' : 'fc-dot--off'}`} />
                </div>
                <div className="cs-item-body">
                  <div className="cs-item-top">
                    <span className="cs-name">{f.username}</span>
                    <span className="cs-time">{conv.time}</span>
                  </div>
                  <div className="cs-item-bot">
                    <span className="cs-last">{conv.lastMessage}</span>
                    {conv.unread > 0 && <span className="cs-unread">{conv.unread}</span>}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
