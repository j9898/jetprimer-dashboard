import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST: Record user's last visit time
export async function POST() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('customers')
      .update({ last_visited_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating last visit:', error)
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/visit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
