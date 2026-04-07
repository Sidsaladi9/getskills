import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  // Supabase handles the token exchange automatically when the user clicks the reset link
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    // Also check if we already have a session (user may have already been redirected)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)

    const { error: err } = await supabase.auth.updateUser({ password })

    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/library'), 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">Password updated!</h1>
          <p className="text-surface-500 mb-6">
            Your password has been reset successfully. Redirecting you to your library...
          </p>
          <Link to="/library" className="text-[#FF6B6B] font-medium no-underline hover:text-[#E85555]">
            Go to library
          </Link>
        </div>
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-heading font-bold text-surface-900 mb-4">Configuration required</h1>
          <p className="text-surface-500 mb-6">Password reset requires Supabase to be configured.</p>
          <Link to="/login" className="text-[#FF6B6B] font-medium no-underline hover:text-[#E85555]">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-surface-900">
              Get<span className="text-[#FF6B6B]">Skills</span>
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">Set new password</h1>
          <p className="text-surface-500">Choose a strong password for your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
          {!sessionReady && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
              Verifying your reset link... If this takes too long, try requesting a new reset link.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !sessionReady}
              className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#E85555] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
