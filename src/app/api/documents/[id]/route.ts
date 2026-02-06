import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Get a signed URL to view/download a document
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get document and verify ownership
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Create signed URL (valid for 1 hour)
    const { data: signedUrl, error: signError } = await supabase.storage
      .from('customer-documents')
      .createSignedUrl(document.file_path, 3600)

    if (signError) {
      console.error('Error creating signed URL:', signError)
      return NextResponse.json({ error: 'Failed to create download link' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: signedUrl.signedUrl })
  } catch (error) {
    console.error('Error in GET /api/documents/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a document (only if status is 'pending')
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get document and verify ownership + pending status
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (document.status !== 'pending') {
      return NextResponse.json(
        { error: 'Cannot delete a document that has been reviewed' },
        { status: 400 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('customer-documents')
      .remove([document.file_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from DB
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('customer_id', customer.id)

    if (dbError) {
      console.error('DB delete error:', dbError)
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/documents/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
