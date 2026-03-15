import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/database.types'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  isPremium: boolean
  isAdmin: boolean
  bookmarks: Set<string>
  toggleBookmark: (itemType: 'muscle' | 'pose', itemId: string) => Promise<void>
  isBookmarked: (itemId: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error && data) setProfile(data as Profile)
  }, [])

  const fetchBookmarks = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', userId)
    if (data && data.length > 0) {
      // Fix: cast each row to access item_id safely
      setBookmarks(new Set((data as { item_id: string }[]).map((b) => b.item_id)))
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchBookmarks(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchBookmarks(session.user.id)
      } else {
        setProfile(null)
        setBookmarks(new Set())
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, fetchBookmarks])

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || '' } },
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const toggleBookmark = async (itemType: 'muscle' | 'pose', itemId: string) => {
    if (!user) return
    if (bookmarks.has(itemId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
      setBookmarks(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    } else {
      // Fix: use type assertion to bypass Supabase generic inference issue
      await (supabase.from('bookmarks') as ReturnType<typeof supabase.from>)
        .insert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
        } as never)
      setBookmarks(prev => new Set(prev).add(itemId))
    }
  }

  const isBookmarked = (itemId: string) => bookmarks.has(itemId)

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      signUpWithEmail, signInWithEmail, signInWithGoogle, signOut,
      isAuthenticated: !!user,
      isPremium: profile?.role === 'premium' || profile?.role === 'admin',
      isAdmin: profile?.role === 'admin',
      bookmarks, toggleBookmark, isBookmarked,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
