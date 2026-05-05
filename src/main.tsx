import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'
import { LenisProvider } from './components/providers/LenisProvider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LenisProvider>
      <App />
    </LenisProvider>
  </BrowserRouter>,
)
