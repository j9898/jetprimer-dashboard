import { createClient } from '@supabase/supabase-js'

// Service role client that bypasses RLS - ONLY use in admin API routes
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
