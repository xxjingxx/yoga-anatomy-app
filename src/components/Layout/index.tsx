import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../AuthModal'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, profile, signOut, isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { path: '/', label: 'Muscles' },
    { path: '/poses', label: 'Poses' },
  ]

  const avatarLetter = profile?.display_name?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || '?'

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-sand bg-warm-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-xs tracking-widest uppercase text-clay font-mono">Yoga Anatomy</span>
            <span className="font-display text-xl text-charcoal leading-tight">
              Muscle <em className="text-clay">Activator</em>
            </span>
          </Link>

          {/* Nav + Auth */}
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-clay text-white'
                      : 'text-earth hover:bg-sand'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-clay text-white font-semibold text-sm flex items-center justify-center hover:bg-earth transition-colors"
                >
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                    : avatarLetter
                  }
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-11 z-20 bg-warm-white border border-sand rounded-2xl shadow-xl w-52 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-sand">
                        <p className="font-medium text-sm text-charcoal truncate">
                          {profile?.display_name || 'Yogi'}
                        </p>
                        <p className="text-xs text-earth/60 truncate">{user?.email}</p>
                        <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${
                          profile?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          profile?.role === 'premium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {profile?.role || 'free'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2.5 text-sm text-charcoal hover:bg-sand transition-colors"
                      >
                        My Profile & Bookmarks
                      </Link>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-1.5 bg-clay text-white rounded-full text-sm font-medium hover:bg-earth transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}
