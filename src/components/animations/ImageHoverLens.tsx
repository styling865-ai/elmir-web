import { useCallback, useRef, useState } from 'react'

const LENS = 140
const ZOOM = 1.48

type Props = {
  src: string
  alt: string
  imgClassName?: string
}

type LensState = { x: number; y: number; w: number; h: number }

/**
 * Circular magnifier follows pointer; slightly higher contrast in lens. Best on fine pointers.
 */
export function ImageHoverLens({ src, alt, imgClassName = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [lens, setLens] = useState<LensState | null>(null)

  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
      setLens(null)
      return
    }
    const el = wrapRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (x < 0 || y < 0 || x > r.width || y > r.height) {
      setLens(null)
      return
    }
    setLens({ x, y, w, h })
  }, [])

  const onLeave = useCallback(() => setLens(null), [])

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName}`}
        loading="lazy"
        decoding="async"
      />
      {lens ? (
        <div
          className="pointer-events-none absolute z-10 rounded-full border border-[rgba(230,255,244,0.45)] bg-[rgba(8,18,12,0.15)] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          style={{
            width: LENS,
            height: LENS,
            left: lens.x - LENS / 2,
            top: lens.y - LENS / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
            backgroundPosition: `${-(lens.x * ZOOM - LENS / 2)}px ${-(lens.y * ZOOM - LENS / 2)}px`,
            filter: 'contrast(1.08) saturate(1.12)',
          }}
          aria-hidden
        />
      ) : null}
    </div>
  )
}
