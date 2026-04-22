import { useLang } from '../context/LanguageContext'

/**
 * FriendRequests — list of incoming requests with Accept/Reject.
 *
 * Props:
 *   requests: Request[]
 *   onAccept(request)
 *   onReject(request)
 */
export default function FriendRequests({ requests, onAccept, onReject }) {
  const { t } = useLang()

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-cream-muted text-sm">{t('noRequests')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5 stagger">
      {requests.map(r => (
        <div key={r.id} className="fr-card card">
          <div className="fr-avatar">{r.avatar}</div>

          <div className="fr-info">
            <div className="fr-name">{r.username}</div>
            <div className="fr-meta">
              <span>Lv.{r.level}</span>
              <span className="fc-sep">·</span>
              <span>{r.mutuals} {t('mutualFriends')}</span>
              <span className="fc-sep">·</span>
              <span className="text-cream-dim">{r.sentAt}</span>
            </div>
          </div>

          <div className="fr-actions">
            <button
              onClick={() => onAccept?.(r)}
              className="fr-btn fr-btn--accept"
            >
              <CheckIcon /> <span>{t('accept')}</span>
            </button>
            <button
              onClick={() => onReject?.(r)}
              className="fr-btn fr-btn--reject"
            >
              <XIcon /> <span>{t('reject')}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
