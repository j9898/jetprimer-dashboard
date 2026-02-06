'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale, setLocaleToDatabase } from '@/lib/actions/locale'

type Locale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'ar' | 'es' | 'hi' | 'pt-BR' | 'fr' | 'de' | 'vi' | 'id' | 'ru'

// Map browser language codes → our locale codes
const browserToLocale: Record<string, Locale> = {
  'ko': 'ko', 'ko-KR': 'ko',
  'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en', 'en-CA': 'en',
  'ja': 'ja', 'ja-JP': 'ja',
  'zh-CN': 'zh-CN', 'zh-Hans': 'zh-CN', 'zh': 'zh-CN',
  'zh-TW': 'zh-TW', 'zh-Hant': 'zh-TW', 'zh-HK': 'zh-TW',
  'ar': 'ar', 'ar-SA': 'ar', 'ar-EG': 'ar', 'ar-AE': 'ar',
  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es',
  'hi': 'hi', 'hi-IN': 'hi',
  'pt-BR': 'pt-BR', 'pt': 'pt-BR', 'pt-PT': 'pt-BR',
  'fr': 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr',
  'de': 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de',
  'vi': 'vi', 'vi-VN': 'vi',
  'id': 'id', 'id-ID': 'id',
  'ru': 'ru', 'ru-RU': 'ru',
}

// Locale → prompt data (flag, country question, "Yes!" button text)
const promptData: Record<Locale, { flag: string; question: string; yes: string }> = {
  'ko': { flag: '🇰🇷', question: '한국어를 사용하시나요?', yes: '네!' },
  'en': { flag: '🇺🇸', question: 'Do you speak English?', yes: 'Yes!' },
  'ja': { flag: '🇯🇵', question: '日本語をお使いですか？', yes: 'はい！' },
  'zh-CN': { flag: '🇨🇳', question: '您使用中文吗？', yes: '是的！' },
  'zh-TW': { flag: '🇹🇼', question: '您使用繁體中文嗎？', yes: '是的！' },
  'ar': { flag: '🇸🇦', question: 'هل تتحدث العربية؟', yes: '!نعم' },
  'es': { flag: '🇪🇸', question: '¿Hablas español?', yes: '¡Sí!' },
  'hi': { flag: '🇮🇳', question: 'क्या आप हिन्दी बोलते हैं?', yes: 'हाँ!' },
  'pt-BR': { flag: '🇧🇷', question: 'Você fala português?', yes: 'Sim!' },
  'fr': { flag: '🇫🇷', question: 'Parlez-vous français ?', yes: 'Oui !' },
  'de': { flag: '🇩🇪', question: 'Sprechen Sie Deutsch?', yes: 'Ja!' },
  'vi': { flag: '🇻🇳', question: 'Bạn nói tiếng Việt?', yes: 'Có!' },
  'id': { flag: '🇮🇩', question: 'Apakah Anda berbahasa Indonesia?', yes: 'Ya!' },
  'ru': { flag: '🇷🇺', question: 'Вы говорите по-русски?', yes: 'Да!' },
}

interface LanguageDetectionPromptProps {
  currentLocale?: string
}

export default function LanguageDetectionPrompt({ currentLocale }: LanguageDetectionPromptProps) {
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    // Don't show if user already dismissed in this session
    const dismissed = sessionStorage.getItem('lang-prompt-dismissed')
    if (dismissed) return

    // Read current locale from props or cookie
    let current = currentLocale
    if (!current) {
      const cookies = document.cookie.split(';')
      const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='))
      if (localeCookie) {
        current = localeCookie.split('=')[1]
      }
    }
    current = current || 'ko'

    // Detect browser language
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || ''

    // Try exact match first, then base language
    let detected: Locale | undefined = browserToLocale[browserLang]
    if (!detected) {
      const baseLang = browserLang.split('-')[0]
      detected = browserToLocale[baseLang]
    }

    // Only show prompt if detected language differs from current
    if (detected && detected !== current) {
      setDetectedLocale(detected)
      // Slight delay for smooth entrance
      setTimeout(() => setIsVisible(true), 800)
    }
  }, [currentLocale])

  const handleSwitch = () => {
    if (!detectedLocale) return
    setIsDismissing(true)
    sessionStorage.setItem('lang-prompt-dismissed', 'true')

    startTransition(async () => {
      await setLocale(detectedLocale)
      await setLocaleToDatabase(detectedLocale)
      router.refresh()
    })

    setTimeout(() => setIsVisible(false), 300)
  }

  const handleDismiss = () => {
    setIsDismissing(true)
    sessionStorage.setItem('lang-prompt-dismissed', 'true')
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!detectedLocale || !isVisible) return null

  const data = promptData[detectedLocale]
  if (!data) return null

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ${
        isDismissing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-sky-200/60 shadow-2xl shadow-sky-300/20 rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[90vw]">
        {/* Flag */}
        <span className="text-2xl flex-shrink-0">{data.flag}</span>

        {/* Question */}
        <p className="text-slate-700 text-sm font-medium flex-1" dir={detectedLocale === 'ar' ? 'rtl' : 'ltr'}>
          {data.question}
        </p>

        {/* Yes button */}
        <button
          onClick={handleSwitch}
          disabled={isPending}
          className="flex-shrink-0 px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-bold rounded-xl shadow-md shadow-sky-400/30 hover:shadow-lg hover:shadow-sky-400/40 transition-all disabled:opacity-50 animate-pulse hover:animate-none"
        >
          {isPending ? '...' : data.yes}
        </button>

        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
