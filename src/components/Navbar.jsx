import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sparkles, Search, BookmarkCheck, User, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, isPro } = useApp()
  const location = useLocation()

  const links = [
    { to: '/browse', label: 'Browse' },
    { to: '/submit', label: 'Submit' },
    { to: '/pricing', label: 'Pricing' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">
              Get<span className="gradient-text">Skills</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/browse"
              className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors no-underline"
            >
              <Search className="w-5 h-5" />
            </Link>

            {user ? (
              <>
                <Link
                  to="/library"
                  className={`p-2 rounded-lg transition-colors no-underline ${
                    isActive('/library')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-surface-400 hover:text-surface-600 hover:bg-surface-100'
                  }`}
                >
                  <BookmarkCheck className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-surface-200">
                  {isPro && (
                    <span className="px-2 py-0.5 text-xs font-semibold gradient-bg text-white rounded-full">
                      PRO
                    </span>
                  )}
                  <Link
                    to="/library"
                    className="flex items-center gap-2 no-underline text-surface-700 hover:text-surface-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 no-underline transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white gradient-bg rounded-lg hover:opacity-90 no-underline transition-opacity"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-600"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium no-underline ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/library"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-surface-600 no-underline"
                >
                  My Library
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false) }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-500"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-surface-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-surface-600 no-underline"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-center text-white gradient-bg no-underline"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
