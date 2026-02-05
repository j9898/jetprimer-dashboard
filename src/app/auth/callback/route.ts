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

        // 등록되어 있지 않으면 새로 추가
        if (!existingCustomer) {
          const flightCode = generateFlightCode()
          const userName = user.user_metadata?.full_name ||
                          user.user_metadata?.name ||
                          user.email?.split('@')[0] ||
                          'New Customer'

          await supabase.from('customers').insert({
            user_id: user.id,
            flight_code: flightCode,
            name: userName,
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
