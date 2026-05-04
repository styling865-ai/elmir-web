import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/utils'

const easeFabric: [number, number, number, number] = [0.45, 0, 0.55, 1]

type Props = {
  /** `page` = full-bleed behind hero on moss. `card` = inside ivory panel (richer color so it reads through frost). */
  variant?: 'page' | 'card'
  className?: string
}

/**
 * Abstract “fabric in motion” — soft folds of color; `card` variant is tuned for frosted overlays.
 */
export function FabricMotionBg({ variant = 'page', className }: Props) {
  const reduced = useReducedMotion() ?? false
  const card = variant === 'card'

  const shell = cn(
    'pointer-events-none overflow-hidden',
    card ? 'absolute inset-0 z-0 rounded-[inherit]' : 'absolute inset-0 z-0',
    className,
  )

  if (reduced) {
    return (
      <div className={shell} aria-hidden>
        <div
          className={cn(
            'absolute -left-[18%] top-[8%] h-[82%] w-[68%] rounded-[48%] opacity-50 blur-[72px]',
            card
              ? 'bg-[radial-gradient(ellipse_at_40%_45%,rgba(220,236,210,0.75)_0%,rgba(130,158,118,0.38)_40%,rgba(74,93,70,0.15)_72%,transparent_78%)]'
              : 'bg-[radial-gradient(ellipse_at_40%_45%,rgba(240,247,236,0.55)_0%,rgba(168,196,155,0.22)_42%,transparent_72%)]',
          )}
        />
        <div
          className={cn(
            'absolute -right-[12%] bottom-[0%] h-[75%] w-[62%] rounded-[52%] opacity-45 blur-[68px]',
            card
              ? 'bg-[radial-gradient(ellipse_at_55%_55%,rgba(255,254,249,0.55)_0%,rgba(168,196,155,0.32)_48%,rgba(95,109,86,0.18)_68%,transparent_76%)]'
              : 'bg-[radial-gradient(ellipse_at_55%_55%,rgba(230,240,226,0.45)_0%,rgba(95,109,86,0.12)_55%,transparent_70%)]',
          )}
        />
        <div
          className={cn(
            'absolute left-[25%] top-[35%] h-[45%] w-[55%] rounded-[45%] blur-[56px]',
            card
              ? 'bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.2)_0%,rgba(200,228,210,0.28)_40%,transparent_65%)] opacity-80'
              : 'bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.08)_0%,transparent_65%)] opacity-70',
          )}
        />
      </div>
    )
  }

  return (
    <div className={shell} aria-hidden>
      <motion.div
        className={cn(
          'absolute -left-[22%] top-[5%] h-[88%] w-[72%] rounded-[48%] blur-[76px]',
          card
            ? 'bg-[radial-gradient(ellipse_at_38%_42%,rgba(248,252,246,0.75)_0%,rgba(175,200,158,0.45)_36%,rgba(95,125,88,0.22)_62%,transparent_80%)]'
            : 'bg-[radial-gradient(ellipse_at_38%_42%,rgba(245,250,242,0.65)_0%,rgba(184,206,172,0.28)_38%,rgba(115,143,104,0.12)_62%,transparent_78%)]',
        )}
        initial={{ opacity: card ? 0.58 : 0.42 }}
        animate={{
          opacity: card
            ? [0.52, 0.72, 0.56, 0.68, 0.52]
            : [0.38, 0.48, 0.4, 0.44, 0.38],
          x: ['-2%', '3%', '-1%', '0%'],
          y: ['0%', '4%', '1%', '0%'],
          rotate: [-2, 1, -1, -2],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: easeFabric,
        }}
      />
      <motion.div
        className={cn(
          'absolute -right-[8%] bottom-[-5%] h-[80%] w-[65%] rounded-[52%] blur-[70px]',
          card
            ? 'bg-[radial-gradient(ellipse_at_58%_48%,rgba(255,254,249,0.55)_0%,rgba(168,196,155,0.32)_42%,rgba(74,93,70,0.2)_68%,transparent_84%)]'
            : 'bg-[radial-gradient(ellipse_at_58%_48%,rgba(255,254,249,0.35)_0%,rgba(168,196,155,0.18)_45%,rgba(74,93,70,0.1)_68%,transparent_82%)]',
        )}
        initial={{ opacity: card ? 0.55 : 0.4 }}
        animate={{
          opacity: card
            ? [0.48, 0.64, 0.52, 0.6, 0.48]
            : [0.36, 0.44, 0.38, 0.42, 0.36],
          x: ['2%', '-3%', '1%', '0%'],
          y: ['2%', '-3%', '0%', '1%'],
          rotate: [1.5, -2, 0.5, 1.5],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: easeFabric,
          delay: 2,
        }}
      />
      <motion.div
        className={cn(
          'absolute left-[18%] top-[28%] h-[52%] w-[58%] rounded-[42%] blur-[58px]',
          card
            ? 'bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.22)_0%,rgba(210,235,220,0.35)_38%,transparent_68%)]'
            : 'bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.12)_0%,rgba(212,238,226,0.15)_35%,transparent_68%)]',
        )}
        initial={{ opacity: card ? 0.5 : 0.35 }}
        animate={{
          opacity: card
            ? [0.44, 0.6, 0.48, 0.55, 0.44]
            : [0.3, 0.42, 0.34, 0.38, 0.3],
          scale: [1, 1.04, 0.98, 1.02, 1],
          x: ['0%', '2%', '-2%', '0%'],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: easeFabric,
          delay: 5,
        }}
      />
      <motion.div
        className={cn(
          'absolute inset-0 mix-blend-soft-light',
          card
            ? 'bg-[linear-gradient(118deg,transparent_32%,rgba(255,255,255,0.16)_50%,transparent_66%)]'
            : 'bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.04)_48%,transparent_62%)]',
        )}
        animate={{
          opacity: card ? [0.22, 0.42, 0.28, 0.36, 0.22] : [0.15, 0.28, 0.18, 0.22, 0.15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: easeFabric, delay: 1 }}
      />
    </div>
  )
}
