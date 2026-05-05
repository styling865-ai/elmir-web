import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Logo } from '../components/Logo'

/** Fixed launch moment (UTC). Override with `VITE_COMING_SOON_LAUNCH` (ISO string). */
function getLaunchDate(): Date {
  const raw = import.meta.env.VITE_COMING_SOON_LAUNCH
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const d = new Date(raw.trim())
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date(Date.UTC(2026, 5, 4, 12, 0, 0))
}

function pad2(n: number) {
  return Math.max(0, n).toString().padStart(2, '0')
}

export function ComingSoonPage() {
  const launch = useMemo(() => getLaunchDate(), [])
  const [now, setNow] = useState(() => Date.now())
  const reduced = useReducedMotion() ?? false
  const lenis = useLenis()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true })
  }, [lenis])

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const diff = Math.max(0, launch.getTime() - now)
  const days = Math.floor(diff / (86400 * 1000))
  const hours = Math.floor((diff % (86400 * 1000)) / (3600 * 1000))
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000))
  const seconds = Math.floor((diff % (60 * 1000)) / 1000)

  const block =
    'rounded-2xl border border-[rgba(201,168,76,0.35)] bg-[rgba(10,15,10,0.55)] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md'

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-16 text-[var(--elmir-text-on-green)] antialiased md:px-8 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgba(126,200,126,0.12),transparent_55%)]" aria-hidden />

      <motion.div
        className="relative z-[1] mx-auto w-full max-w-lg text-center"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="mb-6 flex justify-center">
          <Logo inverted className="justify-center" iconClassName="h-9 w-9 sm:h-10 sm:w-10" />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-tight tracking-tight text-white">
          Coming soon
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--elmir-text-on-green-soft)]">
          We&apos;re putting the finishing touches on try-on. Here&apos;s how long until the doors open.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className={block}>
            <p className="font-[family-name:var(--font-mono)] text-[clamp(1.5rem,6vw,2rem)] font-semibold tabular-nums text-white">
              {days}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(223,245,234,0.55)]">
              Days
            </p>
          </div>
          <div className={block}>
            <p className="font-[family-name:var(--font-mono)] text-[clamp(1.5rem,6vw,2rem)] font-semibold tabular-nums text-white">
              {pad2(hours)}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(223,245,234,0.55)]">
              Hours
            </p>
          </div>
          <div className={block}>
            <p className="font-[family-name:var(--font-mono)] text-[clamp(1.5rem,6vw,2rem)] font-semibold tabular-nums text-white">
              {pad2(minutes)}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(223,245,234,0.55)]">
              Minutes
            </p>
          </div>
          <div className={block}>
            <p className="font-[family-name:var(--font-mono)] text-[clamp(1.5rem,6vw,2rem)] font-semibold tabular-nums text-[#c9a84c]">
              {pad2(seconds)}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(223,245,234,0.55)]">
              Seconds
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(201,168,76,0.55)] bg-[rgba(201,168,76,0.12)] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white outline-none transition hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)] focus-visible:ring-2 focus-visible:ring-[#c9a84c]/75"
        >
          ← Back to site
        </Link>
      </motion.div>
    </div>
  )
}
