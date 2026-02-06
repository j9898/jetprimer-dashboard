'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { User } from '@supabase/supabase-js'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LanguageDetectionPrompt from '@/components/LanguageDetectionPrompt'
import TodoList from '@/components/TodoList'

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

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
  stepKey: string
  dueDate: string | null
  daysLeft: number
  status: string
}

interface Props {
  user: User
  company: Company
  waypoints: Waypoint[]
  locale: string
  isPaid: boolean
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string }) {
  const statusConfig: Record<string, { labelKey: string; bgColor: string; textColor: string; dotColor: string }> = {
    cruising: { labelKey: 'status.cruising', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    boarding: { labelKey: 'status.boarding', bgColor: 'bg-sky-100', textColor: 'text-sky-600', dotColor: 'bg-sky-500' },
    clear: { labelKey: 'status.clear', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    prepare: { labelKey: 'status.prepare', bgColor: 'bg-amber-100', textColor: 'text-amber-600', dotColor: 'bg-amber-500' },
    pending: { labelKey: 'status.pending', bgColor: 'bg-slate-100', textColor: 'text-slate-500', dotColor: 'bg-slate-400' },
  }

  const config = statusConfig[status] || statusConfig.clear

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${status === 'cruising' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-[11px] font-semibold ${config.textColor}`}>{t(config.labelKey)}</span>
    </div>
  )
}

export default function DashboardClient({ user, company, waypoints, locale, isPaid }: Props) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [crewMessage, setCrewMessage] = useState<string | null>(null)
  const [crewMessageTime, setCrewMessageTime] = useState<string | null>(null)
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')

  // Record last visit & fetch crew message
  useEffect(() => {
    // Record visit
    fetch('/api/visit', { method: 'POST' }).catch(() => {})

    // Fetch crew message from DB
    fetch('/api/crew-message')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.message) {
          const msg = data.message
          const localeColumnMap: Record<string, string> = {
            'zh-CN': 'message_zh_cn', 'zh-TW': 'message_zh_tw', 'pt-BR': 'message_pt_br',
          }
          const localeKey = (localeColumnMap[locale] || `message_${locale}`) as keyof typeof msg
          const message = msg[localeKey] || msg.message_ko || msg.message_en
          if (message) {
            setCrewMessage(message)
            setCrewMessageTime(msg.updated_at)
          }
        }
      })
      .catch(() => {})
  }, [locale])

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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Airport Sky Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cloud layers */}
        <div className="absolute top-[8%] animate-[drift_35s_linear_infinite] opacity-20">
          <div className="w-48 h-16 bg-white rounded-full blur-2xl" />
        </div>
        <div className="absolute top-[15%] right-0 animate-[drift_50s_linear_infinite_reverse] opacity-15">
          <div className="w-72 h-20 bg-white rounded-full blur-3xl" />
        </div>
        <div className="absolute top-[25%] animate-[drift_40s_linear_infinite] opacity-10" style={{ animationDelay: '-15s' }}>
          <div className="w-64 h-14 bg-white rounded-full blur-2xl" />
        </div>
        <div className="absolute top-[45%] right-[10%] animate-[drift_60s_linear_infinite_reverse] opacity-10">
          <div className="w-56 h-18 bg-white rounded-full blur-3xl" />
        </div>

        {/* Airplane flying across - main */}
        <div className="absolute top-[12%] animate-[flyAcross_18s_linear_infinite]">
          <svg className="w-8 h-8 lg:w-10 lg:h-10 text-sky-300/40 -rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          {/* Contrail */}
          <div className="absolute top-1/2 right-full w-32 lg:w-48 h-[2px] bg-gradient-to-l from-sky-300/20 to-transparent -translate-y-1/2" />
        </div>

        {/* Airplane flying across - secondary (smaller, higher) */}
        <div className="absolute top-[6%] animate-[flyAcross_25s_linear_infinite]" style={{ animationDelay: '-8s' }}>
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-sky-200/30 -rotate-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          <div className="absolute top-1/2 right-full w-20 lg:w-28 h-[1px] bg-gradient-to-l from-sky-200/15 to-transparent -translate-y-1/2" />
        </div>

        {/* Runway / ground horizon effect - subtle */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-200/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent" />
      </div>

      {/* Language Detection Prompt */}
      <LanguageDetectionPrompt currentLocale={locale} />

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes drift {
          0% { transform: translateX(-200px); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
        @keyframes flyAcross {
          0% { left: -80px; }
          100% { left: calc(100vw + 80px); }
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-sky-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-sky-400/30">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-800">JetPrimer</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 -mr-2 rounded-lg font-semibold text-xs tracking-wider transition-all ${
              isMobileMenuOpen
                ? 'bg-slate-800 text-white shadow-lg'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-400/30 animate-pulse hover:animate-none hover:shadow-lg hover:shadow-sky-400/40'
            }`}
          >
            {isMobileMenuOpen ? <CloseIcon /> : (
              <>
                <MenuIcon />
                <span>MENU</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed, Mobile: slide-in */}
      <div className={`
        w-64 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-lg shadow-sky-200/30 flex flex-col h-screen fixed left-0 top-0 z-40
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-sky-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-400/30">
                <PlaneIcon />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">JetPrimer</h1>
                <p className="text-xs text-sky-600">{t('flightCenter')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-sky-100 text-slate-700"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-400/30">
                <DashboardIcon />
                <span className="text-sm font-medium">{t('flightCenter')}</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Language Switcher */}
        <div className="px-4 pb-2">
          <LanguageSwitcher currentLocale={locale} variant="compact" />
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sky-200/50">
          <div className="mb-3 px-4">
            <p className="text-xs text-slate-400">{tCommon('loggedInAs')}</p>
            <p className="text-sm text-slate-700 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogoutIcon />
            <span className="text-sm font-medium">
              {isLoggingOut ? tCommon('loggingOut') : tCommon('logout')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 px-4 pb-8 pt-[72px] lg:pt-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-5 lg:space-y-8">

          {/* Header - compact on mobile */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-slate-800">{t('title')}</h1>
              <p className="text-slate-500 text-xs lg:text-base mt-0.5">{t('welcome', { captain: company.captain })}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-slate-400 text-sm">{tCommon('localTime')}</p>
              <p className="text-2xl font-mono text-slate-700">{currentTime}</p>
            </div>
          </div>

          {/* Boarding Pass Ticket - Full width, mobile first */}
          <div className={`rounded-2xl overflow-hidden shadow-lg ${isPaid ? 'shadow-sky-200/40' : 'shadow-amber-200/40'}`}>
            {/* Ticket Header */}
            <div className={`px-4 py-3 lg:px-5 lg:py-4 ${isPaid ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlaneIcon />
                  <span className="text-white/90 text-[11px] lg:text-xs font-semibold tracking-widest">{t('boardingPass')}</span>
                </div>
                <span className="text-white font-mono text-xs lg:text-sm font-bold">{company.flightNumber}</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="bg-white px-4 py-4 lg:px-6 lg:py-5 relative">
              {/* Perforated line effect */}
              <div className="absolute left-0 right-0 top-0 flex justify-between">
                <div className="w-4 h-4 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 rounded-full -mt-2 -ml-2" />
                <div className="flex-1 border-t-2 border-dashed border-slate-200 mt-0" />
                <div className="w-4 h-4 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 rounded-full -mt-2 -mr-2" />
              </div>

              {/* Main ticket content - responsive */}
              <div className="mt-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left: Passenger & Service */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 tracking-wider">{t('passenger')}</p>
                  <p className="text-slate-800 font-bold text-base lg:text-lg truncate">{company.captain}</p>
                  <div className="mt-2">
                    <p className="text-[10px] text-slate-400 tracking-wider">{t('service')}</p>
                    <p className="text-slate-700 font-medium text-sm">{t('serviceValue')}</p>
                  </div>
                </div>

                {/* Right: Grid info */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 sm:gap-x-8">
                  <div>
                    <p className="text-[10px] text-slate-400 tracking-wider">{t('class')}</p>
                    <p className="text-slate-700 font-mono font-bold text-sm">{t('classValue')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 tracking-wider">{t('seat')}</p>
                    <p className="text-slate-700 font-mono font-bold text-sm">1A</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 tracking-wider">{t('gate')}</p>
                    <p className="text-slate-700 font-mono font-bold text-sm">{locale === 'ko' ? 'KR' : locale === 'ja' ? 'JP' : 'US'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex items-center gap-3">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isPaid ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  <span className="text-base lg:text-lg">{isPaid ? '✓' : '⏳'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {t(isPaid ? 'ticketConfirmed' : 'ticketPendingPayment')}
                  </p>
                  <p className="text-slate-400 text-xs leading-tight mt-0.5">
                    {t(isPaid ? 'ticketConfirmedDesc' : 'ticketPendingDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer - Barcode style */}
            <div className={`px-4 py-2.5 lg:px-5 lg:py-3 ${isPaid ? 'bg-sky-50' : 'bg-amber-50'}`}>
              <div className="flex items-center justify-center gap-[2px]">
                {Array.from({ length: 40 }, (_, i) => (
                  <div
                    key={i}
                    className={`${isPaid ? 'bg-sky-300/60' : 'bg-amber-300/60'}`}
                    style={{
                      width: `${((i * 7 + 3) % 3) + 1.5}px`,
                      height: `${((i * 13 + 5) % 9) + 14}px`,
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-[10px] text-slate-400 font-mono mt-1 tracking-widest">
                {company.flightNumber}
              </p>
            </div>
          </div>

          {/* Flight Info Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30 rounded-2xl p-4 lg:p-6">
            <div className="flex items-start justify-between mb-4 lg:mb-6">
              <div>
                <p className="text-slate-500 text-xs lg:text-sm mb-0.5">{t('flight')}</p>
                <p className="text-sky-600 font-mono text-base lg:text-lg font-semibold">{company.flightNumber}</p>
              </div>
              <StatusBadge status={company.status} t={t} />
            </div>

            <div className="mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-slate-800 mb-0.5">{company.name}</h2>
              <p className="text-slate-500 text-sm">CEO {company.captain}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:gap-4 pt-3 lg:pt-4 border-t border-sky-200/50">
              <div>
                <p className="text-slate-400 text-[11px] lg:text-xs mb-0.5">{t('destination')}</p>
                <p className="text-slate-700 font-medium text-sm lg:text-base">{company.state}, USA 🇺🇸</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] lg:text-xs mb-0.5">{t('formed')}</p>
                <p className="text-slate-700 font-medium text-sm lg:text-base">{company.formed}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] lg:text-xs mb-0.5">{t('ein')}</p>
                <p className="text-slate-700 font-mono text-sm lg:text-base">{company.ein}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] lg:text-xs mb-0.5">{t('bank')}</p>
                <p className="text-emerald-600 font-medium text-sm lg:text-base">{company.bank}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Waypoints */}
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-3 lg:mb-4">{t('upcomingWaypoints')}</h2>
            <div className="space-y-2.5 lg:space-y-3">
              {waypoints.map((wp) => (
                <div
                  key={wp.id}
                  className={`flex items-center justify-between p-3 lg:p-4 rounded-xl backdrop-blur-sm ${
                    wp.status === 'prepare'
                      ? 'bg-amber-50/80 border border-amber-200/50'
                      : 'bg-white/50 border border-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      wp.status === 'prepare' ? 'bg-amber-100' : 'bg-sky-100'
                    }`}>
                      <span className="text-base lg:text-lg">📍</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 font-medium text-sm lg:text-base truncate">{t(`steps.${wp.stepKey}`)}</p>
                      <p className="text-slate-500 text-xs lg:text-sm">{wp.dueDate || t(`status.${wp.status}`)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 ml-2">
                    <StatusBadge status={wp.status} t={t} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <TodoList />

          {/* Crew Message */}
          <div className="bg-gradient-to-r from-sky-100/80 to-blue-50/50 border border-sky-200/50 rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base lg:text-lg">💬</span>
              </div>
              <div className="min-w-0">
                <p className="text-sky-700 font-medium text-sm lg:text-base mb-1">{t('crewMessage')}</p>
                <p className="text-slate-600 text-sm lg:text-base">&quot;{crewMessage || t('crewMessageContent', { days: 71 })}&quot;</p>
                <p className="text-slate-400 text-xs lg:text-sm mt-1.5 lg:mt-2">
                  {crewMessageTime
                    ? t('crewSignature', { time: new Date(crewMessageTime).toLocaleDateString() })
                    : t('crewSignature', { time: t('hoursAgo', { hours: 2 }) })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
