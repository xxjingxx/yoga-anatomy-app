import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAppStore } from '../../store/useAppStore'
import { Navigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, profile, signOut, isAuthenticated, bookmarks, toggleBookmark } = useAuth()
  const { muscles, poses } = useAppStore()

  if (!isAuthenticated) return <Navigate to="/" replace />

  const bookmarkedMuscles = muscles.filter(m => bookmarks.has(m.id))
  const bookmarkedPoses = poses.filter(p => bookmarks.has(p.id))

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="bg-charcoal rounded-2xl p-6 text-cream flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-clay flex items-center justify-center text-2xl font-bold shrink-0">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover" alt="avatar" />
            : (profile?.display_name?.[0] || user?.email?.[0] || '?').toUpperCase()
          }
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl">{profile?.display_name || 'Yogi'}</h1>
          <p className="text-cream/50 text-sm truncate">{user?.email}</p>
          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${
            profile?.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
            profile?.role === 'premium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-moss/30 text-sage'
          }`}>
            {profile?.role || 'free'} account
          </span>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-cream/50 hover:text-red-400 transition-colors shrink-0"
        >
          Sign out
        </button>
      </div>

      {/* Bookmarks */}
      <div>
        <h2 className="font-display text-xl text-charcoal mb-4">
          🔖 Bookmarked Muscles
          <span className="ml-2 text-sm font-sans text-earth/60">({bookmarkedMuscles.length})</span>
        </h2>
        {bookmarkedMuscles.length === 0 ? (
          <p className="text-earth/50 text-sm bg-warm-white border border-sand rounded-xl p-6 text-center">
            No bookmarked muscles yet — explore the Muscles tab and bookmark your favourites!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedMuscles.map(m => (
              <div key={m.id} className="bg-warm-white border border-sand rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-earth/60">{m.area} · {m.region}</div>
                </div>
                <button onClick={() => toggleBookmark('muscle', m.id)} className="text-clay hover:text-earth text-lg leading-none shrink-0">♥</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl text-charcoal mb-4">
          🔖 Bookmarked Poses
          <span className="ml-2 text-sm font-sans text-earth/60">({bookmarkedPoses.length})</span>
        </h2>
        {bookmarkedPoses.length === 0 ? (
          <p className="text-earth/50 text-sm bg-warm-white border border-sand rounded-xl p-6 text-center">
            No bookmarked poses yet — explore the Poses tab and save your favourites!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedPoses.map(p => (
              <div key={p.id} className="bg-warm-white border border-sand rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-earth/60 italic">{p.sanskrit}</div>
                </div>
                <button onClick={() => toggleBookmark('pose', p.id)} className="text-clay hover:text-earth text-lg leading-none shrink-0">♥</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
