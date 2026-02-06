import { createClient } from '@/lib/supabase/server'
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email'
import { NextResponse } from 'next/server'

// 고객번호 생성 (예: JP-2026-0042)
function generateFlightCode(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 9000 + 1000) // 1000-9999
  return `JP-${year}-${randomNum}`
}

// 기본 할 일 제목 (다국어)
const DEFAULT_TODO_TITLES: Record<string, string> = {
  ko: 'JetPrimer 미국행 법인설립 티켓 구매하기',
  en: 'Purchase JetPrimer US LLC Formation Ticket',
  ja: 'JetPrimer 米国LLC設立チケットを購入する',
  ar: 'شراء تذكرة تأسيس شركة أمريكية من JetPrimer',
  'zh-CN': '购买JetPrimer美国LLC注册机票',
  'zh-TW': '購買JetPrimer美國LLC註冊機票',
  es: 'Comprar boleto de formación de LLC en EE.UU. de JetPrimer',
  hi: 'JetPrimer US LLC गठन टिकट खरीदें',
  'pt-BR': 'Comprar bilhete de abertura de LLC nos EUA da JetPrimer',
  fr: 'Acheter le billet de création de LLC aux États-Unis JetPrimer',
  de: 'JetPrimer US-LLC-Gründungsticket kaufen',
  vi: 'Mua vé thành lập LLC Mỹ JetPrimer',
  id: 'Beli tiket pembentukan LLC AS JetPrimer',
  ru: 'Купить билет на регистрацию LLC в США от JetPrimer',
}

function getLocaleFromRequest(request: Request): string {
  const acceptLanguage = request.headers.get('accept-language') || ''

  // Chinese variants
  if (acceptLanguage.includes('zh-TW') || acceptLanguage.includes('zh-Hant')) return 'zh-TW'
  if (acceptLanguage.includes('zh')) return 'zh-CN'

  // Portuguese variant
  if (acceptLanguage.includes('pt-BR') || acceptLanguage.includes('pt')) return 'pt-BR'

  // Other languages
  if (acceptLanguage.includes('ar')) return 'ar'
  if (acceptLanguage.includes('ja')) return 'ja'
  if (acceptLanguage.includes('es')) return 'es'
  if (acceptLanguage.includes('hi')) return 'hi'
  if (acceptLanguage.includes('fr')) return 'fr'
  if (acceptLanguage.includes('de')) return 'de'
  if (acceptLanguage.includes('vi')) return 'vi'
  if (acceptLanguage.includes('id')) return 'id'
  if (acceptLanguage.includes('ru')) return 'ru'
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
              email: user.email,
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

            // 웰컴 이메일 발송 (실패해도 회원가입에 영향 없음)
            if (user.email) {
              try {
                const { subject, html } = getWelcomeEmailTemplate({
                  customerName: userName,
                  flightCode,
                  locale: userLocale,
                })
                const emailResult = await sendEmail({
                  to: user.email,
                  subject,
                  html,
                })
                if (!emailResult.success) {
                  console.error('Welcome email failed:', emailResult.error)
                }
              } catch (emailError) {
                console.error('Welcome email error:', emailError)
              }
            }

            // 관리자에게 신규 고객 가입 알림 이메일 발송
            try {
              const signupDate = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
              const adminNotifHtml = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"></head>
                <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f0f9ff;">
                  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                    <div style="text-align:center;margin-bottom:30px;">
                      <div style="display:inline-block;background:linear-gradient(135deg,#38bdf8,#3b82f6);padding:15px;border-radius:12px;">
                        <span style="color:white;font-size:24px;">🛬</span>
                      </div>
                      <h1 style="color:#1e293b;font-size:24px;margin:15px 0 0;">JetPrimer 신규 탑승객 알림</h1>
                    </div>
                    <div style="background:white;border-radius:16px;padding:30px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                      <h2 style="color:#1e293b;font-size:20px;margin:0 0 20px;">✈️ 새로운 CEO님이 탑승하셨습니다!</h2>
                      <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:12px;padding:20px;margin-bottom:20px;">
                        <table style="width:100%;border-collapse:collapse;">
                          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">이름</td><td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${userName}</td></tr>
                          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">이메일</td><td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${user.email}</td></tr>
                          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">고객번호</td><td style="padding:8px 0;color:#38bdf8;font-weight:700;text-align:right;letter-spacing:1px;">${flightCode}</td></tr>
                          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">감지된 언어</td><td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${userLocale}</td></tr>
                          <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">가입 시간</td><td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${signupDate}</td></tr>
                        </table>
                      </div>
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jetprimer.com'}/admin" style="display:block;text-align:center;background:linear-gradient(135deg,#38bdf8,#3b82f6);color:white;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;font-size:16px;">
                        Admin Console에서 확인하기
                      </a>
                    </div>
                    <div style="text-align:center;margin-top:30px;">
                      <p style="color:#cbd5e1;font-size:12px;">© 2026 JetPrimer. 관리자 전용 알림입니다.</p>
                    </div>
                  </div>
                </body>
                </html>
              `
              await sendEmail({
                to: 'support@jetprimer.com',
                subject: `[JetPrimer] 신규 CEO 가입 - ${userName} (${flightCode})`,
                html: adminNotifHtml,
              })
            } catch (adminEmailError) {
              console.error('Admin notification email error:', adminEmailError)
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
