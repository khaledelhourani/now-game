import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en')
  }

  const t = (key) => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }

  useEffect(() => {
    const html = document.documentElement
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl')
      html.setAttribute('lang', 'ar')
    } else {
      html.setAttribute('dir', 'ltr')
      html.setAttribute('lang', 'en')
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
