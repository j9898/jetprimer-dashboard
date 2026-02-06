export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
      {/* Airport window light streaks */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-100/30 rounded-full blur-2xl" />
      </div>

      {/* Subtle grid pattern like airport floor tiles */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 text-center">
        {/* Airport departure board style card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-8 shadow-lg shadow-sky-200/30 min-w-[280px]">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-b-full" />

          {/* Airplane animation - flying across */}
          <div className="mb-6 relative h-14 flex items-center justify-center">
            {/* Flight path dotted line */}
            <div className="absolute w-40 h-[1px] border-t border-dashed border-sky-300/60" />
            {/* Airplane icon with smooth pulse */}
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-xl animate-pulse" style={{ width: '48px', height: '48px', margin: '-8px' }} />
              <svg
                className="w-10 h-10 text-sky-500 animate-bounce"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ animationDuration: '2s' }}
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
          </div>

          {/* Loading spinner - light style */}
          <div className="flex justify-center mb-5">
            <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          </div>

          {/* Gate info style text */}
          <div className="space-y-2">
            <p className="text-sky-600 font-semibold tracking-widest text-sm">
              PREPARING FOR TAKEOFF
            </p>
            <p className="text-slate-400 text-xs tracking-wide">
              Please wait...
            </p>
          </div>

          {/* Bottom decorative dots - like airport wayfinding */}
          <div className="flex justify-center gap-1.5 mt-6">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-pulse" style={{ animationDelay: '600ms' }} />
          </div>
        </div>

        {/* JetPrimer brand below */}
        <p className="text-slate-400 text-xs mt-6 tracking-wider font-medium">JetPrimer Airways</p>
      </div>
    </div>
  )
}
