'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { User } from '@supabase/supabase-js'

// Icons
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface Step {
  id: number
  customer_id: number
  step_key?: string
  step_name?: string
  step_order: number
  status: string
  completed_at: string | null
}

interface Customer {
  id: number
  user_id: string
  name: string
  email: string
  flight_code: string
  created_at: string
  steps: Step[]
}

interface Props {
  user: User
  customers: Customer[]
}

export default function AdminClient({ user, customers }: Props) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const tDashboard = useTranslations('dashboard')

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const updateStepStatus = async (stepId: number, newStatus: string) => {
    setIsUpdating(true)
    const supabase = createClient()

    const updateData: { status: string; completed_at?: string | null } = { status: newStatus }

    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else {
      updateData.completed_at = null
    }

    const { error } = await supabase
      .from('steps')
      .update(updateData)
      .eq('id', stepId)

    if (error) {
      console.error('Update error:', error)
      alert('Update failed: ' + error.message)
    } else {
      router.refresh()
    }
    setIsUpdating(false)
  }

  // 현재 진행 단계 계산
  const getCurrentStep = (steps: Step[]) => {
    const inProgress = steps.find(s => s.status === 'in_progress')
    if (inProgress) return inProgress.step_key || inProgress.step_name

    const pending = steps.find(s => s.status === 'pending')
    if (pending) return pending.step_key || pending.step_name

    return 'completed'
  }

  // 진행률 계산
  const getProgress = (steps: Step[]) => {
    const completed = steps.filter(s => s.status === 'completed').length
    return Math.round((completed / steps.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-lg shadow-slate-200/30 flex flex-col h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-400/30">
              <PlaneIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">JetPrimer</h1>
              <p className="text-xs text-slate-500">{t('console')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-400/30">
                <UsersIcon />
                <span className="text-sm font-medium">{t('title')}</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200/50">
          <div className="mb-3 px-4">
            <p className="text-xs text-slate-400">{t('administrator')}</p>
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
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('title')}</h1>
            <p className="text-slate-500">{t('totalCustomers', { count: customers.length })}</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="col-span-2 space-y-4">
              {customers.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-8 text-center">
                  <p className="text-slate-500">{t('noCustomers')}</p>
                </div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`bg-white/70 backdrop-blur-xl border shadow-lg shadow-slate-200/30 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl ${
                      selectedCustomer?.id === customer.id
                        ? 'border-slate-400 ring-2 ring-slate-400/20'
                        : 'border-white/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{customer.name}</h3>
                        <p className="text-slate-500 text-sm">{customer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">{t('flightCode')}</p>
                        <p className="font-mono text-slate-700">{customer.flight_code}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">{t('progress')}</span>
                        <span className="text-slate-700 font-medium">{getProgress(customer.steps)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                          style={{ width: `${getProgress(customer.steps)}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Step */}
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon />
                      <span className="text-slate-500">{t('currentStep')}:</span>
                      <span className="text-slate-700 font-medium">
                        {tDashboard(`steps.${getCurrentStep(customer.steps)}`)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Detail Panel */}
            <div className="space-y-4">
              {selectedCustomer ? (
                <>
                  {/* Customer Info Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('customerInfo')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-xs">{t('name')}</p>
                        <p className="text-slate-700">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('email')}</p>
                        <p className="text-slate-700">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('flightCode')}</p>
                        <p className="text-slate-700 font-mono">{selectedCustomer.flight_code}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('joinDate')}</p>
                        <p className="text-slate-700">
                          {new Date(selectedCustomer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('steps')}</h3>
                    <div className="space-y-3">
                      {selectedCustomer.steps.map((step) => {
                        const stepKey = step.step_key || step.step_name || ''

                        return (
                          <div
                            key={step.id}
                            className="p-4 bg-slate-50 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-slate-700 font-medium">
                                {tDashboard(`steps.${stepKey}`)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                step.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : step.status === 'in_progress'
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-slate-100 text-slate-500'
                              }`}>
                                {t(`status.${step.status === 'in_progress' ? 'inProgress' : step.status}`)}
                              </span>
                            </div>

                            {/* Status Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStepStatus(step.id, 'pending')}
                                disabled={isUpdating || step.status === 'pending'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                  step.status === 'pending'
                                    ? 'bg-slate-200 text-slate-600'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                } disabled:opacity-50`}
                              >
                                {t('status.pending')}
                              </button>
                              <button
                                onClick={() => updateStepStatus(step.id, 'in_progress')}
                                disabled={isUpdating || step.status === 'in_progress'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                  step.status === 'in_progress'
                                    ? 'bg-amber-200 text-amber-700'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
                                } disabled:opacity-50`}
                              >
                                {t('status.inProgress')}
                              </button>
                              <button
                                onClick={() => updateStepStatus(step.id, 'completed')}
                                disabled={isUpdating || step.status === 'completed'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                                  step.status === 'completed'
                                    ? 'bg-emerald-200 text-emerald-700'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                                } disabled:opacity-50`}
                              >
                                <CheckIcon />
                                {t('status.completed')}
                              </button>
                            </div>

                            {step.completed_at && (
                              <p className="text-slate-400 text-xs mt-2">
                                {t('completedAt')}: {new Date(step.completed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-8 text-center">
                  <p className="text-slate-400">{t('selectCustomer')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
