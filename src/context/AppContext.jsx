import { createContext, useContext, useState, useCallback } from 'react'
import { SKILLS } from '../data/skills'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [savedSkills, setSavedSkills] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gs_saved') || '[]')
    } catch { return [] }
  })
  const [collections, setCollections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gs_collections') || '[]')
    } catch { return [] }
  })

  const isPro = user?.plan === 'pro'
  const FREE_SAVE_LIMIT = 5

  const login = useCallback((email, password) => {
    const stored = localStorage.getItem('gs_user')
    if (stored) {
      const u = JSON.parse(stored)
      if (u.email === email) {
        setUser(u)
        return { success: true }
      }
    }
    return { success: false, error: 'Invalid credentials' }
  }, [])

  const signup = useCallback((name, email, password) => {
    const u = { name, email, plan: 'free', createdAt: new Date().toISOString() }
    localStorage.setItem('gs_user', JSON.stringify(u))
    setUser(u)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const upgradeToPro = useCallback(() => {
    if (user) {
      const updated = { ...user, plan: 'pro' }
      localStorage.setItem('gs_user', JSON.stringify(updated))
      setUser(updated)
    }
  }, [user])

  const toggleSave = useCallback((skillId) => {
    setSavedSkills(prev => {
      const isSaved = prev.includes(skillId)
      if (!isSaved && !isPro && prev.length >= FREE_SAVE_LIMIT) {
        return prev
      }
      const next = isSaved ? prev.filter(id => id !== skillId) : [...prev, skillId]
      localStorage.setItem('gs_saved', JSON.stringify(next))
      return next
    })
  }, [isPro])

  const isSkillSaved = useCallback((skillId) => {
    return savedSkills.includes(skillId)
  }, [savedSkills])

  const canSaveMore = isPro || savedSkills.length < FREE_SAVE_LIMIT

  const createCollection = useCallback((name) => {
    const col = { id: Date.now().toString(), name, skillIds: [], createdAt: new Date().toISOString() }
    setCollections(prev => {
      const next = [...prev, col]
      localStorage.setItem('gs_collections', JSON.stringify(next))
      return next
    })
    return col
  }, [])

  const addToCollection = useCallback((collectionId, skillId) => {
    setCollections(prev => {
      const next = prev.map(c =>
        c.id === collectionId && !c.skillIds.includes(skillId)
          ? { ...c, skillIds: [...c.skillIds, skillId] }
          : c
      )
      localStorage.setItem('gs_collections', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{
      user, login, signup, logout, upgradeToPro, isPro,
      savedSkills, toggleSave, isSkillSaved, canSaveMore, FREE_SAVE_LIMIT,
      collections, createCollection, addToCollection,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
