import { useLang } from '../context/LanguageContext'

/**
 * FriendCard — used in Friends list (and anywhere a compact friend row is needed).
 *
 * Props:
 *   friend: { id, username, avatar, online, level, rank, lastSeen }
 *   onMessage?: () => void
 *   onRemove?:  () => void
 *   variant?: 'grid' | 'row'  (default 'grid')
 */
export default function FriendCard({ friend, onMessage, onRemove, variant = 'grid' }) {
  const { t } = useLang()

  return (
    <div className={`fc-card ${variant === 'row' ? 'fc-card--row' : ''} card card-hover`}>
      <div className="fc-avatar-wrap">
        <div className="fc-avatar">{friend.avatar}</div>
        <span className={`fc-dot ${friend.online ? 'fc-dot--on' : 'fc-dot--off'}`} title={friend.online ? t('online') : t('offline')} />
      </div>

      <div className="fc-info">
        <div className="fc-name">{friend.username}</div>
        <div className="fc-meta">
          <span className="fc-rank">⭐ {friend.rank}</span>
          <span className="fc-sep">·</span>
          <span className="fc-lvl">Lv.{friend.level}</span>
        </div>
        <div className="fc-status">
          {friend.online
            ? <span className="fc-online">● {t('online')}</span>
            : <span className="fc-offline">{t('lastSeen')}: {friend.lastSeen}</span>}
        </div>
      </div>

      <div className="fc-actions">
        {onMessage && (
          <button onClick={onMessage} className="fc-btn fc-btn--ghost" title={t('message')}>
            <ChatIcon />
            <span className="fc-btn-label">{t('message')}</span>
          </button>
        )}
        {onRemove && (
          <button onClick={onRemove} className="fc-btn fc-btn--danger" title={t('removeFriend')}>
            <TrashIcon />
            <span className="fc-btn-label">{t('remove')}</span>
          </button>
        )}
      </div>
    </div>
  )
}

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
