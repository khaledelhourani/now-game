import { useState, useRef } from 'react'
import { useLang } from '../context/LanguageContext'

const AVATARS = [
  '🎩','😈','🔫','🌹','🃏','🎭','💎','🥃',
  '🐺','🦅','🌑','🩸','🗡️','👁️','🎯','💀',
  '🔪','🕵️','🧠','🎲','🦁','🐍','🌪️','⚡',
]

const ROLES = ['mafia', 'citizen', 'detective', 'doctor']

export default function EditProfile({ setPage, profile, onSave }) {
  const { t } = useLang()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    displayName: profile.displayName,
    bio: profile.bio || '',
    avatar: profile.avatar,
    avatarImage: profile.avatarImage || null,
    favoriteRole: profile.favoriteRole,
    email: profile.email,
  })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function handleChange(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      handleChange('avatarImage', e.target.result)
      setShowEmojiPicker(false)
    }
    reader.readAsDataURL(file)
  }

  function handleFileInput(e) {
    handleImageFile(e.target.files[0])
    // reset so same file can be picked again
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleImageFile(e.dataTransfer.files[0])
  }

  function handleSave() {
    onSave(form)
    setSaved(true)
    setTimeout(() => setPage('profile'), 900)
  }

  const hasImage = !!form.avatarImage

  return (
    <div className="min-h-screen bg-noir-black pt-[63px]">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back button */}
        <button
          onClick={() => setPage('profile')}
          className="flex items-center gap-2 text-cream-muted hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <span className="text-lg leading-none">←</span>
          {t('backToProfile')}
        </button>

        {/* Title */}
        <h1 className="font-bold text-2xl text-white mb-8">✏️ {t('editProfile')}</h1>

        {/* Avatar section */}
        <div className="card p-6 mb-4">

          {/* Preview */}
          <div className="flex flex-col items-center gap-3 mb-5">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center border-2 border-gold/30 hover:border-gold/60 transition-all cursor-pointer"
                style={{ background: 'var(--noir-surface)', boxShadow: '0 0 24px rgba(229,185,78,0.12)' }}
                onClick={() => fileInputRef.current?.click()}
                title={t('uploadPhoto')}
              >
                {hasImage ? (
                  <img src={form.avatarImage} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">{form.avatar}</span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">📷</span>
                </div>
              </div>

              {/* Remove photo button */}
              {hasImage && (
                <button
                  onClick={() => handleChange('avatarImage', null)}
                  className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 border-2 border-noir-black flex items-center justify-center text-white text-xs transition-colors"
                  title={t('removePhoto')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4
              ${dragOver
                ? 'border-gold bg-[rgba(229,185,78,0.08)]'
                : 'border-noir-border hover:border-gold/40 hover:bg-[rgba(229,185,78,0.03)]'
              }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="text-2xl mb-1.5">📁</div>
            <p className="text-sm font-medium text-cream-muted">{t('uploadPhoto')}</p>
            <p className="text-xs text-cream-dim mt-0.5">JPG, PNG, GIF, WEBP</p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />

          {/* Emoji picker toggle */}
          <button
            onClick={() => setShowEmojiPicker(v => !v)}
            className="w-full text-sm text-cream-muted hover:text-white transition-colors py-1 flex items-center justify-center gap-2"
          >
            <span className="flex-1 h-px bg-noir-border" />
            {t('orChooseEmoji')}
            <span className="flex-1 h-px bg-noir-border" />
          </button>

          {showEmojiPicker && (
            <div className="mt-3 p-3 rounded-xl border border-noir-border" style={{ background: 'var(--noir-deep)' }}>
              <div className="grid grid-cols-8 gap-2">
                {AVATARS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      handleChange('avatar', emoji)
                      handleChange('avatarImage', null)
                      setShowEmojiPicker(false)
                    }}
                    className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all hover:scale-110
                      ${form.avatar === emoji && !hasImage
                        ? 'border-2 border-gold bg-[rgba(229,185,78,0.15)]'
                        : 'border border-noir-border hover:border-gold/40'
                      }`}
                    style={{ background: form.avatar === emoji && !hasImage ? undefined : 'var(--noir-surface)' }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="card p-6 space-y-5">

          {/* Display name */}
          <div>
            <label className="label block mb-1.5">{t('displayName')}</label>
            <input
              className="field w-full"
              value={form.displayName}
              onChange={e => handleChange('displayName', e.target.value)}
              maxLength={30}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="label block mb-1.5">{t('bio')}</label>
            <textarea
              className="field w-full resize-none"
              rows={3}
              placeholder={t('bioPlaceholder')}
              value={form.bio}
              onChange={e => handleChange('bio', e.target.value)}
              maxLength={120}
            />
            <div className="text-end text-xs text-cream-dim mt-1">{form.bio.length}/120</div>
          </div>

          {/* Email */}
          <div>
            <label className="label block mb-1.5">{t('email')}</label>
            <input
              className="field w-full"
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          {/* Favorite role */}
          <div>
            <label className="label block mb-2">{t('favoriteRole')}</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => handleChange('favoriteRole', r)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all
                    ${form.favoriteRole === r
                      ? 'border-gold bg-[rgba(229,185,78,0.12)] text-gold'
                      : 'border-noir-border text-cream-muted hover:border-gold/40 hover:text-white'
                    }`}
                  style={{ background: form.favoriteRole === r ? undefined : 'var(--noir-surface)' }}
                >
                  <span className={`role-${r} px-2 py-0.5 rounded-full text-xs me-1.5`}>{t(r)}</span>
                  {form.favoriteRole === r && '✓'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saved}
            className="btn btn-gold flex-1 py-3 font-bold text-sm"
          >
            {saved ? `✓ ${t('profileUpdated')}` : t('saveChanges')}
          </button>
          <button
            onClick={() => setPage('profile')}
            className="btn btn-ghost px-6 py-3 text-sm"
          >
            {t('cancel')}
          </button>
        </div>

      </div>
    </div>
  )
}
