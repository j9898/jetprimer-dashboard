import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH: Update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get customer ID for current user
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Verify the todo belongs to this customer
    const { data: existingTodo } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single()

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, is_completed, due_date, priority } = body

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (is_completed !== undefined) updateData.is_completed = is_completed
    if (due_date !== undefined) updateData.due_date = due_date || null
    if (priority !== undefined) updateData.priority = priority

    // Update todo
    const { data: todo, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('customer_id', customer.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating todo:', error)
      return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, todo })
  } catch (error) {
    console.error('Error in PATCH /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get customer ID for current user
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Delete the todo (RLS will also verify ownership)
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('customer_id', customer.id)

    if (error) {
      console.error('Error deleting todo:', error)
      return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
