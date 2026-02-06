import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// DELETE: Admin deletes a customer and all related data
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // Verify customer exists
    const { data: customer } = await adminSupabase
      .from('customers')
      .select('id, user_id, name')
      .eq('id', customerId)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Delete related data first (in case there are no CASCADE constraints)
    await adminSupabase.from('todos').delete().eq('customer_id', customer.id)
    await adminSupabase.from('steps').delete().eq('customer_id', customer.id)
    await adminSupabase.from('email_logs').delete().eq('customer_id', customer.id)

    // Delete the customer record
    const { error: deleteError } = await adminSupabase
      .from('customers')
      .delete()
      .eq('id', customer.id)

    if (deleteError) {
      console.error('Error deleting customer:', deleteError)
      return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
    }

    // Optionally delete the auth user from Supabase Auth
    if (customer.user_id) {
      const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(customer.user_id)
      if (authDeleteError) {
        console.error('Error deleting auth user (non-critical):', authDeleteError)
        // Don't fail the whole operation - the customer record is already gone
      }
    }

    return NextResponse.json({ success: true, deletedCustomer: customer.name })
  } catch (error) {
    console.error('Error in DELETE /api/admin/customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
