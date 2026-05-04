import { motion } from 'motion/react'

/**
 * Editorial “leaf light” wash — only greens (no neutral grey ramps).
 * Mirrors soft moss highlights + deep forest pockets like your mobile ref.
 */
export function ElmirBackdrop() {
  return (
    <>
      {/* Light moss bloom — upper hero */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[25%] top-[-22%] h-[95%] w-[85%] rounded-[55%] bg-[radial-gradient(ellipse_at_center,rgba(175,203,165,0.55)_0%,rgba(130,158,118,0.22)_42%,transparent_68%)] blur-[2px]"
        animate={{
          opacity: [0.85, 1, 0.85],
          x: [0, 12, 0],
          y: [0, 8, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary lighter patch — top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[18%] top-[6%] h-[58%] w-[62%] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(200,218,188,0.42)_0%,transparent_62%)] blur-[3px]"
      />
      {/* Deep forest pocket — bottom */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-28%] left-[6%] h-[72%] w-[78%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(28,42,26,0.55)_0%,rgba(45,58,40,0.28)_45%,transparent_70%)] blur-md"
        animate={{ opacity: [0.65, 0.85, 0.65] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Dappled mid-tones — scattered ellipses */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.9]"
        style={{
          background: `
            radial-gradient(ellipse 28% 38% at 75% 42%, rgba(90, 118, 82, 0.38), transparent 62%),
            radial-gradient(ellipse 22% 30% at 22% 58%, rgba(150, 175, 138, 0.28), transparent 58%),
            radial-gradient(ellipse 35% 28% at 48% 78%, rgba(38, 52, 34, 0.42), transparent 58%),
            radial-gradient(ellipse 18% 24% at 88% 82%, rgba(110, 138, 98, 0.22), transparent 55%)
          `,
        }}
      />
      {/* Soft vertical wash — ties layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgba(143,168,135,0.22)_0%,transparent_38%,rgba(32,48,30,0.32)_100%)]"
      />
    </>
  )
}
