'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

// Icons
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

interface Company {
  name: string
  flightNumber: string
  state: string
  ein: string
  formed: string
  status: string
  captain: string
  bank: string
  bankStatus: string
}

interface Waypoint {
  id: number
  name: string
  dueDate: string
  daysLeft: number
  status: string
}

interface Props {
  user: User
  company: Company
  waypoints: Waypoint[]
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; dotColor: string }> = {
    cruising: { label: 'CRUISING', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    boarding: { label: 'BOARDING', bgColor: 'bg-sky-100', textColor: 'text-sky-600', dotColor: 'bg-sky-500' },
    clear: { label: 'CLEAR', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    prepare: { label: 'PREPARE', bgColor: 'bg-amber-100', textColor: 'text-amber-600', dotColor: 'bg-amber-500' },
  }

  const config = statusConfig[status] || statusConfig.clear

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor} ${status === 'cruising' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-xs font-semibold ${config.textColor}`}>{config.label}</span>
    </div>
  )
}

export default function DashboardClient({ user, company, waypoints }: Props) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-lg shadow-sky-200/30 flex flex-col h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-sky-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-400/30">
              <PlaneIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">JetPrimer</h1>
              <p className="text-xs text-sky-600">Flight Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-400/30">
                <DashboardIcon />
                <span className="text-sm font-medium">Flight Center</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sky-200/50">
          <div className="mb-3 px-4">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm text-slate-700 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogoutIcon />
            <span className="text-sm font-medium">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Flight Center</h1>
              <p className="text-slate-500">Welcome aboard, Captain {company.captain}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Local Time</p>
              <p className="text-2xl font-mono text-slate-700">{currentTime}</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Flight Status Card */}
            <div className="col-span-2 bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Flight</p>
                  <p className="text-sky-600 font-mono text-lg font-semibold">{company.flightNumber}</p>
                </div>
                <StatusBadge status={company.status} />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{company.name}</h2>
                <p className="text-slate-500">Captain {company.captain}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sky-200/50">
                <div>
                  <p className="text-slate-400 text-xs mb-1">DESTINATION</p>
                  <p className="text-slate-700 font-medium">{company.state}, USA 🇺🇸</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">FORMED</p>
                  <p className="text-slate-700 font-medium">{company.formed}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">EIN</p>
                  <p className="text-slate-700 font-mono">{company.ein}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">BANK</p>
                  <p className="text-emerald-600 font-medium">{company.bank}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-500 mb-2">✓</div>
                <p className="text-emerald-600 font-medium">All Systems Normal</p>
                <p className="text-slate-500 text-sm mt-1">No immediate action required</p>
              </div>
            </div>
          </div>

          {/* Upcoming Waypoints */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Waypoints</h2>
            <div className="space-y-3">
              {waypoints.map((wp) => (
                <div
                  key={wp.id}
                  className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-sm ${
                    wp.status === 'prepare'
                      ? 'bg-amber-50/80 border border-amber-200/50'
                      : 'bg-white/50 border border-white/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      wp.status === 'prepare' ? 'bg-amber-100' : 'bg-sky-100'
                    }`}>
                      <span className="text-lg">📍</span>
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">{wp.name}</p>
                      <p className="text-slate-500 text-sm">{wp.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-mono ${
                      wp.daysLeft <= 30
                        ? 'bg-rose-100 text-rose-600'
                        : wp.status === 'prepare'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      D-{wp.daysLeft}
                    </div>
                    <StatusBadge status={wp.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crew Message */}
          <div className="bg-gradient-to-r from-sky-100/80 to-blue-50/50 border border-sky-200/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <p className="text-sky-700 font-medium mb-1">Crew Message</p>
                <p className="text-slate-600">&quot;Smooth cruising at 35,000 ft. Your next waypoint is BOI Report in 71 days. Enjoy the flight, Captain.&quot;</p>
                <p className="text-slate-400 text-sm mt-2">— JetPrimer Flight Crew • 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
