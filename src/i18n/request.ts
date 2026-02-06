import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export const locales = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'ar', 'es', 'hi', 'pt-BR', 'fr', 'de', 'vi', 'id', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ko'

// 브라우저 언어에서 지원하는 로케일 찾기
function getLocaleFromAcceptLanguage(acceptLanguage: string): Locale {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, priority = 'q=1'] = lang.trim().split(';')
      return {
        code: code.split('-')[0].toLowerCase(), // 'en-US' -> 'en'
        priority: parseFloat(priority.replace('q=', ''))
      }
    })
    .sort((a, b) => b.priority - a.priority)

  for (const lang of languages) {
    if (locales.includes(lang.code as Locale)) {
      return lang.code as Locale
    }
  }

  return defaultLocale
}

export default getRequestConfig(async () => {
  // 1. 먼저 쿠키에서 사용자가 선택한 언어 확인
  const cookieStore = await cookies()
  const savedLocale = cookieStore.get('locale')?.value as Locale | undefined

  if (savedLocale && locales.includes(savedLocale)) {
    return {
      locale: savedLocale,
      messages: (await import(`../../messages/${savedLocale}.json`)).default
    }
  }

  // 2. 쿠키가 없으면 브라우저 Accept-Language 헤더에서 감지
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  const detectedLocale = getLocaleFromAcceptLanguage(acceptLanguage)

  return {
    locale: detectedLocale,
    messages: (await import(`../../messages/${detectedLocale}.json`)).default
  }
})
