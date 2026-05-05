import { lazy, Suspense } from 'react'
import { Header } from '../components/Header'
import { HeroRotator } from '../components/HeroRotator'
import { IntroOverlay } from '../components/IntroOverlay'

const Features = lazy(() =>
  import('../components/Features').then((m) => ({ default: m.Features })),
)
const AppShowcase = lazy(() =>
  import('../components/AppShowcase').then((m) => ({ default: m.AppShowcase })),
)
const Footer = lazy(() =>
  import('../components/Footer').then((m) => ({ default: m.Footer })),
)

export function HomePage() {
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
        <Suspense fallback={null}>
          <Features />
          <AppShowcase />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
