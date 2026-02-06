'use server'

import { cookies } from 'next/headers'
import { type Locale, locales } from '@/i18n/request'
import { createClient } from '@/lib/supabase/server'

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    return { error: 'Invalid locale' }
  }

  const cookieStore = await cookies()
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1년
    sameSite: 'lax',
  })

  return { success: true }
}

// Supabase DB에 locale 저장 (로그인 시 유지용)
export async function setLocaleToDatabase(locale: Locale) {
  if (!locales.includes(locale)) {
    return { error: 'Invalid locale' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('customers')
    .update({ locale })
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value as Locale | undefined
  return locale && locales.includes(locale) ? locale : 'ko'
}

// DB에서 고객의 저장된 locale 가져오기
export async function getLocaleFromDatabase(): Promise<Locale | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('locale')
    .eq('user_id', user.id)
    .single()

  if (customer?.locale && locales.includes(customer.locale as Locale)) {
    return customer.locale as Locale
  }

  return null
}
