import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch documents for a specific customer (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customerId = request.nextUrl.searchParams.get('customer_id')
    if (!customerId) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const { data: documents, error } = await adminClient
      .from('documents')
      .select('*')
      .eq('customer_id', customerId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching customer documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error('Error in GET /api/admin/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update document status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { document_id, status, admin_note } = body

    if (!document_id) {
      return NextResponse.json({ error: 'document_id is required' }, { status: 400 })
    }

    if (status && !['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const updateData: Record<string, unknown> = {}
    if (status) {
      updateData.status = status
      updateData.reviewed_at = new Date().toISOString()
    }
    if (admin_note !== undefined) {
      updateData.admin_note = admin_note
    }

    const { data: document, error } = await adminClient
      .from('documents')
      .update(updateData)
      .eq('id', document_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
    }

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Error in PATCH /api/admin/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
