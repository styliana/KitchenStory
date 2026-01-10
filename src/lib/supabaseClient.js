// Supabase client placeholder.
// To enable Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (.env) and restart the dev server.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export function hasSupabase() {
  return !!supabase;
}
