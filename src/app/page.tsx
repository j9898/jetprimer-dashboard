'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Home() {
  const t = useTranslations('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center relative p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="compact" />
      </div>

      <div className="text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-lg shadow-sky-400/30 mb-4 md:mb-6">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3 md:mb-4">JetPrimer</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-2">{t('tagline')}</p>
        <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 px-4">{t('description')}</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-sky-400/30 hover:shadow-xl hover:shadow-sky-400/40 transition-all text-sm md:text-base"
          >
            {t('enterFlightCenter')}
          </Link>
        </div>

        <p className="text-slate-400 text-xs md:text-sm mt-8 md:mt-12">
          {t('copyright')}
        </p>

        {/* Legal links */}
        <div className="flex gap-3 justify-center mt-3">
          <Link href="/terms" className="text-slate-400 hover:text-sky-500 text-xs transition-colors">Terms</Link>
          <span className="text-slate-300">·</span>
          <Link href="/privacy" className="text-slate-400 hover:text-sky-500 text-xs transition-colors">Privacy</Link>
        </div>
      </div>
    </div>
  )
}
