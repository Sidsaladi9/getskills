import { Link } from 'react-router-dom'
import { Star, Download, Bookmark, BookmarkCheck, Lock, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, PLATFORMS } from '../data/skills'

const CATEGORY_GRADIENTS = {
  productivity: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  coding: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
  writing: 'linear-gradient(135deg, #34d399, #10b981)',
  data: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
  design: 'linear-gradient(135deg, #f472b6, #ec4899)',
  devops: 'linear-gradient(135deg, #fb923c, #f97316)',
  business: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
  education: 'linear-gradient(135deg, #818cf8, #6366f1)',
}

export default function SkillCard({ skill, featured = false }) {
  const { user, toggleSave, isSkillSaved, canSaveMore, isPro } = useApp()
  const saved = isSkillSaved(skill.id)
  const category = CATEGORIES.find(c => c.id === skill.category)
  const gradient = CATEGORY_GRADIENTS[skill.category] || 'linear-gradient(135deg, #FF6B6B, #FFA0A0)'

  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (!saved && !canSaveMore) return
    toggleSave(skill.id)
  }

  return (
    <Link
      to={`/skill/${skill.slug || skill.id}`}
      className="skill-card relative block bg-white rounded-2xl border border-surface-200 overflow-hidden no-underline text-left transition-all hover:shadow-lg group"
    >
      {/* Hover overlay */}
      <div className="skill-card-overlay">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-surface-900 text-sm font-semibold rounded-full shadow-lg">
          Use Skill <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Category gradient header */}
      <div
        className="h-2 w-full"
        style={{ background: gradient }}
      />

      <div className="p-5">
        {/* Top row: category + premium + save */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {category && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.bg} ${category.color}`}>
                {category.name}
              </span>
            )}
            {skill.isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                <Lock className="w-3 h-3" /> Pro
              </span>
            )}
          </div>
          {user && (
            <button
              onClick={handleSave}
              className={`p-1.5 rounded-lg transition-colors ${
                saved
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-surface-300 hover:text-primary-500 hover:bg-primary-50'
              }`}
              aria-label={saved ? 'Unsave skill' : 'Save skill'}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-surface-900 mb-2 font-heading">{skill.title}</h3>

        {/* Description */}
        <p className="text-sm text-surface-500 leading-relaxed mb-4 line-clamp-2">{skill.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-surface-100 text-surface-500 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-medium text-surface-700">{skill.stars}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <Download className="w-3.5 h-3.5" />
              <span>{skill.installs.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold">
              {skill.author.avatar}
            </div>
            <span className="text-xs text-surface-400">{skill.author.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
