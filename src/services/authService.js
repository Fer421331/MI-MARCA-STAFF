/**
 * AUTH SERVICE — Supabase integration stub
 * ----------------------------------------
 * When ready, import the supabase client here and replace
 * mock functions with real Supabase Auth calls.
 *
 * Usage example:
 *   import { signIn, signOut, getSession } from './authService'
 *
 * TODO: npm install @supabase/supabase-js
 * TODO: Create src/lib/supabase.js:
 *   import { createClient } from '@supabase/supabase-js'
 *   export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 */

// import { supabase } from '../lib/supabase'

/**
 * signIn
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
  // return await supabase.auth.signInWithPassword({ email, password })
  throw new Error('Supabase not yet integrated. Use mock login in AuthContext.')
}

/**
 * signOut
 */
export async function signOut() {
  // return await supabase.auth.signOut()
  throw new Error('Supabase not yet integrated.')
}

/**
 * getSession
 */
export async function getSession() {
  // return await supabase.auth.getSession()
  throw new Error('Supabase not yet integrated.')
}

/**
 * onAuthStateChange
 * @param {Function} callback
 */
export function onAuthStateChange(callback) {
  // return supabase.auth.onAuthStateChange(callback)
}
