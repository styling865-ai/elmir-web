import { motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'

/** Sage accent on light ivory (matches reference screens). */
const ACCENT = 'text-[var(--green-600)]'

const CARD_SHELL =
  'overflow-hidden rounded-[28px] border border-[rgba(89,95,82,0.1)] bg-[#fffef9] shadow-[0_32px_90px_rgba(22,40,28,0.1),0_12px_32px_rgba(22,40,28,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]'

function BadgeIcon({ kind }: { kind: 'hanger' | 'bag' }) {
  if (kind === 'hanger') {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path
          d="M8 7a4 4 0 018 0v2h2a2 2 0 012 2v9H4v-9a2 2 0 012-2h2V7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 9h8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 7h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7L5 4H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  )
}

type SlidePhoto = {
  variant: 'photo'
  id: string
  title: ReactNode
  body: string
  image: string
  badge: 'hanger' | 'bag'
}

type SlideAuth = {
  variant: 'auth'
  id: string
  title: ReactNode
  body: string
  footerNote: string
}

type Slide = SlidePhoto | SlideAuth

const slides: Slide[] = [
  {
    variant: 'photo',
    id: 'vibe',
    title: (
      <>
        Find your <span className={ACCENT}>vibe.</span>
      </>
    ),
    body: 'Curated styles, tailored to you. Explore looks that match your mood.',
    image: '/features/app-showcase/mobile-vibe.png',
    badge: 'hanger',
  },
  {
    variant: 'auth',
    id: 'auth',
    title: (
      <>
        One tap to get <span className={ACCENT}>started.</span>
      </>
    ),
    body: 'Secure, fast & effortless. Sign in to personalize your experience.',
    footerNote: 'Your data is safe with us.',
  },
  {
    variant: 'photo',
    id: 'checkout',
    title: (
      <>
        From look → to <span className={ACCENT}>checkout.</span>
      </>
    ),
    body: 'Try, love & shop — all in one place. Delivered to your door.',
    image: '/features/app-showcase/mobile-checkout.png',
    badge: 'bag',
  },
]

function PhotoCardContent({
  slide,
  titleSlot,
}: {
  slide: SlidePhoto
  titleSlot: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative h-[56%] min-h-[200px] shrink-0 overflow-hidden bg-[#e8e6e0]">
        <img
          src={slide.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#faf8f3] via-[#faf8f3]/75 to-transparent" />
        <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--green-600)] text-[#fffef9] shadow-[0_6px_20px_rgba(45,90,45,0.22)]">
          <BadgeIcon kind={slide.badge} />
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#faf8f3] px-7 pb-8 pt-5">
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--elmir-ink)]">
          {titleSlot}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--elmir-body-light)]">{slide.body}</p>
        <div className="mt-auto pt-8">
          <span className="inline-block h-[3px] w-14 rounded-full bg-[var(--green-500)]" />
        </div>
      </div>
    </div>
  )
}

function TiltSlideCard({
  slide,
  idx,
  focalRef,
}: {
  slide: Slide
  idx: number
  focalRef?: React.RefObject<HTMLElement | null>
}) {
  const reduced = useReducedMotion() ?? false
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const move = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (reduced) return
      const el = e.currentTarget
      const b = el.getBoundingClientRect()
      const px = (e.clientX - b.left) / b.width - 0.5
      const py = (e.clientY - b.top) / b.height - 0.5
      setTilt({ rx: py * -10, ry: px * 14 })
    },
    [reduced],
  )

  const leave = useCallback(() => setTilt({ rx: 0, ry: 0 }), [])

  return (
    <motion.article
      ref={focalRef}
      initial={{ opacity: 0, y: 32, rotateY: -6 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.58, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-w-[min(340px,82vw)] snap-center [perspective:1100px]"
      onMouseMove={move}
      onMouseLeave={leave}
      whileHover={
        reduced
          ? undefined
          : { y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
      }
    >
      <div
        className={`${CARD_SHELL} transition-[transform] duration-200 ease-out [transform-style:preserve-3d] motion-reduce:transform-none`}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        <div className="relative aspect-[9/16] w-full">
          {slide.variant === 'photo' ? (
            <PhotoCardContent slide={slide} titleSlot={slide.title} />
          ) : (
            <div className="flex h-full flex-col bg-gradient-to-b from-[#fdfcfa] via-[#faf8f3] to-[#f3efe8] px-7 pb-8 pt-12">
              <div className="flex min-h-0 flex-1 flex-col justify-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(89,95,82,0.14)] bg-white text-[var(--elmir-ink)] shadow-[0_8px_28px_rgba(22,40,28,0.08)]">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-8 text-center text-2xl font-semibold leading-tight tracking-tight text-[var(--elmir-ink)]">
                  {slide.title}
                </h3>
                <p className="mt-3 text-center text-sm leading-relaxed text-[var(--elmir-body-light)]">
                  {slide.body}
                </p>
                <div className="mt-8 flex flex-col gap-2.5">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(89,95,82,0.16)] bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--elmir-ink)] shadow-[0_4px_16px_rgba(22,40,28,0.06)] transition hover:bg-[var(--elmir-paper-field)]"
                  >
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[var(--elmir-ink)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#fffef9] transition hover:bg-[var(--elmir-ink-hover)]"
                  >
                    Continue with Apple
                  </button>
                </div>
                <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[var(--elmir-caption-on-light)]">
                  <svg className="h-3.5 w-3.5 shrink-0 text-[var(--green-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {slide.footerNote}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-block h-[3px] w-14 rounded-full bg-[var(--green-500)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function AppShowcase() {
  const reduced = useReducedMotion() ?? false
  const focalRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const run = () => {
      if (window.matchMedia('(min-width: 768px)').matches) return
      focalRef.current?.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'auto',
      })
    }
    run()
    window.addEventListener('resize', run)
    return () => window.removeEventListener('resize', run)
  }, [])

  return (
    <section
      id="app"
      className="relative overflow-hidden border-t border-[rgba(188,225,208,0.28)] bg-transparent py-24 md:py-32"
    >
      <motion.div
        className="pointer-events-none absolute -right-[8%] top-[22%] h-[min(56vw,440px)] w-[min(56vw,440px)] rounded-full bg-[radial-gradient(circle,rgba(126,200,126,0.3),rgba(80,130,95,0.12),transparent_56%)] blur-2xl"
        aria-hidden
        animate={
          reduced
            ? undefined
            : {
                x: [0, -40, 28, -16, 0],
                y: [0, 24, -18, 12, 0],
                scale: [1, 1.05, 0.98, 1.02, 1],
              }
        }
        transition={
          reduced
            ? undefined
            : { duration: 16, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        className="pointer-events-none absolute bottom-[8%] left-[-6%] h-[min(48vw,360px)] w-[min(48vw,360px)] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.14),transparent_58%)] blur-3xl"
        aria-hidden
        animate={
          reduced
            ? undefined
            : { opacity: [0.45, 0.75, 0.5, 0.65, 0.45] }
        }
        transition={
          reduced ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_10%,rgba(175,203,165,0.14),transparent_58%)]" aria-hidden />

      <div className="relative z-[1] mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl space-y-4 text-center"
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#cde9df] md:text-[11px] md:tracking-[0.28em]">
            Mobile craft
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-[var(--elmir-text-on-green)]">
            Screens that feel like{' '}
            <span className="text-[var(--green-300)]">the app.</span>
          </h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[var(--elmir-text-on-green-soft)] md:text-[15px]">
            Built with intention. Designed to inspire.
          </p>
        </motion.div>

        <div className="mt-14 flex snap-x snap-mandatory justify-start gap-7 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-16 md:justify-center md:overflow-x-visible [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, idx) => (
            <TiltSlideCard
              key={slide.id}
              slide={slide}
              idx={idx}
              focalRef={idx === 1 ? focalRef : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
