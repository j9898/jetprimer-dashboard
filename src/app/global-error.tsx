'use client'

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* 경고 아이콘 */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '6rem',
                height: '6rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '9999px',
              }}>
                <svg
                  style={{ width: '3rem', height: '3rem', color: '#f87171' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
            }}>
              시스템 오류
            </h1>

            <p style={{
              color: '#94a3b8',
              marginBottom: '2rem',
              maxWidth: '28rem',
              margin: '0 auto 2rem',
            }}>
              심각한 오류가 발생했습니다.<br />
              페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
            </p>

            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '500',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
