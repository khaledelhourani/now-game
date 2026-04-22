import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { mockProfile, mockStats } from '../data/mockData'

export default function Navbar({ currentPage, setPage }) {
  const { t, lang, toggleLang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDrop, setProfileDrop] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [coins] = useState(12750)
  const [notifCount] = useState(3)
  const profileRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileDrop(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const tabs = [
    { key: 'lobby', label: t('lobby'), Icon: RoomsIcon },
    { key: 'friends', label: t('friends'), Icon: FriendsIcon },
    { key: 'chat', label: t('chats'), Icon: ChatTabIcon },
    { key: 'profile', label: t('profile'), Icon: UserIcon },
    { key: 'settings', label: t('gameSettings'), Icon: GearIcon },
  ]

  const xpPct = Math.round((mockProfile.xp / mockProfile.xpNext) * 100)

  return (
    <div className="gn">
      {/* ════════════ TOP NAVBAR ════════════ */}
      <nav className={`gn__bar ${scrolled ? 'gn--scrolled' : ''}`}>
        <div className="gn__shine" />
        <div className="gn__inner">

          {/* ── LEFT ── */}
          <div className="gn__left">
            <button className="gn__logo" onClick={() => setPage('landing')}>
              <span className="gn__logo-emoji">🎭</span>
              <span className="gn__logo-text">
                {lang === 'ar' ? 'المافيا' : 'MAFIA'}
              </span>
            </button>

            <span className="gn__sep" />

            {/* Profile chip — desktop only */}
            <div className="gn__profile-wrap" ref={profileRef}>
              <button
                className={`gn__chip ${profileDrop ? 'gn__chip--open' : ''}`}
                onClick={() => setProfileDrop(v => !v)}
              >
                <span className="gn__avatar">
                  <span className="gn__avatar-face">{mockProfile.avatar}</span>
                  <span className="gn__avatar-lvl">{mockProfile.level}</span>
                </span>
                <span className="gn__chip-info">
                  <span className="gn__chip-name">{mockProfile.username}</span>
                  <span className="gn__chip-rank">{mockProfile.rank}</span>
                </span>
                <svg className={`gn__chevron ${profileDrop ? 'gn__chevron--up' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>

              {profileDrop && (
                <div className="gn__drop">
                  <div className="gn__drop-header">
                    <span className="gn__drop-avatar">{mockProfile.avatar}</span>
                    <div>
                      <div className="gn__drop-name">{mockProfile.displayName}</div>
                      <div className="gn__drop-meta">Lv.{mockProfile.level} · {mockProfile.rank}</div>
                    </div>
                  </div>
                  <div className="gn__drop-xp">
                    <div className="gn__drop-xp-row">
                      <span>XP</span>
                      <span>{mockProfile.xp.toLocaleString()} / {mockProfile.xpNext.toLocaleString()}</span>
                    </div>
                    <div className="gn__xp-track"><div className="gn__xp-fill" style={{ width: `${xpPct}%` }} /></div>
                  </div>
                  <div className="gn__drop-stats">
                    <div className="gn__stat">
                      <span className="gn__stat-val">{mockProfile.wins}</span>
                      <span className="gn__stat-label">{t('wins')}</span>
                    </div>
                    <div className="gn__stat">
                      <span className="gn__stat-val gn__stat-val--green">{mockProfile.winRate}%</span>
                      <span className="gn__stat-label">{t('winRate')}</span>
                    </div>
                    <div className="gn__stat">
                      <span className="gn__stat-val">{mockProfile.played}</span>
                      <span className="gn__stat-label">{t('played')}</span>
                    </div>
                  </div>
                  <div className="gn__drop-divider" />
                  <button className="gn__drop-item" onClick={() => { setPage('profile'); setProfileDrop(false) }}>
                    <UserIcon size={15} /> {t('profile')}
                  </button>
                  <button className="gn__drop-item" onClick={() => { setPage('settings'); setProfileDrop(false) }}>
                    <GearIcon size={15} /> {t('gameSettings')}
                  </button>
                  <div className="gn__drop-divider" />
                  <button className="gn__drop-item gn__drop-item--danger" onClick={() => { setPage('landing'); setProfileDrop(false) }}>
                    <LogoutIcon size={15} /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── CENTER — desktop tabs ── */}
          <div className="gn__tabs">
            {tabs.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`gn__tab ${currentPage === key ? 'gn__tab--active' : ''}`}
                onClick={() => setPage(key)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* ── RIGHT ── */}
          <div className="gn__right">


            {/* Coins — desktop */}
            <div className="gn__coins">
              <span className="gn__coins-icon">💰</span>
              <span className="gn__coins-val">{coins.toLocaleString()}</span>
              <button className="gn__coins-add" aria-label="Add coins">+</button>
            </div>

            {/* Mobile: coins mini — before bell on mobile */}
            <div className="gn__coins-mini">
              <span>💰</span>
              <span>{coins.toLocaleString()}</span>
              <button className="gn__coins-add" aria-label="Add coins">+</button>
            </div>

            {/* Bell */}
            <button className="gn__icon-btn" aria-label="Notifications">
              <BellIcon />
              {notifCount > 0 && <span className="gn__badge">{notifCount}</span>}
            </button>

            {/* Online — desktop */}
            <div className="gn__online">
              <span className="gn__online-dot" />
              <span className="gn__online-num">{mockStats.playersOnline.toLocaleString()}</span>
            </div>

            {/* Language — desktop */}
            <button className="gn__lang" onClick={toggleLang} aria-label="Switch language">
              <span className="gn__lang-track">
                <span className={`gn__lang-thumb ${lang === 'ar' ? 'gn__lang-thumb--ar' : ''}`} />
                <span className={`gn__lang-opt ${lang === 'en' ? 'gn__lang-opt--on' : ''}`}>EN</span>
                <span className={`gn__lang-opt ${lang === 'ar' ? 'gn__lang-opt--on' : ''}`}>AR</span>
              </span>
            </button>

            {/* Burger / Close — mobile */}
            {menuOpen ? (
              <button className="gn-mob__close" onClick={() => setMenuOpen(false)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            ) : (
              <button className="gn__burger" onClick={() => setMenuOpen(true)} aria-label="Menu">
                <span /><span /><span />
              </button>
            )}
          </div>
        </div>
        <div className="gn__border" />
      </nav>

      {/* ════════════ MOBILE DRAWER ════════════ */}
      <div className={`gn-mob__overlay ${menuOpen ? 'gn-mob__overlay--open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className={`gn-mob ${menuOpen ? 'gn-mob--open' : ''}`} onClick={e => e.stopPropagation()}>

          {/* Profile card */}
          <div className="gn-mob__profile">
            <div className="gn-mob__profile-top">
              <span className="gn__avatar gn__avatar--lg">
                <span className="gn__avatar-face gn__avatar-face--lg">{mockProfile.avatar}</span>
                <span className="gn__avatar-lvl gn__avatar-lvl--lg">{mockProfile.level}</span>
              </span>
              <div className="gn-mob__profile-info">
                <div className="gn-mob__name">{mockProfile.displayName}</div>
                <div className="gn-mob__rank">{mockProfile.rank}</div>
              </div>
            </div>

            {/* XP bar */}
            <div className="gn-mob__xp">
              <div className="gn-mob__xp-labels">
                <span>XP</span>
                <span>{mockProfile.xp.toLocaleString()} / {mockProfile.xpNext.toLocaleString()}</span>
              </div>
              <div className="gn__xp-track"><div className="gn__xp-fill" style={{ width: `${xpPct}%` }} /></div>
            </div>

            {/* Stats + coins row */}
            <div className="gn-mob__stats-row">
              <div className="gn-mob__stat-box">
                <span className="gn-mob__stat-num">{mockProfile.wins}</span>
                <span className="gn-mob__stat-lbl">{t('wins')}</span>
              </div>
              <div className="gn-mob__stat-box">
                <span className="gn-mob__stat-num gn-mob__stat-num--green">{mockProfile.winRate}%</span>
                <span className="gn-mob__stat-lbl">{t('winRate')}</span>
              </div>
              <div className="gn-mob__stat-box">
                <span className="gn-mob__stat-num">{mockProfile.played}</span>
                <span className="gn-mob__stat-lbl">{t('played')}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="gn-mob__section-title">{t('lobby')}</div>
          <div className="gn-mob__links">
            {tabs.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`gn-mob__link ${currentPage === key ? 'gn-mob__link--active' : ''}`}
                onClick={() => { setPage(key); setMenuOpen(false) }}
              >
                <span className="gn-mob__link-icon"><Icon size={20} /></span>
                <span className="gn-mob__link-text">{label}</span>
                {currentPage === key && <span className="gn-mob__link-dot" />}
              </button>
            ))}
          </div>

          <div className="gn-mob__divider" />

          {/* Language toggle */}
          <div className="gn-mob__lang-row">
            <GlobeIcon size={18} />
            <span className="gn-mob__lang-label">{t('languageSettings')}</span>
            <button className="gn-mob__lang-toggle" onClick={toggleLang}>
              <span className="gn-mob__lang-track">
                <span className={`gn__lang-thumb ${lang === 'ar' ? 'gn__lang-thumb--ar' : ''}`} />
                <span className={`gn__lang-opt ${lang === 'en' ? 'gn__lang-opt--on' : ''}`}>EN</span>
                <span className={`gn__lang-opt ${lang === 'ar' ? 'gn__lang-opt--on' : ''}`}>AR</span>
              </span>
            </button>
          </div>

          {/* Online count */}
          <div className="gn-mob__online-row">
            <span className="gn__online-dot" />
            <span className="gn-mob__online-text">
              {mockStats.playersOnline.toLocaleString()} {t('playersOnline')}
            </span>
          </div>

          <div className="gn-mob__divider" />

          {/* Logout */}
          <button className="gn-mob__logout" onClick={() => { setPage('landing'); setMenuOpen(false) }}>
            <LogoutIcon size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* ════════════ MOBILE BOTTOM TAB BAR ════════════ */}
      <div className="gn-btm">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`gn-btm__tab ${currentPage === key ? 'gn-btm__tab--active' : ''}`}
            onClick={() => setPage(key)}
          >
            <span className="gn-btm__icon"><Icon size={20} /></span>
            <span className="gn-btm__label">{label}</span>
            {currentPage === key && <span className="gn-btm__indicator" />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Icons ── */
function RoomsIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
}
function UserIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /></svg>
}
function GearIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
}
function BellIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
}
function LogoutIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
}
function GlobeIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
}
function FriendsIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
}
function ChatTabIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
}
