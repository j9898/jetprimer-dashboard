'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import * as Sentry from "@sentry/nextjs"
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors.serverError')

  useEffect(() => {
    console.error('Application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      {/* 배경 그리드 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* 언어 선택기 - 우측 상단 */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher variant="compact" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* 공항 안내판 스타일 카드 */}
        <div className="bg-[#0f2847] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10">
          {/* 상단 헤더 - 경고 스타일 */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-white font-medium tracking-wider text-sm">{t('systemAlert')}</span>
              </div>
              <span className="text-red-100 text-sm font-mono">{t('code')}</span>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="p-8 text-center">
            {/* 경고 아이콘 */}
            <div className="mb-6">
              <div className="inline-block bg-[#0a1628] border border-red-500/30 rounded-lg p-4">
                <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* 상태 메시지 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">{t('heading')}</h1>
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm tracking-wide">{t('subheading')}</span>
              </div>
            </div>

            {/* 안내 메시지 */}
            <p className="text-slate-400 mb-8 text-sm leading-relaxed whitespace-pre-line">
              {t('description')}
            </p>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                {t('retryConnection')}
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-[#1a3a5c] hover:bg-[#234b73] text-blue-100 font-medium rounded-lg transition-all border border-blue-500/20"
              >
                {t('returnToTerminal')}
              </a>
            </div>
          </div>

          {/* 하단 정보 바 */}
          <div className="bg-[#081325] px-6 py-3 flex items-center justify-between text-xs text-slate-500">
            <span>{t('brand')}</span>
            <span className="font-mono">ERR-{error.digest || '500'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
