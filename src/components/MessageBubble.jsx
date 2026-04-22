/**
 * MessageBubble — single chat message.
 *
 * Props:
 *   message: { text, time, isOwn }
 *   showSeen?: boolean    (show "Seen" under bubble)
 *   seenLabel?: string
 */
export default function MessageBubble({ message, showSeen, seenLabel = 'Seen' }) {
  const { text, time, isOwn } = message
  return (
    <div className={`mb-row ${isOwn ? 'mb-row--own' : 'mb-row--other'} animate-fade-in`}>
      <div className={`mb-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
        <div className="mb-text">{text}</div>
        <div className="mb-time">{time}</div>
      </div>
      {isOwn && showSeen && (
        <div className="mb-seen">✓✓ {seenLabel}</div>
      )}
    </div>
  )
}
