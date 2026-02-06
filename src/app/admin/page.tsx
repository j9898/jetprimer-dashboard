import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import AdminClient from './admin-client'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // 로그인 체크
  if (!user) {
    redirect('/login')
  }

  // 관리자 권한 체크
  if (!isAdmin(user.email)) {
    redirect('/dashboard')
  }

  // Admin 클라이언트 (RLS 우회) - 모든 고객 데이터 조회
  const adminSupabase = createAdminClient()

  // 모든 고객 조회
  const { data: customers } = await adminSupabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  // 모든 단계 조회
  const { data: allSteps } = await adminSupabase
    .from('steps')
    .select('*')
    .order('step_order', { ascending: true })

  // 고객별로 steps 그룹화
  const customersWithSteps = customers?.map(customer => ({
    ...customer,
    steps: allSteps?.filter(step => step.customer_id === customer.id) || []
  })) || []

  // 이메일 로그 조회
  const { data: emailLogs } = await adminSupabase
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AdminClient
      user={user}
      customers={customersWithSteps}
      emailLogs={emailLogs || []}
    />
  )
}
