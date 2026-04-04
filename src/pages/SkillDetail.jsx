import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, Download, Bookmark, BookmarkCheck, Copy, Check, ArrowLeft,
  Calendar, RefreshCw, Lock, Share2, Flag, ChevronRight, ExternalLink
} from 'lucide-react'
import { SKILLS, CATEGORIES, PLATFORMS } from '../data/skills'
import { useApp } from '../context/AppContext'
import SkillCard from '../components/SkillCard'

export default function SkillDetail() {
  const { id } = useParams()
  const skill = SKILLS.find(s => s.id === id)
  const { user, toggleSave, isSkillSaved, canSaveMore, isPro } = useApp()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  if (!skill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Skill not found</h2>
        <Link to="/browse" className="text-primary-600 no-underline font-medium">Browse all skills</Link>
      </div>
    )
  }

  const category = CATEGORIES.find(c => c.id === skill.category)
  const platform = PLATFORMS.find(p => p.id === skill.platform)
  const saved = isSkillSaved(skill.id)
  const relatedSkills = SKILLS.filter(s => s.category === skill.category && s.id !== skill.id).slice(0, 3)

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.skillCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const canView = !skill.isPremium || isPro

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link to="/browse" className="no-underline text-surface-500 hover:text-surface-700 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Browse
        </Link>
        <ChevronRight className="w-3 h-3" />
        {category && (
          <>
            <Link to={`/browse?category=${category.id}`} className="no-underline text-surface-500 hover:text-surface-700">
              {category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-surface-700">{skill.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-xl border border-surface-200 p-8 mb-6">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-surface-900 mb-3">{skill.title}</h1>
            <p className="text-lg text-surface-500 leading-relaxed mb-6">{skill.description}</p>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-surface-900">{skill.stars}</span>
                <span className="text-surface-400">({skill.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-surface-500">
                <Download className="w-4 h-4" />
                <span>{skill.installs.toLocaleString()} installs</span>
              </div>
              <div className="flex items-center gap-1.5 text-surface-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-surface-500">
                <RefreshCw className="w-4 h-4" />
                <span>Updated {new Date(skill.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {skill.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/browse?q=${tag}`}
                  className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-lg no-underline hover:bg-surface-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                disabled={!canView}
                className={`px-6 py-3 font-semibold rounded-xl inline-flex items-center gap-2 transition-all ${
                  canView
                    ? 'gradient-bg text-white hover:opacity-90'
                    : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied to clipboard!' : 'Copy skill'}
              </button>
              {user && (
                <button
                  onClick={handleSave}
                  className={`px-6 py-3 font-semibold rounded-xl inline-flex items-center gap-2 border transition-colors ${
                    saved
                      ? 'border-primary-300 bg-primary-50 text-primary-600'
                      : 'border-surface-200 text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  {saved ? 'Saved' : 'Save to library'}
                </button>
              )}
            </div>

            {!canView && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  This is a Pro skill.{' '}
                  <Link to="/pricing" className="font-semibold text-amber-900 underline">
                    Upgrade to Pro
                  </Link>{' '}
                  to copy and use this skill.
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
            <div className="flex border-b border-surface-200">
              {['overview', 'code', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                      : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="prose prose-surface max-w-none">
                  {skill.longDescription.split('\\n\\n').map((para, i) => (
                    <p key={i} className="text-surface-600 leading-relaxed mb-4 whitespace-pre-wrap">
                      {para.replace(/\\n/g, '\n')}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === 'code' && (
                <div>
                  {canView ? (
                    <div className="relative">
                      <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 p-2 rounded-lg bg-surface-700 text-surface-300 hover:text-white hover:bg-surface-600 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <div className="code-block p-6 overflow-auto">
                        <pre className="text-sm whitespace-pre-wrap">{skill.skillCode}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Lock className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-surface-700 mb-2">Pro skill</h3>
                      <p className="text-surface-500 mb-6">Upgrade to Pro to view and copy this skill</p>
                      <Link
                        to="/pricing"
                        className="px-6 py-3 gradient-bg text-white font-semibold rounded-xl no-underline hover:opacity-90 transition-opacity"
                      >
                        Upgrade to Pro
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {[
                    { name: 'Alex M.', rating: 5, comment: 'This skill saves me hours every week. The output quality is fantastic.', date: '2 days ago' },
                    { name: 'Jordan K.', rating: 5, comment: 'Exactly what I was looking for. Works great with Claude Code.', date: '1 week ago' },
                    { name: 'Sam T.', rating: 4, comment: 'Very useful! Would love to see support for more frameworks.', date: '2 weeks ago' },
                  ].map((review, i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b border-surface-100 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-surface-900 text-sm">{review.name}</span>
                          <div className="flex items-center gap-0.5">
                            {Array(5).fill(0).map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3.5 h-3.5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-surface-400">{review.date}</span>
                        </div>
                        <p className="text-sm text-surface-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author */}
          <div className="bg-white rounded-xl border border-surface-200 p-6">
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
          <div className="bg-white rounded-xl border border-surface-200 p-6">
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
              <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-4">Related skills</h3>
              <div className="space-y-4">
                {relatedSkills.map(s => (
                  <Link
                    key={s.id}
                    to={`/skill/${s.id}`}
                    className="block bg-white rounded-xl border border-surface-200 p-4 no-underline hover:border-primary-300 transition-colors"
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
  )
}
