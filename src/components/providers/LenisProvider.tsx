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
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1.18,
        touchMultiplier: 1.05,
        syncTouch: false,
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
