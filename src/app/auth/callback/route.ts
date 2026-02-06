import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PNR 스타일 flight_code 생성 (예: KRX847)
function generateFlightCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // I, O 제외 (숫자와 혼동 방지)
  const randomLetters = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('')
  const randomNumbers = Math.floor(Math.random() * 900 + 100).toString() // 100-999
  return randomLetters + randomNumbers
}

// 기본 할 일 제목 (다국어)
const DEFAULT_TODO_TITLES: Record<string, string> = {
  ko: 'JetPrimer 미국행 법인설립 티켓 구매하기',
  en: 'Purchase JetPrimer US LLC Formation Ticket',
  ja: 'JetPrimer 米国LLC設立チケットを購入する',
}

function getLocaleFromRequest(request: Request): string {
  const acceptLanguage = request.headers.get('accept-language') || ''
  if (acceptLanguage.includes('ja')) return 'ja'
  if (acceptLanguage.includes('en')) return 'en'
  return 'ko'
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 로그인 성공 후 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // customers 테이블에 이미 등록되어 있는지 확인
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // 기존 고객인 경우: Google 프로필 이름이 있으면 자동 업데이트
        if (existingCustomer) {
          const googleName = user.user_metadata?.full_name ||
                            user.user_metadata?.name
          if (googleName) {
            await supabase
              .from('customers')
              .update({ name: googleName })
              .eq('user_id', user.id)
          }
        }

        // 등록되어 있지 않으면 새로 추가
        if (!existingCustomer) {
          const flightCode = generateFlightCode()
          const userName = user.user_metadata?.full_name ||
                          user.user_metadata?.name ||
                          user.email?.split('@')[0] ||
                          'New Customer'

          const { data: newCustomer, error: insertError } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              flight_code: flightCode,
              name: userName,
            })
            .select('id')
            .single()

          if (insertError) {
            console.error('Customer insert error:', insertError)
          }

          // 신규 고객에게 기본 Steps 생성 (step_key는 번역 키로 사용)
          if (newCustomer) {
            const defaultSteps = [
              { customer_id: newCustomer.id, step_key: 'documents', step_order: 1, status: 'in_progress' },
              { customer_id: newCustomer.id, step_key: 'llc', step_order: 2, status: 'pending' },
              { customer_id: newCustomer.id, step_key: 'ein', step_order: 3, status: 'pending' },
              { customer_id: newCustomer.id, step_key: 'bank', step_order: 4, status: 'pending' },
            ]

            const { error: stepsError } = await supabase
              .from('steps')
              .insert(defaultSteps)

            if (stepsError) {
              console.error('Steps insert error:', stepsError)
            }

            // 기본 할 일 생성 (브라우저 언어에 맞춰)
            const userLocale = getLocaleFromRequest(request)
            const defaultTodoTitle = DEFAULT_TODO_TITLES[userLocale] || DEFAULT_TODO_TITLES['ko']
            const { error: todoError } = await supabase
              .from('todos')
              .insert({
                customer_id: newCustomer.id,
                title: defaultTodoTitle,
                priority: 2,
                created_by: 'admin',
              })

            if (todoError) {
              console.error('Default todo insert error:', todoError)
            }
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
