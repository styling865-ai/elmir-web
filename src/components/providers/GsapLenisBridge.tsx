import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drives Lenis via GSAP ticker and keeps ScrollTrigger in sync with smooth scroll.
 * Requires <ReactLenis autoRaf={false} />.
 */
export function GsapLenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on('scroll', onScroll)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(ticker)
      window.removeEventListener('resize', onResize)
    }
  }, [lenis])

  return null
}
