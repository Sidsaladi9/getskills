import { Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
      <div className="w-full max-w-md text-center">
        <div className="text-8xl font-heading font-extrabold text-surface-200 mb-4">404</div>
        <h1 className="text-2xl font-heading font-bold text-surface-900 mb-3">Page not found</h1>
        <p className="text-surface-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go home
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl no-underline hover:bg-surface-50 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse skills
          </Link>
        </div>
      </div>
    </div>
  )
}
