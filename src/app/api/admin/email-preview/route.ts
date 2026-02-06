import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { getStepUpdateEmailTemplate } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 관리자 권한 확인
    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { customerName, stepKey, newStatus, locale = 'ko' } = body

    if (!customerName || !stepKey || !newStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 이메일 템플릿 생성
    const { subject, html } = getStepUpdateEmailTemplate({
      customerName,
      stepName: stepKey,
      newStatus,
      locale
    })

    return NextResponse.json({ success: true, subject, html })
  } catch (error) {
    console.error('Email preview error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
