import { Link } from 'react-router-dom'
import { Star, Download, Bookmark, BookmarkCheck, Lock, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, PLATFORMS } from '../data/skills'

export default function SkillCard({ skill, featured = false }) {
  const { user, toggleSave, isSkillSaved, canSaveMore, isPro } = useApp()
  const saved = isSkillSaved(skill.id)
  const category = CATEGORIES.find(c => c.id === skill.category)
  const platform = PLATFORMS.find(p => p.id === skill.platform)

  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (!saved && !canSaveMore) return
    toggleSave(skill.id)
  }

  return (
    <Link
      to={`/skill/${skill.id}`}
      className={`skill-card block bg-white rounded-xl border border-surface-200 p-6 no-underline text-left transition-all ${
        featured ? 'gradient-border' : ''
      }`}
    >
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
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold text-surface-900 mb-2">{skill.title}</h3>
      <p className="text-sm text-surface-500 leading-relaxed mb-4 line-clamp-2">{skill.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {skill.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-surface-100 text-surface-500 text-xs rounded-md">
            #{tag}
          </span>
        ))}
      </div>

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
    </Link>
  )
}
