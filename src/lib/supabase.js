/**
 * SUPABASE CLIENT
 * ---------------
 * Singleton Supabase client initialized from environment variables.
 * Used across the entire application for auth, database, and realtime.
 *
 * Environment variables (Vite):
 *   VITE_SUPABASE_URL      — Supabase project URL
 *   VITE_SUPABASE_ANON_KEY — Supabase anonymous/public key
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    // Persist session in localStorage automatically
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Storage key for the session
    storageKey: 'mi_marca_staff_auth',
  },
})
