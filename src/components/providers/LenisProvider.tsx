import { Lenis as ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { GsapLenisBridge } from './GsapLenisBridge'

type Props = { children: ReactNode }

export function LenisProvider({ children }: Props) {
  return (
    <ReactLenis
      root
      autoRaf={false}
      options={{
        /* Slightly higher lerp: Lenis stays closer to ScrollTrigger / wheel delta (less “rubber band” backlog). */
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1.12,
        touchMultiplier: 1.08,
        /* Native finger scrolling + Lenis; avoids “fighting” the page on phones. */
        syncTouch: true,
        syncTouchLerp: 0.088,
        anchors: true,
        /* Let nested overflow regions (horizontal carousels) receive wheel without trapping page scroll. */
        allowNestedScroll: true,
      }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  )
}
