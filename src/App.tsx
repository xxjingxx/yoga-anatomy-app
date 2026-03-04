import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Explorer from './pages/Explorer'
import PosesPage from './pages/PoseDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Explorer />} />
        <Route path="/poses" element={<PosesPage />} />
      </Routes>
    </Layout>
  )
}
