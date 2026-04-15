import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

const ROLE_RING = {
  mafia:     '#E74C3C',
  citizen:   '#27AE60',
  detective: '#3498DB',
  doctor:    '#1ABC9C',
}

const GREEN = '#27AE60'
const GREEN_FAINT = 'rgba(39, 174, 96, 0.22)'

export default function PlayerSeat({ player, showRole = false, onVote, canVote = false, isNight = false, totalPlayers = 8, selectionColor = null }) {
  const { t } = useLang()
  const [hovered, setHovered] = useState(false)
  const isDead = player.status === 'dead'
  const clickable = canVote && !isDead && !player.isSelf
  const isSelected = !!selectionColor
  const active = !isDead && (isSelected || (clickable && hovered))
  const roleColor = (showRole || player.isSelf) ? (ROLE_RING[player.role] || ROLE_RING.citizen) : null

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
    <div className={`flex flex-col items-center gap-0.5 transition-all duration-300 ease-out ${isDead ? 'opacity-30 scale-90' : active ? 'scale-110' : ''}`}>
      <div
        className="relative"
        onMouseEnter={() => clickable && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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

        {/* Avatar circle — green border sits flush on the avatar edge (box-sizing: border-box) */}
        <div
          onClick={() => clickable && onVote?.(player.id)}
          title={clickable ? `${t('vote')}: ${player.name}` : player.name}
          className={`${avatarSize} rounded-full flex items-center justify-center ${textSize} transition-all duration-300 ease-out`}
          style={{
            boxSizing: 'border-box',
            border: `2px solid ${isDead ? '#333340' : active ? GREEN : roleColor || GREEN_FAINT}`,
            boxShadow: isDead
              ? 'none'
              : active
                ? `0 0 14px ${GREEN}99, 0 0 4px ${GREEN}66, inset 0 0 8px ${GREEN}33`
                : roleColor
                  ? `0 0 12px ${roleColor}55, inset 0 0 6px ${roleColor}22`
                  : 'none',
            background: isDead
              ? 'var(--noir-surface)'
              : isNight ? 'rgba(13,13,24,0.9)' : 'var(--noir-surface)',
            cursor: clickable ? 'pointer' : 'default',
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
