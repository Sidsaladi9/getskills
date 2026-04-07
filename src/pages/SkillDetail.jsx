import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, Download, Heart, Copy, Check, ChevronRight, Lock,
  Share2, Calendar, RefreshCw, Loader2, Clipboard, ArrowRight,
  MessageSquare, BarChart3, TrendingUp, FileDown
} from 'lucide-react'
import { CATEGORIES, PLATFORMS, SKILLS } from '../data/skills'
import { useApp } from '../context/AppContext'
import { fetchSkillBySlug, fetchSkills, fetchReviews, submitReview, trackInstall, fetchDailyStats } from '../lib/skills'
import SkillCard from '../components/SkillCard'
import Sparkline from '../components/Sparkline'
import RatingBar from '../components/RatingBar'

export default function SkillDetail() {
  const { id } = useParams()
  const [skill, setSkill] = useState(null)
  const [relatedSkills, setRelatedSkills] = useState([])
  const [reviews, setReviews] = useState([])
  const [dailyStats, setDailyStats] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, toggleSave, isSkillSaved, canSaveMore, isPro } = useApp()
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [activeTab, setActiveTab] = useState('copy')

  // Review form state
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setActiveTab('copy')
    setCopied(false)
    fetchSkillBySlug(id).then((s) => {
      setSkill(s)
      if (s) {
        trackInstall(s.id, 'view')
        fetchSkills({ category: s.category }).then((all) =>
          setRelatedSkills(all.filter((r) => r.id !== s.id && r.slug !== s.slug).slice(0, 3))
        )
        fetchReviews(s.id).then(setReviews)
        fetchDailyStats(s.id).then(setDailyStats)
      }
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-[#FF6B6B] animate-spin mx-auto" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-900 font-heading mb-4">Skill not found</h2>
        <Link to="/browse" className="text-[#FF6B6B] no-underline font-medium">Browse all skills</Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === skill.category)
  const platform = PLATFORMS.find((p) => p.id === skill.platform)
  const saved = isSkillSaved(skill.id)
  const canView = !skill.isPremium || isPro

  const handleCopy = () => {
    if (!canView) return
    navigator.clipboard.writeText(skill.skillCode)
    setCopied(true)
    trackInstall(skill.id, 'copy')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!canView) return
    const blob = new Blob([skill.skillCode], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${skill.slug || skill.id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    trackInstall(skill.id, 'download')
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  const handleSave = () => {
    if (!user) return
    if (!saved && !canSaveMore) return
    toggleSave(skill.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: skill.title, text: skill.description, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !reviewRating || !reviewComment.trim()) return
    setReviewSubmitting(true)
    await submitReview(skill.id, user.id, reviewRating, reviewComment)
    const updated = await fetchReviews(skill.id)
    setReviews(updated)
    setReviewRating(0)
    setReviewComment('')
    setReviewSubmitting(false)
  }

  // Compute rating distribution from actual reviews
  const ratingDistribution = (() => {
    if (reviews.length === 0) {
      // Estimate from aggregate when no detailed reviews loaded
      const total = skill.reviews || 0
      return [
        Math.round(total * 0.02),
        Math.round(total * 0.03),
        Math.round(total * 0.1),
        Math.round(total * 0.3),
        Math.round(total * 0.55),
      ]
    }
    const dist = [0, 0, 0, 0, 0]
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++ })
    return dist
  })()

  const tabs = [
    { id: 'copy', label: 'Copy & Use', icon: Clipboard },
    { id: 'details', label: 'Details', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Category gradient banner */}
      <div className="h-28 gradient-bg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
          <Link to="/" className="no-underline text-white/80 hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/browse" className="no-underline text-white/80 hover:text-white">Browse</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">{skill.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Header Card */}
            <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {category && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.bg} ${category.color}`}>
                      {category.name}
                    </span>
                  )}
                  {platform && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-surface-100 text-surface-600">
                      {platform.name}
                    </span>
                  )}
                  {skill.isPremium && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600">
                      <Lock className="w-3 h-3" /> Pro Only
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {user && (
                    <button
                      onClick={handleSave}
                      className={`p-2 rounded-lg transition-colors ${
                        saved
                          ? 'text-[#FF6B6B] bg-red-50'
                          : 'text-surface-400 hover:text-[#FF6B6B] hover:bg-red-50'
                      }`}
                      title={saved ? 'Saved' : 'Save'}
                    >
                      <Heart className={`w-5 h-5 ${saved ? 'fill-[#FF6B6B]' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-surface-900 font-heading mb-2">{skill.title}</h1>

              {/* Author */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                  {skill.author.avatar}
                </div>
                <span className="text-sm text-surface-600">{skill.author.name}</span>
                {skill.author.verified && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded">Verified</span>
                )}
              </div>

              <p className="text-lg text-surface-500 leading-relaxed mb-5">{skill.description}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 mb-5">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-surface-900">{skill.stars}</span>
                  <span className="text-surface-400 text-sm">({skill.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-surface-500 text-sm">
                  <Download className="w-4 h-4" />
                  {skill.installs.toLocaleString()} installs
                </div>
                <div className="flex items-center gap-1.5 text-surface-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-surface-500 text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Updated {new Date(skill.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((t) => (
                  <Link
                    key={t}
                    to={`/browse?q=${t}`}
                    className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-lg no-underline hover:bg-surface-200 transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3-Tab System */}
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
              {/* Tab bar */}
              <div className="flex border-b border-surface-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors ${
                        activeTab === tab.id
                          ? 'text-[#FF6B6B] border-b-2 border-[#FF6B6B] bg-red-50/30'
                          : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="p-6">
                {/* Tab 1: Copy & Use */}
                {activeTab === 'copy' && (
                  <div>
                    {canView ? (
                      <>
                        {/* Skill code block */}
                        <div className="relative mb-4">
                          <div className="bg-surface-900 rounded-xl p-6 overflow-auto max-h-96">
                            <pre className="text-sm text-surface-300 whitespace-pre-wrap font-mono">{skill.skillCode}</pre>
                          </div>
                        </div>

                        {/* Download + Copy buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleDownload}
                            className={`flex-1 py-4 rounded-xl font-semibold text-base inline-flex items-center justify-center gap-2.5 transition-all ${
                              downloaded
                                ? 'bg-emerald-500 text-white'
                                : 'gradient-bg text-white hover:opacity-90 shadow-lg shadow-[#FF6B6B]/20'
                            }`}
                          >
                            {downloaded ? (
                              <>
                                <Check className="w-5 h-5" />
                                Downloaded!
                              </>
                            ) : (
                              <>
                                <FileDown className="w-5 h-5" />
                                Download .md
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleCopy}
                            className={`px-6 py-4 rounded-xl font-semibold text-base inline-flex items-center justify-center gap-2.5 transition-all border ${
                              copied
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : 'bg-white border-surface-200 text-surface-700 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-5 h-5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        {/* How to use */}
                        <div className="mt-8 pt-6 border-t border-surface-100">
                          <h3 className="text-lg font-semibold text-surface-900 font-heading mb-4">How to use</h3>
                          <div className="space-y-4">
                            {[
                              { step: 1, title: 'Download the .md file', desc: 'Click "Download .md" to save the skill as a markdown file, or use "Copy" to grab it to your clipboard.' },
                              { step: 2, title: 'Add to your AI tool', desc: 'Drop the .md file into your tool\'s skills folder — e.g. ~/.claude/commands/ for Claude Code, or paste directly into ChatGPT/Cursor.' },
                              { step: 3, title: "Start using the skill", desc: 'The skill will guide your AI on how to help you. Just start working!' },
                            ].map((item) => (
                              <div key={item.step} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                                  <span className="text-white text-sm font-bold">{item.step}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-surface-900 text-sm">{item.title}</h4>
                                  <p className="text-sm text-surface-500 mt-0.5">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Premium gate overlay */
                      <div className="text-center py-12">
                        <div className="relative inline-block mb-6">
                          <div className="bg-surface-900 rounded-xl p-6 opacity-20 blur-sm max-w-md mx-auto">
                            <pre className="text-sm text-surface-300 whitespace-pre-wrap font-mono">
                              {skill.skillCode.slice(0, 200)}...
                            </pre>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-12 h-12 text-surface-300" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-surface-700 font-heading mb-2">
                          Upgrade to Pro to copy this skill
                        </h3>
                        <p className="text-surface-500 mb-6 max-w-sm mx-auto">
                          This is a premium skill. Unlock all Pro skills with a GetSkills Pro subscription.
                        </p>
                        <Link
                          to="/pricing"
                          className="inline-flex items-center gap-2 px-8 py-3 gradient-bg text-white font-semibold rounded-xl no-underline hover:opacity-90 transition-opacity"
                        >
                          Upgrade to Pro <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Details */}
                {activeTab === 'details' && (
                  <div>
                    <div className="prose prose-surface max-w-none mb-8">
                      {(skill.longDescription || skill.description || '').split(/\n\n+/).map((para, i) => (
                        <p key={i} className="text-surface-600 leading-relaxed mb-4 whitespace-pre-wrap">
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Skill metadata */}
                    <div className="border-t border-surface-100 pt-6">
                      <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Skill Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <p className="text-xs text-surface-400 mb-1">Created</p>
                          <p className="text-sm font-medium text-surface-700">
                            {new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <p className="text-xs text-surface-400 mb-1">Last Updated</p>
                          <p className="text-sm font-medium text-surface-700">
                            {new Date(skill.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <p className="text-xs text-surface-400 mb-1">Platform</p>
                          <p className="text-sm font-medium text-surface-700">{platform?.name || skill.platform}</p>
                        </div>
                        <div className="p-3 bg-surface-50 rounded-lg">
                          <p className="text-xs text-surface-400 mb-1">Category</p>
                          <p className="text-sm font-medium text-surface-700">{category?.name || skill.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === 'reviews' && (
                  <div>
                    {/* Rating summary */}
                    <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-surface-100">
                      <div className="text-center sm:text-left shrink-0">
                        <div className="text-5xl font-bold text-surface-900 font-heading mb-1">{skill.stars}</div>
                        <div className="flex items-center gap-0.5 justify-center sm:justify-start mb-1">
                          {Array(5).fill(0).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-5 h-5 ${j < Math.round(skill.stars) ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-surface-400">{skill.reviews} reviews</p>
                      </div>
                      <div className="flex-1">
                        <RatingBar distribution={ratingDistribution} />
                      </div>
                    </div>

                    {/* Review list */}
                    <div className="space-y-6 mb-8">
                      {reviews.map((review, i) => {
                        const name = review.user_name || review.name || 'Anonymous'
                        const date = review.created_at
                          ? new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : review.date || ''
                        return (
                          <div key={review.id || i} className="flex gap-4 pb-6 border-b border-surface-100 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm shrink-0">
                              {name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-surface-900 text-sm">{name}</span>
                                <div className="flex items-center gap-0.5">
                                  {Array(5).fill(0).map((_, j) => (
                                    <Star
                                      key={j}
                                      className={`w-3.5 h-3.5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-surface-400">{date}</span>
                              </div>
                              <p className="text-sm text-surface-600">{review.comment}</p>
                            </div>
                          </div>
                        )
                      })}
                      {reviews.length === 0 && (
                        <p className="text-sm text-surface-400 text-center py-6">No reviews yet. Be the first!</p>
                      )}
                    </div>

                    {/* Write a Review */}
                    {user && (
                      <div className="bg-warm-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-surface-900 font-heading mb-4">Write a Review</h3>

                        {/* Star selector */}
                        <div className="flex items-center gap-1 mb-4">
                          <span className="text-sm text-surface-500 mr-2">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              onClick={() => setReviewRating(star)}
                              className="p-0.5"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= (reviewHover || reviewRating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-surface-200'
                                }`}
                              />
                            </button>
                          ))}
                          {reviewRating > 0 && (
                            <span className="text-sm text-surface-500 ml-2">{reviewRating}/5</span>
                          )}
                        </div>

                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this skill..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/40 focus:border-[#FF6B6B] text-sm resize-none transition-all"
                        />

                        <button
                          onClick={handleSubmitReview}
                          disabled={!reviewRating || !reviewComment.trim() || reviewSubmitting}
                          className={`mt-3 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                            reviewRating && reviewComment.trim()
                              ? 'gradient-bg text-white hover:opacity-90'
                              : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                          }`}
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Analytics */}
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Usage Analytics
              </h3>
              <Sparkline
                data={dailyStats.length > 0
                  ? dailyStats.map(d => (d.copies || 0) + (d.downloads || 0))
                  : [12, 18, 25, 22, 30, 28, 35, 42, 38, 45, 50, 48, 55, 60]
                }
                height={48}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-surface-400">Total installs</p>
                  <p className="text-lg font-bold text-surface-900">{skill.installs.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-400">Last 14 days</p>
                  <p className="text-lg font-bold text-surface-900">
                    {dailyStats.length > 0
                      ? dailyStats.reduce((sum, d) => sum + (d.copies || 0) + (d.downloads || 0), 0).toLocaleString()
                      : Math.round(skill.installs * 0.08).toLocaleString()
                    }
                  </p>
                </div>
              </div>
              {platform && (
                <div className="mt-4 pt-4 border-t border-surface-100">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-100 text-surface-600 text-sm font-medium">
                    {platform.name}
                  </span>
                </div>
              )}
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Author</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {skill.author.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-surface-900">{skill.author.name}</span>
                    {skill.author.verified && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded">Verified</span>
                    )}
                  </div>
                  <span className="text-sm text-surface-400">Skill creator</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Installs</span>
                  <span className="font-semibold text-surface-900">{skill.installs.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-surface-900">{skill.stars}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Reviews</span>
                  <span className="font-semibold text-surface-900">{skill.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Platform</span>
                  <span className="font-semibold text-surface-900">{platform?.name}</span>
                </div>
              </div>
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Related Skills</h3>
                <div className="space-y-4">
                  {relatedSkills.map((s) => (
                    <Link
                      key={s.id}
                      to={`/skill/${s.slug || s.id}`}
                      className="block bg-white rounded-xl border border-surface-200 p-4 no-underline hover:border-[#FF6B6B]/30 hover:shadow-sm transition-all"
                    >
                      <h4 className="font-semibold text-surface-900 text-sm mb-1">{s.title}</h4>
                      <p className="text-xs text-surface-500 line-clamp-2">{s.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-surface-400">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {s.stars}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-surface-400">
                          <Download className="w-3 h-3" />
                          {s.installs.toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
