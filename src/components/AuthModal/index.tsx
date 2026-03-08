import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type Mode = 'signin' | 'signup'

interface Props {
  isOpen: boolean
  onClose: () => void
  reason?: string  // e.g. "to bookmark poses" or "to access quiz mode"
}

export default function AuthModal({ isOpen, onClose, reason }: Props) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await signUpWithEmail(email, password, displayName)
      if (error) { setError(error); setLoading(false); return }
      setSuccess('Account created! Check your email to confirm.')
    } else {
      const { error } = await signInWithEmail(email, password)
      if (error) { setError(error); setLoading(false); return }
      onClose()
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) setError(error)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-warm-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-earth/50 hover:text-earth text-2xl leading-none">×</button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest uppercase text-clay font-mono mb-1">Yoga Anatomy</p>
          <h2 className="font-display text-2xl text-charcoal">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          {reason && (
            <p className="text-sm text-earth/70 mt-1">Sign in {reason}</p>
          )}
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-moss font-medium">{success}</p>
            <button onClick={onClose} className="mt-4 btn-primary">Close</button>
          </div>
        ) : (
          <>
            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-2.5 border-2 border-sand rounded-xl text-sm font-medium text-charcoal hover:border-clay hover:bg-sand transition-all mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-sand" />
              <span className="text-xs text-earth/50">or</span>
              <div className="flex-1 h-px bg-sand" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs text-earth uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full mt-1 px-4 py-2.5 border-2 border-sand rounded-xl text-sm focus:outline-none focus:border-moss transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-earth uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full mt-1 px-4 py-2.5 border-2 border-sand rounded-xl text-sm focus:outline-none focus:border-moss transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-earth uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full mt-1 px-4 py-2.5 border-2 border-sand rounded-xl text-sm focus:outline-none focus:border-moss transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-clay text-white rounded-xl font-medium text-sm hover:bg-earth transition-colors disabled:opacity-60"
              >
                {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-sm text-earth/70 mt-4">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
                className="text-clay hover:underline font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
