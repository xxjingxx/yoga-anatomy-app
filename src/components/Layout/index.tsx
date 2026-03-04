import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navItems = [
    { path: '/', label: 'Explorer' },
    { path: '/poses', label: 'Poses' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-sand bg-warm-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="text-xs tracking-widest uppercase text-clay font-mono">Yoga Anatomy</span>
            <span className="font-display text-xl text-charcoal leading-tight">
              Muscle <em className="text-clay">Activator</em>
            </span>
          </Link>
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
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
