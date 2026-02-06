// 관리자 이메일 목록 (환경 변수에서만 로드)
// 설정: ADMIN_EMAILS=admin@example.com,admin2@example.com
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []

// 환경 변수 미설정 시 경고
if (ADMIN_EMAILS.length === 0 && typeof window === 'undefined') {
  console.warn('[JetPrimer] ADMIN_EMAILS 환경 변수가 설정되지 않았습니다. 관리자 접근이 불가능합니다.')
}

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS
}
