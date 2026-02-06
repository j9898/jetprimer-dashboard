import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// GET: Get signed URL for a document (admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()

    const { data: document } = await adminClient
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const { data: signedUrl, error } = await adminClient.storage
      .from('customer-documents')
      .createSignedUrl(document.file_path, 3600)

    if (error) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json({ error: 'Failed to create download link' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: signedUrl.signedUrl })
  } catch (error) {
    console.error('Error in GET /api/admin/documents/[id]/url:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
