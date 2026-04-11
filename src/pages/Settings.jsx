import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

/* ── helpers ── */
function SectionCard({ icon, title, accent = 'var(--gold)', children }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-noir-border flex items-center gap-2"
        style={{ background: 'var(--noir-deep)' }}>
        <span>{icon}</span>
        <span className="label" style={{ color: accent }}>{title}</span>
      </div>
      <div className="divide-y divide-noir-border/50">
        {children}
      </div>
    </div>
  )
}

function ToggleRow({ label, sublabel, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {sublabel && <div className="text-xs text-cream-dim mt-0.5">{sublabel}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className="toggle-track shrink-0"
        style={{ background: checked ? 'var(--gold)' : 'var(--noir-border)' }}
      >
        <div className="toggle-thumb" style={{ left: checked ? '21px' : '3px' }} />
      </button>
    </div>
  )
}

function SliderRow({ label, sublabel, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="px-5 py-4">
      <div className="flex justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          {sublabel && <div className="text-xs text-cream-dim mt-0.5">{sublabel}</div>}
        </div>
        <span className="text-sm font-bold text-gold tabular-nums">{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: 'var(--gold)' }}
      />
      <div className="flex justify-between text-[10px] text-cream-dim mt-1">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  )
}

function SelectRow({ label, sublabel, options, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {sublabel && <div className="text-xs text-cream-dim mt-0.5">{sublabel}</div>}
      </div>
      <div className="flex rounded-lg overflow-hidden border border-noir-border shrink-0">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 text-xs font-semibold transition-all"
            style={value === opt.value
              ? { background: 'var(--gold)', color: '#0C0C0E' }
              : { background: 'var(--noir-surface)', color: 'var(--cream-muted)' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── main ── */
export default function Settings({ setPage }) {
  const { t, lang, toggleLang } = useLang()
  const { theme, setTheme } = useTheme()

  const [sound, setSound] = useState({
    effects: true,
    music: false,
    volume: 70,
    musicVolume: 40,
  })

  const [gameplay, setGameplay] = useState({
    autoReady: false,
    confirmVote: true,
    showRoleAfterDeath: true,
    showChatDefault: true,
    showPlayerCount: true,
    animations: true,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--noir-black)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setPage('profile')}
            className="flex items-center gap-1.5 text-xs text-cream-dim hover:text-gold transition-colors mb-4"
          >
            ‹ {t('backToProfile')}
          </button>
          <h1 className="font-black text-2xl text-white">{t('gameSettings')}</h1>
          <p className="text-sm text-cream-dim mt-1">{t('gameSettingsDesc')}</p>
        </div>

        <div className="space-y-4">

          {/* ── المظهر ── */}
          <SectionCard icon="🎨" title={t('appearance')} accent="#E5B94E">
            <div className="px-5 py-5">
              <div className="text-sm font-medium text-white mb-3">{t('theme')}</div>
              <div className="grid grid-cols-2 gap-3">

                {/* Dark */}
                <button
                  onClick={() => setTheme('dark')}
                  className="relative rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: theme === 'dark' ? 'var(--gold)' : 'var(--noir-border)',
                    boxShadow: theme === 'dark' ? '0 0 16px rgba(229,185,78,0.2)' : 'none',
                  }}
                >
                  {/* preview */}
                  <div className="h-20 p-2.5" style={{ background: '#0C0C0E' }}>
                    <div className="h-2 w-16 rounded mb-1.5" style={{ background: '#2A2A35' }} />
                    <div className="h-8 rounded" style={{ background: '#17171C', border: '1px solid #2A2A35' }}>
                      <div className="h-2 w-10 rounded m-2" style={{ background: '#E5B94E', opacity: 0.7 }} />
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 flex items-center justify-between"
                    style={{ background: '#111115', borderTop: '1px solid #2A2A35' }}
                  >
                    <span className="text-xs font-semibold" style={{ color: theme === 'dark' ? '#E5B94E' : '#6B6B80' }}>
                      🌑 {t('darkTheme')}
                    </span>
                    {theme === 'dark' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(229,185,78,0.15)', color: '#E5B94E' }}>
                        ✓
                      </span>
                    )}
                  </div>
                </button>

                {/* Light */}
                <button
                  onClick={() => setTheme('light')}
                  className="relative rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: theme === 'light' ? 'var(--gold)' : 'var(--noir-border)',
                    boxShadow: theme === 'light' ? '0 0 16px rgba(229,185,78,0.2)' : 'none',
                  }}
                >
                  {/* preview */}
                  <div className="h-20 p-2.5" style={{ background: '#F2F0EB' }}>
                    <div className="h-2 w-16 rounded mb-1.5" style={{ background: '#D5D0C5' }} />
                    <div className="h-8 rounded" style={{ background: '#FFFFFF', border: '1px solid #D5D0C5' }}>
                      <div className="h-2 w-10 rounded m-2" style={{ background: '#C8960C', opacity: 0.8 }} />
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 flex items-center justify-between"
                    style={{ background: '#E8E5DE', borderTop: '1px solid #D5D0C5' }}
                  >
                    <span className="text-xs font-semibold" style={{ color: theme === 'light' ? '#8A6B20' : '#888075' }}>
                      ☀️ {t('lightTheme')}
                    </span>
                    {theme === 'light' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(138,107,32,0.15)', color: '#8A6B20' }}>
                        ✓
                      </span>
                    )}
                  </div>
                </button>

              </div>
            </div>
          </SectionCard>

          {/* ── اللغة ── */}
          <SectionCard icon="🌐" title={t('languageSettings')} accent="#2980B9">
            <SelectRow
              label={t('language')}
              sublabel={t('languageDesc')}
              options={[
                { label: 'العربية', value: 'ar' },
                { label: 'English', value: 'en' },
              ]}
              value={lang}
              onChange={val => { if (val !== lang) toggleLang() }}
            />
          </SectionCard>

          {/* ── الصوت ── */}
          <SectionCard icon="🔊" title={t('soundSettings')} accent="#16A085">
            <ToggleRow
              label={t('soundEffects')}
              sublabel={t('soundEffectsDesc')}
              checked={sound.effects}
              onChange={v => setSound(s => ({ ...s, effects: v }))}
            />
            <SliderRow
              label={t('effectsVolume')}
              value={sound.volume}
              onChange={v => setSound(s => ({ ...s, volume: v }))}
            />
            <ToggleRow
              label={t('backgroundMusic')}
              sublabel={t('backgroundMusicDesc')}
              checked={sound.music}
              onChange={v => setSound(s => ({ ...s, music: v }))}
            />
            <SliderRow
              label={t('musicVolume')}
              value={sound.musicVolume}
              onChange={v => setSound(s => ({ ...s, musicVolume: v }))}
            />
          </SectionCard>

          {/* ── إعدادات اللعبة ── */}
          <SectionCard icon="🎮" title={t('gameplaySettings')} accent="#C0392B">
            <ToggleRow
              label={t('autoReady')}
              sublabel={t('autoReadyDesc')}
              checked={gameplay.autoReady}
              onChange={v => setGameplay(g => ({ ...g, autoReady: v }))}
            />
            <ToggleRow
              label={t('confirmVote')}
              sublabel={t('confirmVoteDesc')}
              checked={gameplay.confirmVote}
              onChange={v => setGameplay(g => ({ ...g, confirmVote: v }))}
            />
            <ToggleRow
              label={t('showRoleAfterDeath')}
              sublabel={t('showRoleAfterDeathDesc')}
              checked={gameplay.showRoleAfterDeath}
              onChange={v => setGameplay(g => ({ ...g, showRoleAfterDeath: v }))}
            />
            <ToggleRow
              label={t('showChatDefault')}
              sublabel={t('showChatDefaultDesc')}
              checked={gameplay.showChatDefault}
              onChange={v => setGameplay(g => ({ ...g, showChatDefault: v }))}
            />
            <ToggleRow
              label={t('enableAnimations')}
              sublabel={t('enableAnimationsDesc')}
              checked={gameplay.animations}
              onChange={v => setGameplay(g => ({ ...g, animations: v }))}
            />
          </SectionCard>

          {/* ── إعادة الضبط ── */}
          <SectionCard icon="⚠️" title={t('resetSettings')} accent="#E74C3C">
            <div className="px-5 py-4">
              <p className="text-sm text-cream-dim mb-4">{t('resetSettingsDesc')}</p>
              <button
                onClick={() => {
                  setTheme('dark')
                  setSound({ effects: true, music: false, volume: 70, musicVolume: 40 })
                  setGameplay({ autoReady: false, confirmVote: true, showRoleAfterDeath: true, showChatDefault: true, showPlayerCount: true, animations: true })
                }}
                className="btn btn-danger px-5 py-2 text-sm w-full sm:w-auto"
              >
                🔄 {t('resetToDefault')}
              </button>
            </div>
          </SectionCard>

        </div>

        {/* Save bar */}
        <div className="sticky bottom-4 mt-6">
          <div
            className="card px-5 py-3.5 flex items-center justify-between"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          >
            <span className="text-sm text-cream-dim">{t('settingsAutoSave')}</span>
            <button
              onClick={handleSave}
              className="btn btn-gold px-6 py-2 text-sm"
            >
              {saved ? `✓ ${t('saved')}` : t('saveChanges')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
