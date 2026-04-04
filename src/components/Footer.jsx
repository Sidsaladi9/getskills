import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 no-underline mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Get<span className="text-primary-400">Skills</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              The open repository for AI skills. Discover, share, and install skills for Claude Code and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <div className="space-y-2">
              <Link to="/browse" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Browse Skills</Link>
              <Link to="/submit" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Submit a Skill</Link>
              <Link to="/pricing" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Documentation</a>
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Skill Format Guide</a>
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">API</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Community</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Discord</a>
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">Twitter</a>
              <a href="#" className="block text-sm text-surface-400 hover:text-white no-underline transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">&copy; 2026 GetSkills. Built by <a href="https://theproductchannel.substack.com" target="_blank" rel="noopener" className="text-primary-400 hover:text-primary-300 no-underline">The Product Channel</a>.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-surface-500 hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="text-surface-500 hover:text-white transition-colors text-sm">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
