export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      {/* 배경 그리드 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 text-center">
        {/* 공항 로딩 디스플레이 */}
        <div className="bg-[#0f2847] border border-blue-500/20 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
          {/* 비행기 애니메이션 */}
          <div className="mb-6 relative h-12 flex items-center justify-center">
            <div className="absolute w-32 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <svg
              className="w-10 h-10 text-blue-400 animate-bounce"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

          {/* 로딩 스피너 */}
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>

          {/* 텍스트 */}
          <p className="text-blue-300 font-medium tracking-wider text-sm">PREPARING FOR TAKEOFF</p>
          <p className="text-slate-500 text-xs mt-1">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
