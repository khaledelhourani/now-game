import { useLang } from '../context/LanguageContext'

/**
 * AddFriendButton — 3 visual states controlled by `status`
 *   'none'    → Add Friend   (gold filled)
 *   'sent'    → Request Sent (ghost, disabled-look)
 *   'friends' → Friends      (soft green pill)
 *
 * Props:
 *   status, onAdd, onCancel, onRemove, size='md', className
 */
export default function AddFriendButton({
  status = 'none',
  onAdd,
  onCancel,
  onRemove,
  size = 'md',
  className = '',
}) {
  const { t } = useLang()

  const pad = size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-5 py-2 text-sm'

  if (status === 'friends') {
    return (
      <button
        onClick={onRemove}
        className={`af-btn af-btn--friends ${pad} ${className}`}
        title={t('unfriend')}
      >
        <CheckIcon size={size === 'sm' ? 13 : 15} />
        <span>{t('alreadyFriends')}</span>
      </button>
    )
  }

  if (status === 'sent') {
    return (
      <button
        onClick={onCancel}
        className={`af-btn af-btn--sent ${pad} ${className}`}
      >
        <ClockIcon size={size === 'sm' ? 13 : 15} />
        <span>{t('requestSent')}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onAdd}
      className={`af-btn af-btn--add ${pad} ${className}`}
    >
      <PlusIcon size={size === 'sm' ? 14 : 16} />
      <span>{t('addFriend')}</span>
    </button>
  )
}

function PlusIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function CheckIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function ClockIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}
