import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Explorer from './pages/Explorer'
import PosesPage from './pages/PoseDetail'
import ProfilePage from './pages/Profile'
import AIAssistant from './components/AIAssistant'
import ErrorBoundary from './components/ErrorBoundary'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const { loadData, isLoading } = useAppStore()

  useEffect(() => { loadData() }, [loadData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-clay border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-earth/60 font-mono tracking-widest uppercase">Loading</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary name="App">
      <AuthProvider>
        <Layout>
          <ErrorBoundary name="Routes">
            <Routes>
              <Route path="/" element={<Explorer />} />
              <Route path="/poses" element={<PosesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
        <ErrorBoundary name="AIAssistant" fallback={null}>
          {/* AI Assistant floats outside Layout so it stays on top of everything */}
          <AIAssistant />
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  )
}
