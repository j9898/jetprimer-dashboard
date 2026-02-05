'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/lib/actions/locale'
import { type Locale } from '@/i18n/request'

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

interface LanguageSwitcherProps {
  currentLocale: string
  variant?: 'default' | 'compact'
}

export default function LanguageSwitcher({ currentLocale, variant = 'default' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLocaleChange = (locale: Locale) => {
    startTransition(async () => {
      await setLocale(locale)
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
