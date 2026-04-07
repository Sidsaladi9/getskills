import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, Loader2, ArrowLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!isSupabaseConfigured()) {
      setSubmitting(false)
      setError('Password reset requires Supabase to be configured.')
      return
    }

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#FF6B6B] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">Check your email</h1>
          <p className="text-surface-500 mb-6">
            We sent a password reset link to <strong className="text-surface-700">{email}</strong>.
            Click the link to set a new password.
          </p>
          <p className="text-sm text-surface-400 mb-6">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
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
          <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">Reset your password</h1>
          <p className="text-surface-500">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#E85555] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send reset link
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-[#FF6B6B] font-medium no-underline hover:text-[#E85555]">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
