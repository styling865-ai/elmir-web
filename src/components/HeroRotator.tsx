import { motion, useReducedMotion } from 'motion/react'
import { Suspense, lazy, useEffect, useState } from 'react'
import { useUiStore } from '../store/uiStore'
import { cn } from '../lib/utils'

/** Full-bleed storefront (night ELMIR) — outside the hero card. */
const HERO_OUTSIDE_BG = '/hero-outside-bg.png'
/** Showroom studio — right panel; 3D dress composites on top (transparent WebGL). */
const HERO_STUDIO_BG = '/hero-studio.png'

/** Film grain — full-hero feTurbulence + desaturate (300×300 tile). */
const HERO_FILM_NOISE_DATA =
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="300" height="300" filter="url(#n)" opacity="1"/></svg>`,
  ) +
  '")'

const textEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const HeroGarmentStage = lazy(() =>
  import('./hero/HeroGarmentStage').then((m) => ({
    default: m.HeroGarmentStage,
  })),
)

export function HeroRotator() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const introDone = useUiStore((s) => s.introDone)
  const rm = prefersReducedMotion

  const show = introDone || rm
  const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

  const [scrollHideCue, setScrollHideCue] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrollHideCue(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="looks"
      className="relative z-[1] flex min-h-[100svh] flex-col items-center justify-start overflow-hidden bg-transparent px-5 pb-12 pt-[calc(env(safe-area-inset-top,0px)+4.25rem)] sm:px-8 md:px-12 md:pb-16 md:pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] lg:px-16 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src={HERO_OUTSIDE_BG}
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="absolute left-1/2 top-1/2 h-[115%] min-h-full w-full min-w-[115%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_42%] blur-[2px] motion-reduce:blur-none sm:object-[center_38%] md:blur-[4px]"
        />
        <div className="absolute inset-0 bg-[rgba(8,18,14,0.28)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(0,0,0,0.4)_100%)]"
        aria-hidden
      />

      <motion.div
        className={cn(
          'relative z-10 mx-auto w-full max-w-[min(1180px,100%)] shrink-0 overflow-hidden rounded-[34px]',
          'border border-white/[0.12]',
          'shadow-[0_32px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset]',
          'h-[min(88svh,920px)]',
          'max-md:h-[min(92svh,820px)] max-md:max-w-full max-md:rounded-[28px]',
        )}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={show || rm ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0 }}
        transition={{
          duration: rm ? 0.01 : 0.6,
          delay: rm ? 0 : show ? 0.2 : 0,
          ease: easeOut,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] bg-[linear-gradient(105deg,#0a0f0a_0%,#0a0f0a_40%,rgba(10,15,10,0.7)_55%,rgba(10,15,10,0.0)_70%)]"
          aria-hidden
        />
        <div className="relative z-[3] grid h-full max-md:grid-rows-[minmax(min(48vh,420px),1fr)_auto] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:grid-rows-1 md:items-stretch">
          {/* Left — copy floats on shared darkness; no separate panel chrome */}
          <div className="relative z-[3] order-2 flex min-h-0 flex-col justify-end overflow-visible !border-none bg-transparent px-6 pb-10 pt-10 !shadow-none [border-radius:0!important] md:order-1 md:px-9 md:pb-12 md:pt-12">
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[min(100%,420px)] w-[min(100%,480px)] bg-[radial-gradient(ellipse_400px_300px_at_20%_80%,rgba(61,122,61,0.04)_0%,transparent_70%)] motion-safe:animate-[hero-glow-breathe_4s_ease-in-out_infinite] motion-reduce:animate-none"
              aria-hidden
            />

            <div className="relative z-10 max-w-[min(92vw,400px)] [text-rendering:optimizeLegibility]">
              <motion.p
                className="font-[family-name:var(--font-body)] mb-4 text-[0.6rem] font-medium uppercase tracking-[0.15em] text-[rgba(201,168,76,0.8)] md:mb-5"
                initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: rm ? 0.01 : 0.8,
                  delay: rm ? 0 : show ? 0.3 : 0,
                  ease: textEase,
                }}
              >
                AI Fashion Platform · 2026
              </motion.p>
              <h1
                className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em] text-[clamp(2.8rem,5vw,5rem)] leading-[0.92] text-white"
                spellCheck={false}
              >
                <motion.span
                  className="block pb-[0.04em] text-white"
                  initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{
                    duration: rm ? 0.01 : 0.9,
                    delay: rm ? 0 : show ? 0.5 : 0,
                    ease: textEase,
                  }}
                >
                  Wear it.
                </motion.span>
                <motion.span
                  className="block pb-[0.04em] text-white"
                  initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{
                    duration: rm ? 0.01 : 0.9,
                    delay: rm ? 0 : show ? 0.65 : 0,
                    ease: textEase,
                  }}
                >
                  Before
                </motion.span>
                <motion.span
                  className="block pb-[0.04em] text-white"
                  initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{
                    duration: rm ? 0.01 : 0.9,
                    delay: rm ? 0 : show ? 0.8 : 0,
                    ease: textEase,
                  }}
                >
                  <em className="font-serif font-medium text-[#c9a84c] italic">You</em>
                  <span> buy it.</span>
                </motion.span>
              </h1>
              <motion.p
                className="mt-4 max-w-[280px] font-[family-name:var(--font-body)] text-[0.875rem] leading-relaxed text-[rgba(255,255,255,0.45)] md:mt-5"
                initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: rm ? 0.01 : 0.8,
                  delay: rm ? 0 : show ? 1.0 : 0,
                  ease: textEase,
                }}
              >
                Upload your photo. Describe your dream outfit. See yourself wearing it — in seconds.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-wrap gap-3 md:mt-10"
                initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={show || rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: rm ? 0.01 : 0.8,
                  delay: rm ? 0 : show ? 1.2 : 0,
                  ease: textEase,
                }}
              >
                <a
                  href="#app"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(201,168,76,0.5)] bg-transparent px-6 py-3 font-[family-name:var(--font-body)] text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white outline-none transition-all duration-200 ease-out hover:-translate-y-px hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] hover:shadow-[0_0_25px_rgba(201,168,76,0.35),0_0_50px_rgba(201,168,76,0.15)] focus-visible:ring-2 focus-visible:ring-[#c9a84c]/80"
                >
                  Try On Now →
                </a>
                <a
                  href="#features"
                  className="group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full border-none bg-transparent px-6 py-3 font-[family-name:var(--font-body)] text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.4)] outline-none transition-colors duration-200 ease-out after:pointer-events-none after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[rgba(255,255,255,0.5)] after:transition-[width] after:duration-300 after:ease-out hover:text-[rgba(255,255,255,0.9)] hover:after:w-full focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60"
                >
                  Explore Looks
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right — studio plate + 3D */}
          <div className="relative z-10 order-1 min-h-0 md:order-2">
            <img
              src={HERO_STUDIO_BG}
              alt=""
              width={1600}
              height={1200}
              decoding="async"
              fetchPriority="high"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_center]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(10,15,10,0.95)_0%,rgba(10,15,10,0.6)_30%,rgba(10,15,10,0.1)_60%,rgba(10,15,10,0.0)_100%)]"
              aria-hidden
            />
            <div className="relative z-10 flex h-full min-h-[min(48vh,420px)] w-full items-stretch md:min-h-0">
              <Suspense
                fallback={
                  <div
                    className="flex h-full w-full flex-1 items-center justify-center text-white/40"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="text-xs tracking-[0.2em] uppercase">Loading…</span>
                  </div>
                }
              >
                <HeroGarmentStage
                  reducedMotion={rm}
                  className="h-full min-h-[min(48vh,420px)] w-full flex-1 md:min-h-0"
                  modelTargetHeight={4.2}
                  variant="light"
                />
              </Suspense>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="pointer-events-none fixed inset-0 z-[9999] h-[100vh] w-[100vw] opacity-[0.025] motion-reduce:opacity-0"
        style={{
          backgroundImage: HERO_FILM_NOISE_DATA,
          backgroundRepeat: 'repeat',
        }}
        aria-hidden
      />

      <div
        className={cn(
          'pointer-events-none absolute bottom-8 left-1/2 z-[10000] flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-500 ease-out motion-reduce:hidden',
          scrollHideCue ? 'opacity-0' : 'opacity-100',
        )}
        aria-hidden
      >
        <span className="font-[family-name:var(--font-body)] text-[0.55rem] font-normal uppercase tracking-[0.15em] text-[rgba(255,255,255,0.25)]">
          Scroll to explore
        </span>
        <span
          className="block h-[35px] w-px bg-[rgba(255,255,255,0.2)] motion-safe:animate-[hero-scroll-line_1.5s_ease-in-out_infinite] motion-reduce:animate-none"
          aria-hidden
        />
      </div>
    </section>
  )
}
