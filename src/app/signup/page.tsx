'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const router = useRouter()

  useEffect(() => {
        // 회원가입 페이지는 더 이상 필요하지 않습니다.
                // Google OAuth와 Magic Link가 자동으로 신규 사용자를 생성합니다.
                router.replace('/login')
  }, [router])

  return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
              <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>div>
                      <p className="text-slate-600">로그인 페이지로 이동 중...</p>p>
              </div>div>
        </div>div>
      )
}</div>
