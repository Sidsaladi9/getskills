import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { fetchPlatformStats } from '../lib/skills'

export default function Footer() {
  const [count, setCount] = useState(100)
  useEffect(() => {
    fetchPlatformStats().then((s) => s?.skillCount && setCount(s.skillCount))
  }, [])
  return (
    <footer className="bg-[#1a1a1a] text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 no-underline mb-4">
              <div className="w-8 h-8 bg-[#FF6B6B] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                Get<span className="text-[#FF6B6B]">Skills</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed mb-4">
              The open repository for AI skills. Discover, share, and install skills for Claude Code and beyond.
            </p>
            <p className="text-xs text-surface-500">
              {count}+ skills and counting
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 font-heading">Product</h4>
            <div className="space-y-2">
              <Link to="/browse" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Browse</Link>
              <Link to="/submit" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Submit</Link>
              <Link to="/pricing" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 font-heading">Resources</h4>
            <div className="space-y-2">
              <Link to="/browse" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Browse Skills</Link>
              <Link to="/submit" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Submit a Skill</Link>
              <Link to="/pricing" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Pricing & Plans</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 font-heading">Company</h4>
            <div className="space-y-2">
              <a href="https://theproductchannel.substack.com/about" target="_blank" rel="noopener" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">About</a>
              <a href="https://theproductchannel.substack.com" target="_blank" rel="noopener" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Blog</a>
              <Link to="/login" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Sign In</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} GetSkills. Built by{' '}
            <a
              href="https://theproductchannel.substack.com"
              target="_blank"
              rel="noopener"
              className="text-[#FF6B6B] hover:text-[#FFB3B3] no-underline"
            >
              The Product Channel
            </a>.
          </p>
          <div className="flex items-center gap-4 text-sm text-surface-500">
            <span className="flex items-center gap-1.5">
              Press{' '}
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-surface-400 text-xs font-mono">
                <span className="text-xs">&#8984;</span>K
              </kbd>{' '}
              to search
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
