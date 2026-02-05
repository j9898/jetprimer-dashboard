import { Resend } from 'resend'

// Resend 클라이언트 (지연 초기화)
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

// 발신자 이메일 (Resend에서 도메인 인증 후 변경)
const FROM_EMAIL = process.env.FROM_EMAIL || 'JetPrimer <onboarding@resend.dev>'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// 단계 업데이트 알림 이메일
export function getStepUpdateEmailTemplate({
  customerName,
  stepName,
  newStatus,
  locale = 'ko'
}: {
  customerName: string
  stepName: string
  newStatus: string
  locale?: string
}) {
  const statusLabels: Record<string, Record<string, string>> = {
    ko: {
      pending: '대기',
      in_progress: '진행 중',
      completed: '완료'
    },
    en: {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    },
    ja: {
      pending: '待機',
      in_progress: '進行中',
      completed: '完了'
    }
  }

  const stepLabels: Record<string, Record<string, string>> = {
    ko: {
      documents: '서류 준비',
      llc: 'LLC 설립',
      ein: 'EIN 신청',
      bank: '은행 계좌'
    },
    en: {
      documents: 'Document Preparation',
      llc: 'LLC Formation',
      ein: 'EIN Application',
      bank: 'Bank Account'
    },
    ja: {
      documents: '書類準備',
      llc: 'LLC設立',
      ein: 'EIN申請',
      bank: '銀行口座'
    }
  }

  const messages: Record<string, { subject: string; greeting: string; body: string; footer: string }> = {
    ko: {
      subject: `[JetPrimer] ${stepLabels.ko[stepName] || stepName} 상태가 업데이트되었습니다`,
      greeting: `안녕하세요, ${customerName}님`,
      body: `귀하의 LLC 설립 진행 상황이 업데이트되었습니다.`,
      footer: '궁금한 점이 있으시면 언제든지 문의해 주세요.'
    },
    en: {
      subject: `[JetPrimer] ${stepLabels.en[stepName] || stepName} status has been updated`,
      greeting: `Hello, ${customerName}`,
      body: `Your LLC formation progress has been updated.`,
      footer: 'If you have any questions, please feel free to contact us.'
    },
    ja: {
      subject: `[JetPrimer] ${stepLabels.ja[stepName] || stepName}のステータスが更新されました`,
      greeting: `${customerName}様`,
      body: `LLC設立の進捗状況が更新されました。`,
      footer: 'ご質問がございましたら、お気軽にお問い合わせください。'
    }
  }

  const lang = messages[locale] || messages.ko
  const statusLabel = statusLabels[locale]?.[newStatus] || statusLabels.ko[newStatus] || newStatus
  const stepLabel = stepLabels[locale]?.[stepName] || stepLabels.ko[stepName] || stepName

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0f9ff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%); padding: 15px; border-radius: 12px;">
            <span style="color: white; font-size: 24px;">✈️</span>
          </div>
          <h1 style="color: #1e293b; font-size: 24px; margin: 15px 0 0 0;">JetPrimer</h1>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 20px 0;">${lang.greeting}</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            ${lang.body}
          </p>

          <!-- Status Card -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #64748b; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase;">Step</p>
                <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0;">${stepLabel}</p>
              </div>
              <div style="text-align: right;">
                <p style="color: #64748b; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase;">Status</p>
                <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; ${
                  newStatus === 'completed'
                    ? 'background: #d1fae5; color: #059669;'
                    : newStatus === 'in_progress'
                      ? 'background: #fef3c7; color: #d97706;'
                      : 'background: #f1f5f9; color: #64748b;'
                }">
                  ${statusLabel}
                </span>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <a href="https://jetprimer-dashboard.vercel.app/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 16px;">
            ${locale === 'en' ? 'View Dashboard' : locale === 'ja' ? 'ダッシュボードを見る' : '대시보드 확인하기'}
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">${lang.footer}</p>
          <p style="color: #cbd5e1; font-size: 12px; margin: 0;">© 2026 JetPrimer. Your Business, Ready for Takeoff.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject: lang.subject,
    html
  }
}
