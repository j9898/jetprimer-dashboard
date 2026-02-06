'use client'

import { useTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale, setLocaleToDatabase } from '@/lib/actions/locale'

type Locale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'ar' | 'es' | 'hi' | 'pt-BR' | 'fr' | 'de' | 'vi' | 'id' | 'ru'
const DEFAULT_LOCALE = 'ko'

const primaryLanguages: { code: Locale; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
]

const moreLanguages: { code: Locale; label: string; flag: string }[] = [
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

interface LanguageSwitcherProps {
  currentLocale?: string
  variant?: 'default' | 'compact'
}

export default function LanguageSwitcher({ currentLocale: propLocale, variant = 'default' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState(propLocale || DEFAULT_LOCALE)
  const [showMore, setShowMore] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!propLocale) {
      const cookies = document.cookie.split(';')
      const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='))
      if (localeCookie) {
        const locale = localeCookie.split('=')[1]
        setCurrentLocale(locale)
      }
    }
  }, [propLocale])

  // If current locale is in moreLanguages, auto-expand
  useEffect(() => {
    if (moreLanguages.some(l => l.code === currentLocale)) {
      setShowMore(true)
    }
  }, [currentLocale])

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale)
    startTransition(async () => {
      await setLocale(locale)
      await setLocaleToDatabase(locale)
      router.refresh()
    })
  }

  const renderButton = (lang: { code: Locale; label: string; flag: string }, isCompact: boolean) => (
    <button
      key={lang.code}
      onClick={() => handleLocaleChange(lang.code)}
      disabled={isPending || currentLocale === lang.code}
      className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm flex items-center gap-2'} rounded-lg transition-all ${
        currentLocale === lang.code
          ? isCompact
            ? 'bg-blue-500 text-white'
            : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
          : isCompact
            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            : 'bg-[#1a3a5c] text-blue-100 hover:bg-[#234b73] border border-blue-500/20'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isCompact ? (
        lang.flag
      ) : (
        <>
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </>
      )}
    </button>
  )

  const moreToggleBtn = (isCompact: boolean) => (
    <button
      onClick={() => setShowMore(!showMore)}
      className={`${isCompact ? 'px-2 py-1 text-xs bg-slate-700 text-slate-300 hover:bg-slate-600' : 'px-3 py-2 text-sm bg-[#1a3a5c] text-blue-100 hover:bg-[#234b73] border border-blue-500/20'} rounded-lg transition-all`}
    >
      {showMore ? '▲' : `+${moreLanguages.length}`}
    </button>
  )

  if (variant === 'compact') {
    return (
      <div>
        <div className="flex items-center gap-1 flex-wrap">
          {primaryLanguages.map((lang) => renderButton(lang, true))}
          {moreToggleBtn(true)}
        </div>
        {showMore && (
          <div className="flex items-center gap-1 flex-wrap mt-1">
            {moreLanguages.map((lang) => renderButton(lang, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        {primaryLanguages.map((lang) => renderButton(lang, false))}
        {moreToggleBtn(false)}
      </div>
      {showMore && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {moreLanguages.map((lang) => renderButton(lang, false))}
        </div>
      )}
    </div>
  )
}
