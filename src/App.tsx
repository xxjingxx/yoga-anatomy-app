import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Explorer from './pages/Explorer'
import PosesPage from './pages/PoseDetail'
import ProfilePage from './pages/Profile'
import AIAssistant from './components/AIAssistant'

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Explorer />} />
          <Route path="/poses" element={<PosesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
      {/* AI Assistant floats outside Layout so it stays on top of everything */}
      <AIAssistant />
    </AuthProvider>
  )
}
