import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useUiStore } from '../store/uiStore'
import { cn } from '../lib/utils'
import { Logo } from './Logo'

const links = [
  { href: '#looks', label: 'Looks' },
  { href: '#features', label: 'Features' },
  { href: '#waitlist', label: 'About us' },
]

export function Header() {
  const introDone = useUiStore((s) => s.introDone)
  const reduced = useReducedMotion() ?? false
  const visible = introDone || reduced

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: -20 }
      }
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'pointer-events-none fixed left-0 right-0 top-0 z-[200] flex justify-center px-4 py-2 transition-[background-color,backdrop-filter,border-color] duration-300 ease-out md:px-8 md:py-2',
        scrolled
          ? 'border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.85)] backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-6xl items-center justify-between gap-4 md:gap-6">
        <a
          href="#"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/80"
          aria-label="ELMIR home"
        >
          <Logo showWordmark={false} inverted iconClassName="h-6 w-6 shrink-0" />
          <span className="font-serif text-[1.125rem] font-semibold leading-none tracking-[0.12em] text-white md:text-[1.2rem]">
            ELMIR
          </span>
        </a>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-white/60 md:gap-x-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-white/60 transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 hover:text-white hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="#app"
            className="hidden shrink-0 rounded-full border border-white/45 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/80 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80 sm:inline-flex"
          >
            Try On Now →
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
