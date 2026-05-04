import { motion, useReducedMotion } from 'motion/react'

type Props = {
  text: string
  className?: string
  delay?: number
  perChar?: number
  /** When true, characters stay hidden until this becomes false (e.g. intro overlay). */
  hold?: boolean
}

export function SplitText({
  text,
  className = '',
  delay = 0,
  perChar = 0.02,
  hold = false,
}: Props) {
  const reduced = useReducedMotion() ?? false
  const chars = text.split('')
  const frozen = hold && !reduced

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <motion.span
          key={`${text}-${i}-${ch}`}
          className="inline-block"
          initial={reduced ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }}
          animate={
            reduced
              ? undefined
              : frozen
                ? { y: -60, opacity: 0 }
                : { y: 0, opacity: 1 }
          }
          transition={
            reduced || frozen
              ? undefined
              : {
                  delay: delay + i * perChar,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        >
          {ch === ' ' ? '\u00a0' : ch}
        </motion.span>
      ))}
    </span>
  )
}
