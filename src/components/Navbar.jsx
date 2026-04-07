import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sparkles, Search, BookmarkCheck, LogOut, ChevronRight, Home } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CommandPalette from './CommandPalette'

const NAV_LINKS = [
  { to: '/browse', label: 'Browse' },
  { to: '/submit', label: 'Submit' },
  { to: '/pricing', label: 'Pricing' },
]

function getBreadcrumbs(pathname) {
  if (pathname === '/') return null
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = [{ label: 'Home', to: '/' }]

  const labelMap = {
    browse: 'Browse',
    submit: 'Submit',
    pricing: 'Pricing',
    login: 'Log in',
    signup: 'Sign up',
    library: 'Library',
    skill: 'Skill',
  }

  let path = ''
  segments.forEach((seg, i) => {
    path += `/${seg}`
    const isLast = i === segments.length - 1
    crumbs.push({
      label: labelMap[seg] || decodeURIComponent(seg),
      to: isLast ? null : path,
    })
  })

  return crumbs
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { user, logout, isPro } = useApp()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="sticky top-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-surface-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
              <div className="w-8 h-8 bg-[#FF6B6B] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-surface-900">
                Get<span className="text-[#FF6B6B]">Skills</span>
              </span>
            </Link>

            {/* Center: Search bar */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 mx-6 flex-1 max-w-md px-4 py-2 rounded-xl border border-surface-200 bg-white text-surface-400 text-sm hover:border-surface-300 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search skills...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-100 text-surface-400 text-xs font-mono">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </button>

            {/* Right: nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                    isActive(link.to)
                      ? 'text-[#FF6B6B] border-b-2 border-[#FF6B6B]'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: auth section */}
            <div className="hidden md:flex items-center gap-3 ml-4">
              {user ? (
                <>
                  <Link
                    to="/library"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                      isActive('/library')
                        ? 'text-[#FF6B6B] bg-primary-50'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    Library
                  </Link>
                  <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
                    {isPro && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-[#FF6B6B] text-white rounded-full">
                        PRO
                      </span>
                    )}
                    <Link
                      to="/library"
                      className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[#FF6B6B] text-sm font-semibold no-underline hover:bg-primary-200 transition-colors"
                    >
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </Link>
                    <button
                      onClick={logout}
                      className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Log out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 no-underline transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B6B] rounded-lg hover:bg-[#E85555] no-underline transition-colors"
                  >
                    Sign up free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: search + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setPaletteOpen(true)}
                className="p-2 rounded-lg text-surface-500 hover:bg-surface-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-surface-600"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-200 bg-white animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium no-underline ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-[#FF6B6B]'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/library"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium no-underline ${
                      isActive('/library')
                        ? 'bg-primary-50 text-[#FF6B6B]'
                        : 'text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    My Library
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-surface-200">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[#FF6B6B] text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-surface-700 flex-1">{user.name}</span>
                    {isPro && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-[#FF6B6B] text-white rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="pt-3 mt-2 border-t border-surface-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-surface-600 no-underline hover:bg-surface-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-center text-white bg-[#FF6B6B] no-underline hover:bg-[#E85555]"
                  >
                    Sign up free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="border-t border-surface-100 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ol className="flex items-center gap-1.5 py-2 text-sm text-surface-400">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                    {i === 0 && <Home className="w-3.5 h-3.5" />}
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="no-underline text-surface-400 hover:text-surface-700 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-surface-600 font-medium">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </nav>

      {/* Command Palette */}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  )
}
