import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Google 프로필 이름이 있으면 customers.name 자동 업데이트
  const googleName = user.user_metadata?.full_name || user.user_metadata?.name
  if (googleName) {
    await supabase
      .from('customers')
      .update({ name: googleName })
      .eq('user_id', user.id)
  }

  // 고객 데이터 조회 (admin_notes 제외 - 고객에게 보이면 안 됨)
  const { data: customer } = await supabase
    .from('customers')
    .select('id, user_id, name, email, locale, flight_code, created_at, is_paid')
    .eq('user_id', user.id)
    .single()

  // DB에 저장된 locale이 있으면 쿠키에 적용 (로그인 시 언어 유지)
  if (customer?.locale) {
    const currentCookieLocale = cookieStore.get('locale')?.value
    if (currentCookieLocale !== customer.locale) {
      cookieStore.set('locale', customer.locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    }
  }

  const locale = customer?.locale || await getLocale()

  // 고객의 진행 단계 조회
  const { data: steps } = await supabase
    .from('steps')
    .select('*')
    .eq('customer_id', customer?.id)
    .order('step_order', { ascending: true })

  // 실제 데이터가 있으면 사용, 없으면 데모 데이터
  const company = customer ? {
    name: customer.name + "'s LLC",
    flightNumber: customer.flight_code,
    state: "Wyoming",
    ein: "신청 중",
    formed: new Date(customer.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    status: "cruising",
    captain: customer.name,
    bank: "준비 중",
    bankStatus: "Pending"
  } : {
    name: "Horizon Ventures LLC",
    flightNumber: "JP-2026-0042",
    state: "Wyoming",
    ein: "88-1234567",
    formed: "Feb 7, 2026",
    status: "cruising",
    captain: user.email?.split('@')[0] || "Captain",
    bank: "Mercury Financial",
    bankStatus: "Active"
  }

  // step_name을 step_key로 매핑 (기존 한국어 데이터 호환)
  const stepNameToKey: Record<string, string> = {
    '서류 준비': 'documents',
    'LLC 설립': 'llc',
    'EIN 신청': 'ein',
    '은행 계좌': 'bank',
  }

  // 실제 steps가 있으면 변환, 없으면 데모 데이터
  const waypoints = steps && steps.length > 0
    ? steps.map(step => ({
        id: step.id,
        // step_key가 있으면 사용, 없으면 step_name에서 변환
        stepKey: step.step_key || stepNameToKey[step.step_name] || 'documents',
        dueDate: step.completed_at
          ? new Date(step.completed_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : null,
        daysLeft: 0,
        status: step.status === 'completed' ? 'clear' : step.status === 'in_progress' ? 'prepare' : 'pending'
      }))
    : [
        { id: 1, stepKey: "documents", dueDate: null, daysLeft: 0, status: "prepare" },
        { id: 2, stepKey: "llc", dueDate: null, daysLeft: 0, status: "pending" },
        { id: 3, stepKey: "ein", dueDate: null, daysLeft: 0, status: "pending" },
        { id: 4, stepKey: "bank", dueDate: null, daysLeft: 0, status: "pending" },
      ]

  return (
    <DashboardClient
      user={user}
      company={company}
      waypoints={waypoints}
      locale={locale}
      isPaid={customer?.is_paid || false}
    />
  )
}
