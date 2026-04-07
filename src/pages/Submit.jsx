import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Check, Info, Loader2 } from 'lucide-react'
import { CATEGORIES, PLATFORMS } from '../data/skills'
import { useApp } from '../context/AppContext'
import { submitSkill } from '../lib/skills'

export default function Submit() {
  const { user, rawUser } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    platform: '',
    tags: '',
    skillCode: '',
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await submitSkill({
      ...form,
      authorId: rawUser?.id || null,
    })
    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error || 'Failed to submit skill')
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Upload className="w-8 h-8 text-[#FF6B6B]" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-4">Submit a Skill</h1>
        <p className="text-surface-500 mb-8">
          Share your best AI skills with the community. Sign in to get started.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
          >
            Sign up free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl no-underline hover:bg-surface-50 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FF6B6B] flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-4">Skill submitted!</h1>
        <p className="text-surface-500 mb-8">
          We&apos;ll review it shortly. You&apos;ll receive an email once it&apos;s published.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/browse"
            className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
          >
            Browse skills
          </Link>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ title: '', description: '', category: '', platform: '', tags: '', skillCode: '' })
            }}
            className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">Submit a Skill</h1>
        <p className="text-surface-500">Share your skill with the community. It will be reviewed before publishing.</p>
      </div>

      {/* Info banner */}
      <div className="bg-primary-50 border border-[#FF6B6B]/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#FF6B6B] mt-0.5 shrink-0" />
        <div className="text-sm text-surface-700">
          <strong>Skill format:</strong> Skills use a YAML frontmatter header (name, description) followed by the skill instructions.
          Your skill should use a YAML frontmatter header (<code className="px-1 py-0.5 bg-white rounded text-xs">---</code>) with <code className="px-1 py-0.5 bg-white rounded text-xs">name</code> and <code className="px-1 py-0.5 bg-white rounded text-xs">description</code> fields, followed by the instructions.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Skill title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Smart Commit Messages"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Short description *</label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="One or two sentences describing what this skill does"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B] resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1.5">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1.5">Platform *</label>
              <select
                required
                value={form.platform}
                onChange={(e) => update('platform', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-surface-200 text-surface-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
              >
                <option value="">Select platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="Comma-separated tags, e.g. git, automation, testing"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1.5">Skill code *</label>
            <textarea
              required
              rows={12}
              value={form.skillCode}
              onChange={(e) => update('skillCode', e.target.value)}
              placeholder={`---\nname: my-skill\ndescription: What the skill does\n---\n\nYour skill instructions here...`}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-900 text-surface-50 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B] resize-none font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            to="/browse"
            className="px-6 py-3 text-surface-600 font-medium no-underline hover:text-surface-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#E85555] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  )
}
