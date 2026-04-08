import { supabase, isSupabaseConfigured } from './supabase'
import { SKILLS as MOCK_SKILLS, CATEGORIES, PLATFORMS, searchSkills as mockSearch } from '../data/skills'

// Fetch all approved skills (with stats) from Supabase, or fall back to mock data
export async function fetchSkills({ query, category, platform, sort } = {}) {
  if (!isSupabaseConfigured()) {
    return mockSearch(query, { category, platform, sort })
  }

  let q = supabase.from('skills_with_stats').select('*').range(0, 9999)

  if (query) {
    // Escape PostgREST OR-filter special chars: , ( ) " *
    const safe = query.replace(/[,()*"\\]/g, ' ').trim()
    if (safe) {
      q = q.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
    }
  }
  if (category) {
    q = q.eq('category', category)
  }
  if (platform) {
    q = q.eq('platform', platform)
  }

  if (sort === 'rating') {
    q = q.order('avg_rating', { ascending: false })
  } else if (sort === 'newest') {
    q = q.order('created_at', { ascending: false })
  } else {
    q = q.order('install_count', { ascending: false })
  }

  const { data, error } = await q
  if (error) {
    console.error('Error fetching skills:', error)
    return mockSearch(query, { category, platform, sort })
  }

  return data.map(normalizeSkill)
}

// Fetch a single skill by slug
export async function fetchSkillBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return MOCK_SKILLS.find(s => s.id === slug) || null
  }

  const { data, error } = await supabase
    .from('skills_with_stats')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return MOCK_SKILLS.find(s => s.id === slug) || null
  }

  return normalizeSkill(data)
}

// Fetch featured skills
export async function fetchFeaturedSkills() {
  if (!isSupabaseConfigured()) {
    return MOCK_SKILLS.filter(s => s.isFeatured)
  }

  const { data } = await supabase
    .from('skills_with_stats')
    .select('*')
    .eq('is_featured', true)
    .order('install_count', { ascending: false })
    .limit(6)

  if (!data) return MOCK_SKILLS.filter(s => s.isFeatured)
  return data.map(normalizeSkill)
}

// Fetch skill of the day (highest rated featured skill)
export async function fetchSkillOfTheDay() {
  if (!isSupabaseConfigured()) {
    return MOCK_SKILLS.find(s => s.id === 'test-generator') || MOCK_SKILLS[0]
  }

  const { data } = await supabase
    .from('skills_with_stats')
    .select('*')
    .eq('is_featured', true)
    .order('avg_rating', { ascending: false })
    .limit(1)
    .single()

  if (!data) return MOCK_SKILLS.find(s => s.id === 'test-generator')
  return normalizeSkill(data)
}

// Fetch skills by IDs (for library)
export async function fetchSkillsByIds(ids) {
  if (!ids.length) return []

  if (!isSupabaseConfigured()) {
    return MOCK_SKILLS.filter(s => ids.includes(s.id))
  }

  const { data } = await supabase
    .from('skills_with_stats')
    .select('*')
    .in('id', ids)

  if (!data) return MOCK_SKILLS.filter(s => ids.includes(s.id))
  return data.map(normalizeSkill)
}

// Fetch reviews for a skill
export async function fetchReviews(skillId) {
  if (!isSupabaseConfigured()) {
    return [
      { id: '1', user_name: 'Alex M.', rating: 5, comment: 'This skill saves me hours every week. The output quality is fantastic.', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: '2', user_name: 'Jordan K.', rating: 5, comment: 'Exactly what I was looking for. Works great with Claude Code.', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
      { id: '3', user_name: 'Sam T.', rating: 4, comment: 'Very useful! Would love to see support for more frameworks.', created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
    ]
  }

  const { data } = await supabase
    .from('reviews')
    .select('*, profiles(name)')
    .eq('skill_id', skillId)
    .order('created_at', { ascending: false })

  if (!data) return []
  return data.map(r => ({
    ...r,
    user_name: r.profiles?.name || 'Anonymous',
  }))
}

// Submit a review
export async function submitReview(skillId, userId, rating, comment) {
  if (!isSupabaseConfigured()) return { success: true }

  const { error } = await supabase.from('reviews').upsert({
    skill_id: skillId,
    user_id: userId,
    rating,
    comment,
  }, { onConflict: 'skill_id,user_id' })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Submit a new skill
export async function submitSkill({ title, description, category, platform, tags, skillCode, authorId }) {
  if (!isSupabaseConfigured()) return { success: true }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)

  const { data, error } = await supabase.from('skills').insert({
    slug,
    title,
    description,
    category,
    platform,
    skill_code: skillCode,
    tags: tagsArray,
    author_id: authorId,
    status: 'pending',
  }).select().single()

  if (error) return { success: false, error: error.message }
  return { success: true, skill: data }
}

// Fetch platform stats for home page stat cards
export async function fetchPlatformStats() {
  if (!isSupabaseConfigured()) {
    return { skillCount: 12, totalInstalls: 92000, avgRating: 4.7, categoryCount: 8 }
  }

  // Get skill aggregates
  const { data: skills } = await supabase
    .from('skills')
    .select('install_count, category')
    .eq('status', 'approved')

  if (!skills) return { skillCount: 12, totalInstalls: 92000, avgRating: 4.7, categoryCount: 8 }

  const totalInstalls = skills.reduce((sum, s) => sum + (s.install_count || 0), 0)
  const categories = new Set(skills.map(s => s.category))

  // Get average rating from reviews
  const { data: ratingData } = await supabase
    .from('reviews')
    .select('rating')

  const avgRating = ratingData && ratingData.length > 0
    ? (ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length).toFixed(1)
    : '4.7'

  return {
    skillCount: skills.length,
    totalInstalls,
    avgRating,
    categoryCount: categories.size,
  }
}

// Fetch daily stats for a skill's sparkline
export async function fetchDailyStats(skillId) {
  if (!isSupabaseConfigured()) return []

  const { data } = await supabase
    .from('daily_skill_stats')
    .select('date, copies, downloads, views')
    .eq('skill_id', skillId)
    .order('date', { ascending: true })
    .limit(14)

  return data || []
}

// Log a skill action (copy/download/view) — increments counters + daily rollup
export async function trackInstall(skillId, action = 'copy') {
  if (!isSupabaseConfigured() || !skillId) return
  const { data: { user } = {} } = await supabase.auth.getUser()
  await supabase.rpc('log_skill_event', {
    p_skill_id: skillId,
    p_user_id: user?.id || null,
    p_action: action,
    p_platform: null,
    p_referrer: typeof document !== 'undefined' ? document.referrer || null : null,
  })
}

// Normalize Supabase row to match component expectations
function normalizeSkill(row) {
  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || row.longDescription || '',
    category: row.category,
    platform: row.platform,
    author: {
      name: row.author_name || 'Community',
      avatar: (row.author_name || 'C').split(' ').map(n => n[0]).join(''),
      verified: row.author_verified || false,
    },
    installs: row.install_count ?? row.installs ?? 0,
    stars: row.avg_rating ?? row.stars ?? 0,
    reviews: row.review_count ?? row.reviews ?? 0,
    tags: row.tags || [],
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
    isPremium: row.is_premium ?? row.isPremium ?? false,
    isFeatured: row.is_featured ?? row.isFeatured ?? false,
    skillCode: row.skill_code || row.skillCode || '',
    sourceName: row.source_name || row.sourceName || '',
    sourceUrl: row.source_url || row.sourceUrl || '',
  }
}
