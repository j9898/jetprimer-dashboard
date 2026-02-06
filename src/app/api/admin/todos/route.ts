import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// POST: Admin creates a todo for a specific customer
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
    const { customer_id, title, description, due_date, priority } = body

    if (!customer_id || !title || title.trim() === '') {
      return NextResponse.json({ error: 'customer_id and title are required' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Verify customer exists
    const { data: customer } = await adminSupabase
      .from('customers')
      .select('id')
      .eq('id', customer_id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Insert todo with created_by = 'admin'
    const { data: todo, error } = await adminSupabase
      .from('todos')
      .insert({
        customer_id,
        title: title.trim(),
        description: description?.trim() || null,
        due_date: due_date || null,
        priority: priority || 0,
        created_by: 'admin',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin todo:', error)
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, todo })
  } catch (error) {
    console.error('Error in POST /api/admin/todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
