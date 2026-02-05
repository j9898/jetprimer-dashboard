import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      {/* 배경 그리드 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* 공항 안내판 스타일 카드 */}
        <div className="bg-[#0f2847] border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
          {/* 상단 헤더 - 공항 게이트 스타일 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-white font-medium tracking-wider text-sm">FLIGHT STATUS</span>
              </div>
              <span className="text-blue-100 text-sm font-mono">GATE --</span>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="p-8 text-center">
            {/* 에러 코드 - 출발 게이트 디스플레이 스타일 */}
            <div className="mb-6">
              <div className="inline-block bg-[#0a1628] border border-blue-500/30 rounded-lg px-8 py-4">
                <span className="text-6xl font-bold font-mono text-blue-400 tracking-wider">404</span>
              </div>
            </div>

            {/* 상태 메시지 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">FLIGHT NOT FOUND</h1>
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm tracking-wide">DESTINATION UNAVAILABLE</span>
              </div>
            </div>

            {/* 안내 메시지 */}
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              요청하신 페이지를 찾을 수 없습니다.<br />
              항로를 다시 확인하시거나 안내 데스크로 문의해 주세요.
            </p>

            {/* 비행기 아이콘 애니메이션 */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <svg
                  className="w-8 h-8 text-blue-400 absolute -top-3 -right-4 transform rotate-45"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Return to Terminal
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-[#1a3a5c] hover:bg-[#234b73] text-blue-100 font-medium rounded-lg transition-all border border-blue-500/20"
              >
                Flight Center
              </Link>
            </div>
          </div>

          {/* 하단 정보 바 */}
          <div className="bg-[#081325] px-6 py-3 flex items-center justify-between text-xs text-slate-500">
            <span>JetPrimer Airways</span>
            <span className="font-mono">ERR-404</span>
          </div>
        </div>
      </div>
    </div>
  )
}
