import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Explorer from './pages/Explorer'
import PosesPage from './pages/PoseDetail'
import ProfilePage from './pages/Profile'
import AIAssistant from './components/AIAssistant'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
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
