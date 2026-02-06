import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
]

// GET: Fetch all documents for the current user
export async function GET() {
  try {
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

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('customer_id', customer.id)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error('Error in GET /api/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Upload a new document
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id, flight_code')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = (formData.get('document_type') as string) || 'other'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, JPEG, PNG, WebP, HEIC' },
        { status: 400 }
      )
    }

    // Generate unique file path: customer-{id}/{timestamp}_{filename}
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `customer-${customer.id}/${timestamp}_${sanitizedName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('customer-documents')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Create document record in DB
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        customer_id: customer.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        document_type: documentType,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      // Try to clean up uploaded file
      await supabase.storage.from('customer-documents').remove([filePath])
      return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 })
    }

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Error in POST /api/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
