'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
'use client'
  
  import { useState } from 'react'
    import { createClient } from '@/lib/supabase/client'
      import { useRouter } from 'next/navigation'
        import Link from 'next/link'
          
  export default function LoginPage() {
      const [email, setEmail] = useState('')
          const [password, setPassword] = useState('')
              const [isLoading, setIsLoading] = useState(false)
                  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
                      const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
                          const router = useRouter()
                            
      const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault()
                  setIsLoading(true)
                        setMessage(null)
                          
            const supabase = createClient()
              
            const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
            })
              
            if (error) {
                    setMessage({ type: 'error', text: error.message })
                            setIsLoading(false)
            } else {
                    router.push('/dashboard')
            }
      }
        
      const handleGoogleLogin = async () => {
            setIsGoogleLoading(true)
                  setMessage(null)
                    
            const supabase = createClient()
              
            const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                              redirectTo: `${window.location.origin}/auth/callback`,
                    },
            })
              
            if (error) {
                    setMessage({ type: 'error', text: error.message })
                            setIsGoogleLoading(false)
            }
      }
        
      return (
            <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                  <div className="w-full max-w-md">
                    {/* Logo */}
                          <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-lg shadow-sky-400/30 mb-4">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                                </svg>svg>
                                    </div>div>
                                    <h1 className="text-3xl font-bold text-slate-800">JetPrimer</h1>h1>
                                    <p className="text-slate-500 mt-2">Flight Center에 오신 것을 환영합니다</p>p>
                          </div>div>
                  
                    {/* Login Card */}
                          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30 rounded-2xl p-8">
                                    <h2 className="text-xl font-semibold text-slate-800 mb-6">로그인</h2>h2>
                          
                                    <form onSubmit={handleLogin} className="space-y-4">
                                                <div>
                                                              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                                                              이메일 주소
                                                              </label>label>
                                                              <input
                                                                                id="email"
                                                                                type="email"
                                                                                value={email}
                                                                                onChange={(e) => setEmail(e.target.value)}
                                                                                placeholder="captain@example.com"
                                                                                required
                                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all bg-white/50"
                                                                              />
                                                </div>div>
                                    
                                                <div>
                                                              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                                                              비밀번호
                                                              </label>label>
                                                              <input
                                                                                id="password"
                                                                                type="password"
                                                                                value={password}
                                                                                onChange={(e) => setPassword(e.target.value)}
                                                                                placeholder="••••••••"
                                                                                required
                                                                                minLength={6}
                                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all bg-white/50"
                                                                              />
                                                </div>div>
                                    
                                      {message && (
                            <div className={`p-4 rounded-xl text-sm ${
                                              message.type === 'success'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {message.text}
                            </div>div>
                                                )}
                                    
                                                <button
                                                                type="submit"
                                                                disabled={isLoading}
                                                                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-sky-400/30 hover:shadow-xl hover:shadow-sky-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                              >
                                                  {isLoading ? (
                                                                                <span className="flex items-center justify-center gap-2">
                                                                                                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                                                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                                                    </svg>svg>
                                                                                                  로그인 중...
                                                                                </span>span>
                                                                              ) : (
                                                                                '로그인'
                                                                              )}
                                                </button>button>
                                    </form>form>
                          
                            {/* Divider */}
                                    <div className="relative my-6">
                                                <div className="absolute inset-0 flex items-center">
                                                              <div className="w-full border-t border-slate-200"></div>div>
                                                </div>div>
                                                <div className="relative flex justify-center text-sm">
                                                              <span className="px-4 bg-white/70 text-slate-500">또는</span>span>
                                                </div>div>
                                    </div>div>
                          
                            {/* Google Sign In Button */}
                                    <button
                                                  type="button"
                                                  onClick={handleGoogleLogin}
                                                  disabled={isGoogleLoading}
                                                  className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                >
                                      {isGoogleLoading ? (
                                                                <span className="flex items-center justify-center gap-2">
                                                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                                </svg>svg>
                                                                                연결 중...
                                                                </span>span>
                                                              ) : (
                                                                <>
                                                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                                                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                                                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                                                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                                                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                                                </svg>svg>
                                                                                Google로 로그인
                                                                </>>
                                                              )}
                                    </button>button>
                          
                                    <div className="mt-6 text-center">
                                                <p className="text-slate-500 text-sm">
                                                              아직 계정이 없으신가요?{' '}
                                                              <Link href="/signup" className="text-sky-600 hover:text-sky-700 font-medium">
                                                                              회원가입
                                                              </Link>Link>
                                                </p>p>
                                    </div>div>
                          </div>div>
                  
                    {/* Footer */}
                          <p className="text-center text-slate-400 text-sm mt-8">
                                    © 2026 JetPrimer. Your Business, Ready for Takeoff.
                          </p>p>
                  </div>div>
            </div>div>
          )
  }</></div>const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-lg shadow-sky-400/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">JetPrimer</h1>
          <p className="text-slate-500 mt-2">Flight Center에 오신 것을 환영합니다</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">로그인</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                이메일 주소
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="captain@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all bg-white/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all bg-white/50"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-sky-400/30 hover:shadow-xl hover:shadow-sky-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              아직 계정이 없으신가요?{' '}
              <Link href="/signup" className="text-sky-600 hover:text-sky-700 font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8">
          © 2026 JetPrimer. Your Business, Ready for Takeoff.
        </p>
      </div>
    </div>
  )
}
