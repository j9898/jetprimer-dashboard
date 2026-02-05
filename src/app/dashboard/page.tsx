import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 고객 데이터 조회
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .single()

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

  // 실제 steps가 있으면 변환, 없으면 데모 데이터
  const waypoints = steps && steps.length > 0
    ? steps.map(step => ({
        id: step.id,
        name: step.step_name,
        dueDate: step.completed_at
          ? new Date(step.completed_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : "진행 중",
        daysLeft: 0,
        status: step.status === 'completed' ? 'clear' : step.status === 'in_progress' ? 'prepare' : 'pending'
      }))
    : [
        { id: 1, name: "서류 준비", dueDate: "진행 중", daysLeft: 0, status: "prepare" },
        { id: 2, name: "LLC 설립", dueDate: "대기", daysLeft: 0, status: "pending" },
        { id: 3, name: "EIN 신청", dueDate: "대기", daysLeft: 0, status: "pending" },
        { id: 4, name: "은행 계좌", dueDate: "대기", daysLeft: 0, status: "pending" },
      ]

  return (
    <DashboardClient
      user={user}
      company={company}
      waypoints={waypoints}
    />
  )
}
