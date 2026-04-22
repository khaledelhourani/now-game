import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { mockGameHistory, mockAchievements } from '../data/mockData'
import AddFriendButton from '../components/AddFriendButton'

function StatCard({ icon, value, label }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl mb-1.5">{icon}</div>
      <div className="font-black text-2xl text-white">{value}</div>
      <div className="text-xs text-cream-dim mt-0.5 font-medium">{label}</div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="toggle-track shrink-0"
      style={{ background: checked ? 'var(--gold)' : 'var(--noir-border)' }}
    >
      <div className="toggle-thumb" style={{ left: checked ? '21px' : '3px' }} />
    </button>
  )
}

function SettingRow({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-noir-border/50 last:border-0">
      <div>
        <div className="text-sm text-white">{label}</div>
        {sublabel && <div className="text-xs text-cream-dim mt-0.5">{sublabel}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Profile({ setPage, profile }) {
  const { t } = useLang()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [tab, setTab] = useState('stats')
  const [friendStatus, setFriendStatus] = useState('none') // none | sent | friends — demo on profile

  const [privacy, _setPrivacy] = useState(() => {
    try { const v = localStorage.getItem('mafia_privacy'); return v ? JSON.parse(v) : { showOnline: true, showHistory: true, showAchievements: false } }
    catch { return { showOnline: true, showHistory: true, showAchievements: false } }
  })
  const setPrivacy = (fn) => _setPrivacy(prev => {
    const next = typeof fn === 'function' ? fn(prev) : fn
    localStorage.setItem('mafia_privacy', JSON.stringify(next))
    return next
  })

  const [notifs, _setNotifs] = useState(() => {
    try { const v = localStorage.getItem('mafia_notifs'); return v ? JSON.parse(v) : { email: true, gameInvites: true, friendRequests: true } }
    catch { return { email: true, gameInvites: true, friendRequests: true } }
  })
  const setNotifs = (fn) => _setNotifs(prev => {
    const next = typeof fn === 'function' ? fn(prev) : fn
    localStorage.setItem('mafia_notifs', JSON.stringify(next))
    return next
  })

  const xpPct = (profile.xp / profile.xpNext) * 100
  const tabs = [
    { key: 'stats',        label: t('stats'),        icon: '📊' },
    { key: 'history',      label: t('gameHistory'),  icon: '📜' },
    { key: 'achievements', label: t('achievements'), icon: '🏆' },
    { key: 'settings',     label: t('settings'),     icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-noir-black pt-[63px]">
      {/* Profile header */}
      <div className="profile-hero border-b border-noir-border bg-noir-deep">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-5xl border-2 border-gold/30"
                style={{ background: 'var(--noir-surface)', boxShadow: '0 0 24px rgba(229,185,78,0.12)' }}>
                {profile.avatarImage
                  ? <img src={profile.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                  : profile.avatar
                }
              </div>
              <div className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-noir-black"
                style={{ background: 'linear-gradient(135deg,#8A6B20,#E5B94E)', color: '#0C0C0E' }}>
                {profile.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-start">
              <h1 className="font-bold text-2xl text-white mb-1">{profile.displayName}</h1>

              {profile.bio && (
                <p className="text-sm text-cream-muted mb-2 max-w-xs mx-auto sm:mx-0 italic">"{profile.bio}"</p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(229,185,78,0.12)', border: '1px solid rgba(229,185,78,0.3)', color: '#E5B94E' }}>
                  ⭐ {profile.rank}
                </span>
                <span className="text-xs text-cream-dim">{t('memberSince')}: {profile.memberSince}</span>
              </div>

              {/* XP */}
              <div className="max-w-xs mx-auto sm:mx-0 mb-4">
                <div className="flex justify-between text-xs text-cream-dim mb-1.5">
                  <span>{t('level')} {profile.level}</span>
                  <span>{profile.xp} / {profile.xpNext} XP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--noir-border)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${xpPct}%`,
                    background: 'linear-gradient(90deg, #8A6B20, #F5D080)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button onClick={() => setPage('editProfile')} className="btn btn-ghost px-5 py-2 text-sm">
                  ✏️ {t('editProfile')}
                </button>
                <AddFriendButton
                  status={friendStatus}
                  size="sm"
                  onAdd={() => setFriendStatus('sent')}
                  onCancel={() => setFriendStatus('none')}
                  onRemove={() => setFriendStatus('none')}
                />
              </div>
            </div>

            {/* Win rate */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative" style={{ width: 72, height: 72, borderRadius: '50%', boxShadow: '0 0 18px rgba(229,185,78,0.25)' }}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="13" fill="none" stroke={isLight ? '#D5D0C5' : '#2A2A35'} strokeWidth="3" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke={isLight ? '#C8960C' : '#E5B94E'} strokeWidth="3"
                    strokeLinecap="round" strokeDasharray={`${profile.winRate} 100`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-black text-sm text-gold">{profile.winRate}%</span>
                </div>
              </div>
              <span className="text-xs text-cream-dim font-medium">{t('winRate')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky-tabs border-b border-noir-border sticky top-14 z-20"
        style={{ background: 'rgba(12,12,14,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab_ => (
            <button key={tab_.key} onClick={() => setTab(tab_.key)}
              className={`px-5 py-3.5 text-sm font-medium transition-all relative whitespace-nowrap
                ${tab === tab_.key ? 'text-white' : 'text-cream-muted hover:text-white'}`}>
              {tab_.icon} {tab_.label}
              {tab === tab_.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Stats */}
        {tab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
              <StatCard icon="🏆" value={profile.wins}   label={t('wins')} />
              <StatCard icon="💀" value={profile.losses} label={t('losses')} />
              <StatCard icon="🎮" value={profile.played} label={t('played')} />
              <StatCard icon="🔪" value={profile.totalKills} label={t('totalKills')} />
            </div>

            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-white text-sm">{t('stats')}</h3>
              {[
                { label: t('winRate'),        value: `${profile.winRate}%`,  pct: profile.winRate },
                { label: t('survivedNights'), value: profile.survivedNights, pct: Math.min((profile.survivedNights/200)*100, 100) },
                { label: t('totalKills'),     value: profile.totalKills,     pct: Math.min((profile.totalKills/50)*100, 100) },
                { label: t('level'),          value: profile.level,          pct: (profile.level/50)*100 },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-cream-muted">{s.label}</span>
                    <span className="font-semibold text-gold">{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--noir-border)' }}>
                    <div className="h-full rounded-full" style={{
                      width: `${s.pct}%`, background: 'linear-gradient(90deg, #8A6B20, #E5B94E)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-noir-border">
                    {[t('roomName'), t('role'), t('result'), t('players'), t('date')].map(h => (
                      <th key={h} className="px-4 py-3 text-start label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="stagger">
                  {mockGameHistory.map(g => (
                    <tr key={g.id} className="border-b border-noir-border/40 hover:bg-noir-hover transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">{g.room}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold role-${g.role}`}>
                          {t(g.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${g.result === 'win'
                            ? 'text-green-400 bg-[rgba(39,174,96,0.12)] border border-[rgba(39,174,96,0.3)]'
                            : 'text-red-400 bg-[rgba(231,76,60,0.12)] border border-[rgba(231,76,60,0.3)]'}`}>
                          {g.result === 'win' ? '✓ ' + t('win') : '✗ ' + t('loss')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-cream-muted">{g.players}</td>
                      <td className="px-4 py-3 text-xs text-cream-dim">{g.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Achievements */}
        {tab === 'achievements' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
            {mockAchievements.map(ach => (
              <div key={ach.id}
                className={`card card-hover p-4 text-center transition-all
                  ${ach.unlocked ? 'border-[rgba(229,185,78,0.25)]' : 'opacity-50'}`}
                style={ach.unlocked ? { boxShadow: '0 0 16px rgba(229,185,78,0.06)' } : {}}>
                <div className={`text-4xl mb-2 ${!ach.unlocked ? 'grayscale opacity-40' : ''}`}>{ach.icon}</div>
                <div className={`text-sm font-semibold mb-1 ${ach.unlocked ? 'text-gold' : 'text-cream-dim'}`}>
                  {t(ach.key)}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--noir-border)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(ach.progress / ach.max) * 100}%`,
                    background: ach.unlocked ? 'linear-gradient(90deg,#8A6B20,#E5B94E)' : isLight ? '#C5C0B5' : '#3A3A45',
                  }} />
                </div>
                <div className="text-xs text-cream-dim">{ach.progress}/{ach.max}</div>
                <span className={`text-[10px] font-semibold uppercase tracking-wide
                  ${ach.unlocked ? 'text-gold/70' : 'text-cream-dim/50'}`}>
                  {ach.unlocked ? '✓ ' + t('unlocked') : '🔒 ' + t('locked')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="space-y-4 animate-slide-up">

            {/* ── الخصوصية ── */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-noir-border" style={{ background: 'rgba(41,128,185,0.05)' }}>
                <span className="label">🔒 {t('privacySettings')}</span>
              </div>
              <div className="px-5">
                <SettingRow
                  label={t('showOnlineStatus')}
                  sublabel={t('showOnlineStatusDesc')}
                >
                  <Toggle checked={privacy.showOnline} onChange={v => setPrivacy(p => ({ ...p, showOnline: v }))} />
                </SettingRow>
                <SettingRow
                  label={t('showGameHistory')}
                  sublabel={t('showGameHistoryDesc')}
                >
                  <Toggle checked={privacy.showHistory} onChange={v => setPrivacy(p => ({ ...p, showHistory: v }))} />
                </SettingRow>
                <SettingRow
                  label={t('showAchievements')}
                  sublabel={t('showAchievementsDesc')}
                >
                  <Toggle checked={privacy.showAchievements} onChange={v => setPrivacy(p => ({ ...p, showAchievements: v }))} />
                </SettingRow>
              </div>
            </div>

            {/* ── الإشعارات ── */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-noir-border" style={{ background: 'rgba(22,160,133,0.05)' }}>
                <span className="label">🔔 {t('notifications')}</span>
              </div>
              <div className="px-5">
                <SettingRow
                  label={t('emailNotifications')}
                  sublabel={t('emailNotificationsDesc')}
                >
                  <Toggle checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
                </SettingRow>
                <SettingRow
                  label={t('gameInvites')}
                  sublabel={t('gameInvitesDesc')}
                >
                  <Toggle checked={notifs.gameInvites} onChange={v => setNotifs(n => ({ ...n, gameInvites: v }))} />
                </SettingRow>
                <SettingRow
                  label={t('friendRequests')}
                  sublabel={t('friendRequestsDesc')}
                >
                  <Toggle checked={notifs.friendRequests} onChange={v => setNotifs(n => ({ ...n, friendRequests: v }))} />
                </SettingRow>
              </div>
            </div>

            {/* ── الأمان ── */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-noir-border" style={{ background: 'rgba(192,57,43,0.05)' }}>
                <span className="label">🛡️ {t('security')}</span>
              </div>
              <div className="divide-y divide-noir-border/50">
                <button className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-cream-muted hover:text-white hover:bg-noir-hover transition-all group">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: 'rgba(229,185,78,0.08)' }}>🔑</span>
                    {t('changePassword')}
                  </span>
                  <span className="text-cream-dim group-hover:text-gold transition-colors">›</span>
                </button>
                <button className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-cream-muted hover:text-white hover:bg-noir-hover transition-all group">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: 'rgba(41,128,185,0.08)' }}>📱</span>
                    {t('twoFactor')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(231,76,60,0.1)', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.2)' }}>
                    {t('off')}
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-cream-muted hover:text-white hover:bg-noir-hover transition-all group">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: 'rgba(229,185,78,0.08)' }}>📋</span>
                    {t('loginActivity')}
                  </span>
                  <span className="text-cream-dim group-hover:text-gold transition-colors">›</span>
                </button>
                <button className="w-full flex items-center justify-between px-5 py-3.5 text-sm hover:bg-noir-hover transition-all group"
                  style={{ color: '#E74C3C' }}>
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ background: 'rgba(231,76,60,0.08)' }}>🚪</span>
                    {t('logout')}
                  </span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">›</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
