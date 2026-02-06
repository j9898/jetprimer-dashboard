import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { sendEmail, getStepUpdateEmailTemplate } from '@/lib/email'
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
    const { customerId, stepKey, newStatus, locale = 'ko' } = body

    if (!customerId || !stepKey || !newStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 고객 정보 조회 (locale, email_locale 포함)
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('name, email, locale, email_locale')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // 이메일 발송 언어 사용 (email_locale > locale > 요청의 locale > 'ko')
    const emailLocale = customer.email_locale || customer.locale || locale || 'ko'

    // 이메일 템플릿 생성
    const { subject, html } = getStepUpdateEmailTemplate({
      customerName: customer.name,
      stepName: stepKey,
      newStatus,
      locale: emailLocale
    })

    // 이메일 발송
    const result = await sendEmail({
      to: customer.email,
      subject,
      html
    })

    // 이메일 로그 저장
    const logStatus = result.success ? 'sent' : 'failed'
    await supabase
      .from('email_logs')
      .insert({
        customer_id: customerId,
        recipient_email: customer.email,
        subject,
        step_key: stepKey,
        status: logStatus,
        sent_by: user.email
      })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
