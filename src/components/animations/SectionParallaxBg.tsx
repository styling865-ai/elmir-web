import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  src: string
  /** Screen-reader description; empty decorative image uses "". */
  alt?: string
}

/**
 * Full-bleed ambient photo inside a parent <section>; subtle parallax on scroll (GSAP scrub).
 */
export function SectionParallaxBg({ src, alt = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    if (reduced || !imgRef.current || !wrapRef.current) return

    const mq = window.matchMedia('(max-width: 767px)')

    const run = () => {
      if (!imgRef.current || !wrapRef.current) return undefined

      if (mq.matches) {
        gsap.set(imgRef.current, { clearProps: 'transform' })
        return undefined
      }

      const trigger = wrapRef.current.closest('section')
      if (!trigger) return undefined
      const el = imgRef.current

      return gsap.context(() => {
        gsap.fromTo(
          el,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top bottom',
              end: 'bottom top',
              /* Tighter than ~1s: less animation “catch-up” work while Lenis is moving. */
              scrub: true,
            },
          },
        )
      }, wrapRef)
    }

    let ctx = run()
    const onMq = () => {
      ctx?.revert()
      ctx = run()
      ScrollTrigger.refresh()
    }
    mq.addEventListener('change', onMq)

    return () => {
      mq.removeEventListener('change', onMq)
      ctx?.revert()
    }
  }, [reduced, src])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute left-1/2 top-1/2 h-[130%] min-h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.2] saturate-[0.75] md:opacity-[0.26]"
        loading="lazy"
        decoding="async"
        width={1600}
        height={900}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_35%,transparent_20%,rgba(5,15,5,0.88)_72%,rgba(5,15,5,0.96)_100%)]" />
    </div>
  )
}
