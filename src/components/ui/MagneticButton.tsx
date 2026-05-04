import { type ComponentProps, useCallback, useRef, useState } from 'react'

const RADIUS = 30
const STRENGTH = 0.42

type Props = ComponentProps<'button'> & {
  magneticRadius?: number
  magneticStrength?: number
}

/**
 * Subtle pull toward cursor within radius (desktop hover). No-op for coarse pointers.
 */
export function MagneticButton({
  magneticRadius = RADIUS,
  magneticStrength = STRENGTH,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [off, setOff] = useState({ x: 0, y: 0 })

  const move = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < magneticRadius && dist > 1) {
        const f = (1 - dist / magneticRadius) * magneticStrength
        setOff({ x: dx * f, y: dy * f })
      } else if (dist <= 1) {
        setOff({ x: 0, y: 0 })
      } else {
        setOff({ x: 0, y: 0 })
      }
    },
    [magneticRadius, magneticStrength],
  )

  return (
    <button
      ref={ref}
      type={type}
      className={className}
      style={{
        transform: `translate(${off.x}px, ${off.y}px)`,
        transition:
          off.x === 0 && off.y === 0
            ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
            : undefined,
      }}
      {...rest}
      onMouseMove={(e) => {
        rest.onMouseMove?.(e)
        move(e)
      }}
      onMouseLeave={(e) => {
        setOff({ x: 0, y: 0 })
        rest.onMouseLeave?.(e)
      }}
    />
  )
}
