import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch the current crew message
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminSupabase = createAdminClient()

    const { data: message, error } = await adminSupabase
      .from('crew_messages')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching crew message:', error)
      return NextResponse.json({ success: true, message: null })
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error in GET /api/admin/crew-message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Update the crew message
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { message_ko, message_en, message_ja, message_ar, message_zh_cn, message_zh_tw, message_es, message_hi, message_pt_br, message_fr, message_de, message_vi, message_id, message_ru } = body

    const adminSupabase = createAdminClient()

    // Check if a message already exists
    const { data: existing } = await adminSupabase
      .from('crew_messages')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    let result
    if (existing) {
      // Update existing
      const { data, error } = await adminSupabase
        .from('crew_messages')
        .update({
          message_ko: message_ko || '',
          message_en: message_en || '',
          message_ja: message_ja || '',
          message_ar: message_ar || '',
          message_zh_cn: message_zh_cn || '',
          message_zh_tw: message_zh_tw || '',
          message_es: message_es || '',
          message_hi: message_hi || '',
          message_pt_br: message_pt_br || '',
          message_fr: message_fr || '',
          message_de: message_de || '',
          message_vi: message_vi || '',
          message_id: message_id || '',
          message_ru: message_ru || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Insert new
      const { data, error } = await adminSupabase
        .from('crew_messages')
        .insert({
          message_ko: message_ko || '',
          message_en: message_en || '',
          message_ja: message_ja || '',
          message_ar: message_ar || '',
          message_zh_cn: message_zh_cn || '',
          message_zh_tw: message_zh_tw || '',
          message_es: message_es || '',
          message_hi: message_hi || '',
          message_pt_br: message_pt_br || '',
          message_fr: message_fr || '',
          message_de: message_de || '',
          message_vi: message_vi || '',
          message_id: message_id || '',
          message_ru: message_ru || '',
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ success: true, message: result })
  } catch (error) {
    console.error('Error in POST /api/admin/crew-message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
