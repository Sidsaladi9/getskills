import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, X, Zap, Code2, PenTool, BarChart3, Palette, Server,
  Briefcase, GraduationCap, ChevronRight, Loader2, SlidersHorizontal
} from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { CATEGORIES, PLATFORMS, SKILLS } from '../data/skills'
import { fetchSkills } from '../lib/skills'

const ICON_MAP = { Zap, Code2, PenTool, BarChart3, Palette, Server, Briefcase, GraduationCap }

const SORT_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'newest', label: 'Newest' },
]

// Collect all unique tags from skills data
const ALL_TAGS = [...new Set(SKILLS.flatMap((s) => s.tags))].slice(0, 12)

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef(null)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const platform = searchParams.get('platform') || ''
  const sort = searchParams.get('sort') || 'popular'
  const tag = searchParams.get('tag') || ''

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  // Debounced search input
  const [localQuery, setLocalQuery] = useState(query)
  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  const handleQueryChange = (value) => {
    setLocalQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('q', value)
    }, 300)
  }

  useEffect(() => {
    setLoading(true)
    // If a tag filter is active, include it in the query
    const effectiveQuery = tag ? (query ? `${query} ${tag}` : tag) : query
    fetchSkills({ query: effectiveQuery, category, platform, sort })
      .then(setResults)
      .finally(() => setLoading(false))
  }, [query, category, platform, sort, tag])

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-surface-500 mb-6">
          <Link to="/" className="no-underline text-surface-500 hover:text-surface-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-surface-700 font-medium">Browse</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 font-heading mb-2">Explore Skills</h1>
          <p className="text-surface-500">Discover community-built skills to supercharge your AI workflow</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search skills, categories, tags..."
            value={localQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-surface-200 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/40 focus:border-[#FF6B6B] text-base shadow-sm transition-all"
          />
          {localQuery && (
            <button
              onClick={() => { setLocalQuery(''); updateParam('q', '') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-100 transition-colors"
            >
              <X className="w-4 h-4 text-surface-400" />
            </button>
          )}
        </div>

        {/* Category Filter - horizontal pills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam('category', '')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? 'bg-[#FF6B6B] text-white shadow-sm'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-surface-300'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon]
              return (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
                    category === cat.id
                      ? 'bg-[#FF6B6B] text-white shadow-sm'
                      : 'bg-white text-surface-600 border border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Platform Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => updateParam('platform', platform === p.id ? '' : p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  platform === p.id
                    ? 'bg-surface-800 text-white'
                    : 'bg-white text-surface-500 border border-surface-200 hover:border-surface-300'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => updateParam('tag', tag === t ? '' : t)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  tag === t
                    ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] font-medium'
                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + Skill Count Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-surface-500">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Searching...
              </span>
            ) : (
              <>
                <span className="font-semibold text-surface-700">{results.length}</span>{' '}
                skill{results.length !== 1 ? 's' : ''} found
                {query && (
                  <> for &quot;<span className="font-medium text-surface-700">{query}</span>&quot;</>
                )}
              </>
            )}
          </p>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-4 py-2 rounded-lg border border-surface-200 bg-white text-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/40 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Active filter chips */}
        {(category || platform || tag) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-surface-400">Active:</span>
            {category && (
              <button
                onClick={() => updateParam('category', '')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] text-sm font-medium hover:bg-[#FF6B6B]/20 transition-colors"
              >
                {CATEGORIES.find((c) => c.id === category)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {platform && (
              <button
                onClick={() => updateParam('platform', '')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] text-sm font-medium hover:bg-[#FF6B6B]/20 transition-colors"
              >
                {PLATFORMS.find((p) => p.id === platform)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {tag && (
              <button
                onClick={() => updateParam('tag', '')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] text-sm font-medium hover:bg-[#FF6B6B]/20 transition-colors"
              >
                #{tag}
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => {
                const next = new URLSearchParams()
                if (query) next.set('q', query)
                setSearchParams(next)
              }}
              className="text-sm text-surface-400 hover:text-surface-600 font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Skill Grid */}
        {!loading && results.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-surface-300" />
            </div>
            <h3 className="text-xl font-semibold text-surface-700 font-heading mb-2">No skills found matching your search</h3>
            <p className="text-surface-500 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or removing some filters to see more results.
            </p>
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="px-6 py-2.5 gradient-bg text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Loading Grid Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-surface-200 p-6 animate-pulse">
                <div className="flex gap-2 mb-3">
                  <div className="w-16 h-5 bg-surface-100 rounded-full" />
                  <div className="w-12 h-5 bg-surface-100 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-surface-100 rounded mb-2" />
                <div className="w-full h-4 bg-surface-100 rounded mb-1" />
                <div className="w-2/3 h-4 bg-surface-100 rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="w-14 h-5 bg-surface-100 rounded" />
                  <div className="w-14 h-5 bg-surface-100 rounded" />
                </div>
                <div className="border-t border-surface-100 pt-4 flex justify-between">
                  <div className="w-20 h-4 bg-surface-100 rounded" />
                  <div className="w-24 h-4 bg-surface-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
