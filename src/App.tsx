import { Route, Routes } from 'react-router-dom'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />
    </Routes>
  )
}
