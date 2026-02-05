'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 경고 아이콘 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 에러 코드 */}
        <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>

        {/* 메시지 */}
        <h2 className="text-2xl font-semibold text-slate-300 mb-2">
          기술적 문제가 발생했습니다
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          일시적인 문제가 발생했습니다.<br />
          잠시 후 다시 시도해 주세요.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>

        {/* 에러 정보 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-left max-w-lg mx-auto">
            <p className="text-xs text-slate-500 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
