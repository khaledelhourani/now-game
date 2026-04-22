import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { mockRooms } from '../data/mockData'
import CreateRoomModal from '../components/CreateRoomModal'
import Modal from '../components/Modal'

function StatusBadge({ status, t }) {
  const cfg = {
    waiting: { label: t('waiting'), color: '#27AE60', bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.35)' },
    playing: { label: t('playing'), color: '#E5B94E', bg: 'rgba(229,185,78,0.12)', border: 'rgba(229,185,78,0.35)' },
    full:    { label: t('full'),    color: '#E74C3C', bg: 'rgba(231,76,60,0.12)',  border: 'rgba(231,76,60,0.35)'  },
  }
  const c = cfg[status] || cfg.waiting
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  )
}

function RoomCard({ room, onJoin, t }) {
  const pct = (room.players / room.maxPlayers) * 100
  const barColor = pct >= 90 ? '#E74C3C' : pct >= 70 ? '#E5B94E' : '#27AE60'
  const isFull = room.players >= room.maxPlayers
  const isPlaying = room.status === 'playing'

  return (
    <div className="card card-hover p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.35)' }}>
      {/* Private icon */}
      {room.isPrivate && <span className="absolute top-3 end-3 text-sm" title="Private">🔒</span>}

      <div>
        <h3 className="font-semibold text-white text-base pe-5 mb-0.5">{room.name}</h3>
        <p className="text-xs text-cream-dim">{t('host')}: {room.host}</p>
      </div>

      {/* Player bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-cream-dim">{t('players')}</span>
          <span className="font-semibold" style={{ color: barColor }}>{room.players}/{room.maxPlayers}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--noir-border)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={room.status} t={t} />
          <span className="text-[10px] text-cream-dim/50 font-medium uppercase tracking-wide">{room.mode}</span>
        </div>
        {isPlaying
          ? <button onClick={() => onJoin(room)} className="btn btn-ghost px-3 py-1.5 text-xs">{t('watch')}</button>
          : <button onClick={() => onJoin(room)} disabled={isFull}
              className="btn btn-gold px-4 py-1.5 text-xs font-bold disabled:opacity-40">
              {t('join')}
            </button>
        }
      </div>

      <p className="text-[10px] text-cream-dim/40">{room.createdAt}</p>
    </div>
  )
}

export default function Lobby({ setPage }) {
  const { t, lang } = useLang()
  const [rooms, setRooms] = useState(mockRooms)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [joinModal, setJoinModal] = useState({ open: false, room: null })
  const [joinPw, setJoinPw] = useState('')

  const filtered = rooms.filter(r => {
    const matchF = filter === 'all' || r.status === filter
    const matchS = r.name.toLowerCase().includes(search.toLowerCase()) ||
                   r.host.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const handleCreate = data => {
    setRooms(prev => [{
      id: Date.now(), name: data.name, host: lang === 'ar' ? 'أنت' : 'You',
      players: 1, maxPlayers: data.maxPlayers,
      status: 'waiting', isPrivate: data.isPrivate,
      language: lang, mode: data.mode === 'classic' ? 'Classic' : 'Advanced',
      createdAt: lang === 'ar' ? 'الآن' : 'just now',
    }, ...prev])
    setTimeout(() => setPage('game'), 200)
  }

  const handleJoin = room => {
    if (room.isPrivate) setJoinModal({ open: true, room })
    else setPage('game')
  }

  const filters = [
    { key: 'all',     label: t('all')     },
    { key: 'waiting', label: t('waiting') },
    { key: 'playing', label: t('playing') },
  ]

  return (
    <div className="min-h-screen bg-noir-black">
      {/* Header */}
      <div className="border-b border-noir-border bg-noir-deep pt-[63px]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="font-bold text-xl text-white">{t('availableRooms')}</h1>
              <p className="text-sm text-cream-dim mt-0.5">
                {filtered.length} {lang === 'ar' ? 'غرفة' : 'rooms'}
              </p>
            </div>
            <button onClick={() => setCreateOpen(true)} className="btn btn-gold px-5 py-2.5 text-sm font-bold self-start sm:self-auto">
              + {t('createRoom')}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim opacity-50"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('searchRooms')}
                className="field ps-9 py-2.5 text-sm" />
            </div>

            {/* Filters */}
            <div className="flex gap-1 p-1 rounded-xl w-full sm:w-auto" style={{ background: 'var(--noir-surface)' }}>
              {filters.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${filter === f.key ? 'bg-noir-card text-white shadow-sm' : 'text-cream-muted hover:text-white'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎭</div>
            <p className="text-cream-muted text-base mb-5">{t('noRooms')}</p>
            <button onClick={() => setCreateOpen(true)} className="btn btn-gold px-7 py-2.5 font-bold">
              {t('createRoom')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} onJoin={handleJoin} t={t} />
            ))}
          </div>
        )}
      </div>

      <CreateRoomModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />

      {/* Private room join modal */}
      <Modal isOpen={joinModal.open} onClose={() => { setJoinModal({ open: false, room: null }); setJoinPw('') }}
        title={t('enterPassword')} maxWidth="max-w-sm">
        <div className="space-y-4">
          <p className="text-sm text-cream-muted">{joinModal.room?.name}</p>
          <input type="password" className="field" placeholder="••••••••"
            value={joinPw} onChange={e => setJoinPw(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={() => { setJoinModal({ open: false, room: null }); setJoinPw('') }}
              className="btn btn-ghost flex-1 py-2.5 text-sm">{t('cancel')}</button>
            <button onClick={() => { setJoinModal({ open: false, room: null }); setJoinPw(''); setPage('game') }}
              className="btn btn-gold flex-1 py-2.5 text-sm font-bold">{t('confirmJoin')}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
