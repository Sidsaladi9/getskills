import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Zap, Code2, PenTool, BarChart3,
  Palette, Server, Briefcase, GraduationCap, Star, TrendingUp,
  ChevronRight, Copy, Check, Command, FileDown
} from 'lucide-react'
import SkillCard from '../components/SkillCard'
import StatCard from '../components/StatCard'
import CommandPalette from '../components/CommandPalette'
import { SKILLS, CATEGORIES } from '../data/skills'
import { fetchPlatformStats } from '../lib/skills'

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
import { fetchFeaturedSkills, fetchSkillOfTheDay } from '../lib/skills'

const ICON_MAP = { Zap, Code2, PenTool, BarChart3, Palette, Server, Briefcase, GraduationCap }

const SUGGESTION_CHIPS = ['git commits', 'code review', 'testing', 'documentation']

export default function Home() {
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [featured, setFeatured] = useState([])
  const [skillOfDay, setSkillOfDay] = useState(null)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [stats, setStats] = useState({ skillCount: 0, totalInstalls: 0, avgRating: '0', categoryCount: 0 })

  useEffect(() => {
    fetchFeaturedSkills().then(setFeatured)
    fetchSkillOfTheDay().then(setSkillOfDay)
    fetchPlatformStats().then(setStats)
  }, [])

  // Global Cmd+K listener
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleCopySkillOfDay = () => {
    if (!skillOfDay) return
    navigator.clipboard.writeText(skillOfDay.skillCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadSkillOfDay = () => {
    if (!skillOfDay) return
    const blob = new Blob([skillOfDay.skillCode], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${skillOfDay.slug || skillOfDay.id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  // Trending: top 5 by installs
  const trending = [...SKILLS].sort((a, b) => b.installs - a.installs).slice(0, 5)

  // Category skill counts
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = SKILLS.filter((s) => s.category === cat.id).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#FAFAF8]" />
        {/* Glow orbs */}
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-surface-900 tracking-tight mb-6 font-heading animate-fade-in">
              Find skills that{' '}
              <span className="gradient-text">accelerate your work</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 animate-slide-up">
              Browse community-built skills for Claude Code, Cursor, ChatGPT and more.
              Copy, paste, and start using them in seconds.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={() => setPaletteOpen(true)}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border border-surface-200 bg-white text-left shadow-sm hover:border-surface-300 hover:shadow-md transition-all group"
              >
                <Search className="w-5 h-5 text-surface-400 group-hover:text-surface-500" />
                <span className="flex-1 text-surface-400 text-base">Search skills, categories, tags...</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-100 text-surface-400 text-xs font-mono">
                  <Command className="w-3 h-3" />K
                </kbd>
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-sm text-surface-400">Try:</span>
              {SUGGESTION_CHIPS.map((chip) => (
                <Link
                  key={chip}
                  to={`/browse?q=${encodeURIComponent(chip)}`}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-surface-200 text-sm text-surface-600 no-underline hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors"
                >
                  {chip}
                </Link>
              ))}
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <StatCard
                label="Skills Available"
                value={stats.skillCount.toString()}
                change="+12"
                sparkData={[3, 5, 4, 7, 6, 8, 9, 7, 10, 12]}
              />
              <StatCard
                label="Total Installs"
                value={stats.totalInstalls.toLocaleString()}
                change="+2.4K"
                sparkData={[20, 25, 30, 28, 35, 40, 38, 45, 50, 55]}
              />
              <StatCard
                label="Avg Rating"
                value={String(stats.avgRating)}
                change="+0.1"
                sparkData={[4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.7, 4.8, 4.8]}
              />
              <StatCard
                label="Categories"
                value={stats.categoryCount.toString()}
                sparkData={[8, 8, 8, 8, 8, 8, 8, 8, 8, 8]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skill Spotlight */}
      {skillOfDay && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-surface-900 font-heading">Skill of the Day</h2>
          </div>

          <div className="rounded-2xl overflow-hidden border border-surface-200 bg-white shadow-sm">
            {/* Category gradient header */}
            <div className="h-2 gradient-bg" />
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">Featured</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-surface-700">{skillOfDay.stars}</span>
                    </div>
                    <span className="text-sm text-surface-400">{skillOfDay.installs.toLocaleString()} installs</span>
                  </div>

                  <h3 className="text-2xl font-bold text-surface-900 font-heading mb-3">{skillOfDay.title}</h3>
                  <p className="text-surface-500 leading-relaxed mb-6">{skillOfDay.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {skillOfDay.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={handleDownloadSkillOfDay}
                      className={`px-6 py-3 font-semibold rounded-xl inline-flex items-center gap-2 transition-all ${
                        downloaded
                          ? 'bg-emerald-500 text-white'
                          : 'gradient-bg text-white hover:opacity-90'
                      }`}
                    >
                      {downloaded ? <Check className="w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                      {downloaded ? 'Downloaded!' : 'Download .md'}
                    </button>
                    <button
                      onClick={handleCopySkillOfDay}
                      className={`px-6 py-3 border font-semibold rounded-xl inline-flex items-center gap-2 transition-colors ${
                        copied
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                          : 'border-surface-200 text-surface-700 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <Link
                      to={`/skill/${skillOfDay.slug || skillOfDay.id}`}
                      className="px-6 py-3 text-[#FF6B6B] font-semibold rounded-xl hover:bg-primary-50 transition-colors no-underline inline-flex items-center gap-2"
                    >
                      View details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="bg-surface-900 rounded-xl p-5 overflow-auto max-h-72">
                  <pre className="text-sm text-surface-300 whitespace-pre-wrap font-mono">{skillOfDay.skillCode}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-surface-900 font-heading">Trending Skills</h2>
          <Link
            to="/browse?sort=popular"
            className="inline-flex items-center gap-1 text-[#FF6B6B] font-medium no-underline hover:opacity-80 transition-opacity text-sm"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trending.map((skill, index) => {
            const cat = CATEGORIES.find(c => c.id === skill.category)
            const grad = CATEGORY_GRADIENTS[skill.category] || 'linear-gradient(135deg, #FF6B6B, #FFA0A0)'
            const Icon = ICON_MAP[cat?.icon]
            return (
              <Link
                key={skill.id}
                to={`/skill/${skill.slug || skill.id}`}
                className={`stagger-item stagger-${index + 1} relative flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden no-underline hover:shadow-lg hover:-translate-y-1 transition-all group`}
              >
                {/* Gradient header with rank */}
                <div
                  className="relative h-20 flex items-center justify-between px-4"
                  style={{ background: grad }}
                >
                  <span className="text-4xl font-extrabold text-white/30 font-heading">
                    #{index + 1}
                  </span>
                  {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold text-surface-900 text-sm mb-1.5 font-heading line-clamp-1">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-surface-500 line-clamp-2 mb-3 flex-1">{skill.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-surface-700">{skill.stars}</span>
                    </div>
                    <span className="text-xs text-surface-400">{skill.installs.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface-900 font-heading mb-4">Browse by Category</h2>
          <p className="text-surface-500 max-w-xl mx-auto">Find the perfect skill for your workflow across {CATEGORIES.length} categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon]
            return (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className={`stagger-item stagger-${i + 1} group flex flex-col items-center gap-3 p-6 rounded-xl border border-surface-200 bg-white hover:border-[#FF6B6B]/30 hover:shadow-lg transition-all no-underline`}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {Icon && <Icon className={`w-6 h-6 ${cat.color}`} />}
                </div>
                <span className="font-semibold text-surface-700 text-sm">{cat.name}</span>
                <span className="text-xs text-surface-400">{categoryCounts[cat.id] || 0} skills</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Top Rated / Featured Skills */}
      <section className="border-t border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 font-heading mb-2">Top Rated Skills</h2>
              <p className="text-surface-500">Hand-picked by the community</p>
            </div>
            <Link
              to="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-[#FF6B6B] font-medium no-underline hover:opacity-80 transition-opacity"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((skill, i) => (
              <div key={skill.id} className={`stagger-item stagger-${i + 1}`}>
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center gap-1 text-[#FF6B6B] font-medium no-underline"
            >
              View all skills <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="gradient-bg rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Ready to level up?</h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of developers using GetSkills to work smarter with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-[#FF6B6B] font-semibold rounded-xl hover:bg-surface-50 transition-colors no-underline"
            >
              Get started free
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors no-underline"
            >
              Browse skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
