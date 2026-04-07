import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Zap, BookOpen, Code2, Star, Download, X } from 'lucide-react'
import { SKILLS, CATEGORIES } from '../data/skills'

const NAV_COMMANDS = [
  { id: 'nav-browse', label: 'Browse Skills', path: '/browse', icon: Search },
  { id: 'nav-library', label: 'My Library', path: '/library', icon: BookOpen },
  { id: 'nav-submit', label: 'Submit a Skill', path: '/submit', icon: Code2 },
  { id: 'nav-pricing', label: 'Pricing', path: '/pricing', icon: Zap },
  { id: 'nav-login', label: 'Login', path: '/login', icon: ArrowRight },
]

export default function CommandPalette({ open = true, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const isNavMode = query.startsWith('/')

  const q = query.toLowerCase()
  const matchedCategories = q && !isNavMode
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(q))
    : []

  const results = isNavMode
    ? NAV_COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.slice(1).toLowerCase())
      )
    : query.length > 0
    ? SKILLS.filter((skill) => {
        return (
          skill.title.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q) ||
          skill.tags.some((t) => t.toLowerCase().includes(q))
        )
      }).slice(0, 6)
    : SKILLS.slice(0, 5)

  useEffect(() => {
    if (open) {
      setQuery(initialQuery)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, initialQuery])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = useCallback(
    (index) => {
      if (isNavMode) {
        const cmd = results[index]
        if (cmd) {
          navigate(cmd.path)
          onClose()
        }
      } else {
        const skill = results[index]
        if (skill) {
          navigate(`/skill/${skill.slug || skill.id}`)
          onClose()
        }
      }
    },
    [isNavMode, results, navigate, onClose]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results.length > 0) {
        handleSelect(selectedIndex)
      } else if (query.trim()) {
        onClose()
        navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.children[selectedIndex]
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100">
          <Search className="w-5 h-5 text-surface-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search skills, categories, tags...'
            className="flex-1 text-base bg-transparent border-none outline-none placeholder-surface-400 text-surface-900"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {matchedCategories.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Categories</p>
              {matchedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onClose(); navigate(`/browse?category=${cat.id}`) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-warm-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                    <span className={`text-sm font-medium ${cat.color}`}>{cat.name[0]}</span>
                  </div>
                  <span className="font-medium text-surface-700 text-sm">{cat.name}</span>
                  <ArrowRight className="w-4 h-4 text-surface-300 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="px-4 pt-2 pb-1">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  {isNavMode ? 'Commands' : q ? 'Skills' : 'Popular skills'}
                </p>
              </div>
              <ul ref={listRef} className="px-2">
                {results.map((item, i) => {
                  const isActive = i === selectedIndex
                  if (isNavMode) {
                    const Icon = item.icon
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          isActive ? 'bg-primary-50 text-primary-600' : 'text-surface-700 hover:bg-surface-50'
                        }`}
                        onClick={() => handleSelect(i)}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                      </li>
                    )
                  }
                  return (
                    <li
                      key={item.id}
                      className={`px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isActive ? 'bg-primary-50' : 'hover:bg-surface-50'
                      }`}
                      onClick={() => handleSelect(i)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-medium text-sm ${isActive ? 'text-primary-600' : 'text-surface-900'}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="flex items-center gap-0.5 text-xs text-surface-400">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {item.stars}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-surface-400">
                            <Download className="w-3 h-3" />
                            {item.installs.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-surface-500 truncate">{item.description}</p>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {query.length > 0 && results.length === 0 && !isNavMode && (
            <div className="px-4 py-8 text-center text-surface-400 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {query.length === 0 && !results.length && (
            <div className="px-4 py-6 text-center text-surface-400 text-sm">
              Type to search skills or <kbd className="px-1.5 py-0.5 rounded bg-surface-100 font-mono text-xs">/</kbd> for commands
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-surface-100 bg-warm-50 flex items-center gap-4 text-xs text-surface-400">
          <span><kbd className="px-1.5 py-0.5 rounded bg-surface-200 text-surface-500 font-mono text-[10px]">Esc</kbd> close</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-surface-200 text-surface-500 font-mono text-[10px]">&uarr;&darr;</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-surface-200 text-surface-500 font-mono text-[10px]">Enter</kbd> select</span>
        </div>
      </div>
    </div>
  )
}
