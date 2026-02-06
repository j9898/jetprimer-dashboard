import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function PrivacyPage() {
  const t = await getTranslations('legal.privacy')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-200/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <span className="font-bold text-sm">JetPrimer</span>
          </Link>
          <LanguageSwitcher currentLocale={locale} variant="compact" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-sky-200/40 shadow-lg shadow-sky-100/50 p-6 lg:p-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">{t('title')}</h1>
          <p className="text-sm text-slate-400 mb-8">{t('lastUpdated')}</p>

          <div className="prose prose-slate prose-sm max-w-none space-y-6">
            {/* Section 1 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s1Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s1Content')}</p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s2Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s2Content')}</p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s3Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s3Content')}</p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s4Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s4Content')}</p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s5Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s5Content')}</p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-700 border-b border-sky-100 pb-2">{t('s6Title')}</h2>
              <p className="text-slate-600 leading-relaxed mt-3">{t('s6Content')}</p>
            </section>
          </div>

          {/* Footer links */}
          <div className="mt-10 pt-6 border-t border-sky-100 flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-sky-600 hover:text-sky-700 hover:underline">{t('termsLink')}</Link>
            <Link href="/" className="text-slate-400 hover:text-slate-500 hover:underline">{t('homeLink')}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
