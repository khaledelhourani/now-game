import { useState, useMemo } from 'react'
import { useLang } from '../context/LanguageContext'
import {
  mockFriends,
  mockFriendRequests,
  mockDiscoverPlayers,
} from '../data/mockData'
import FriendsList from '../components/FriendsList'
import FriendRequests from '../components/FriendRequests'
import AddFriendButton from '../components/AddFriendButton'

export default function Friends({ setPage, onOpenChat }) {
  const { t } = useLang()

  const [tab, setTab] = useState('friends')
  const [friends, setFriends] = useState(mockFriends)
  const [requests, setRequests] = useState(mockFriendRequests)
  const [discover, setDiscover] = useState(mockDiscoverPlayers)
  const [search, setSearch] = useState('')

  /* ─── Handlers ─── */
  const handleAccept = (req) => {
    setRequests(prev => prev.filter(r => r.id !== req.id))
    setFriends(prev => [{
      id: req.id, username: req.username, avatar: req.avatar,
      online: true, level: req.level, rank: 'Rookie', lastSeen: 'now',
    }, ...prev])
  }
  const handleReject = (req) => {
    setRequests(prev => prev.filter(r => r.id !== req.id))
  }
  const handleRemove = (friend) => {
    if (confirm(t('confirmRemove'))) {
      setFriends(prev => prev.filter(f => f.id !== friend.id))
    }
  }
  const handleMessage = (friend) => {
    onOpenChat?.(friend.id)
    setPage('chat')
  }

  const updateDiscover = (id, relation) => {
    setDiscover(prev => prev.map(p => p.id === id ? { ...p, relation } : p))
  }

  const filteredDiscover = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return discover
    return discover.filter(p => p.username.toLowerCase().includes(q))
  }, [discover, search])

  const tabs = [
    { key: 'friends',  label: t('myFriends'), icon: '👥', count: friends.length },
    { key: 'requests', label: t('requests'),  icon: '📨', count: requests.length },
    { key: 'discover', label: t('discover'),  icon: '🔎', count: null },
  ]

  return (
    <div className="min-h-screen bg-noir-black pt-[63px]">
      {/* Header */}
      <div className="border-b border-noir-border bg-noir-deep">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">👥</span>
            <h1 className="font-bold text-xl text-white">{t('friends')}</h1>
          </div>
          <p className="text-sm text-cream-dim">
            {friends.length} {t('friends').toLowerCase()}
            {requests.length > 0 && <> · <span className="text-gold">{requests.length} {t('requests').toLowerCase()}</span></>}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="sticky-tabs border-b border-noir-border sticky top-14 z-20"
        style={{ background: 'rgba(12,12,14,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tt => (
            <button
              key={tt.key}
              onClick={() => setTab(tt.key)}
              className={`px-5 py-3.5 text-sm font-medium transition-all relative whitespace-nowrap flex items-center gap-2
                ${tab === tt.key ? 'text-white' : 'text-cream-muted hover:text-white'}`}
            >
              <span>{tt.icon}</span>
              <span>{tt.label}</span>
              {tt.count != null && tt.count > 0 && (
                <span className="fr-tab-badge">{tt.count}</span>
              )}
              {tab === tt.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {tab === 'friends' && (
          <FriendsList
            friends={friends}
            onMessage={handleMessage}
            onRemove={handleRemove}
          />
        )}

        {tab === 'requests' && (
          <FriendRequests
            requests={requests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}

        {tab === 'discover' && (
          <div className="space-y-4">
            <div className="relative w-full sm:max-w-xs">
              <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim opacity-50"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlayers')}
                className="field ps-9 py-2.5 text-sm"
              />
            </div>

            {filteredDiscover.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-cream-muted text-sm">{t('noResults')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
                {filteredDiscover.map(p => (
                  <div key={p.id} className="fc-card card card-hover">
                    <div className="fc-avatar-wrap">
                      <div className="fc-avatar">{p.avatar}</div>
                    </div>
                    <div className="fc-info">
                      <div className="fc-name">{p.username}</div>
                      <div className="fc-meta">
                        <span className="fc-rank">⭐ {p.rank}</span>
                        <span className="fc-sep">·</span>
                        <span className="fc-lvl">Lv.{p.level}</span>
                      </div>
                    </div>
                    <div className="fc-actions">
                      <AddFriendButton
                        size="sm"
                        status={p.relation}
                        onAdd={() => updateDiscover(p.id, 'sent')}
                        onCancel={() => updateDiscover(p.id, 'none')}
                        onRemove={() => updateDiscover(p.id, 'none')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
