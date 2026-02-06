'use client'

import { useTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale, setLocaleToDatabase } from '@/lib/actions/locale'

type Locale = 'ko' | 'en' | 'ja'
const DEFAULT_LOCALE = 'ko'

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

interface LanguageSwitcherProps {
  currentLocale?: string
  variant?: 'default' | 'compact'
}

export default function LanguageSwitcher({ currentLocale: propLocale, variant = 'default' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const [currentLocale, setCurrentLocale] = useState(propLocale || DEFAULT_LOCALE)
  const router = useRouter()

  // 쿠키에서 현재 locale 읽기 (클라이언트 사이드)
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

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale)
    startTransition(async () => {
      // 쿠키에 저장 (즉시 적용용)
      await setLocale(locale)
      // Supabase DB에도 저장 (로그인 시 유지용)
      await setLocaleToDatabase(locale)
      router.refresh()
    })
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            disabled={isPending || currentLocale === lang.code}
            className={`px-2 py-1 text-xs rounded transition-all ${
              currentLocale === lang.code
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLocaleChange(lang.code)}
          disabled={isPending || currentLocale === lang.code}
          className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
            currentLocale === lang.code
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-[#1a3a5c] text-blue-100 hover:bg-[#234b73] border border-blue-500/20'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
