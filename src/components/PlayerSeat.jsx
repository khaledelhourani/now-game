import { useLang } from '../context/LanguageContext'

const ROLE_RING = {
  mafia:     '#E74C3C',
  citizen:   '#27AE60',
  detective: '#3498DB',
  doctor:    '#1ABC9C',
}

export default function PlayerSeat({ player, showRole = false, onVote, canVote = false, isNight = false, totalPlayers = 8 }) {
  const { t } = useLang()
  const isDead = player.status === 'dead'
  const ring = ROLE_RING[player.role] || ROLE_RING.citizen
  const clickable = canVote && !isDead && !player.isSelf

  // Dynamic sizing based on player count
  const isLarge = totalPlayers <= 8
  const isMedium = totalPlayers > 8 && totalPlayers <= 14
  // small = 15+

  const avatarSize = isLarge
    ? 'w-12 h-12 sm:w-14 sm:h-14'
    : isMedium
      ? 'w-10 h-10 sm:w-12 sm:h-12'
      : 'w-8 h-8 sm:w-10 sm:h-10'

  const textSize = isLarge
    ? 'text-lg sm:text-xl'
    : isMedium
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base'

  const nameSize = isLarge ? 'text-[10px]' : isMedium ? 'text-[9px]' : 'text-[8px]'
  const nameWidth = isLarge ? 'max-w-[58px]' : isMedium ? 'max-w-[50px]' : 'max-w-[42px]'

  const voteSize = isLarge
    ? 'w-5 h-5 text-[9px] -top-1.5 -end-1.5'
    : isMedium
      ? 'w-4 h-4 text-[8px] -top-1 -end-1'
      : 'w-3.5 h-3.5 text-[7px] -top-0.5 -end-0.5'

  const selfDotSize = isLarge ? 'w-3.5 h-3.5' : isMedium ? 'w-3 h-3' : 'w-2.5 h-2.5'

  return (
    <div className={`flex flex-col items-center gap-0.5 transition-all duration-500 ${isDead ? 'opacity-30 scale-90' : ''}`}>
      <div className="relative">
        {/* Vote count badge */}
        {player.votes > 0 && !isDead && (
          <div className={`absolute ${voteSize} rounded-full text-white font-black flex items-center justify-center z-10 animate-slide-down`}
            style={{ background: 'linear-gradient(135deg, #C0392B, #E74C3C)', boxShadow: '0 2px 8px rgba(231,76,60,0.5)' }}>
            {player.votes}
          </div>
        )}

        {/* Self indicator */}
        {player.isSelf && !isDead && (
          <div className={`absolute -bottom-0.5 -end-0.5 ${selfDotSize} rounded-full border-2 border-noir-black z-10`}
            style={{ background: 'linear-gradient(135deg, #C8960C, #E5B94E)', boxShadow: '0 0 6px rgba(229,185,78,0.5)' }} />
        )}

        {/* Avatar circle */}
        <div
          onClick={() => clickable && onVote?.(player.id)}
          title={clickable ? `${t('vote')}: ${player.name}` : player.name}
          className={`${avatarSize} rounded-full flex items-center justify-center ${textSize} border-2 transition-all duration-300`}
          style={{
            borderColor: isDead ? '#333340' : (showRole || player.isSelf) ? ring : isNight ? 'rgba(100,120,255,0.2)' : '#2A2A35',
            boxShadow: isDead
              ? 'none'
              : clickable
                ? `0 0 0 3px ${ring}15, 0 0 16px ${ring}20`
                : player.isSelf
                  ? `0 0 12px ${ring}30`
                  : isNight ? '0 0 8px rgba(100,120,255,0.05)' : 'none',
            background: isDead
              ? 'var(--noir-surface)'
              : isNight ? 'rgba(13,13,24,0.9)' : 'var(--noir-surface)',
            cursor: clickable ? 'pointer' : 'default',
          }}
          onMouseEnter={e => {
            if (clickable) {
              e.currentTarget.style.transform = 'scale(1.18)'
              e.currentTarget.style.borderColor = ring
              e.currentTarget.style.boxShadow = `0 0 0 4px ${ring}25, 0 0 20px ${ring}35`
            }
          }}
          onMouseLeave={e => {
            if (clickable) {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.borderColor = isNight ? 'rgba(100,120,255,0.2)' : '#2A2A35'
              e.currentTarget.style.boxShadow = `0 0 0 3px ${ring}15, 0 0 16px ${ring}20`
            }
          }}
        >
          {isDead
            ? <span className="text-red-500 font-bold" style={{ fontSize: isLarge ? '16px' : isMedium ? '13px' : '11px' }}>✕</span>
            : <span className="drop-shadow-sm">{player.avatar}</span>
          }
        </div>
      </div>

      {/* Name */}
      <span className={`${nameSize} font-semibold text-center ${nameWidth} truncate leading-tight
        ${isDead ? 'line-through text-cream-dim/40' : player.isSelf ? 'text-gold' : 'text-cream-muted'}`}>
        {player.name}
      </span>

      {/* Role tag */}
      {showRole && !isDead && (
        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold role-${player.role} animate-fade-in`}>
          {t(player.role)}
        </span>
      )}
    </div>
  )
}
