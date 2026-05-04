import { AppShowcase } from './components/AppShowcase'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroRotator } from './components/HeroRotator'
import { IntroOverlay } from './components/IntroOverlay'

function App() {
  return (
    <div className="min-h-[100svh] text-[var(--elmir-text-on-green)] antialiased">
      <div className="elmir-grain" aria-hidden />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <IntroOverlay />
      <Header />
      <main id="main-content">
        <HeroRotator />
        <Features />
        <AppShowcase />
      </main>
      <Footer />
    </div>
  )
}

export default App
