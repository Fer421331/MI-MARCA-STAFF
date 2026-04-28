/**
 * LOGIN PAGE
 * ----------
 * Enterprise login with animated background, form validation,
 * loading state, and error display.
 * Architecture ready for Supabase Auth integration.
 */

import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, User2, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import MiMarcaLogo from '../components/ui/MiMarcaLogo'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [shake,     setShake]     = useState(false)

  /* If already logged in, redirect */
  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Por favor ingresa usuario y contraseña.')
      triggerShake()
      return
    }

    setError('')
    setLoading(true)

    const result = await login(username, password)

    setLoading(false)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
      triggerShake()
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden p-4">
      {/* ── Animated background ──────────────────────────────── */}
      <BackgroundFX />

      {/* ── Login card ───────────────────────────────────────── */}
      <div className={`
        relative z-10 w-full max-w-md
        animate-slide-in-up
        ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}
      `}>
        {/* Glow border effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-800/40 to-transparent pointer-events-none" />

        <div className="bg-surface-900/90 backdrop-blur-xl border border-surface-700 rounded-2xl shadow-card-hover overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-brand-900 via-brand-600 to-brand-900" />

          <div className="px-8 pt-8 pb-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <MiMarcaLogo size="lg" />
              <p className="text-surface-400 text-sm mt-4 text-center">
                Plataforma de Gestión Interna
              </p>
            </div>

            {/* ── Form ─────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="login-username" className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                    <User2 size={16} />
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError('') }}
                    placeholder="Ingresa tu usuario"
                    className="input-field pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 bg-brand-950 border border-brand-800 rounded-lg px-4 py-3 animate-fade-in">
                  <AlertCircle size={15} className="text-brand-400 shrink-0" />
                  <p className="text-sm text-brand-300">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 h-11 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Verificando…</>
                  : 'Iniciar Sesión'
                }
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 pt-5 border-t border-surface-700">
              <p className="text-center text-xs text-surface-600 mb-3">Cuentas de demostración</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_USERS.map(d => (
                  <button
                    key={d.username}
                    type="button"
                    onClick={() => { setUsername(d.username); setPassword(d.password); setError('') }}
                    className="text-xs px-3 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-surface-500 text-surface-400 hover:text-white transition-all text-left truncate"
                  >
                    <span className="font-medium text-surface-300">{d.username}</span>
                    <span className="text-surface-600 ml-1">· {d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-surface-700 mt-6">
          © {new Date().getFullYear()} Mi Marca · Uso interno exclusivo
        </p>
      </div>

      {/* Shake keyframes injected inline (Tailwind JIT limitation) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}

/* ── Animated background ──────────────────────────────────────────────────────── */
function BackgroundFX() {
  return (
    <>
      {/* Radial glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-800/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-brand-950/30 blur-[80px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
    </>
  )
}

const DEMO_USERS = [
  { username: 'admin',   password: 'admin123',   label: 'Admin'   },
  { username: 'ventas',  password: 'ventas123',  label: 'Ventas'  },
  { username: 'rrhh',    password: 'rrhh123',    label: 'RR.HH.'  },
  { username: 'soporte', password: 'soporte123', label: 'Soporte' },
]
