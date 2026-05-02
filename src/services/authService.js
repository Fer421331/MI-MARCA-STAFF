/**
 * AUTH SERVICE
 * -----------
 * Service layer for Supabase authentication.
 * Handles the username → email lookup and Supabase Auth sign-in flow.
 */

import { supabase } from '../lib/supabase'

// ─── Role constants ──────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: 'Administrador',
  SALES: 'Ventas',
  HR: 'Recursos Humanos',
  SUPPORT: 'Soporte',
}

// ─── Role → default landing route ───────────────────────────────────────────
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.SALES]: '/ventas',
  [ROLES.HR]: '/rrhh',
  [ROLES.SUPPORT]: '/soporte',
}

/**
 * loginWithUsername()
 */
export async function loginWithUsername(username, password) {
  try {
    // Step 1: Find the user record by username
    const { data: userRecord, error: lookupError } = await supabase
      .from('usuarios')
      .select('cod_usuarios, usuario, auth_user_id, cod_personas')
      .eq('usuario', username.trim().toLowerCase())
      .maybeSingle()

    if (lookupError) {
      console.error('Lookup error:', lookupError)
      return {
        success: false,
        error: 'Error al verificar usuario. Intenta de nuevo.',
      }
    }

    if (!userRecord) {
      return {
        success: false,
        error: 'Usuario o contraseña incorrectos.',
      }
    }

    // Step 2: Get email from personas table
    const { data: personData, error: personError } = await supabase
      .from('personas')
      .select('correo')
      .eq('cod_persona', userRecord.cod_personas)
      .maybeSingle()

    if (personError || !personData?.correo) {
      console.error('Person lookup error:', personError)

      return {
        success: false,
        error: 'Error al obtener información del usuario.',
      }
    }

    // Step 3: Supabase Auth login
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: personData.correo,
        password: password,
      })

    if (authError) {
      console.error('Auth error:', authError)

      if (authError.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos.',
        }
      }

      if (authError.message.includes('Email not confirmed')) {
        return {
          success: false,
          error:
            'Cuenta pendiente de activación. Contacta al administrador.',
        }
      }

      return {
        success: false,
        error: 'Error de autenticación. Intenta de nuevo.',
      }
    }

    // Step 4: Fetch role
    const role = await fetchUserRole(userRecord.cod_usuarios)

    // Step 5: Fetch display name
    const { data: fullPerson } = await supabase
      .from('personas')
      .select(
        `
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido
      `
      )
      .eq('cod_persona', userRecord.cod_personas)
      .maybeSingle()

    const displayName = fullPerson
      ? [fullPerson.primer_nombre, fullPerson.primer_apellido]
        .filter(Boolean)
        .join(' ')
      : username

    return {
      success: true,
      user: {
        id: userRecord.cod_usuarios,
        authId: authData.user.id,
        username: userRecord.usuario,
        name: displayName,
        role: role,
        codPersonas: userRecord.cod_personas,
      },
    }
  } catch (err) {
    console.error('Login error:', err)

    return {
      success: false,
      error: 'Error inesperado. Intenta de nuevo.',
    }
  }
}

/**
 * fetchUserRole()
 */
async function fetchUserRole(codUsuarios) {
  try {
    const { data, error } = await supabase
      .from('usuario_x_roles')
      .select(
        `
        cod_rol,
        roles(descripcion)
      `
      )
      .eq('cod_usuario', codUsuarios)
      .maybeSingle()

    if (error || !data) {
      console.warn('Role lookup failed:', error)
      return 'Sin Rol'
    }

    return data.roles?.descripcion || 'Sin Rol'
  } catch (err) {
    console.error('fetchUserRole error:', err)
    return 'Sin Rol'
  }
}

/**
 * fetchCurrentUserProfile()
 */
export async function fetchCurrentUserProfile() {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return { success: false }
    }

    const authUserId = session.user.id

    // Find usuario linked to auth user
    const { data: userRecord, error: userError } = await supabase
      .from('usuarios')
      .select('cod_usuarios, usuario, auth_user_id, cod_personas')
      .eq('auth_user_id', authUserId)
      .maybeSingle()

    if (userError || !userRecord) {
      console.error('User restore error:', userError)
      return { success: false }
    }

    // Fetch role
    const role = await fetchUserRole(userRecord.cod_usuarios)

    // Fetch person info
    const { data: person } = await supabase
      .from('personas')
      .select('primer_nombre, primer_apellido')
      .eq('cod_persona', userRecord.cod_personas)
      .maybeSingle()

    const displayName = person
      ? [person.primer_nombre, person.primer_apellido]
        .filter(Boolean)
        .join(' ')
      : userRecord.usuario

    return {
      success: true,
      user: {
        id: userRecord.cod_usuarios,
        authId: authUserId,
        username: userRecord.usuario,
        name: displayName,
        role: role,
        codPersonas: userRecord.cod_personas,
      },
    }
  } catch (err) {
    console.error('Profile restore error:', err)
    return { success: false }
  }
}

/**
 * logout()
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
  }
}

/**
 * getDefaultRoute()
 */
export function getDefaultRoute(role) {
  return ROLE_ROUTES[role] || '/dashboard'
}

/**
 * onAuthStateChange()
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)

  return subscription
}