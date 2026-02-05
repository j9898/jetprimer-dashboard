import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 비행기 아이콘 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/10 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
        </div>

        {/* 에러 코드 */}
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>

        {/* 메시지 */}
        <h2 className="text-2xl font-semibold text-slate-300 mb-2">
          Flight Not Found
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          요청하신 페이지를 찾을 수 없습니다.<br />
          항로를 다시 확인해 주세요.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}
