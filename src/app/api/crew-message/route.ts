import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET: Fetch crew message for authenticated users
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: message, error } = await supabase
      .from('crew_messages')
      .select('message_ko, message_en, message_ja, message_ar, message_zh_cn, message_zh_tw, message_es, message_hi, message_pt_br, message_fr, message_de, message_vi, message_id, message_ru, updated_at')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json({ success: true, message: null })
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error in GET /api/crew-message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
