import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [savedSkills, setSavedSkills] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const isPro = profile?.plan === 'pro'
  const FREE_SAVE_LIMIT = 5
  const sb = isSupabaseConfigured()

  // Initialize: check session on mount
  useEffect(() => {
    if (!sb) {
      // Fallback to localStorage when Supabase isn't configured
      try {
        const stored = localStorage.getItem('gs_user')
        if (stored) setUser(JSON.parse(stored))
        setSavedSkills(JSON.parse(localStorage.getItem('gs_saved') || '[]'))
        setCollections(JSON.parse(localStorage.getItem('gs_collections') || '[]'))
      } catch {}
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
        fetchSavedSkills(session.user.id)
        fetchCollections(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
        fetchSavedSkills(session.user.id)
        fetchCollections(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setSavedSkills([])
        setCollections([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sync profile from localStorage fallback
  useEffect(() => {
    if (!sb && user) {
      setProfile({ name: user.name, email: user.email, plan: user.plan || 'free' })
    }
  }, [user, sb])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  async function fetchSavedSkills(userId) {
    const { data } = await supabase
      .from('saved_skills')
      .select('skill_id')
      .eq('user_id', userId)
    if (data) setSavedSkills(data.map(s => s.skill_id))
  }

  async function fetchCollections(userId) {
    const { data } = await supabase
      .from('collections')
      .select('*, collection_skills(skill_id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) {
      setCollections(data.map(c => ({
        ...c,
        skillIds: c.collection_skills?.map(cs => cs.skill_id) || []
      })))
    }
  }

  // Auth: Signup
  const signup = useCallback(async (name, email, password) => {
    if (!sb) {
      const u = { name, email, plan: 'free', createdAt: new Date().toISOString() }
      localStorage.setItem('gs_user', JSON.stringify(u))
      setUser(u)
      return { success: true }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) return { success: false, error: error.message }
    return { success: true, needsConfirmation: !data.session }
  }, [sb])

  // Auth: Login
  const login = useCallback(async (email, password) => {
    if (!sb) {
      const stored = localStorage.getItem('gs_user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.email === email) { setUser(u); return { success: true } }
      }
      return { success: false, error: 'Invalid credentials' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [sb])

  // Auth: Google OAuth
  const loginWithGoogle = useCallback(async () => {
    if (!sb) return { success: false, error: 'Supabase not configured' }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/library` }
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [sb])

  // Auth: Logout
  const logout = useCallback(async () => {
    if (sb) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('gs_user')
    }
    setUser(null)
    setProfile(null)
    setSavedSkills([])
    setCollections([])
  }, [sb])

  // Upgrade to Pro
  const upgradeToPro = useCallback(async () => {
    if (!sb) {
      if (user) {
        const updated = { ...user, plan: 'pro' }
        localStorage.setItem('gs_user', JSON.stringify(updated))
        setUser(updated)
        setProfile(prev => ({ ...prev, plan: 'pro' }))
      }
      return
    }
    if (user) {
      await supabase.from('profiles').update({ plan: 'pro' }).eq('id', user.id)
      setProfile(prev => ({ ...prev, plan: 'pro' }))
    }
  }, [user, sb])

  // Save / Unsave skill
  const toggleSave = useCallback(async (skillId) => {
    if (!user) return

    const isSaved = savedSkills.includes(skillId)

    if (!isSaved && !isPro && savedSkills.length >= FREE_SAVE_LIMIT) return

    if (!sb) {
      const next = isSaved
        ? savedSkills.filter(id => id !== skillId)
        : [...savedSkills, skillId]
      setSavedSkills(next)
      localStorage.setItem('gs_saved', JSON.stringify(next))
      return
    }

    if (isSaved) {
      await supabase.from('saved_skills').delete()
        .eq('user_id', user.id).eq('skill_id', skillId)
      setSavedSkills(prev => prev.filter(id => id !== skillId))
    } else {
      await supabase.from('saved_skills').insert({ user_id: user.id, skill_id: skillId })
      setSavedSkills(prev => [...prev, skillId])
    }
  }, [user, savedSkills, isPro, sb])

  const isSkillSaved = useCallback((skillId) => {
    return savedSkills.includes(skillId)
  }, [savedSkills])

  const canSaveMore = isPro || savedSkills.length < FREE_SAVE_LIMIT

  // Collections
  const createCollection = useCallback(async (name) => {
    if (!sb) {
      const col = { id: Date.now().toString(), name, skillIds: [], created_at: new Date().toISOString() }
      setCollections(prev => {
        const next = [...prev, col]
        localStorage.setItem('gs_collections', JSON.stringify(next))
        return next
      })
      return col
    }

    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name })
      .select()
      .single()
    if (data) {
      const col = { ...data, skillIds: [] }
      setCollections(prev => [col, ...prev])
      return col
    }
    return null
  }, [user, sb])

  const addToCollection = useCallback(async (collectionId, skillId) => {
    if (!sb) {
      setCollections(prev => {
        const next = prev.map(c =>
          c.id === collectionId && !c.skillIds.includes(skillId)
            ? { ...c, skillIds: [...c.skillIds, skillId] }
            : c
        )
        localStorage.setItem('gs_collections', JSON.stringify(next))
        return next
      })
      return
    }

    await supabase.from('collection_skills').insert({ collection_id: collectionId, skill_id: skillId })
    setCollections(prev => prev.map(c =>
      c.id === collectionId && !c.skillIds.includes(skillId)
        ? { ...c, skillIds: [...c.skillIds, skillId] }
        : c
    ))
  }, [sb])

  const deleteCollection = useCallback(async (collectionId) => {
    if (!sb) {
      setCollections(prev => {
        const next = prev.filter(c => c.id !== collectionId)
        localStorage.setItem('gs_collections', JSON.stringify(next))
        return next
      })
      return
    }

    await supabase.from('collections').delete().eq('id', collectionId)
    setCollections(prev => prev.filter(c => c.id !== collectionId))
  }, [sb])

  // Expose a merged user object for components
  const displayUser = user ? {
    id: user.id,
    name: profile?.name || user.user_metadata?.name || user.name || '',
    email: profile?.email || user.email || '',
    plan: profile?.plan || 'free',
    avatar_url: profile?.avatar_url || null,
  } : null

  return (
    <AppContext.Provider value={{
      user: displayUser,
      rawUser: user,
      loading,
      login, signup, loginWithGoogle, logout, upgradeToPro, isPro,
      savedSkills, toggleSave, isSkillSaved, canSaveMore, FREE_SAVE_LIMIT,
      collections, createCollection, addToCollection, deleteCollection,
      supabaseConfigured: sb,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
