import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Zap, Code2, PenTool, BarChart3, Palette, Server, Briefcase, GraduationCap, Loader2 } from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { CATEGORIES, PLATFORMS } from '../data/skills'
import { fetchSkills } from '../lib/skills'

const ICON_MAP = { Zap, Code2, PenTool, BarChart3, Palette, Server, Briefcase, GraduationCap }

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most popular' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'newest', label: 'Newest' },
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const platform = searchParams.get('platform') || ''
  const sort = searchParams.get('sort') || 'popular'

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  useEffect(() => {
    setLoading(true)
    fetchSkills({ query, category, platform, sort })
      .then(setResults)
      .finally(() => setLoading(false))
  }, [query, category, platform, sort])

  const activeFilterCount = [category, platform].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Browse skills</h1>
        <p className="text-surface-500">Explore {results.length}+ community-built skills</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => updateParam('q', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-100"
            >
              <X className="w-4 h-4 text-surface-400" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`sm:w-auto px-4 py-3 rounded-xl border font-medium text-sm inline-flex items-center justify-center gap-2 transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'border-primary-300 bg-primary-50 text-primary-600'
              : 'border-surface-200 bg-white text-surface-600 hover:bg-surface-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full gradient-bg text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="sm:w-48 px-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-surface-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-surface-700 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !category ? 'gradient-bg text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => {
                  const Icon = ICON_MAP[cat.icon]
                  return (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
                        category === cat.id
                          ? 'gradient-bg text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-surface-700 mb-3">Platform</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('platform', '')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !platform ? 'gradient-bg text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  All
                </button>
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateParam('platform', platform === p.id ? '' : p.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      platform === p.id
                        ? 'gradient-bg text-white'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                updateParam('category', '')
                updateParam('platform', '')
              }}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filters chips */}
      {(category || platform) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-surface-500">Active filters:</span>
          {category && (
            <button
              onClick={() => updateParam('category', '')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium"
            >
              {CATEGORIES.find(c => c.id === category)?.name}
              <X className="w-3 h-3" />
            </button>
          )}
          {platform && (
            <button
              onClick={() => updateParam('platform', '')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium"
            >
              {PLATFORMS.find(p => p.id === platform)?.name}
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mb-4 text-sm text-surface-500">
        {results.length} skill{results.length !== 1 ? 's' : ''} found
        {query && <> for &quot;<span className="font-medium text-surface-700">{query}</span>&quot;</>}
      </div>

      {results.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-700 mb-2">No skills found</h3>
          <p className="text-surface-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchParams(new URLSearchParams())
            }}
            className="px-6 py-2 gradient-bg text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
