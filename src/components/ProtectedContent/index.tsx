import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../AuthModal'

interface Props {
  children: React.ReactNode
  reason?: string           // Why they need to sign in
  teaser?: React.ReactNode  // Optional blurred preview to show behind the gate
}

/**
 * Wrap any content that requires authentication.
 * - If logged in: renders children normally
 * - If logged out: shows a sign-in prompt with optional blurred teaser
 */
export default function ProtectedContent({ children, reason = 'to access this content', teaser }: Props) {
  const { isAuthenticated, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-clay border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (isAuthenticated) return <>{children}</>

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden">
        {/* Blurred teaser */}
        {teaser && (
          <div className="pointer-events-none select-none blur-sm opacity-60">
            {teaser}
          </div>
        )}

        {/* Gate overlay */}
        <div className={`${teaser ? 'absolute inset-0' : ''} flex flex-col items-center justify-center py-12 px-6 text-center bg-warm-white/95 rounded-2xl border border-sand`}>
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-display text-lg text-charcoal mb-1">Members Only</h3>
          <p className="text-sm text-earth/70 mb-5 max-w-xs">
            Create a free account {reason}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-clay text-white rounded-full text-sm font-medium hover:bg-earth transition-colors"
          >
            Sign up — it's free
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-xs text-earth/60 hover:text-clay transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reason={reason}
      />
    </>
  )
}
