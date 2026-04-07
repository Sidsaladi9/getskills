import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, FolderPlus, Crown, Plus, Sparkles, Loader2, Trash2, Download } from 'lucide-react'
import StatCard from '../components/StatCard'
import { fetchSkillsByIds } from '../lib/skills'
import { useApp } from '../context/AppContext'

export default function Library() {
  const {
    user,
    savedSkills,
    isPro,
    canSaveMore,
    FREE_SAVE_LIMIT,
    collections,
    createCollection,
    toggleSave,
  } = useApp()

  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [savedSkillObjects, setSavedSkillObjects] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)

  useEffect(() => {
    if (savedSkills.length > 0) {
      setLoadingSaved(true)
      fetchSkillsByIds(savedSkills)
        .then(setSavedSkillObjects)
        .finally(() => setLoadingSaved(false))
    } else {
      setSavedSkillObjects([])
    }
  }, [savedSkills])

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Bookmark className="w-8 h-8 text-[#FF6B6B]" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-4">Your skill library</h1>
        <p className="text-surface-500 mb-8">Sign in to save and organize your favorite AI skills.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
          >
            Sign up free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl no-underline hover:bg-surface-50 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    )
  }

  const totalInstalls = savedSkillObjects.reduce((sum, s) => sum + (s.installs || 0), 0)

  const handleCreateCollection = (e) => {
    e.preventDefault()
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim())
      setNewCollectionName('')
      setShowNewCollection(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-1">My Library</h1>
        <p className="text-surface-500">Your saved skills and collections</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Saved Skills" value={savedSkills.length} />
        <StatCard label="Collections" value={collections.length} />
        <StatCard
          label="Total Installs"
          value={totalInstalls.toLocaleString()}
        />
        <div className="bg-white rounded-xl border border-surface-200 p-5 flex flex-col gap-3">
          <p className="text-sm text-surface-500 mb-1">Status</p>
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 text-2xl font-bold text-[#FF6B6B] font-heading">
              <Sparkles className="w-5 h-5" /> Pro
            </span>
          ) : (
            <div>
              <p className="text-2xl font-bold text-surface-900 font-heading mb-1">Free</p>
              <Link
                to="/pricing"
                className="text-xs text-[#FF6B6B] font-medium no-underline hover:underline"
              >
                Upgrade to Pro
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Saved Skills */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-surface-900">Saved Skills</h2>
          {!isPro && (
            <span className="text-sm text-surface-400">
              {savedSkills.length}/{FREE_SAVE_LIMIT} saves used
            </span>
          )}
        </div>

        {loadingSaved ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#FF6B6B] animate-spin" />
          </div>
        ) : savedSkillObjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSkillObjects.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-xl border border-surface-200 p-5 hover:border-[#FF6B6B]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link
                      to={`/skill/${skill.slug || skill.id}`}
                      className="text-base font-semibold text-surface-900 no-underline hover:text-[#FF6B6B] transition-colors"
                    >
                      {skill.title}
                    </Link>
                    <p className="text-xs text-surface-400 mt-0.5">{skill.category}</p>
                  </div>
                  <button
                    onClick={() => toggleSave(skill.id)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-surface-500 line-clamp-2 mb-3">
                  {skill.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {(skill.installs || 0).toLocaleString()}
                  </span>
                  {skill.stars && (
                    <span>&#9733; {skill.stars}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-surface-200">
            <Bookmark className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-700 mb-2">No saved skills yet</h3>
            <p className="text-surface-500 mb-6">Start saving skills to build your library</p>
            <Link
              to="/browse"
              className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
            >
              Browse skills
            </Link>
          </div>
        )}
      </section>

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-surface-900">Collections</h2>
          {isPro && (
            <button
              onClick={() => setShowNewCollection(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </button>
          )}
        </div>

        {!isPro ? (
          <div className="text-center py-12 bg-white rounded-xl border border-surface-200">
            <Crown className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-700 mb-2">Collections are a Pro feature</h3>
            <p className="text-surface-500 mb-6">Organize your skills into custom collections with Pro</p>
            <Link
              to="/pricing"
              className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl no-underline hover:bg-[#E85555] transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        ) : (
          <>
            {showNewCollection && (
              <form onSubmit={handleCreateCollection} className="mb-6 flex items-center gap-3">
                <input
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF6B6B] text-white text-sm font-medium rounded-xl hover:bg-[#E85555] transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCollection(false)}
                  className="px-4 py-2.5 text-sm text-surface-500 hover:text-surface-700"
                >
                  Cancel
                </button>
              </form>
            )}

            {collections.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((col) => (
                  <div
                    key={col.id}
                    className="bg-white rounded-xl border border-surface-200 p-6 hover:border-[#FF6B6B]/30 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-8 h-8 text-[#FF6B6B] mb-3" />
                    <h3 className="font-semibold text-surface-900 mb-1">{col.name}</h3>
                    <p className="text-sm text-surface-400">{col.skillIds?.length || 0} skills</p>
                  </div>
                ))}
              </div>
            ) : !showNewCollection && (
              <div className="text-center py-12 bg-white rounded-xl border border-surface-200">
                <FolderPlus className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">Create your first collection to organize skills</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
