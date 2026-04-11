import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { mockStats } from '../data/mockData'

const ROLES = [
  { icon: '🔫', key: 'mafia',     color: '#E74C3C', cls: 'role-mafia'     },
  { icon: '👮', key: 'detective', color: '#3498DB', cls: 'role-detective'  },
  { icon: '💊', key: 'doctor',    color: '#1ABC9C', cls: 'role-doctor'     },
  { icon: '👤', key: 'citizen',   color: '#27AE60', cls: 'role-citizen'    },
]

export default function Landing({ setPage }) {
  const { t, toggleLang, lang } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div className="min-h-screen bg-noir-black flex flex-col">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#E5B94E 1px, transparent 1px), linear-gradient(90deg, #E5B94E 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-noir-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          <span className="font-bold text-xl text-white tracking-wide">
            {lang === 'ar' ? 'المافيا' : 'MAFIA'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLang}
            className="btn btn-ghost px-4 py-2 text-sm">
            {t('language')}
          </button>
          <button onClick={() => setPage('auth')}
            className="btn btn-gold px-5 py-2 text-sm">
            {t('login')}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        {/* Glow orb behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(229,185,78,0.07) 0%, transparent 70%)' }} />

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Badge */}
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(229,185,78,0.12)', border: '1px solid rgba(229,185,78,0.3)', color: '#E5B94E' }}>
            🎮 {lang === 'ar' ? 'لعبة اجتماعية متعددة اللاعبين' : 'Multiplayer Social Deduction Game'}
          </span>

          {/* Title */}
          <h1 className="font-black mb-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1.05 }}>
            <span className="text-gold-gradient">{lang === 'ar' ? 'لعبة' : 'PLAY'}</span>
            <br />
            <span className="text-white">{lang === 'ar' ? 'المافيا' : 'MAFIA'}</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-cream-muted mb-2 max-w-xl mx-auto">
            {t('tagline')}
          </p>
          <p className="text-sm text-cream-dim mb-10 max-w-md mx-auto">{t('taglineSub')}</p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setPage('auth')}
              className="btn btn-gold px-8 py-3.5 text-base font-bold">
              🚀 {t('playNow')}
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-ghost px-8 py-3.5 text-base">
              {t('howToPlay')}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-px w-full max-w-lg">
          {[
            { val: mockStats.playersOnline.toLocaleString(), lbl: t('playersOnline'), icon: '🟢' },
            { val: mockStats.gamesPlayed.toLocaleString(),   lbl: t('gamesPlayed'),   icon: '🎮' },
            { val: mockStats.roomsOpen.toLocaleString(),     lbl: t('roomsOpen'),     icon: '🚪' },
          ].map((s, i) => (
            <div key={i} className="flex-1 min-w-28 card text-center px-4 py-3"
              style={{ borderRadius:
                i === 0 ? (lang === 'ar' ? '0 12px 12px 0' : '12px 0 0 12px') :
                i === 2 ? (lang === 'ar' ? '12px 0 0 12px' : '0 12px 12px 0') : '0' }}>
              <div className="text-xl font-black text-white">{s.val}</div>
              <div className="text-xs text-cream-dim mt-0.5">{s.icon} {s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="divider mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'الأدوار' : 'Know Your Role'}
            </h2>
            <p className="text-cream-muted">{lang === 'ar' ? 'كل دور له هدف مختلف' : 'Every role has a different objective'}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
            {ROLES.map(role => (
              <div key={role.key} className="card card-hover p-5 text-center">
                <div className="text-4xl mb-3">{role.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${role.cls}`}>
                  {t(role.key)}
                </span>
                <p className="text-xs text-cream-dim mt-2 leading-relaxed">
                  {lang === 'ar'
                    ? role.key === 'mafia'     ? 'اقتل المواطنين ليلاً'
                    : role.key === 'detective' ? 'اكشف هوية المافيا'
                    : role.key === 'doctor'    ? 'احمِ اللاعبين من الموت'
                    : 'صوّت لاستبعاد المافيا'
                    : role.key === 'mafia'     ? 'Eliminate citizens at night'
                    : role.key === 'detective' ? 'Investigate and find the Mafia'
                    : role.key === 'doctor'    ? 'Save players from elimination'
                    : 'Vote to eliminate the Mafia'
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-noir-border">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4 stagger">
          {[
            { icon: '🎭', title: t('feature1Title'), desc: t('feature1Desc') },
            { icon: '🃏', title: t('feature2Title'), desc: t('feature2Desc') },
            { icon: '🗳️', title: t('feature3Title'), desc: t('feature3Desc') },
          ].map((f, i) => (
            <div key={i} className="card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-cream-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Game Rules */}
      <section className="py-20 px-4 border-t border-noir-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="divider mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'قواعد اللعبة' : 'Game Rules'}
            </h2>
            <p className="text-cream-muted">
              {lang === 'ar' ? 'تعلّم كيف تلعب المافيا وتسيطر على المدينة' : 'Learn how to play Mafia and dominate the town'}
            </p>
          </div>

          {/* Objective */}
          <div className="card p-6 mb-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-1">🎯</span>
              <div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {lang === 'ar' ? 'هدف اللعبة' : 'Objective'}
                </h3>
                <p className="text-sm text-cream-muted leading-relaxed">
                  {lang === 'ar'
                    ? 'المافيا هي لعبة خداع اجتماعي حيث يتواجه فريقان: المافيا ضد المدنيين. يحاول المدنيون كشف وإقصاء جميع أعضاء المافيا عبر التصويت، بينما تحاول المافيا البقاء مختبئة والقضاء على المدنيين ليلاً حتى يتساوى عددهم أو يتفوقوا عليهم.'
                    : 'Mafia is a social deduction game where two teams clash: the Mafia vs. the Town. Townspeople must identify and vote out all Mafia members during the day, while the Mafia tries to stay hidden and eliminate Townspeople at night until they equal or outnumber them.'}
                </p>
              </div>
            </div>
          </div>

          {/* Player Roles */}
          <div className="card p-6 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl mt-1">🃏</span>
              <div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {lang === 'ar' ? 'أدوار اللاعبين' : 'Player Roles'}
                </h3>
                <p className="text-sm text-cream-muted mb-4">
                  {lang === 'ar' ? 'يحصل كل لاعب على دور سري في بداية اللعبة' : 'Each player is secretly assigned a role at the start of the game'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: '🔫', cls: 'role-mafia',
                  name: lang === 'ar' ? 'المافيا' : 'Mafia',
                  desc: lang === 'ar'
                    ? 'تعرف من هم بقية أعضاء المافيا. تجتمع ليلاً لاختيار ضحية للقضاء عليها. تتظاهر بأنها مدنية نهاراً.'
                    : 'Knows who the other Mafia members are. Meets at night to choose a target to eliminate. Pretends to be a Townsperson during the day.'
                },
                {
                  icon: '👮', cls: 'role-detective',
                  name: lang === 'ar' ? 'المحقق' : 'Detective',
                  desc: lang === 'ar'
                    ? 'كل ليلة يمكنه التحقيق في هوية لاعب واحد لمعرفة إن كان مافيا أم لا. يجب أن يستخدم هذه المعلومات بذكاء لإقناع المدينة.'
                    : 'Each night, may investigate one player to learn if they are Mafia or not. Must use this information wisely to convince the town.'
                },
                {
                  icon: '💊', cls: 'role-doctor',
                  name: lang === 'ar' ? 'الطبيب' : 'Doctor',
                  desc: lang === 'ar'
                    ? 'كل ليلة يختار لاعباً واحداً لحمايته. إذا استهدفت المافيا هذا اللاعب، ينجو من الموت. لا يمكنه حماية نفسه مرتين متتاليتين.'
                    : 'Each night, chooses one player to protect. If the Mafia targets that player, they survive. Cannot protect the same player two nights in a row.'
                },
                {
                  icon: '👤', cls: 'role-citizen',
                  name: lang === 'ar' ? 'المواطن' : 'Civilian',
                  desc: lang === 'ar'
                    ? 'ليس لديه قدرة خاصة ليلاً، لكنه يملك صوتاً قوياً نهاراً. يجب عليه المراقبة والتحليل والتصويت لإقصاء المافيا.'
                    : 'Has no special night ability, but holds a powerful vote during the day. Must observe, analyze, and vote to eliminate the Mafia.'
                },
              ].map((r, i) => (
                <div key={i} className="card p-4 flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-2xl mt-0.5">{r.icon}</div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${r.cls}`}>{r.name}</span>
                    <p className="text-xs text-cream-dim mt-2 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Phases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌙</span>
                <h3 className="font-semibold text-white text-lg">
                  {lang === 'ar' ? 'مرحلة الليل' : 'Night Phase'}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-cream-muted">
                {(lang === 'ar' ? [
                  'جميع اللاعبين "ينامون" (يغلقون أعينهم)',
                  'المافيا تستيقظ وتختار ضحية للقضاء عليها',
                  'المحقق يستيقظ ويحقق في هوية لاعب واحد',
                  'الطبيب يستيقظ ويختار لاعباً لحمايته',
                ] : [
                  'All players "go to sleep" (close their eyes)',
                  'The Mafia wakes up and chooses a target to eliminate',
                  'The Detective wakes up and investigates one player',
                  'The Doctor wakes up and chooses a player to protect',
                ]).map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold-main text-xs mt-1">●</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">☀️</span>
                <h3 className="font-semibold text-white text-lg">
                  {lang === 'ar' ? 'مرحلة النهار' : 'Day Phase'}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-cream-muted">
                {(lang === 'ar' ? [
                  'يتم الإعلان عن ضحية الليل (إن وُجدت)',
                  'يناقش جميع اللاعبين الأحياء ويتبادلون الاتهامات',
                  'يقدم اللاعبون حججهم ويدافعون عن أنفسهم',
                  'يصوّت اللاعبون لإقصاء المشتبه به',
                ] : [
                  'The night\'s victim is announced (if any)',
                  'All living players discuss and share accusations',
                  'Players present their arguments and defend themselves',
                  'Players vote to eliminate a suspect',
                ]).map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold-main text-xs mt-1">●</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Voting & Elimination */}
          <div className="card p-6 mb-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-1">🗳️</span>
              <div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {lang === 'ar' ? 'التصويت والإقصاء' : 'Voting & Elimination'}
                </h3>
                <ul className="space-y-2 text-sm text-cream-muted">
                  {(lang === 'ar' ? [
                    'بعد انتهاء النقاش، يصوّت كل لاعب حي لإقصاء لاعب مشتبه به.',
                    'اللاعب الذي يحصل على أكبر عدد من الأصوات يتم إقصاؤه من اللعبة.',
                    'اللاعب المُقصى قد يُكشف دوره (حسب إعدادات اللعبة).',
                    'في حالة التعادل في الأصوات، لا يتم إقصاء أحد (أو يتم إعادة التصويت).',
                  ] : [
                    'After discussion ends, each living player votes to eliminate a suspect.',
                    'The player with the most votes is eliminated from the game.',
                    'The eliminated player\'s role may be revealed (depending on game settings).',
                    'In case of a tie, no one is eliminated (or a revote occurs).',
                  ]).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold-main text-xs mt-1">●</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Winning Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6" style={{ borderLeft: '3px solid #27AE60' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏘️</span>
                <h3 className="font-semibold text-white">
                  {lang === 'ar' ? 'فوز المدينة' : 'Town Wins'}
                </h3>
              </div>
              <p className="text-sm text-cream-muted leading-relaxed">
                {lang === 'ar'
                  ? 'يفوز المدنيون (المواطنون، المحقق، والطبيب) عندما يتم كشف وإقصاء جميع أعضاء المافيا عبر التصويت.'
                  : 'The Town (Civilians, Detective, and Doctor) wins when all Mafia members have been identified and eliminated through voting.'}
              </p>
            </div>
            <div className="card p-6" style={{ borderLeft: '3px solid #E74C3C' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔫</span>
                <h3 className="font-semibold text-white">
                  {lang === 'ar' ? 'فوز المافيا' : 'Mafia Wins'}
                </h3>
              </div>
              <p className="text-sm text-cream-muted leading-relaxed">
                {lang === 'ar'
                  ? 'تفوز المافيا عندما يتساوى عدد أعضائها مع عدد المدنيين الأحياء أو يتفوقوا عليهم، مما يجعل من المستحيل إقصاءهم بالتصويت.'
                  : 'The Mafia wins when their numbers equal or exceed the remaining Townspeople, making it impossible to vote them out.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">{t('joinThousands')}</h2>
        <p className="text-cream-muted mb-6">{lang === 'ar' ? 'مجاني تماماً — ابدأ الآن' : 'Completely free — start now'}</p>
        <button onClick={() => setPage('auth')} className="btn btn-gold px-10 py-3.5 text-base font-bold">
          {t('playNow')}
        </button>
      </section>

      <footer className="border-t border-noir-border py-5 px-6 text-center">
        <span className="text-xs text-cream-dim">
          {lang === 'ar' ? '© 2024 لعبة المافيا — جميع الحقوق محفوظة' : '© 2024 MAFIA Game — All rights reserved'}
        </span>
      </footer>
    </div>
  )
}
