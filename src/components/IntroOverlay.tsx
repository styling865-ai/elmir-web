import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useUiStore } from '../store/uiStore'

const WORD = 'ELMIR'

type Phase = 'enter' | 'spread' | 'fadeout'

export function IntroOverlay() {
  const reduced = useReducedMotion() ?? false
  const introDone = useUiStore((s) => s.introDone)
  const setIntroDone = useUiStore((s) => s.setIntroDone)
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    if (reduced) {
      setIntroDone(true)
      return
    }
    if (introDone) return
    /* Timeline: 0–0.8s letters, 0.8–1.4s spread, 1.4–2.0s overlay fade, hero at 2.0s */
    const tSpread = window.setTimeout(() => setPhase('spread'), 800)
    const tFade = window.setTimeout(() => setPhase('fadeout'), 1400)
    const tDone = window.setTimeout(() => setIntroDone(true), 2000)
    return () => {
      window.clearTimeout(tSpread)
      window.clearTimeout(tFade)
      window.clearTimeout(tDone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot runway intro timing
  }, [reduced, setIntroDone])

  if (introDone || reduced) return null

  const letters = WORD.split('')

  return (
    <motion.div
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={phase === 'fadeout' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="flex items-center justify-center font-serif text-[clamp(2rem,8vw,3rem)] font-semibold tracking-[0.02em] text-white"
        animate={
          phase === 'spread'
            ? { gap: '0.5em', opacity: 0 }
            : { gap: '0.02em', opacity: 1 }
        }
        transition={
          phase === 'spread'
            ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.35 }
        }
        style={{ display: 'flex' }}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            initial={{ y: 60, opacity: 0 }}
            animate={
              phase === 'spread'
                ? { y: -10, opacity: 0, rotateX: -45 }
                : { y: 0, opacity: 1, rotateX: 0 }
            }
            transition={{
              delay: i * 0.1,
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}
