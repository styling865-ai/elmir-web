import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Logo } from './Logo'
import { SectionParallaxBg } from './animations/SectionParallaxBg'

const INSTAGRAM_URL = 'https://www.instagram.com/joinelmir/'
const LINKEDIN_URL = 'https://www.linkedin.com/company/joinelmir'

const FOOTER_MOOD =
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80'

const EASE = [0.22, 1, 0.36, 1] as const

const navLink =
  'relative shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d0eae2] transition-colors hover:text-[var(--elmir-text-on-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dff8ee] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:origin-left after:bg-[var(--green-300)] after:transition-[width,opacity] after:duration-300 hover:after:w-full'

const lineReveal = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
}

const lineItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
}

export function Footer() {
  const [sent, setSent] = useState(false)
  const reduced = useReducedMotion() ?? false

  return (
    <footer
      id="waitlist"
      className="relative mt-0 overflow-hidden border-t border-[rgba(188,225,208,0.28)]"
    >
      <SectionParallaxBg src={FOOTER_MOOD} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(168deg,rgba(5,15,5,0.92)_0%,rgba(8,22,12,0.88)_45%,rgba(5,15,5,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-400)]/35 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* —— Waitlist (same page region as footer; one visual system) —— */}
        <div className="relative border-b border-[rgba(188,225,208,0.14)] py-20 md:py-28">
          <motion.div
            className="pointer-events-none absolute left-[12%] top-[28%] h-[min(42vw,380px)] w-[min(42vw,380px)] rounded-full bg-[radial-gradient(circle,rgba(126,200,126,0.32),rgba(100,160,120,0.14),transparent_55%)] blur-2xl"
            aria-hidden
            animate={
              reduced
                ? undefined
                : {
                    x: [0, 36, -22, 18, 0],
                    y: [0, -28, 16, -12, 0],
                    scale: [1, 1.06, 0.98, 1.03, 1],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 14,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          />
          <div className="pointer-events-none absolute -left-24 top-[18%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(126,200,126,0.16),transparent_65%)] blur-3xl md:top-[22%]" />
          <div className="pointer-events-none absolute bottom-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.1),transparent_60%)] blur-3xl" />

          <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-20">
            <motion.div
              variants={lineReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35, margin: '-40px' }}
              className="max-w-xl space-y-6 text-left"
            >
              <motion.p
                variants={lineItem}
                className="type-label text-[var(--green-300)]"
              >
                Join the drop
              </motion.p>
              <motion.h2
                variants={lineItem}
                className="type-h2 font-serif leading-[1.08] text-[var(--elmir-text-on-green)]"
              >
                Early invites — zero spam
              </motion.h2>
              <motion.p
                variants={lineItem}
                className="type-body max-w-md text-[#dffbf5]"
              >
                Leave an email — we reply when TestFlight opens.
              </motion.p>
              <motion.div
                variants={lineItem}
                className="hidden h-px max-w-xs bg-gradient-to-r from-[var(--gold-400)]/50 via-[var(--green-300)]/40 to-transparent lg:block"
                aria-hidden
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.72, ease: EASE }}
              className="relative rounded-[var(--radius-2xl)] border border-[rgba(220,248,236,0.28)] bg-[rgba(18,34,26,0.58)] p-8 shadow-[0_32px_120px_rgba(10,26,18,0.45)] backdrop-blur-none md:bg-[rgba(18,34,26,0.5)] md:backdrop-blur-[14px] md:p-10"
            >
              <div className="pointer-events-none absolute -inset-[1px] rounded-[var(--radius-2xl)] bg-gradient-to-br from-[rgba(255,255,255,0.08)] via-transparent to-[rgba(126,200,126,0.06)] opacity-70" />
              <div className="relative space-y-6">
                <AnimatePresence mode="wait">
                  {!sent ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="space-y-6"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#cde9df]">
                        Notify me
                      </p>
                      <form
                        className="flex flex-col gap-4 sm:flex-row sm:items-stretch"
                        onSubmit={(e) => {
                          e.preventDefault()
                          setSent(true)
                        }}
                      >
                        <label className="sr-only" htmlFor="footer-email">
                          Email address
                        </label>
                        <input
                          id="footer-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@studio.com"
                          className="min-h-[52px] flex-1 rounded-[var(--radius-lg)] border border-[rgba(220,248,236,0.22)] bg-[rgba(255,255,255,0.06)] px-5 text-sm text-[var(--elmir-text-on-green)] outline-none ring-[var(--green-400)]/30 placeholder:text-[var(--white-60)] transition focus:border-[var(--green-400)] focus:bg-[rgba(255,255,255,0.08)] focus:ring-[3px]"
                        />
                        <motion.button
                          type="submit"
                          className="min-h-[52px] rounded-full border border-[var(--green-400)] bg-transparent px-8 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[var(--white)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green-400)]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                        >
                          Notify me
                        </motion.button>
                      </form>
                      <p className="text-xs text-[var(--white-60)]">
                        Wire this field to your ESP when you ship invites.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="done"
                      role="status"
                      aria-live="polite"
                      initial={{ scale: 0.65, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="flex flex-col items-center justify-center gap-4 py-2 text-center sm:flex-row sm:py-4 sm:text-left"
                    >
                      <motion.div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--green-400)] bg-[rgba(126,200,126,0.14)] shadow-[0_0_28px_rgba(126,200,126,0.25)]"
                        initial={{ rotate: -40, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
                      >
                        <svg
                          className="h-7 w-7 text-[var(--green-300)]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <motion.path
                            d="M6 12.5l4 4L18 8"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.35, duration: 0.42, ease: EASE }}
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#cde9df]">
                          You’re in
                        </p>
                        <p className="mt-1 text-sm text-[var(--green-300)]">
                          We’ll reach out when TestFlight opens.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* —— Site meta: one grid — logo row | nav | social+legal — tagline only under logo —— */}
        <div className="grid grid-cols-1 gap-9 py-14 pb-16 md:gap-10 md:py-16 md:pb-20 lg:grid-cols-[auto_1fr_auto] lg:gap-x-10 lg:gap-y-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="lg:col-start-1 lg:row-start-1 lg:self-center"
          >
            <Logo inverted variant="footer" />
          </motion.div>

          <p className="max-w-[min(100%,22rem)] text-[13px] leading-relaxed text-[#a8c9bc] lg:col-start-1 lg:row-start-2 lg:mt-1 lg:pt-1">
            AI fashion platform — orbit the fabric before it ships to your rail.
          </p>

          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
            className="flex min-h-[44px] flex-nowrap items-center justify-start gap-x-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-x-8 lg:col-start-2 lg:row-start-1 lg:self-center lg:justify-center lg:gap-x-9 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Footer"
          >
            <a className={navLink} href="#looks">
              Looks
            </a>
            <a className={navLink} href="#app">
              App
            </a>
            <a className={navLink} href="#features">
              Features
            </a>
            <a className={navLink} href="#waitlist">
              Waitlist
            </a>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
            className="flex flex-col items-stretch gap-4 sm:items-end lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:w-[min(100%,220px)] lg:justify-self-end"
          >
            <div className="flex items-center justify-start gap-2.5 sm:justify-end">
              <a
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(220,248,236,0.22)] bg-[rgba(255,255,255,0.05)] text-[#e8f7f0] shadow-[inset_0_1px_0_rgba(255,254,249,0.06)] transition hover:border-[var(--green-400)]/45 hover:text-[var(--elmir-text-on-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dff8ee]"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(220,248,236,0.22)] bg-[rgba(255,255,255,0.05)] text-[#e8f7f0] shadow-[inset_0_1px_0_rgba(255,254,249,0.06)] transition hover:border-[var(--green-400)]/45 hover:text-[var(--elmir-text-on-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dff8ee]"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ELMIR on LinkedIn"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
              className="flex flex-col gap-1.5 border-t border-[rgba(188,225,208,0.14)] pt-4 text-right sm:items-end lg:border-t-0 lg:pt-3"
            >
              <p className="text-[10px] font-medium leading-relaxed tracking-wide text-[#8fb5a4] sm:max-w-[210px]">
                Some product links may earn ELMIR a commission — placements stay editorial.
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#cce8de]">
                © {new Date().getFullYear()} ELMIR
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
