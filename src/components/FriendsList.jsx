import { useState, useMemo } from 'react'
import { useLang } from '../context/LanguageContext'
import FriendCard from './FriendCard'

/**
 * FriendsList — grid of friends with a search bar.
 *
 * Props:
 *   friends: Friend[]
 *   onMessage(friend)
 *   onRemove(friend)
 */
export default function FriendsList({ friends, onMessage, onRemove }) {
  const { t } = useLang()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return friends
    return friends.filter(f => f.username.toLowerCase().includes(q))
  }, [friends, search])

  const onlineCount = friends.filter(f => f.online).length

  return (
    <div className="space-y-4">
      {/* Summary + Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-cream-muted">
            <span className="text-white font-semibold">{friends.length}</span> {t('friends').toLowerCase()}
          </span>
          <span className="fc-online">● {onlineCount} {t('online').toLowerCase()}</span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchFriends')}
            className="field ps-9 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-cream-muted text-sm">
            {friends.length === 0 ? t('noFriends') : t('noResults')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
          {filtered.map(f => (
            <FriendCard
              key={f.id}
              friend={f}
              onMessage={onMessage ? () => onMessage(f) : undefined}
              onRemove={onRemove ? () => onRemove(f) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim opacity-50"
      fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
