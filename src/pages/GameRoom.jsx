import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { mockPlayers } from '../data/mockData'
import ChatBox from '../components/ChatBox'
import PlayerSeat from '../components/PlayerSeat'
import MafiaGame, { PHASES, ROLES, PHASE_TIMERS } from '../engine/MafiaGame'

/* ── player pool (first 12 for balanced game) ── */
const PLAYER_POOL = mockPlayers.slice(0, 12)
const SELF_ID = PLAYER_POOL.find(p => p.isSelf)?.id ?? 1

function getPos(i, total, r = 43) {
  const a = (i / total) * 2 * Math.PI - Math.PI / 2
  return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) }
}

/* ════════════════════════════════════════
   ROLE REVEAL MODAL
════════════════════════════════════════ */
function RoleRevealModal({ role, timeLeft, onHide, lang }) {
  const icons = { mafia: '🔫', citizen: '👤', detective: '👮', doctor: '💊' }
  const colors = { mafia: '#E74C3C', citizen: '#27AE60', detective: '#3498DB', doctor: '#1ABC9C' }
  const names = {
    mafia:     lang === 'ar' ? 'مافيا' : 'Mafia',
    detective: lang === 'ar' ? 'محقق' : 'Detective',
    doctor:    lang === 'ar' ? 'طبيب' : 'Doctor',
    citizen:   lang === 'ar' ? 'مواطن' : 'Civilian',
  }
  const descs = {
    mafia:     lang === 'ar' ? 'اقضِ على المدنيين ليلاً وتظاهر بالبراءة نهاراً' : 'Eliminate townspeople at night and blend in during the day',
    detective: lang === 'ar' ? 'حقق في هوية لاعب واحد كل ليلة' : 'Investigate one player each night to learn their identity',
    doctor:    lang === 'ar' ? 'احمِ لاعباً واحداً من القتل كل ليلة' : 'Protect one player from elimination each night',
    citizen:   lang === 'ar' ? 'ناقش وصوّت لكشف المافيا وإقصائهم' : 'Discuss and vote to identify and eliminate the Mafia',
  }

  const color = colors[role] || colors.citizen
  const pct = (timeLeft / 30) * 100

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center modal-bg"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="flex flex-col items-center gap-6 animate-slide-up">
        {/* Timer ring + card */}
        <div className="relative">
          <svg className="w-52 h-52 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={`${pct * 2.89} 289`}
              style={{ transition: 'stroke-dasharray 1s linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-6xl drop-shadow-lg" style={{ filter: `drop-shadow(0 0 16px ${color}60)` }}>
              {icons[role]}
            </div>
            <div className="text-xl font-black" style={{ color }}>{names[role]}</div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold role-${role}`}>
              {names[role]}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-cream-muted text-center max-w-xs leading-relaxed">{descs[role]}</p>

        {/* Timer text */}
        <p className="text-xs text-cream-dim">
          {lang === 'ar' ? `إخفاء تلقائي خلال ${timeLeft} ثانية` : `Auto-hide in ${timeLeft}s`}
        </p>

        {/* Hide button */}
        <button onClick={onHide} className="btn btn-gold px-8 py-3 text-sm font-bold">
          {lang === 'ar' ? 'أخفِ البطاقة' : 'Hide Card'}
        </button>

        <p className="text-[10px] text-cream-dim/50 italic">
          {lang === 'ar' ? 'لن تتمكن من رؤية البطاقة مرة أخرى' : 'You will not be able to view this card again'}
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   NIGHT ACTION PANEL
════════════════════════════════════════ */
function NightActionPanel({ role, target, investigationResult, players, lang, isDead }) {
  if (isDead) {
    return (
      <div className="text-center py-3 animate-fade-in">
        <p className="text-sm text-cream-dim italic">
          {lang === 'ar' ? 'أنت ميت... راقب من الظلال' : 'You are dead... watch from the shadows'}
        </p>
      </div>
    )
  }

  const instructions = {
    mafia:     { icon: '🔫', text: lang === 'ar' ? 'اختر ضحية للقضاء عليها' : 'Choose a target to eliminate',     color: '#E74C3C' },
    detective: { icon: '🔍', text: lang === 'ar' ? 'اختر لاعباً للتحقيق في هويته' : 'Choose a player to investigate', color: '#3498DB' },
    doctor:    { icon: '🛡️', text: lang === 'ar' ? 'اختر لاعباً لحمايته' : 'Choose a player to protect',           color: '#1ABC9C' },
    citizen:   { icon: '😴', text: lang === 'ar' ? 'انتظر حتى الفجر...' : 'Wait for dawn...',                      color: '#6B6B80' },
  }

  const info = instructions[role] || instructions.citizen
  const targetPlayer = target ? players.find(p => p.id === target) : null

  return (
    <div className="text-center py-3 animate-fade-in space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl">{info.icon}</span>
        <p className="text-sm font-semibold" style={{ color: info.color }}>{info.text}</p>
      </div>

      {target && targetPlayer && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full animate-fade-in"
          style={{ background: `${info.color}15`, border: `1px solid ${info.color}30` }}>
          <span>{targetPlayer.avatar}</span>
          <span className="text-sm font-bold text-white">{targetPlayer.name}</span>
          <span className="text-[10px] font-semibold" style={{ color: info.color }}>
            {lang === 'ar' ? '✓ تم الاختيار' : '✓ Selected'}
          </span>
        </div>
      )}

      {/* Detective investigation result */}
      {investigationResult && role === 'detective' && (
        <div className="animate-slide-up mt-2">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{
              background: investigationResult.isMafia ? 'rgba(231,76,60,0.15)' : 'rgba(39,174,96,0.15)',
              border: `1.5px solid ${investigationResult.isMafia ? 'rgba(231,76,60,0.4)' : 'rgba(39,174,96,0.4)'}`,
            }}>
            <span className="text-2xl">{investigationResult.playerAvatar}</span>
            <div className="text-start">
              <p className="text-sm font-bold text-white">{investigationResult.playerName}</p>
              <p className="text-xs font-semibold" style={{ color: investigationResult.isMafia ? '#E74C3C' : '#27AE60' }}>
                {investigationResult.isMafia
                  ? (lang === 'ar' ? '🔴 هذا اللاعب مافيا!' : '🔴 This player IS Mafia!')
                  : (lang === 'ar' ? '🟢 هذا اللاعب بريء' : '🟢 This player is NOT Mafia')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════
   DAY RESULTS OVERLAY
════════════════════════════════════════ */
function DayResultsOverlay({ result, lang }) {
  if (!result) return null

  if (result.killed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="animate-slide-up text-center">
          <div className="text-7xl mb-4 animate-bounce">💀</div>
          <div className="px-8 py-4 rounded-2xl"
            style={{
              background: 'rgba(192,57,43,0.95)', border: '2px solid rgba(231,76,60,0.6)',
              color: 'white', boxShadow: '0 12px 48px rgba(192,57,43,0.5)',
            }}>
            <div className="text-3xl mb-1">{result.killed.avatar}</div>
            <div className="text-lg font-bold">{result.killed.name}</div>
            <div className="text-sm opacity-80 mt-1">
              {lang === 'ar' ? 'قُتل على يد المافيا الليلة' : 'was killed by the Mafia'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (result.saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="animate-slide-up text-center">
          <div className="text-7xl mb-4">💊</div>
          <div className="px-8 py-4 rounded-2xl"
            style={{
              background: 'rgba(22,160,133,0.95)', border: '2px solid rgba(26,188,156,0.6)',
              color: 'white', boxShadow: '0 12px 48px rgba(22,160,133,0.5)',
            }}>
            <div className="text-lg font-bold">
              {lang === 'ar' ? 'الطبيب أنقذ حياة!' : 'The Doctor saved a life!'}
            </div>
            <div className="text-sm opacity-80 mt-1">
              {lang === 'ar' ? 'لم يُقتل أحد الليلة' : 'Nobody was killed tonight'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-slide-up text-center">
        <div className="text-7xl mb-4">🌅</div>
        <div className="px-8 py-4 rounded-2xl"
          style={{
            background: 'rgba(229,185,78,0.2)', border: '2px solid rgba(229,185,78,0.4)',
            color: 'white', boxShadow: '0 12px 48px rgba(229,185,78,0.2)',
          }}>
          <div className="text-lg font-bold">
            {lang === 'ar' ? 'ليلة هادئة' : 'A quiet night'}
          </div>
          <div className="text-sm opacity-80 mt-1">
            {lang === 'ar' ? 'لم يُستهدف أحد' : 'Nobody was targeted'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   VOTE ELIMINATION OVERLAY
════════════════════════════════════════ */
function VoteOverlay({ target, lang }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-slide-up text-center">
        <div className="text-6xl mb-3 animate-bounce">💀</div>
        <div className="px-6 py-3 rounded-2xl text-lg font-bold"
          style={{
            background: 'rgba(192,57,43,0.95)', border: '2px solid rgba(231,76,60,0.6)',
            color: 'white', boxShadow: '0 12px 48px rgba(192,57,43,0.5)',
          }}>
          {target.avatar} {target.name}{' '}
          {lang === 'ar' ? 'تم إقصاؤه' : 'was eliminated'}
          <div className="text-xs opacity-70 mt-1">
            {target.role === 'mafia'
              ? (lang === 'ar' ? '🔴 كان مافيا!' : '🔴 Was Mafia!')
              : (lang === 'ar' ? '🟢 كان بريئاً...' : '🟢 Was innocent...')}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   GAME OVER SCREEN
════════════════════════════════════════ */
function GameOverScreen({ winner, players, selfRole, onPlayAgain, onLeave, lang }) {
  const isMafiaWin = winner === 'mafia'
  const selfWon = isMafiaWin ? selfRole === 'mafia' : selfRole !== 'mafia'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center modal-bg"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-lg w-full mx-4 animate-slide-up">
        {/* Trophy */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-3">{isMafiaWin ? '🔫' : '🏘️'}</div>
          <h2 className="text-3xl font-black mb-2" style={{ color: isMafiaWin ? '#E74C3C' : '#27AE60' }}>
            {isMafiaWin
              ? (lang === 'ar' ? 'فازت المافيا!' : 'Mafia Wins!')
              : (lang === 'ar' ? 'فاز المدنيون!' : 'Town Wins!')}
          </h2>
          <p className="text-lg font-bold" style={{ color: selfWon ? '#27AE60' : '#E74C3C' }}>
            {selfWon
              ? (lang === 'ar' ? '🎉 أنت فزت!' : '🎉 You Won!')
              : (lang === 'ar' ? '💔 أنت خسرت' : '💔 You Lost')}
          </p>
        </div>

        {/* All roles revealed */}
        <div className="card p-4 mb-6 max-h-64 overflow-y-auto">
          <p className="label mb-3 text-center">
            {lang === 'ar' ? 'جميع الأدوار' : 'All Roles Revealed'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg"
                style={{
                  background: p.status === 'dead' ? 'rgba(231,76,60,0.06)' : 'rgba(255,255,255,0.03)',
                  opacity: p.status === 'dead' ? 0.5 : 1,
                }}>
                <span className="text-lg">{p.status === 'dead' ? '💀' : p.avatar}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${p.isSelf ? 'text-gold' : 'text-white'}`}>
                    {p.name} {p.isSelf ? '★' : ''}
                  </p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold role-${p.role}`}>
                    {p.role === 'mafia' ? (lang === 'ar' ? 'مافيا' : 'Mafia')
                    : p.role === 'detective' ? (lang === 'ar' ? 'محقق' : 'Detective')
                    : p.role === 'doctor' ? (lang === 'ar' ? 'طبيب' : 'Doctor')
                    : (lang === 'ar' ? 'مواطن' : 'Civilian')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button onClick={onPlayAgain} className="btn btn-gold px-8 py-3 text-sm font-bold">
            {lang === 'ar' ? 'العب مرة أخرى' : 'Play Again'}
          </button>
          <button onClick={onLeave} className="btn btn-ghost px-6 py-3 text-sm">
            {lang === 'ar' ? 'مغادرة' : 'Leave'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   EVENT LOG
════════════════════════════════════════ */
function EventLog({ events }) {
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [events])
  if (!events.length) return null

  return (
    <div className="flex flex-col gap-1 max-h-28 overflow-y-auto px-1 scrollbar-hide">
      {events.map((ev, i) => (
        <div key={i} className="flex items-center gap-2 text-xs animate-slide-up"
          style={{ animationDelay: `${i * 0.02}s` }}>
          <span>{ev.icon}</span>
          <span className="text-cream-dim">{ev.text}</span>
          <span className="text-cream-dim/40 text-[10px] ms-auto">{ev.time}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}

/* ════════════════════════════════════════
   PLAYER LIST SIDEBAR
════════════════════════════════════════ */
function PlayerList({ players, phase, votedFor, nightTarget, selfRole, onAction, t, lang, isNight }) {
  const alive = players.filter(p => p.status === 'alive')
  const dead = players.filter(p => p.status === 'dead')

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-noir-border flex items-center justify-between">
        <span className="label">{t('players_list')}</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.3)' }}>
          {alive.length} {t('alive')}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1.5">
        {alive.map(p => (
          <PlayerListItem key={p.id} player={p} phase={phase} votedFor={votedFor}
            nightTarget={nightTarget} selfRole={selfRole} onAction={onAction}
            t={t} isNight={isNight} />
        ))}
        {dead.length > 0 && (
          <>
            <div className="px-3 pt-3 pb-1">
              <span className="text-[10px] font-semibold text-cream-dim/50 uppercase tracking-wider">
                💀 {t('dead')} ({dead.length})
              </span>
            </div>
            {dead.map(p => (
              <PlayerListItem key={p.id} player={p} phase={phase} votedFor={votedFor}
                nightTarget={nightTarget} selfRole={selfRole} onAction={onAction}
                t={t} isNight={isNight} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function PlayerListItem({ player: p, phase, votedFor, nightTarget, selfRole, onAction, t, isNight }) {
  const isVotingPhase = phase === PHASES.DAY_VOTING
  const isNightPhase = phase === PHASES.NIGHT
  const canNightAction = isNightPhase && p.status === 'alive' && !p.isSelf && selfRole !== 'citizen'
    && !nightTarget && (selfRole !== 'mafia' || p.role !== 'mafia')
  const canVote = isVotingPhase && p.status === 'alive' && !p.isSelf && !votedFor
  const clickable = (canVote || canNightAction) && p.status === 'alive'
  const isVoted = votedFor === p.id
  const isNightSelected = nightTarget === p.id

  // Mafia can see fellow mafia at night
  const showMafiaTag = isNight && selfRole === 'mafia' && p.role === 'mafia' && !p.isSelf && p.status === 'alive'

  return (
    <div
      onClick={() => clickable && onAction(p.id)}
      className={`flex items-center gap-2.5 px-3 py-2.5 mx-1.5 my-0.5 rounded-lg transition-all
        ${p.status === 'dead' ? 'opacity-30' : ''}
        ${clickable ? 'cursor-pointer hover:bg-noir-hover active:scale-[0.98]' : ''}`}
      style={{
        background: isVoted ? 'rgba(231,76,60,0.1)'
          : isNightSelected ? 'rgba(229,185,78,0.1)'
          : p.isSelf ? 'rgba(229,185,78,0.06)' : 'transparent',
        border: isVoted ? '1px solid rgba(231,76,60,0.3)'
          : isNightSelected ? '1px solid rgba(229,185,78,0.3)'
          : '1px solid transparent',
      }}>
      <div className="relative">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all"
          style={{
            borderColor: p.status === 'dead' ? '#333340' : (p.isSelf ? '#E5B94E' : '#2A2A35'),
            background: 'var(--noir-surface)',
          }}>
          {p.status === 'dead' ? <span className="text-red-500 text-xs">✕</span> : p.avatar}
        </div>
        {p.isSelf && (
          <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-gold border-2 border-noir-black z-10" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${p.isSelf ? 'text-gold' : 'text-white'} ${p.status === 'dead' ? 'line-through' : ''}`}>
          {p.name} {p.isSelf && <span className="text-gold/50 font-normal">({t('youAre').toLowerCase()})</span>}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {p.votes > 0 && p.status === 'alive' && (
            <span className="text-[9px] text-red-400 font-bold flex items-center gap-0.5">🗳️ {p.votes}</span>
          )}
          {showMafiaTag && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold role-mafia">
              {t('mafia')}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {clickable && (
          <span className="text-[9px] text-cream-dim/40 font-medium">
            {isNightPhase
              ? (selfRole === 'mafia' ? '🔫' : selfRole === 'detective' ? '🔍' : '💉')
              : t('vote')}
          </span>
        )}
        <div className={`w-2 h-2 rounded-full ${p.status === 'dead' ? 'bg-red-500' : 'bg-green-400'}`}
          style={{ boxShadow: p.status === 'alive' ? '0 0 6px rgba(39,174,96,0.5)' : 'none' }} />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   MOBILE PLAYERS DRAWER
════════════════════════════════════════ */
function MobilePlayersDrawer({ open, onClose, players, phase, votedFor, nightTarget, selfRole, onAction, t, lang, isLight, isNight }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute bottom-0 inset-x-0 rounded-t-2xl animate-slide-up overflow-hidden"
        style={{ background: isLight ? '#FFFFFF' : 'var(--noir-deep)', maxHeight: '70vh' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-noir-border">
          <span className="font-semibold text-white text-sm">{t('players_list')}</span>
          <button onClick={onClose} className="text-cream-dim hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[55vh]">
          <PlayerList players={players} phase={phase} votedFor={votedFor}
            nightTarget={nightTarget} selfRole={selfRole} onAction={onAction}
            t={t} lang={lang} isLight={isLight} isNight={isNight} />
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   MAFIA PRIVATE CHAT (Night only)
════════════════════════════════════════ */
function MafiaChat({ mafiaMembers, allPlayers, className = '', lang }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const aiTimers = useRef([])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI mafia members send strategic messages on mount (each night = fresh mount via key)
  useEffect(() => {
    const aiMembers = mafiaMembers.filter(m => !m.isSelf && m.status === 'alive')
    const targets = allPlayers.filter(p => p.role !== 'mafia' && p.status === 'alive')
    if (!aiMembers.length || !targets.length) return

    const pool = lang === 'ar' ? [
      (n) => `لنستهدف ${n} الليلة`,
      (n) => `أعتقد أن ${n} مشتبه بنا`,
      (n) => `ماذا عن ${n}؟ يبدو خطيراً`,
      (n) => `${n} يجب أن يُقصى`,
      (n) => `أقترح القضاء على ${n}`,
      () => 'يجب أن نكون حذرين غداً',
      () => 'لا تكشفوا أنفسكم أثناء النقاش',
      () => 'موافق على الخطة 👍',
    ] : [
      (n) => `Let's go for ${n} tonight`,
      (n) => `I think ${n} suspects us`,
      (n) => `What about ${n}? Seems dangerous`,
      (n) => `${n} needs to go`,
      (n) => `I suggest we eliminate ${n}`,
      () => `We need to be careful tomorrow`,
      () => `Don't draw attention during discussion`,
      () => `Agreed on the plan 👍`,
    ]

    aiMembers.forEach(ai => {
      const count = Math.random() > 0.4 ? 2 : 1
      for (let j = 0; j < count; j++) {
        const delay = 2000 + Math.random() * 20000
        const id = setTimeout(() => {
          const tmpl = pool[Math.floor(Math.random() * pool.length)]
          const t = targets[Math.floor(Math.random() * targets.length)]
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: ai.name, avatar: ai.avatar,
            text: tmpl(t?.name || '???'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            isOwn: false,
          }])
        }, delay)
        aiTimers.current.push(id)
      }
    })

    return () => { aiTimers.current.forEach(id => clearTimeout(id)); aiTimers.current = [] }
  }, [])

  const send = e => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: lang === 'ar' ? 'أنت' : 'You',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      isOwn: true,
    }])
    setInput('')
    inputRef.current?.focus()
  }

  const alive = mafiaMembers.filter(m => m.status === 'alive')
  const isRTL = lang === 'ar'

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: 'rgba(231,76,60,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#E74C3C', boxShadow: '0 0 6px rgba(231,76,60,0.5)' }} />
            <span className="text-sm font-bold" style={{ color: '#E74C3C' }}>
              {lang === 'ar' ? 'دردشة المافيا' : 'Mafia Chat'}
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full role-mafia">
            {lang === 'ar' ? 'سري 🤫' : 'SECRET 🤫'}
          </span>
        </div>
        {/* Online mafia members */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {alive.map(m => (
            <div key={m.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.15)' }}>
              <span className="text-xs">{m.avatar}</span>
              <span className="text-[9px] font-medium" style={{ color: m.isSelf ? '#E5B94E' : '#FF6B6B' }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="text-3xl mb-2">🤫</div>
            <p className="text-xs text-cream-dim italic">
              {lang === 'ar' ? 'تحدث مع فريقك بسرية...' : 'Discuss secretly with your team...'}
            </p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-0.5 animate-fade-in ${msg.isOwn ? 'items-end' : 'items-start'}`}>
            {!msg.isOwn && (
              <span className="text-[11px] font-bold px-1 mb-0.5" style={{ color: '#FF6B6B' }}>
                {msg.avatar} {msg.sender}
              </span>
            )}
            <div className="max-w-[85%] px-3.5 py-2 text-[13px] leading-relaxed"
              style={msg.isOwn
                ? { background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.25)',
                    borderRadius: isRTL ? '12px 12px 12px 2px' : '12px 12px 2px 12px' }
                : { background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.12)',
                    borderRadius: isRTL ? '12px 12px 2px 12px' : '12px 12px 12px 2px' }
              }>
              {msg.text}
            </div>
            <span className="text-[9px] text-cream-dim/40 px-1">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex gap-2 p-3 border-t shrink-0"
        style={{ borderColor: 'rgba(231,76,60,0.15)' }}>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder={lang === 'ar' ? 'رسالة سرية...' : 'Secret message...'}
          className="field flex-1 py-2 text-sm"
          style={{ borderRadius: '10px', borderColor: 'rgba(231,76,60,0.25)' }} />
        <button type="submit" disabled={!input.trim()}
          className="w-9 h-9 p-0 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all flex items-center justify-center"
          style={{ background: input.trim() ? 'linear-gradient(135deg, #C0392B, #E74C3C)' : 'rgba(231,76,60,0.2)',
                   border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d={lang === 'ar' ? 'M12 19l-9 2 9-18 9 18-9-2zm0 0v-8' : 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'} />
          </svg>
        </button>
      </form>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN GAME ROOM
═══════════════════════════════════════ */
export default function GameRoom({ setPage }) {
  const { t, lang } = useLang()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  /* ── Game engine ── */
  const gameRef = useRef(null)
  const [gs, setGs] = useState(null)               // game snapshot
  const [timeLeft, setTimeLeft] = useState(0)
  const [roleHidden, setRoleHidden] = useState(false)
  const [nightTarget, setNightTarget] = useState(null)
  const [votedFor, setVotedFor] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [playersOpen, setPlayersOpen] = useState(false)
  const [eliminationToast, setEliminationToast] = useState(null)
  const [selfRole, setSelfRole] = useState(null)    // persists after death
  const aiVoteTimers = useRef([])
  const phaseTimers = useRef([])    // track all setTimeout IDs for cleanup

  const sync = useCallback(() => {
    if (gameRef.current) setGs(gameRef.current.snapshot())
  }, [])

  /* ── Initialize waiting state ── */
  useEffect(() => {
    const game = new MafiaGame(PLAYER_POOL, SELF_ID, lang)
    gameRef.current = game
    sync()

    // Cleanup all timers on unmount
    return () => {
      aiVoteTimers.current.forEach(id => clearTimeout(id))
      phaseTimers.current.forEach(id => clearTimeout(id))
      aiVoteTimers.current = []
      phaseTimers.current = []
    }
  }, [])

  const phase = gs?.phase ?? PHASES.WAITING
  const isNight = phase === PHASES.NIGHT
  const players = gs?.players ?? []
  const self = gs?.self
  const aliveCount = gs ? players.filter(p => p.status === 'alive').length : 0
  const events = gs?.events ?? []

  /* ── Timer ── */
  useEffect(() => {
    if (!gs || phase === PHASES.WAITING || phase === PHASES.GAME_OVER) return
    const dur = PHASE_TIMERS[phase]
    if (!dur) return
    setTimeLeft(dur)
  }, [phase])

  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(p => (p <= 1 ? 0 : p - 1)), 1000)
    return () => clearInterval(id)
  }, [timeLeft > 0])

  /* ── Phase transitions on timer expiry ── */
  useEffect(() => {
    if (timeLeft !== 0 || !gs) return
    const game = gameRef.current
    if (!game) return

    switch (phase) {
      case PHASES.ROLE_REVEAL:
        setRoleHidden(true)
        game.startNight()
        sync()
        break

      case PHASES.NIGHT:
        handleNightEnd()
        break

      case PHASES.DAY_RESULTS: {
        const winner = game.checkWinCondition()
        if (!winner) {
          game.startDayDiscussion()
        }
        sync()
        break
      }

      case PHASES.DAY_DISCUSSION:
        game.startVoting()
        setVotedFor(null)
        sync()
        scheduleAIVotes()
        break

      case PHASES.DAY_VOTING:
        handleVotingEnd()
        break
    }
  }, [timeLeft])

  /* ── Start game ── */
  const startGame = () => {
    const game = gameRef.current
    if (!game) return
    const self = game.startGame()
    setSelfRole(self.role)
    setRoleHidden(false)
    setNightTarget(null)
    setVotedFor(null)
    sync()
  }

  /* ── Play again ── */
  const playAgain = () => {
    aiVoteTimers.current.forEach(id => clearTimeout(id))
    phaseTimers.current.forEach(id => clearTimeout(id))
    aiVoteTimers.current = []
    phaseTimers.current = []
    const game = new MafiaGame(PLAYER_POOL, SELF_ID, lang)
    gameRef.current = game
    setSelfRole(null)
    setRoleHidden(false)
    setNightTarget(null)
    setVotedFor(null)
    setEliminationToast(null)
    sync()
    // Auto-start after a brief delay
    const id = setTimeout(() => {
      const self = game.startGame()
      setSelfRole(self.role)
      setGs(game.snapshot())
    }, 300)
    phaseTimers.current.push(id)
  }

  /* ── Hide role card ── */
  const hideCard = () => {
    setRoleHidden(true)
    const game = gameRef.current
    game.startNight()
    sync()
  }

  /* ── Night action (click a target) ── */
  const handleNightAction = (targetId) => {
    const game = gameRef.current
    const self = game.getSelf()
    if (!self || self.status !== 'alive' || self.role === 'citizen') return
    if (phase !== PHASES.NIGHT) return
    if (nightTarget) return

    // Mafia can't target fellow mafia
    if (self.role === 'mafia') {
      const target = players.find(p => p.id === targetId)
      if (target?.role === 'mafia') return
    }

    setNightTarget(targetId)
    game.submitNightAction(SELF_ID, targetId)
    sync()
  }

  /* ── Resolve night ── */
  const handleNightEnd = () => {
    const game = gameRef.current
    game.resolveNight()
    setNightTarget(null)
    sync()
    // Timer system handles DAY_RESULTS → DAY_DISCUSSION transition
  }

  /* ── Day vote ── */
  const handleVote = (targetId) => {
    if (votedFor) return
    const game = gameRef.current
    const self = game.getSelf()
    if (!self || self.status !== 'alive') return
    if (phase !== PHASES.DAY_VOTING) return

    game.castVote(SELF_ID, targetId)
    setVotedFor(targetId)
    sync()
  }

  /* ── Schedule AI votes (staggered) ── */
  const scheduleAIVotes = () => {
    aiVoteTimers.current.forEach(id => clearTimeout(id))
    aiVoteTimers.current = []

    const game = gameRef.current
    const plan = game.getAIVotePlan()
    const votingDuration = PHASE_TIMERS[PHASES.DAY_VOTING] * 1000

    plan.forEach((vote, i) => {
      const delay = Math.random() * (votingDuration * 0.8) + 1000 // 1s to 80% of voting time
      const id = setTimeout(() => {
        game.castVote(vote.voterId, vote.targetId)
        sync()
      }, delay)
      aiVoteTimers.current.push(id)
    })
  }

  /* ── Resolve votes ── */
  const handleVotingEnd = () => {
    const game = gameRef.current
    const result = game.resolveVotes()
    sync()

    const goToNextPhase = () => {
      setEliminationToast(null)
      const winner = game.checkWinCondition()
      if (!winner) {
        game.startNight()
        setNightTarget(null)
        setVotedFor(null)
      }
      sync()
    }

    if (result.eliminated) {
      setEliminationToast(result.eliminated)
      const id = setTimeout(goToNextPhase, 3000)
      phaseTimers.current.push(id)
    } else {
      const id = setTimeout(goToNextPhase, 2000)
      phaseTimers.current.push(id)
    }
  }

  /* ── Unified action handler (night action or day vote) ── */
  const handlePlayerAction = (targetId) => {
    if (phase === PHASES.NIGHT) handleNightAction(targetId)
    else if (phase === PHASES.DAY_VOTING) handleVote(targetId)
  }

  /* ── Timer display ── */
  const totalTime = PHASE_TIMERS[phase] || 1
  const urgentTime = timeLeft <= 10
  const criticalTime = timeLeft <= 5
  const timePct = (timeLeft / totalTime) * 100
  const timerColor = criticalTime ? '#E74C3C' : urgentTime ? '#E67E22' : isLight ? '#C8960C' : '#E5B94E'
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  /* ── Can player act on the table? ── */
  const canTableAction = (p) => {
    if (p.status === 'dead' || p.isSelf) return false
    if (phase === PHASES.NIGHT && selfRole && selfRole !== 'citizen') {
      const selfAlive = self?.status === 'alive'
      if (!selfAlive) return false
      if (selfRole === 'mafia' && p.role === 'mafia') return false
      return true
    }
    if (phase === PHASES.DAY_VOTING && !votedFor && self?.status === 'alive') return true
    return false
  }

  /* ── Phase label for display ── */
  const phaseLabel = phase === PHASES.NIGHT ? t('night')
    : phase === PHASES.DAY_VOTING ? (lang === 'ar' ? 'تصويت' : 'Voting')
    : phase === PHASES.DAY_DISCUSSION ? t('day')
    : phase === PHASES.DAY_RESULTS ? t('day')
    : phase === PHASES.ROLE_REVEAL ? (lang === 'ar' ? 'كشف الأدوار' : 'Role Reveal')
    : t('day')

  const showTimer = phase !== PHASES.WAITING && phase !== PHASES.GAME_OVER
  const round = gs?.round ?? 0
  const showMafiaChat = isNight && selfRole === 'mafia' && self?.status === 'alive'
  const mafiaMembers = players.filter(p => p.role === 'mafia')

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-700"
      style={{ background: isNight ? '#08080F' : isLight ? '#F2F0EB' : '#0C0C0E' }}>

      {/* Night atmospheric overlay */}
      {isNight && (
        <>
          <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(60,80,200,0.06) 0%, transparent 100%)' }} />
          <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ background: 'radial-gradient(ellipse 40% 40% at 80% 20%, rgba(100,120,255,0.03) 0%, transparent 100%)' }} />
        </>
      )}

      {/* Day warm glow */}
      {!isNight && !isLight && phase !== PHASES.WAITING && (
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(229,185,78,0.03) 0%, transparent 100%)' }} />
      )}

      {/* ── Overlays ── */}
      {eliminationToast && <VoteOverlay target={eliminationToast} lang={lang} />}

      {phase === PHASES.ROLE_REVEAL && !roleHidden && selfRole && (
        <RoleRevealModal role={selfRole} timeLeft={timeLeft} onHide={hideCard} lang={lang} />
      )}

      {phase === PHASES.DAY_RESULTS && gs?.lastNightResult && (
        <DayResultsOverlay result={gs.lastNightResult} lang={lang} />
      )}

      {phase === PHASES.GAME_OVER && gs?.winner && (
        <GameOverScreen
          winner={gs.winner}
          players={players}
          selfRole={selfRole}
          onPlayAgain={playAgain}
          onLeave={() => setPage('lobby')}
          lang={lang}
        />
      )}

      {/* ── Top Bar ── */}
      <div className="sticky-tabs sticky top-0 z-30 border-b border-noir-border"
        style={{ background: isLight ? 'rgba(242,240,235,0.97)' : 'rgba(12,12,14,0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">

          {/* Left: Room info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden sm:block">
              <h2 className="font-bold text-white text-sm truncate">Chicago Nights</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-cream-dim">{aliveCount}/{players.length} {t('alive')}</span>
              </div>
            </div>

            {/* Phase badge */}
            {phase !== PHASES.WAITING && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${isNight ? 'phase-night' : 'phase-day'}`}>
                <span className="text-sm">{isNight ? '🌙' : '☀️'}</span>
                <span>{phaseLabel}</span>
                {round > 0 && (
                  <>
                    <span className="opacity-60">—</span>
                    <span>{t('round')} {round}</span>
                  </>
                )}
              </div>
            )}

            {phase === PHASES.WAITING && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold phase-day">
                <span className="text-sm">⏳</span>
                <span>{lang === 'ar' ? 'في الانتظار' : 'Waiting'}</span>
              </div>
            )}
          </div>

          {/* Center: Phase message (desktop) */}
          <div className="hidden lg:block flex-1 text-center">
            <p className="text-xs text-cream-dim italic">
              {phase === PHASES.WAITING && (lang === 'ar' ? 'اضغط "ابدأ اللعبة" للبدء' : 'Press "Start Game" to begin')}
              {phase === PHASES.NIGHT && (isNight ? t('nightPhaseMsg') : '')}
              {phase === PHASES.DAY_DISCUSSION && t('dayPhaseMsg')}
              {phase === PHASES.DAY_VOTING && (lang === 'ar' ? 'صوّت لإقصاء المشتبه به' : 'Vote to eliminate a suspect')}
              {phase === PHASES.DAY_RESULTS && (lang === 'ar' ? 'نتائج الليلة...' : 'Last night\'s results...')}
              {phase === PHASES.ROLE_REVEAL && (lang === 'ar' ? 'تحقق من دورك!' : 'Check your role card!')}
            </p>
          </div>

          {/* Right: Timer + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showTimer && (
              <div className="flex items-center gap-2">
                <div className="relative w-11 h-11">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none"
                      stroke={isLight ? '#D5D0C5' : '#1E1E25'} strokeWidth="2.5" />
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="2.5" strokeLinecap="round"
                      stroke={timerColor}
                      strokeDasharray={`${timePct} 100`}
                      style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s ease' }} />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-black
                    ${criticalTime ? 'text-red-400 animate-pulse' : urgentTime ? 'text-orange-400' : 'text-gold'}`}>
                    {timeLeft}
                  </span>
                </div>
                <div className="hidden sm:block text-end">
                  <div className="text-xs font-bold text-white tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-cream-dim">{t('timer')}</div>
                </div>
              </div>
            )}

            <button onClick={() => setPage('lobby')} className="btn btn-danger px-3 py-1.5 text-xs">
              <span className="hidden sm:inline">{t('leaveRoom')}</span>
              <span className="sm:hidden">🚪</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">

        {/* Players sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-48 xl:w-56 border-e border-noir-border shrink-0"
          style={{ height: 'calc(100vh - 4rem)', background: isLight ? 'rgba(242,240,235,0.6)' : 'rgba(12,12,14,0.4)' }}>
          <PlayerList players={players} phase={phase} votedFor={votedFor}
            nightTarget={nightTarget} selfRole={selfRole} onAction={handlePlayerAction}
            t={t} lang={lang} isLight={isLight} isNight={isNight} />
        </aside>

        {/* Center Game Area */}
        <main className="flex-1 flex flex-col items-center py-4 px-3 sm:px-4 gap-4 overflow-auto">

          {/* Role indicator (after reveal) */}
          {selfRole && roleHidden && phase !== PHASES.GAME_OVER && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: selfRole === 'mafia' ? 'rgba(231,76,60,0.1)'
                    : selfRole === 'detective' ? 'rgba(52,152,219,0.1)'
                    : selfRole === 'doctor' ? 'rgba(26,188,156,0.1)'
                    : 'rgba(39,174,96,0.1)',
                  border: `1px solid ${selfRole === 'mafia' ? 'rgba(231,76,60,0.3)'
                    : selfRole === 'detective' ? 'rgba(52,152,219,0.3)'
                    : selfRole === 'doctor' ? 'rgba(26,188,156,0.3)'
                    : 'rgba(39,174,96,0.3)'}`,
                }}>
                <span className="text-lg">
                  {selfRole === 'mafia' ? '🔫' : selfRole === 'detective' ? '👮' : selfRole === 'doctor' ? '💊' : '👤'}
                </span>
                <div>
                  <p className="label">{t('youAre')}</p>
                  <p className="font-bold text-white text-sm leading-none">{t(selfRole)}</p>
                </div>
              </div>
              {/* Quick stats */}
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(39,174,96,0.1)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.25)' }}>
                  {aliveCount} {t('alive')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(231,76,60,0.1)', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.25)' }}>
                  {players.length - aliveCount} {t('dead')}
                </span>
              </div>
            </div>
          )}

          {/* Night action panel */}
          {phase === PHASES.NIGHT && selfRole && (
            <NightActionPanel
              role={selfRole}
              target={nightTarget}
              investigationResult={gs?.investigationResult}
              players={players}
              lang={lang}
              isDead={self?.status === 'dead'}
            />
          )}

          {/* ── Circular Table ── */}
          <div className="relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[600px]"
            style={{ paddingBottom: '100%' }}>
            <div className="absolute inset-0">
              {/* Outer ring */}
              <div className="absolute inset-[4%] rounded-full border pointer-events-none transition-all duration-700"
                style={{ borderColor: isNight ? 'rgba(100,120,255,0.06)' : 'rgba(229,185,78,0.06)' }} />

              {/* Middle decorative ring */}
              <div className="absolute inset-[15%] rounded-full border pointer-events-none transition-all duration-700"
                style={{ borderColor: isNight ? 'rgba(100,120,255,0.04)' : 'rgba(229,185,78,0.04)', borderStyle: 'dashed' }} />

              {/* Center Table */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] h-[24%] rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700"
                style={{
                  borderColor: isNight ? 'rgba(100,120,255,0.12)'
                    : isLight ? 'rgba(138,107,32,0.25)' : 'rgba(229,185,78,0.15)',
                  background: isNight ? 'radial-gradient(circle, #0D0D18, #08080F)'
                    : isLight ? 'radial-gradient(circle, #FFFFFF, #F5F3EE)'
                    : 'radial-gradient(circle, #14120A, #0C0A04)',
                  boxShadow: isNight ? '0 0 40px rgba(100,120,255,0.06), inset 0 0 20px rgba(100,120,255,0.03)'
                    : isLight ? '0 0 30px rgba(138,107,32,0.08), inset 0 0 16px rgba(0,0,0,0.03)'
                    : '0 0 40px rgba(229,185,78,0.08), inset 0 0 24px rgba(0,0,0,0.5)',
                }}>
                {phase === PHASES.WAITING ? (
                  <>
                    <div className="text-2xl">🎭</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest mt-1 text-cream-dim/50">
                      {lang === 'ar' ? 'جاهز' : 'READY'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl transition-transform duration-500" style={{ transform: isNight ? 'scale(1.1)' : 'scale(1)' }}>
                      {isNight ? '🌙' : '☀️'}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest mt-1"
                      style={{ color: isNight ? 'rgba(160,180,255,0.6)' : isLight ? '#9A8A78' : 'rgba(229,185,78,0.5)' }}>
                      {phaseLabel}
                    </div>
                    {round > 0 && (
                      <div className="text-[8px] mt-0.5"
                        style={{ color: isNight ? 'rgba(160,180,255,0.3)' : isLight ? '#B5A898' : 'rgba(229,185,78,0.3)' }}>
                        {t('round')} {round}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {players.map((p, i) => {
                  if (p.status === 'dead') return null
                  const pos = getPos(i, players.length, 43)
                  return (
                    <line key={p.id} x1="50" y1="50" x2={pos.x} y2={pos.y}
                      stroke={isNight ? 'rgba(100,120,255,0.04)' : 'rgba(229,185,78,0.04)'}
                      strokeWidth="0.3" />
                  )
                })}
              </svg>

              {/* Players around table */}
              {players.map((p, i) => {
                const pos = getPos(i, players.length, 43)
                const canAct = canTableAction(p)
                const selectionColor = (nightTarget === p.id || votedFor === p.id) ? '#27AE60' : null

                return (
                  <div key={p.id} className="player-seat" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={() => canAct && handlePlayerAction(p.id)}>
                    <div className="transition-all duration-300">
                      <PlayerSeat
                        totalPlayers={players.length}
                        player={{
                          ...p,
                          role: p.isSelf || phase === PHASES.GAME_OVER
                            || (isNight && selfRole === 'mafia' && p.role === 'mafia')
                            ? p.role : 'citizen',
                        }}
                        showRole={
                          phase === PHASES.GAME_OVER ||
                          (isNight && selfRole === 'mafia' && p.role === 'mafia')
                        }
                        onVote={canAct ? handlePlayerAction : undefined}
                        canVote={canAct}
                        isNight={isNight}
                        selectionColor={selectionColor}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Event log */}
          <div className="w-full max-w-md">
            <EventLog events={events} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 justify-center pb-4">
            {phase === PHASES.WAITING && (
              <button onClick={startGame} className="btn btn-gold px-8 py-3 text-sm font-bold animate-glow">
                🎮 {lang === 'ar' ? 'ابدأ اللعبة' : 'Start Game'}
              </button>
            )}

            {phase === PHASES.DAY_VOTING && self?.status === 'alive' && (
              <>
                <button disabled={!!votedFor}
                  className="btn btn-danger px-5 sm:px-6 py-2.5 text-sm font-bold disabled:opacity-40 transition-all">
                  🗳️ {t('vote')}
                </button>
                {!votedFor && (
                  <button className="btn btn-ghost px-5 py-2.5 text-sm"
                    onClick={() => {
                      /* skip vote — just wait for timer */
                    }}>
                    ⏭️ {t('skipVote')}
                  </button>
                )}
              </>
            )}

            {phase === PHASES.NIGHT && self?.status === 'alive' && selfRole !== 'citizen' && (
              <div className="text-center">
                {nightTarget ? (
                  <p className="text-xs text-cream-dim italic animate-fade-in">
                    {selfRole === 'mafia' ? '🔫' : selfRole === 'detective' ? '🔍' : '💉'}
                    {' '}
                    {lang === 'ar' ? 'تم تأكيد اختيارك — انتظر الفجر' : 'Action confirmed — waiting for dawn'}
                  </p>
                ) : (
                  <p className="text-xs text-cream-dim animate-pulse">
                    {lang === 'ar' ? 'اختر هدفاً من الطاولة' : 'Select a target from the table'}
                  </p>
                )}
              </div>
            )}

            {phase === PHASES.DAY_DISCUSSION && (
              <div className="text-center">
                <p className="text-xs text-cream-dim italic">
                  💬 {lang === 'ar' ? 'ناقش مع اللاعبين — التصويت يبدأ قريباً' : 'Discuss with players — voting starts soon'}
                </p>
              </div>
            )}
          </div>

          {votedFor && phase === PHASES.DAY_VOTING && (
            <p className="text-xs text-cream-dim italic animate-fade-in">
              🗳️ {lang === 'ar'
                ? `صوّتت ضد ${players.find(p => p.id === votedFor)?.name}`
                : `Voted against ${players.find(p => p.id === votedFor)?.name}`}
            </p>
          )}
        </main>

        {/* Chat sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-s border-noir-border shrink-0"
          style={{ height: 'calc(100vh - 4rem)', background: isLight ? 'rgba(242,240,235,0.6)' : 'rgba(12,12,14,0.4)' }}>
          {showMafiaChat ? (
            <MafiaChat key={`mafia-desk-${round}`} mafiaMembers={mafiaMembers} allPlayers={players} className="h-full" lang={lang} />
          ) : (
            <ChatBox className="h-full" />
          )}
        </aside>
      </div>

      {/* ── Mobile Bottom Bar ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-noir-border flex"
        style={{ background: isLight ? 'rgba(242,240,235,0.97)' : 'rgba(12,12,14,0.95)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => setPlayersOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-cream-muted hover:text-white transition-colors">
          <span className="text-lg">👥</span>
          <span className="text-[10px] font-medium">{t('players_list')}</span>
        </button>
        <button onClick={() => setChatOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-cream-muted hover:text-white transition-colors">
          <span className="text-lg">{showMafiaChat ? '🔫' : '💬'}</span>
          <span className="text-[10px] font-medium" style={showMafiaChat ? { color: '#FF6B6B' } : {}}>
            {showMafiaChat ? (lang === 'ar' ? 'المافيا' : 'Mafia') : t('chat')}
          </span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-cream-muted transition-colors">
          <span className="text-lg">{isNight ? '🌙' : '☀️'}</span>
          <span className="text-[10px] font-medium">{phaseLabel}</span>
        </button>
      </div>

      {/* Mobile chat overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col" style={{ background: isLight ? '#F2F0EB' : 'var(--noir-black)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: showMafiaChat ? 'rgba(231,76,60,0.2)' : 'var(--noir-border)' }}>
            <div className="flex items-center gap-2">
              {showMafiaChat && <div className="w-2 h-2 rounded-full" style={{ background: '#E74C3C', boxShadow: '0 0 6px rgba(231,76,60,0.5)' }} />}
              <span className="font-semibold" style={{ color: showMafiaChat ? '#E74C3C' : 'white' }}>
                {showMafiaChat ? (lang === 'ar' ? 'دردشة المافيا' : 'Mafia Chat') : t('chat')}
              </span>
              {showMafiaChat && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full role-mafia">
                  {lang === 'ar' ? 'سري' : 'SECRET'}
                </span>
              )}
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 text-cream-dim hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {showMafiaChat ? (
              <MafiaChat key={`mafia-mob-${round}`} mafiaMembers={mafiaMembers} allPlayers={players} className="h-full" lang={lang} />
            ) : (
              <ChatBox className="h-full" />
            )}
          </div>
        </div>
      )}

      {/* Mobile players drawer */}
      <MobilePlayersDrawer
        open={playersOpen} onClose={() => setPlayersOpen(false)}
        players={players} phase={phase} votedFor={votedFor}
        nightTarget={nightTarget} selfRole={selfRole} onAction={handlePlayerAction}
        t={t} lang={lang} isLight={isLight} isNight={isNight}
      />
    </div>
  )
}
