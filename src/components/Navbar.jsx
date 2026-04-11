import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { mockProfile } from '../data/mockData'

export default function Navbar({ currentPage, setPage }) {
  const { t, toggleLang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const links = [
    { key: 'lobby',   label: t('lobby'),   icon: '🚪' },
    { key: 'profile', label: t('profile'), icon: '👤' },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-noir-border"
      style={{ background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => setPage('landing')} className="flex items-center gap-2 shrink-0 group">
          <span className="text-xl">🎭</span>
          <span className="font-black text-base text-white group-hover:text-gold transition-colors tracking-wide">
            MAFIA
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.key} onClick={() => setPage(l.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${currentPage === l.key
                  ? 'bg-noir-surface text-white'
                  : 'text-cream-muted hover:text-white hover:bg-noir-hover'}`}>
              {l.icon} {l.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={toggleLang}
            className="hidden sm:flex btn btn-ghost px-3 py-1.5 text-xs">
            {t('language')}
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-noir-border hover:border-gold/40 transition-all">
              <span className="text-lg">{mockProfile.avatar}</span>
              <span className="hidden sm:block text-sm text-cream-muted font-medium">{mockProfile.username}</span>
              <svg className={`w-3 h-3 text-cream-dim transition-transform ${dropOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropOpen && (
              <div className="absolute end-0 top-full mt-1.5 w-44 card rounded-xl shadow-2xl animate-slide-down overflow-hidden z-50">
                <button onClick={() => { setPage('profile'); setDropOpen(false) }}
                  className="w-full text-start px-4 py-2.5 text-sm text-cream-muted hover:bg-noir-hover hover:text-white transition-colors">
                  👤 {t('profile')}
                </button>
                <button onClick={() => { setPage('settings'); setDropOpen(false) }}
                  className="w-full text-start px-4 py-2.5 text-sm text-cream-muted hover:bg-noir-hover hover:text-white transition-colors">
                  ⚙️ {t('gameSettings')}
                </button>
                <div className="border-t border-noir-border" />
                <button onClick={() => { setPage('landing'); setDropOpen(false) }}
                  className="w-full text-start px-4 py-2.5 text-sm text-crimson-bright hover:bg-noir-hover transition-colors">
                  🚪 {t('logout')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 text-cream-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-noir-border bg-noir-deep animate-slide-down">
          {links.map(l => (
            <button key={l.key} onClick={() => { setPage(l.key); setMenuOpen(false) }}
              className={`w-full text-start px-5 py-3 text-sm font-medium transition-colors
                ${currentPage === l.key ? 'text-gold' : 'text-cream-muted hover:text-white'}`}>
              {l.icon} {l.label}
            </button>
          ))}
          <button onClick={() => { toggleLang(); setMenuOpen(false) }}
            className="w-full text-start px-5 py-3 text-sm text-cream-dim hover:text-white transition-colors border-t border-noir-border">
            🌐 {t('language')}
          </button>
        </div>
      )}
    </nav>
  )
}
