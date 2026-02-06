'use client'

import { useTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale, setLocaleToDatabase } from '@/lib/actions/locale'

type Locale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'ar' | 'es' | 'hi' | 'pt-BR' | 'fr' | 'de' | 'vi' | 'id' | 'ru'
const DEFAULT_LOCALE = 'ko'

const allLanguages: { code: Locale; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
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

const PRIMARY_CODES: Locale[] = ['ko', 'en', 'ja', 'zh-CN']

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

  const isPrimaryLocale = PRIMARY_CODES.includes(currentLocale as Locale)
  const currentLangData = allLanguages.find(l => l.code === currentLocale)

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale)
    // Always close the expanded list after selection
    setShowMore(false)
    startTransition(async () => {
      await setLocale(locale)
      await setLocaleToDatabase(locale)
      router.refresh()
    })
  }

  // Build the visible primary buttons:
  // Always show ko, en, ja, zh-CN.
  // If current locale is NOT one of these 4, also show it as a "selected extra" badge.
  const primaryLangs = allLanguages.filter(l => PRIMARY_CODES.includes(l.code))
  const moreLanguages = allLanguages.filter(l => !PRIMARY_CODES.includes(l.code))

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

  // Selected non-primary language badge (shown when list is collapsed)
  const selectedExtraBadge = (isCompact: boolean) => {
    if (isPrimaryLocale || !currentLangData) return null
    return (
      <button
        key={currentLangData.code}
        disabled
        className={`${isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm flex items-center gap-2'} rounded-lg bg-blue-500 text-white ${isCompact ? '' : 'shadow-lg shadow-blue-500/25'}`}
      >
        {isCompact ? (
          <span>{currentLangData.flag}</span>
        ) : (
          <>
            <span>{currentLangData.flag}</span>
            <span>{currentLangData.label}</span>
          </>
        )}
      </button>
    )
  }

  const moreToggleBtn = (isCompact: boolean) => (
    <button
      onClick={() => setShowMore(!showMore)}
      className={`${
        showMore
          ? isCompact
            ? 'px-1.5 py-1 text-xs bg-rose-500/80 text-white hover:bg-rose-500'
            : 'px-2.5 py-2 text-sm bg-rose-500/80 text-white hover:bg-rose-500'
          : isCompact
            ? 'px-2 py-1 text-xs bg-slate-700 text-slate-300 hover:bg-slate-600'
            : 'px-3 py-2 text-sm bg-[#1a3a5c] text-blue-100 hover:bg-[#234b73] border border-blue-500/20'
      } rounded-lg transition-all`}
    >
      {showMore ? '✕' : `+${moreLanguages.length}`}
    </button>
  )

  if (variant === 'compact') {
    return (
      <div>
        <div className="flex items-center gap-1 flex-wrap">
          {primaryLangs.map((lang) => renderButton(lang, true))}
          {!showMore && selectedExtraBadge(true)}
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
        {primaryLangs.map((lang) => renderButton(lang, false))}
        {!showMore && selectedExtraBadge(false)}
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
