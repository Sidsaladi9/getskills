import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, FolderPlus, Search, Grid3X3, List, Crown, Plus, Sparkles, Loader2 } from 'lucide-react'
import SkillCard from '../components/SkillCard'
import { fetchSkillsByIds } from '../lib/skills'
import { useApp } from '../context/AppContext'

export default function Library() {
  const { user, savedSkills, isPro, canSaveMore, FREE_SAVE_LIMIT, collections, createCollection } = useApp()
  const [view, setView] = useState('grid')
  const [activeTab, setActiveTab] = useState('saved')
  const [searchQuery, setSearchQuery] = useState('')
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
        <Bookmark className="w-16 h-16 text-surface-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-surface-900 mb-4">Your skill library</h1>
        <p className="text-surface-500 mb-8">Log in to save and organize your favorite AI skills.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 gradient-bg text-white font-semibold rounded-xl no-underline hover:opacity-90">
            Sign up free
          </Link>
          <Link to="/login" className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl no-underline hover:bg-surface-50">
            Log in
          </Link>
        </div>
      </div>
    )
  }

  const saved = savedSkillObjects
  const filtered = saved.filter(s =>
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-1">My Library</h1>
          <p className="text-surface-500">
            {saved.length} saved skill{saved.length !== 1 ? 's' : ''}
            {!isPro && (
              <span className="text-surface-400"> &middot; {FREE_SAVE_LIMIT - saved.length} saves remaining</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isPro && (
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium no-underline hover:bg-amber-100 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Upgrade for unlimited
            </Link>
          )}
          {isPro && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-bg text-white text-xs font-semibold">
              <Sparkles className="w-3 h-3" /> Pro
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-surface-200 mb-6">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          Saved Skills ({saved.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'collections'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          Collections ({collections.length})
        </button>
      </div>

      {activeTab === 'saved' && (
        <>
          {/* Search & View Toggle */}
          {saved.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search saved skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filtered.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : saved.length > 0 ? (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No skills match your search</p>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-surface-200">
              <Bookmark className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-700 mb-2">No saved skills yet</h3>
              <p className="text-surface-500 mb-6">Browse the skill library and save your favorites</p>
              <Link
                to="/browse"
                className="px-6 py-3 gradient-bg text-white font-semibold rounded-xl no-underline hover:opacity-90"
              >
                Browse skills
              </Link>
            </div>
          )}
        </>
      )}

      {activeTab === 'collections' && (
        <div>
          {!isPro ? (
            <div className="text-center py-16 bg-white rounded-xl border border-surface-200">
              <FolderPlus className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-700 mb-2">Collections are a Pro feature</h3>
              <p className="text-surface-500 mb-6">Organize your skills into custom collections with Pro</p>
              <Link
                to="/pricing"
                className="px-6 py-3 gradient-bg text-white font-semibold rounded-xl no-underline hover:opacity-90"
              >
                Upgrade to Pro
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowNewCollection(true)}
                className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-surface-300 rounded-xl text-sm font-medium text-surface-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New collection
              </button>

              {showNewCollection && (
                <form onSubmit={handleCreateCollection} className="mb-6 flex items-center gap-3">
                  <input
                    type="text"
                    autoFocus
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button type="submit" className="px-4 py-2.5 gradient-bg text-white text-sm font-medium rounded-xl">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCollection(false)}
                    className="px-4 py-2.5 text-sm text-surface-500"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {collections.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map(col => (
                    <div
                      key={col.id}
                      className="bg-white rounded-xl border border-surface-200 p-6 hover:border-primary-300 transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-8 h-8 text-primary-500 mb-3" />
                      <h3 className="font-semibold text-surface-900 mb-1">{col.name}</h3>
                      <p className="text-sm text-surface-400">{col.skillIds.length} skills</p>
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
        </div>
      )}
    </div>
  )
}
