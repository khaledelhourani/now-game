import { useState } from 'react'
import Modal from './Modal'
import { useLang } from '../context/LanguageContext'

function CounterInput({ label, icon, roleClass, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ background: 'var(--noir-surface)' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{icon}</span>
        <div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleClass}`}>{label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-colors disabled:opacity-30"
          style={{ background: 'var(--noir-border)', color: 'var(--cream)' }}
        >−</button>
        <span className="w-6 text-center font-bold text-white text-sm">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-colors disabled:opacity-30"
          style={{ background: 'var(--noir-border)', color: 'var(--cream)' }}
        >+</button>
      </div>
    </div>
  )
}

export default function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const { t, lang } = useLang()

  const [form, setForm] = useState({
    name: '',
    isPrivate: false,
    password: '',
    mode: 'classic',
    discussionTime: 60,
    maxPlayers: 10,
  })

  const [roles, setRoles] = useState({
    mafia: 2,
    detective: 1,
    doctor: 1,
  })

  const totalRoles = roles.mafia + roles.detective + roles.doctor
  const citizens = Math.max(0, form.maxPlayers - totalRoles)
  const isValid = form.name.trim() && citizens >= 1

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setR = (k, v) => setRoles(p => ({ ...p, [k]: v }))

  const maxForRole = (role) => {
    const others = totalRoles - roles[role]
    return Math.max(roles[role], form.maxPlayers - others - 1) // at least 1 citizen
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!isValid) return
    onCreate({ ...form, roles, citizens })
    onClose()
    setForm({ name: '', isPrivate: false, password: '', mode: 'classic', discussionTime: 60, maxPlayers: 10 })
    setRoles({ mafia: 2, detective: 1, doctor: 1 })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('createRoom')}>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Room name */}
        <div>
          <label className="label mb-1.5 block">{t('roomName')}</label>
          <input className="field" required
            placeholder={lang === 'ar' ? 'اسم الغرفة...' : 'Room name...'}
            value={form.name} onChange={e => setF('name', e.target.value)} />
        </div>

        {/* Max players */}
        <div>
          <label className="label mb-2 block">{t('maxPlayers')} — {form.maxPlayers}</label>
          <div className="flex gap-2 flex-wrap">
            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(n => (
              <button key={n} type="button"
                onClick={() => setF('maxPlayers', n)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all
                  ${form.maxPlayers === n
                    ? 'border-gold bg-[rgba(229,185,78,0.12)] text-gold'
                    : 'border-noir-border text-cream-muted hover:border-gold/40 hover:text-cream'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Role counts */}
        <div>
          <label className="label mb-2 block">
            {lang === 'ar' ? 'توزيع الأدوار' : 'Role Distribution'}
          </label>
          <div className="space-y-2">
            <CounterInput
              label={t('mafia')} icon="🔫" roleClass="role-mafia"
              value={roles.mafia} min={1} max={maxForRole('mafia')}
              onChange={v => setR('mafia', v)}
            />
            <CounterInput
              label={t('detective')} icon="👮" roleClass="role-detective"
              value={roles.detective} min={0} max={maxForRole('detective')}
              onChange={v => setR('detective', v)}
            />
            <CounterInput
              label={t('doctor')} icon="💊" roleClass="role-doctor"
              value={roles.doctor} min={0} max={maxForRole('doctor')}
              onChange={v => setR('doctor', v)}
            />
            {/* Citizens (auto) */}
            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-dashed"
              style={{ borderColor: 'var(--noir-border)', background: 'rgba(39,174,96,0.05)' }}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👤</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold role-citizen">{t('citizen')}</span>
                <span className="text-xs text-cream-dim">{lang === 'ar' ? '(تلقائي)' : '(auto)'}</span>
              </div>
              <span className="font-bold text-white text-sm w-6 text-center">{citizens}</span>
            </div>
          </div>

          {/* Summary bar */}
          <div className="mt-3 p-3 rounded-lg flex items-center justify-between"
            style={{ background: 'var(--noir-surface)' }}>
            <div className="flex gap-3 text-xs">
              <span className="text-red-400">🔫 ×{roles.mafia}</span>
              <span className="text-blue-400">👮 ×{roles.detective}</span>
              <span className="text-teal-400">💊 ×{roles.doctor}</span>
              <span className="text-green-400">👤 ×{citizens}</span>
            </div>
            <span className="text-xs font-bold text-white">{form.maxPlayers} {t('players')}</span>
          </div>

          {citizens < 1 && (
            <p className="text-xs text-red-400 mt-1.5">
              {lang === 'ar' ? '⚠ يجب أن يكون هناك مواطن واحد على الأقل' : '⚠ At least 1 citizen required'}
            </p>
          )}
        </div>

        {/* Game mode */}
        <div>
          <label className="label mb-2 block">{t('gameMode')}</label>
          <div className="flex gap-2">
            {['classic', 'advanced'].map(m => (
              <button key={m} type="button" onClick={() => setF('mode', m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all
                  ${form.mode === m
                    ? 'border-gold bg-[rgba(229,185,78,0.12)] text-gold'
                    : 'border-noir-border text-cream-muted hover:border-gold/40'}`}>
                {m === 'classic' ? t('classic') : t('advanced')}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion time */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="label">{t('timeLimit')}</label>
            <span className="text-sm font-bold text-gold">{form.discussionTime}s</span>
          </div>
          <input type="range" min="30" max="180" step="15" className="w-full"
            value={form.discussionTime} onChange={e => setF('discussionTime', +e.target.value)} />
          <div className="flex justify-between text-xs text-cream-dim mt-1">
            <span>30s</span><span>180s</span>
          </div>
        </div>

        {/* Private toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-cream-muted">{t('privateRoom')}</span>
          <button type="button" onClick={() => setF('isPrivate', !form.isPrivate)}
            className="toggle-track" style={{ background: form.isPrivate ? 'var(--gold)' : 'var(--noir-border)' }}>
            <span className="toggle-thumb" style={{ left: form.isPrivate ? '21px' : '3px' }} />
          </button>
        </div>

        {form.isPrivate && (
          <div className="animate-slide-down">
            <label className="label mb-1.5 block">{t('roomPassword')}</label>
            <input type="password" className="field" placeholder="••••••••"
              value={form.password} onChange={e => setF('password', e.target.value)} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1 py-2.5 text-sm">
            {t('cancel')}
          </button>
          <button type="submit" disabled={!isValid} className="btn btn-gold flex-1 py-2.5 text-sm font-bold disabled:opacity-40">
            {t('create')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
