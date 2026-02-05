import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-lg shadow-sky-400/30 mb-6">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-slate-800 mb-4">JetPrimer</h1>
        <p className="text-xl text-slate-600 mb-2">Your Business, Ready for Takeoff</p>
        <p className="text-slate-500 mb-8">미국 LLC 설립부터 관리까지, 프리미엄 서비스</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-sky-400/30 hover:shadow-xl hover:shadow-sky-400/40 transition-all"
          >
            Flight Center 입장
          </Link>
        </div>

        <p className="text-slate-400 text-sm mt-12">
          © 2026 JetPrimer. Premium US LLC Formation for Global Entrepreneurs.
        </p>
      </div>
    </div>
  )
}
