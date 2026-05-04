import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'
import { LenisProvider } from './components/providers/LenisProvider'

createRoot(document.getElementById('root')!).render(
  <LenisProvider>
    <App />
  </LenisProvider>,
)
