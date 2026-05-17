import { supabaseAdmin } from '@/lib/supabase-admin';

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin not configured');
  }
  return supabaseAdmin;
}