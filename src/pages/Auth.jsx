import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Auth({ setPage }) {
  const { t, toggleLang, lang } = useLang()
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const set = f => v => setForm(p => ({ ...p, [f]: v }))

  const submit = e => {
    e.preventDefault()
    setError('')
    if (tab === 'register' && form.password !== form.confirm) {
      setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }
    setLoading(true)
    setTimeout(() => { setLoading(false); setPage('lobby') }, 1000)
  }

  return (
    <div className="min-h-screen bg-noir-black flex items-center justify-center px-4 py-10">
      {/* bg glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(229,185,78,0.05) 0%, transparent 100%)' }} />

      <div className="relative w-full max-w-sm">
        {/* Back */}
        <button onClick={() => setPage('landing')}
          className="flex items-center gap-1.5 text-sm text-cream-muted hover:text-white mb-6 transition-colors">
          <svg className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {lang === 'ar' ? 'الرئيسية' : 'Back'}
        </button>

        <div className="card p-7 animate-slide-up" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
          {/* Logo */}
          <div className="text-center mb-6">
            <span className="text-4xl">🎭</span>
            <h1 className="font-black text-2xl text-white mt-2">
              {tab === 'login' ? t('welcomeBack') : t('joinFamily')}
            </h1>
            <p className="text-sm text-cream-muted mt-1">
              {tab === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 p-1 rounded-lg" style={{ background: 'var(--noir-surface)' }}>
            {['login', 'register'].map(k => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200
                  ${tab === k ? 'bg-noir-card text-white shadow-sm' : 'text-cream-muted hover:text-cream'}`}>
                {k === 'login' ? t('login') : t('register')}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label mb-1.5 block">{t('username')}</label>
              <input className="field" placeholder={lang === 'ar' ? 'اسمك في اللعبة...' : 'Your game alias...'}
                value={form.username} onChange={e => set('username')(e.target.value)} required />
            </div>

            {/* Email (register only) */}
            {tab === 'register' && (
              <div className="animate-slide-down">
                <label className="label mb-1.5 block">{t('email')}</label>
                <input type="email" className="field" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email')(e.target.value)} required />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="label mb-1.5 block">{t('password')}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="field pe-10"
                  placeholder="••••••••" value={form.password}
                  onChange={e => set('password')(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream transition-colors">
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Confirm password */}
            {tab === 'register' && (
              <div className="animate-slide-down">
                <label className="label mb-1.5 block">{t('confirmPassword')}</label>
                <input type="password" className="field" placeholder="••••••••"
                  value={form.confirm} onChange={e => set('confirm')(e.target.value)} />
              </div>
            )}

            {tab === 'login' && (
              <div className="text-end">
                <button type="button" className="text-xs text-gold hover:text-gold-light transition-colors">
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 text-center py-1">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="btn btn-gold w-full py-3 font-bold text-sm mt-1">
              {loading
                ? <span className="flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {lang === 'ar' ? 'جارٍ...' : 'Loading...'}
                  </span>
                : tab === 'login' ? t('loginBtn') : t('registerBtn')
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-noir-border" />
            <span className="text-xs text-cream-dim">{t('orContinue')}</span>
            <div className="flex-1 h-px bg-noir-border" />
          </div>

          <button onClick={() => setPage('lobby')} className="btn btn-ghost w-full py-2.5 text-sm">
            👤 {t('guest')}
          </button>

          <p className="text-center mt-4 text-sm text-cream-muted">
            {tab === 'login' ? t('noAccount') : t('haveAccount')}{' '}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="text-gold hover:text-gold-light transition-colors font-semibold">
              {tab === 'login' ? t('signUp') : t('signIn')}
            </button>
          </p>
        </div>

        {/* Lang toggle */}
        <div className="text-center mt-4">
          <button onClick={toggleLang} className="text-xs text-cream-dim hover:text-gold transition-colors">
            {t('language')}
          </button>
        </div>
      </div>
    </div>
  )
}
