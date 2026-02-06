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

// 발신자 이메일 (Resend에서 도메인 인증 완료)
const FROM_EMAIL = process.env.FROM_EMAIL || 'JetPrimer <support@jetprimer.com>'

// BCC 이메일 (모든 고객 이메일 복사본 수신)
const BCC_EMAIL = process.env.BCC_EMAIL || 'inbox@jetprimer.com'

// 대시보드 URL
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.jetprimer.com'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  bcc?: string | string[]
}

export async function sendEmail({ to, subject, html, bcc }: SendEmailParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      bcc: bcc || BCC_EMAIL,
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
    },
    ar: {
      pending: 'قيد الانتظار',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل'
    },
    'zh-CN': { pending: '待处理', in_progress: '进行中', completed: '已完成' },
    'zh-TW': { pending: '待處理', in_progress: '進行中', completed: '已完成' },
    es: { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' },
    hi: { pending: 'लंबित', in_progress: 'प्रगति में', completed: 'पूर्ण' },
    'pt-BR': { pending: 'Pendente', in_progress: 'Em andamento', completed: 'Concluído' },
    fr: { pending: 'En attente', in_progress: 'En cours', completed: 'Terminé' },
    de: { pending: 'Ausstehend', in_progress: 'In Bearbeitung', completed: 'Abgeschlossen' },
    vi: { pending: 'Đang chờ', in_progress: 'Đang tiến hành', completed: 'Hoàn thành' },
    id: { pending: 'Menunggu', in_progress: 'Sedang Berjalan', completed: 'Selesai' },
    ru: { pending: 'Ожидание', in_progress: 'В процессе', completed: 'Завершено' },
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
    },
    ar: {
      documents: 'تجهيز المستندات',
      llc: 'تأسيس LLC',
      ein: 'طلب EIN',
      bank: 'حساب بنكي'
    },
    'zh-CN': { documents: '文件准备', llc: 'LLC注册', ein: 'EIN申请', bank: '银行开户' },
    'zh-TW': { documents: '文件準備', llc: 'LLC註冊', ein: 'EIN申請', bank: '銀行開戶' },
    es: { documents: 'Preparación de documentos', llc: 'Formación de LLC', ein: 'Solicitud de EIN', bank: 'Cuenta bancaria' },
    hi: { documents: 'दस्तावेज़ तैयारी', llc: 'LLC गठन', ein: 'EIN आवेदन', bank: 'बैंक खाता' },
    'pt-BR': { documents: 'Preparação de documentos', llc: 'Abertura de LLC', ein: 'Solicitação de EIN', bank: 'Conta bancária' },
    fr: { documents: 'Préparation des documents', llc: 'Formation de LLC', ein: 'Demande EIN', bank: 'Compte bancaire' },
    de: { documents: 'Dokumentenvorbereitung', llc: 'LLC-Gründung', ein: 'EIN-Antrag', bank: 'Bankkonto' },
    vi: { documents: 'Chuẩn bị tài liệu', llc: 'Thành lập LLC', ein: 'Đăng ký EIN', bank: 'Tài khoản ngân hàng' },
    id: { documents: 'Persiapan Dokumen', llc: 'Pembentukan LLC', ein: 'Pengajuan EIN', bank: 'Rekening Bank' },
    ru: { documents: 'Подготовка документов', llc: 'Регистрация LLC', ein: 'Заявка на EIN', bank: 'Банковский счёт' },
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
    },
    ar: {
      subject: `[JetPrimer] تم تحديث حالة ${stepLabels.ar[stepName] || stepName}`,
      greeting: `مرحباً ${customerName}`,
      body: `تم تحديث تقدم تأسيس شركة LLC الخاصة بك.`,
      footer: 'إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.'
    },
    'zh-CN': { subject: `[JetPrimer] ${stepLabels['zh-CN']?.[stepName] || stepName}的状态已更新`, greeting: `您好，${customerName}`, body: '您的LLC注册进度已更新。', footer: '如有任何问题，请随时联系我们。' },
    'zh-TW': { subject: `[JetPrimer] ${stepLabels['zh-TW']?.[stepName] || stepName}的狀態已更新`, greeting: `您好，${customerName}`, body: '您的LLC註冊進度已更新。', footer: '如有任何問題，請隨時聯繫我們。' },
    es: { subject: `[JetPrimer] El estado de ${stepLabels.es?.[stepName] || stepName} ha sido actualizado`, greeting: `Hola, ${customerName}`, body: 'El progreso de formación de su LLC ha sido actualizado.', footer: 'Si tiene alguna pregunta, no dude en contactarnos.' },
    hi: { subject: `[JetPrimer] ${stepLabels.hi?.[stepName] || stepName} की स्थिति अपडेट हुई`, greeting: `नमस्ते, ${customerName}`, body: 'आपकी LLC गठन प्रगति अपडेट हो गई है।', footer: 'कोई प्रश्न हो तो कृपया हमसे संपर्क करें।' },
    'pt-BR': { subject: `[JetPrimer] O status de ${stepLabels['pt-BR']?.[stepName] || stepName} foi atualizado`, greeting: `Olá, ${customerName}`, body: 'O progresso da abertura da sua LLC foi atualizado.', footer: 'Se tiver alguma dúvida, entre em contato conosco.' },
    fr: { subject: `[JetPrimer] Le statut de ${stepLabels.fr?.[stepName] || stepName} a été mis à jour`, greeting: `Bonjour, ${customerName}`, body: 'L\'avancement de la création de votre LLC a été mis à jour.', footer: 'Si vous avez des questions, n\'hésitez pas à nous contacter.' },
    de: { subject: `[JetPrimer] Status von ${stepLabels.de?.[stepName] || stepName} wurde aktualisiert`, greeting: `Hallo, ${customerName}`, body: 'Der Fortschritt Ihrer LLC-Gründung wurde aktualisiert.', footer: 'Bei Fragen stehen wir Ihnen gerne zur Verfügung.' },
    vi: { subject: `[JetPrimer] Trạng thái ${stepLabels.vi?.[stepName] || stepName} đã được cập nhật`, greeting: `Xin chào, ${customerName}`, body: 'Tiến độ thành lập LLC của bạn đã được cập nhật.', footer: 'Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.' },
    id: { subject: `[JetPrimer] Status ${stepLabels.id?.[stepName] || stepName} telah diperbarui`, greeting: `Halo, ${customerName}`, body: 'Progres pembentukan LLC Anda telah diperbarui.', footer: 'Jika ada pertanyaan, jangan ragu untuk menghubungi kami.' },
    ru: { subject: `[JetPrimer] Статус ${stepLabels.ru?.[stepName] || stepName} обновлён`, greeting: `Здравствуйте, ${customerName}`, body: 'Прогресс регистрации вашей LLC обновлён.', footer: 'Если у вас есть вопросы, свяжитесь с нами.' },
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
          <a href="${DASHBOARD_URL}/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 16px;">
            ${{
              ko: '대시보드 확인하기', en: 'View Dashboard', ja: 'ダッシュボードを見る', ar: 'عرض لوحة التحكم',
              'zh-CN': '查看控制台', 'zh-TW': '查看控制台', es: 'Ver panel', hi: 'डैशबोर्ड देखें',
              'pt-BR': 'Ver painel', fr: 'Voir le tableau de bord', de: 'Dashboard ansehen',
              vi: 'Xem bảng điều khiển', id: 'Lihat dasbor', ru: 'Перейти в панель'
            }[locale] || '대시보드 확인하기'}
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

// 웰컴 이메일 템플릿
export function getWelcomeEmailTemplate({
  customerName,
  flightCode,
  locale = 'ko'
}: {
  customerName: string
  flightCode: string
  locale?: string
}) {
  const messages: Record<string, {
    subject: string
    greeting: string
    body: string
    flightCodeLabel: string
    nextStep: string
    ctaButton: string
    footer: string
  }> = {
    ko: {
      subject: '[JetPrimer] 환영합니다! 미국 법인 설립 여정을 시작하세요',
      greeting: `${customerName}님, 환영합니다! ✈️`,
      body: 'JetPrimer에 가입해 주셔서 감사합니다. 미국 LLC 설립을 위한 프리미엄 서비스가 준비되어 있습니다.',
      flightCodeLabel: '고객번호 (Flight Code)',
      nextStep: '대시보드에서 티켓을 구매하시면 법인 설립 절차가 시작됩니다. 서류 준비부터 은행 계좌 개설까지, JetPrimer 크루가 함께합니다.',
      ctaButton: '대시보드 바로가기',
      footer: '궁금한 점이 있으시면 언제든지 문의해 주세요.'
    },
    en: {
      subject: '[JetPrimer] Welcome! Start your US LLC formation journey',
      greeting: `Welcome, ${customerName}! ✈️`,
      body: 'Thank you for joining JetPrimer. Our premium US LLC formation service is ready for you.',
      flightCodeLabel: 'Customer ID (Flight Code)',
      nextStep: 'Purchase your ticket on the dashboard to begin the LLC formation process. From document preparation to bank account setup, the JetPrimer crew is with you every step of the way.',
      ctaButton: 'Go to Dashboard',
      footer: 'If you have any questions, please feel free to contact us.'
    },
    ja: {
      subject: '[JetPrimer] ようこそ！米国LLC設立の旅を始めましょう',
      greeting: `${customerName}様、ようこそ！ ✈️`,
      body: 'JetPrimerにご登録いただきありがとうございます。米国LLC設立のプレミアムサービスをご用意しております。',
      flightCodeLabel: '顧客番号（フライトコード）',
      nextStep: 'ダッシュボードでチケットをご購入いただくと、LLC設立手続きが開始されます。書類準備から銀行口座開設まで、JetPrimerクルーがサポートいたします。',
      ctaButton: 'ダッシュボードへ',
      footer: 'ご質問がございましたら、お気軽にお問い合わせください。'
    },
    ar: {
      subject: '[JetPrimer] مرحباً! ابدأ رحلة تأسيس شركتك في أمريكا',
      greeting: `مرحباً ${customerName}! ✈️`,
      body: 'شكراً لانضمامك إلى JetPrimer. خدمة تأسيس LLC الأمريكية المتميزة جاهزة لك.',
      flightCodeLabel: 'رقم العميل (كود الرحلة)',
      nextStep: 'قم بشراء تذكرتك من لوحة التحكم لبدء إجراءات تأسيس LLC. من تجهيز المستندات إلى فتح الحساب البنكي، فريق JetPrimer معك في كل خطوة.',
      ctaButton: 'الذهاب إلى لوحة التحكم',
      footer: 'إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.'
    },
    'zh-CN': { subject: '[JetPrimer] 欢迎！开始您的美国LLC注册之旅', greeting: `${customerName}，欢迎！ ✈️`, body: '感谢您加入JetPrimer。我们的美国LLC注册服务已为您准备就绪。', flightCodeLabel: '客户编号（航班代码）', nextStep: '在控制台购买票据即可开始LLC注册流程。从文件准备到银行开户，JetPrimer团队将全程陪伴。', ctaButton: '前往控制台', footer: '如有任何问题，请随时联系我们。' },
    'zh-TW': { subject: '[JetPrimer] 歡迎！開始您的美國LLC註冊之旅', greeting: `${customerName}，歡迎！ ✈️`, body: '感謝您加入JetPrimer。我們的美國LLC註冊服務已為您準備就緒。', flightCodeLabel: '客戶編號（航班代碼）', nextStep: '在控制台購買票據即可開始LLC註冊流程。從文件準備到銀行開戶，JetPrimer團隊將全程陪伴。', ctaButton: '前往控制台', footer: '如有任何問題，請隨時聯繫我們。' },
    es: { subject: '[JetPrimer] ¡Bienvenido! Comience su viaje de formación de LLC en EE.UU.', greeting: `¡Bienvenido, ${customerName}! ✈️`, body: 'Gracias por unirse a JetPrimer. Nuestro servicio premium de formación de LLC en EE.UU. está listo para usted.', flightCodeLabel: 'ID de Cliente (Código de Vuelo)', nextStep: 'Compre su boleto en el panel para iniciar el proceso de formación de LLC. Desde la preparación de documentos hasta la apertura de cuenta bancaria, el equipo JetPrimer lo acompaña.', ctaButton: 'Ir al panel', footer: 'Si tiene alguna pregunta, no dude en contactarnos.' },
    hi: { subject: '[JetPrimer] स्वागत है! अपनी US LLC गठन यात्रा शुरू करें', greeting: `स्वागत है, ${customerName}! ✈️`, body: 'JetPrimer से जुड़ने के लिए धन्यवाद। हमारी प्रीमियम US LLC गठन सेवा आपके लिए तैयार है।', flightCodeLabel: 'ग्राहक ID (फ्लाइट कोड)', nextStep: 'डैशबोर्ड पर टिकट खरीदें और LLC गठन प्रक्रिया शुरू करें। दस्तावेज़ तैयारी से लेकर बैंक खाता खोलने तक, JetPrimer टीम आपके साथ है।', ctaButton: 'डैशबोर्ड पर जाएं', footer: 'कोई प्रश्न हो तो कृपया हमसे संपर्क करें।' },
    'pt-BR': { subject: '[JetPrimer] Bem-vindo! Comece sua jornada de abertura de LLC nos EUA', greeting: `Bem-vindo, ${customerName}! ✈️`, body: 'Obrigado por se juntar ao JetPrimer. Nosso serviço premium de abertura de LLC nos EUA está pronto para você.', flightCodeLabel: 'ID do Cliente (Código de Voo)', nextStep: 'Compre seu bilhete no painel para iniciar o processo de abertura de LLC. Da preparação de documentos à abertura de conta bancária, a equipe JetPrimer acompanha você.', ctaButton: 'Ir ao painel', footer: 'Se tiver alguma dúvida, entre em contato conosco.' },
    fr: { subject: '[JetPrimer] Bienvenue ! Commencez votre parcours de création de LLC aux États-Unis', greeting: `Bienvenue, ${customerName} ! ✈️`, body: 'Merci d\'avoir rejoint JetPrimer. Notre service premium de création de LLC aux États-Unis est prêt pour vous.', flightCodeLabel: 'ID Client (Code de vol)', nextStep: 'Achetez votre billet sur le tableau de bord pour démarrer le processus de création de LLC. De la préparation des documents à l\'ouverture du compte bancaire, l\'équipe JetPrimer vous accompagne.', ctaButton: 'Accéder au tableau de bord', footer: 'Si vous avez des questions, n\'hésitez pas à nous contacter.' },
    de: { subject: '[JetPrimer] Willkommen! Starten Sie Ihre US-LLC-Gründung', greeting: `Willkommen, ${customerName}! ✈️`, body: 'Vielen Dank für Ihre Anmeldung bei JetPrimer. Unser Premium-Service zur US-LLC-Gründung steht für Sie bereit.', flightCodeLabel: 'Kunden-ID (Flugcode)', nextStep: 'Kaufen Sie Ihr Ticket im Dashboard, um den LLC-Gründungsprozess zu starten. Von der Dokumentenvorbereitung bis zur Kontoeröffnung – das JetPrimer-Team begleitet Sie.', ctaButton: 'Zum Dashboard', footer: 'Bei Fragen stehen wir Ihnen gerne zur Verfügung.' },
    vi: { subject: '[JetPrimer] Chào mừng! Bắt đầu hành trình thành lập LLC tại Mỹ', greeting: `Chào mừng, ${customerName}! ✈️`, body: 'Cảm ơn bạn đã tham gia JetPrimer. Dịch vụ thành lập LLC tại Mỹ cao cấp đã sẵn sàng cho bạn.', flightCodeLabel: 'Mã khách hàng (Mã chuyến bay)', nextStep: 'Mua vé trên bảng điều khiển để bắt đầu quy trình thành lập LLC. Từ chuẩn bị tài liệu đến mở tài khoản ngân hàng, đội ngũ JetPrimer đồng hành cùng bạn.', ctaButton: 'Đi tới bảng điều khiển', footer: 'Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.' },
    id: { subject: '[JetPrimer] Selamat datang! Mulai perjalanan pembentukan LLC AS Anda', greeting: `Selamat datang, ${customerName}! ✈️`, body: 'Terima kasih telah bergabung dengan JetPrimer. Layanan premium pembentukan LLC AS kami siap untuk Anda.', flightCodeLabel: 'ID Pelanggan (Kode Penerbangan)', nextStep: 'Beli tiket Anda di dasbor untuk memulai proses pembentukan LLC. Dari persiapan dokumen hingga pembukaan rekening bank, tim JetPrimer mendampingi Anda.', ctaButton: 'Buka dasbor', footer: 'Jika ada pertanyaan, jangan ragu untuk menghubungi kami.' },
    ru: { subject: '[JetPrimer] Добро пожаловать! Начните регистрацию LLC в США', greeting: `Добро пожаловать, ${customerName}! ✈️`, body: 'Спасибо за регистрацию в JetPrimer. Наш премиальный сервис по регистрации LLC в США готов к работе.', flightCodeLabel: 'ID клиента (код рейса)', nextStep: 'Приобретите билет на панели управления, чтобы начать процесс регистрации LLC. От подготовки документов до открытия банковского счёта — команда JetPrimer с вами на каждом шагу.', ctaButton: 'Перейти в панель', footer: 'Если у вас есть вопросы, свяжитесь с нами.' },
  }

  const lang = messages[locale] || messages.ko

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
          <h2 style="color: #1e293b; font-size: 22px; margin: 0 0 15px 0;">${lang.greeting}</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            ${lang.body}
          </p>

          <!-- Flight Code Card -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">${lang.flightCodeLabel}</p>
            <p style="color: #38bdf8; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 2px;">${flightCode}</p>
          </div>

          <!-- Next Step -->
          <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
            ${lang.nextStep}
          </p>

          <!-- CTA Button -->
          <a href="${DASHBOARD_URL}/dashboard" style="display: block; text-align: center; background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 16px;">
            ${lang.ctaButton}
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
