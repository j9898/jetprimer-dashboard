// 관리자 이메일 목록
// 환경 변수로도 설정 가능: NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [
  'j9898k@gmail.com', // 기본 관리자 (본인 이메일로 변경하세요)
]

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS
}
