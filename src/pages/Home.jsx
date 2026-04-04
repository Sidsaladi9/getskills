import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ArrowRight, Sparkles, Zap, Code2, PenTool, BarChart3,
  Palette, Server, Briefcase, GraduationCap, Star, Download,
  Users, BookOpen, Trophy, ChevronRight, Copy, Check, TrendingUp
} from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { SKILLS, CATEGORIES, SKILL_OF_THE_DAY, getFeaturedSkills } from '../data/skills'

const ICON_MAP = { Zap, Code2, PenTool, BarChart3, Palette, Server, Briefcase, GraduationCap }

const STATS = [
  { icon: BookOpen, label: 'Skills', value: '500+' },
  { icon: Users, label: 'Users', value: '12K+' },
  { icon: Download, label: 'Installs', value: '89K+' },
  { icon: Trophy, label: 'Contributors', value: '200+' },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const featured = getFeaturedSkills()

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(SKILL_OF_THE_DAY.skillCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="hero-glow bg-primary-500 -top-40 -left-40" />
        <div className="hero-glow bg-accent-500 -top-20 right-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              The open repository for AI skills
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-surface-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Discover & share{' '}
              <span className="gradient-text">AI skills</span>
              {' '}that supercharge your workflow
            </h1>

            <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Browse 500+ community-built skills for Claude Code, Cursor, ChatGPT and more.
              Copy, install, and start using them in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search skills... (e.g. 'test generator', 'git')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-200 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm"
                />
              </div>
              <Link
                to={searchQuery ? `/browse?q=${encodeURIComponent(searchQuery)}` : '/browse'}
                className="w-full sm:w-auto px-8 py-4 gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity no-underline text-center"
              >
                Explore skills
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-surface-200">
            {STATS.map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center justify-center gap-3 py-6">
                  <Icon className="w-5 h-5 text-primary-500" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
                    <div className="text-xs text-surface-500">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skill of the Day */}
      {SKILL_OF_THE_DAY && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-surface-900">Skill of the Day</h2>
          </div>

          <div className="gradient-border p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">Featured</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-surface-700">{SKILL_OF_THE_DAY.stars}</span>
                  </div>
                  <span className="text-sm text-surface-400">{SKILL_OF_THE_DAY.installs.toLocaleString()} installs</span>
                </div>

                <h3 className="text-2xl font-bold text-surface-900 mb-3">{SKILL_OF_THE_DAY.title}</h3>
                <p className="text-surface-500 leading-relaxed mb-6">{SKILL_OF_THE_DAY.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {SKILL_OF_THE_DAY.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-100 text-surface-600 text-sm rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/skill/${SKILL_OF_THE_DAY.id}`}
                    className="px-6 py-3 gradient-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity no-underline inline-flex items-center gap-2"
                  >
                    View skill <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleCopyInstall}
                    className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-lg hover:bg-surface-50 transition-colors inline-flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy skill'}
                  </button>
                </div>
              </div>

              <div className="code-block p-5 overflow-auto max-h-72">
                <pre className="text-sm whitespace-pre-wrap">{SKILL_OF_THE_DAY.skillCode}</pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface-900 mb-4">Browse by category</h2>
          <p className="text-surface-500 max-w-xl mx-auto">Find the perfect skill for your workflow across 8 categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon]
            return (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className={`group flex flex-col items-center gap-3 p-6 rounded-xl border border-surface-200 bg-white hover:border-primary-300 hover:shadow-lg transition-all no-underline`}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {Icon && <Icon className={`w-6 h-6 ${cat.color}`} />}
                </div>
                <span className="font-semibold text-surface-700 text-sm">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Skills */}
      <section className="bg-surface-50 border-y border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 mb-2">Featured skills</h2>
              <p className="text-surface-500">Hand-picked by the community</p>
            </div>
            <Link
              to="/browse"
              className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-medium no-underline hover:text-primary-700 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center gap-1 text-primary-600 font-medium no-underline"
            >
              View all skills <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-surface-900 mb-4">How it works</h2>
          <p className="text-surface-500 max-w-xl mx-auto">Three steps to supercharge your AI workflow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Find a skill',
              description: 'Search or browse 500+ skills across categories. Filter by platform, rating, or use case.',
              icon: Search,
            },
            {
              step: '02',
              title: 'Copy & install',
              description: 'One-click copy the skill definition. Paste it into your AI tool\'s settings or skill folder.',
              icon: Copy,
            },
            {
              step: '03',
              title: 'Use it instantly',
              description: 'The skill is now available in your AI assistant. Use it by name or let it trigger automatically.',
              icon: Zap,
            },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-surface-500 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="gradient-bg rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to level up?</h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of developers using GetSkills to work smarter with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-surface-50 transition-colors no-underline"
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
