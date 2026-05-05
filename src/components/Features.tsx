import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SectionParallaxBg } from './animations/SectionParallaxBg'

const EASE = [0.22, 1, 0.36, 1] as const

/** Same gradient + chrome as “Find my match” (forest → sage). */
const CTA_GRADIENT =
  'bg-gradient-to-r from-[var(--green-700)] via-[var(--green-600)] to-[var(--green-500)] text-white shadow-[0_12px_40px_rgba(45,90,45,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-300)]'

const CTA_GRADIENT_BR =
  'bg-gradient-to-br from-[var(--green-700)] via-[var(--green-600)] to-[var(--green-500)] text-white shadow-[0_0_28px_rgba(45,90,45,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-300)]'

/** Accents / icons — same token family as CTA (not lime #4ade80). */
const ACCENT = 'text-[var(--green-300)]'
const ACCENT_BORDER = 'border-[rgba(126,200,126,0.35)]'

/** Same horizontal rails for Feature 01 + 02 (matches user “blue line” alignment). */
const FEATURE_PHOTO_PAIR_EDGE =
  'relative mx-auto w-full max-w-[min(1240px,100%)] px-5 md:px-8' as const

/** Unsplash — editorial / fashion (remaining feature bands only). Feature 01 uses local `/features/photo-match/` paths. */
const MOOD_IMAGES = {
  '02': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  /** Distinct from 01 — retail / rails (paste-link feature). */
  '03': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  '04': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
  '05': 'https://images.unsplash.com/photo-1515886657613-943f6cbabf0f?auto=format&fit=crop&w=1600&q=80',
} as const

/**
 * Local assets under `public/features/photo-match/` — no Unsplash in Feature 01.
 */
const PM = {
  /** Passport-style headshot — small preview beside upload. */
  uploadPreview: '/features/photo-match/upload-portrait.png',
  /** Two full-length dress-match visuals. */
  matchFull: [
    '/features/photo-match/match-full-1.png',
    '/features/photo-match/match-full-2.png',
  ] as const,
} as const

/**
 * Feature 02 — “Model wears it”: fixed local trio (model1 = your photo, model-pic = tap to try on, model2 = you).
 */
const MODEL_WEAR = {
  yourPhoto: '/features/model-wear/model1.png',
  tapToTryOn: '/features/model-wear/model-pic.png',
  thisIsYou: '/features/model-wear/model2.png',
} as const

/** Feature 03 — paste link preview (single local hero; no Unsplash model). */
const PASTE_GARMENT = {
  hero: '/features/paste-garment/try-on-hero.png',
} as const

const PASTE_URL_DEMO =
  'https://www.zara.com/in/en/black-satin-draped-midi-dress-l08912340.html'

const PM_FALLBACK_PORTRAIT =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#141c15"/><stop offset="1" stop-color="#0b100b"/></linearGradient></defs><rect width="320" height="420" fill="url(#p)"/><text x="160" y="210" fill="#6d8874" font-family="DM Sans,system-ui,sans-serif" font-size="11" text-anchor="middle" letter-spacing="0.12em">IMAGE</text></svg>`,
  )

/**
 * Same garment / look on two different models — section 02 cycles these (Unsplash illustrative).
 */
const sameOutfitTwoModels = [
  {
    piece: 'Sage tiered midi dress',
    brand: 'ONLY',
    price: '₹2,499',
    rating: 4.6,
    reviews: 128,
    bg: 'linear-gradient(168deg,#7c9b6f 0%,#5c7a52 42%,#3c5236 100%)',
    accent: '#7ec87e',
    models: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520975958221-ecb9a3a35a15?auto=format&fit=crop&w=1000&q=80',
    ] as const,
  },
  {
    piece: 'Charcoal tailored suit',
    brand: 'COS',
    price: '₹4,199',
    rating: 4.8,
    reviews: 96,
    bg: 'linear-gradient(168deg,#8eaf86 0%,#6f8f67 45%,#4b6245 100%)',
    accent: '#7ec87e',
    models: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    ] as const,
  },
  {
    piece: 'Ivory evening gown',
    brand: 'AND',
    price: '₹5,499',
    rating: 4.7,
    reviews: 203,
    bg: 'linear-gradient(168deg,#9dbf93 0%,#769a6d 45%,#4c6944 100%)',
    accent: '#7ec87e',
    models: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80',
    ] as const,
  },
] as const

/** Feature 04 — couple synced look (vibe tabs + hero; no sparkle icons). */
const COUPLE_VIBES = [
  {
    id: 'evening',
    label: 'Evening Escape',
    lookLabel: 'Evening Escape',
    toggle: 'evening' as const,
    you: '/features/couple/evening-you.png',
    partner: '/features/couple/evening-partner.png',
    hero: '/features/couple/evening-together.png',
  },
  {
    id: 'beach',
    label: 'Beach Getaway',
    lookLabel: 'Beach Getaway',
    toggle: 'beach' as const,
    you: '/features/couple/beach-you.png',
    partner: '/features/couple/beach-partner.png',
    hero: '/features/couple/beach-together.png',
  },
  {
    id: 'date',
    label: 'Date Night',
    lookLabel: 'Date Night',
    toggle: 'date' as const,
    you: '/features/couple/date-you.png',
    partner: '/features/couple/date-partner.png',
    hero: '/features/couple/date-together.png',
  },
] as const

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: EASE },
  },
}

function PmAssetImg({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [useFallback, setUseFallback] = useState(false)
  if (useFallback) {
    return (
      <img
        src={PM_FALLBACK_PORTRAIT}
        alt={alt}
        className={className}
        width={320}
        height={420}
        loading="lazy"
        decoding="async"
      />
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setUseFallback(true)}
    />
  )
}

function FeaturePhotoMatchWorkbench() {
  const [vibe, setVibe] = useState(
    'Brunch with friends on weekend, casual but stylish, light colors.',
  )

  const vibeMax = 120
  const vibeTrim = vibe.slice(0, vibeMax)

  return (
    <section
      id="feature-01"
      className="relative overflow-hidden border-y border-[rgba(188,225,208,0.28)] bg-transparent"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_20%_0%,rgba(175,203,165,0.1),transparent_55%)]" />
      <div className={`${FEATURE_PHOTO_PAIR_EDGE} py-16 md:py-24`}>
        <div className="grid gap-10 lg:min-h-[min(68vh,640px)] lg:grid-cols-[minmax(280px,400px)_1fr] lg:items-stretch lg:gap-12">
          {/* Equal-height row: shared min-height so left card bottom aligns with results footer */}
          {/* Left — flow (dark rounded shell, same language as site) */}
          <motion.div
            className="flex h-full min-h-0 self-stretch flex-col rounded-[18px] border border-[rgba(210,248,232,0.22)] bg-[rgba(14,28,20,0.55)] p-6 shadow-[inset_0_1px_0_rgba(220,248,236,0.08),0_28px_80px_rgba(5,15,8,0.35)] backdrop-blur-[12px] md:p-8"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--green-300)]">
              Feature
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.08] tracking-tight text-[var(--elmir-text-on-green)]">
              Photo in — dress match <span className="text-[var(--green-300)]">out</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-[#dffbf5] md:text-[15px]">
              Upload your picture, add a short vibe or occasion note, and ELMIR ranks the strongest dresses for you. Every pick ships with a direct link to buy.
            </p>

            <div className="mt-6 flex min-h-0 flex-1 flex-col">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cde9df]">
                  Step 1 · Upload your photo
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="flex min-h-[118px] min-w-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(126,200,126,0.4)] bg-[rgba(8,18,12,0.35)] px-4 py-4 text-center transition hover:border-[rgba(158,230,192,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-400)]"
                  >
                    <svg className="h-8 w-8 text-[var(--green-300)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#cde9df]">
                      Upload
                    </span>
                  </button>
                  <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border border-[rgba(210,248,232,0.22)] shadow-[0_8px_24px_rgba(5,15,8,0.35)]">
                    <PmAssetImg
                      src={PM.uploadPreview}
                      alt="Your photo preview"
                      className="h-full w-full object-cover object-[center_20%]"
                    />
                    <span className="absolute left-2 top-2 rounded bg-[rgba(5,15,5,0.65)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                      Before
                    </span>
                    <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--green-500)] text-white shadow-md" aria-hidden>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cde9df]">
                  Step 2 · Describe your vibe
                </p>
                <label className="mt-3 block">
                  <textarea
                    value={vibeTrim}
                    onChange={(e) => setVibe(e.target.value)}
                    maxLength={vibeMax}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-[rgba(210,248,232,0.18)] bg-[rgba(8,18,12,0.45)] px-4 py-3 text-[13px] leading-relaxed text-[#f3fcf7] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[rgba(223,251,245,0.35)] focus:border-[rgba(158,230,192,0.45)] focus:outline-none"
                    placeholder="Occasion, colors, silhouette…"
                  />
                  <span className="mt-1.5 block text-right text-[10px] tabular-nums text-[#cde9df]/80">
                    {vibeTrim.length}/{vibeMax}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="button"
              className={`mt-8 w-full rounded-2xl px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${CTA_GRADIENT}`}
            >
              Find My Match
            </button>
            <p className="mt-2 text-center text-[11px] text-[#cde9df]/85">Takes under 30 seconds.</p>

            <div className="mt-auto flex gap-3 rounded-2xl border border-[rgba(210,248,232,0.15)] bg-[rgba(8,18,12,0.35)] p-4 pt-8">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(61,122,61,0.25)] text-[var(--green-300)]" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="text-[12px] leading-snug text-[#dffbf5]">
                <span className="font-semibold text-[#f3fcf7]">Real products. Real links.</span>{' '}
                We show only real items from trusted brands.
              </p>
            </div>
            </div>
          </motion.div>

          {/* Right — results studio */}
          <motion.div
            className="flex h-full min-h-0 min-w-0 self-stretch flex-col gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
          >
            <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
              <h3 className="text-xl font-semibold tracking-tight text-[var(--elmir-text-on-green)] md:text-2xl">
                Your matches are ready!
              </h3>
              <span className="rounded-full border border-[rgba(210,248,232,0.22)] bg-[rgba(12,26,18,0.5)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#cde9df]">
                AI matched · Real products
              </span>
            </div>

            <div className="grid min-h-[min(36vh,260px)] flex-1 grid-cols-1 gap-5 sm:min-h-0 sm:grid-cols-2 sm:grid-rows-1 sm:gap-6">
              {PM.matchFull.map((src, i) => (
                <div
                  key={src}
                  className="relative min-h-[min(36vh,260px)] overflow-hidden rounded-[22px] border border-[rgba(210,248,232,0.2)] bg-[rgba(14,22,17,0.9)] shadow-[0_24px_70px_rgba(5,15,8,0.45)] sm:h-full sm:min-h-0"
                >
                  <PmAssetImg
                    src={src}
                    alt={i === 0 ? 'Dress match one — full length' : 'Dress match two — full length'}
                    className="absolute inset-0 block h-full w-full object-cover object-[center_38%]"
                  />
                </div>
              ))}
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-4 rounded-2xl border border-[rgba(61,122,61,0.35)] bg-[rgba(10,40,22,0.55)] px-4 py-4 shadow-[inset_0_1px_0_rgba(220,248,236,0.06)] md:flex-row md:items-center md:justify-between md:px-6">
              <div className="flex gap-3">
                <span className="text-[var(--green-300)]" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="max-w-xl text-[12px] leading-relaxed text-[#dffbf5]">
                  Results are based on your photo and vibe. You can refine or try different looks anytime.
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-[rgba(210,248,232,0.22)] bg-[rgba(8,22,14,0.65)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#eafff3] transition hover:border-[rgba(158,230,192,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-400)]"
              >
                <span className="inline-flex items-center gap-2">
                  Upload new photo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SectionShell({
  id,
  index,
  title,
  hint,
  children,
  right,
  moodImage,
}: {
  id: string
  index: keyof typeof MOOD_IMAGES
  title: ReactNode
  hint: string
  children: React.ReactNode
  right?: React.ReactNode
  moodImage?: string
}) {
  const bg = moodImage ?? MOOD_IMAGES[index]
  return (
    <section
      id={id}
      className="relative overflow-hidden border-y border-[rgba(188,225,208,0.28)] bg-transparent"
    >
      <SectionParallaxBg src={bg} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_10%,rgba(175,203,165,0.14),transparent_58%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22, margin: '0px 0px -10% 0px' }}
          className="space-y-7"
        >
          <motion.h2
            variants={staggerItem}
            className="max-w-[18ch] pt-1 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-[var(--elmir-text-on-green)]"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="max-w-xl text-[15px] leading-relaxed text-[#dffbf5] md:text-[17px]"
          >
            {hint}
          </motion.p>
          <motion.div variants={staggerItem}>{children}</motion.div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
        >
          {right}
        </motion.div>
      </div>
    </section>
  )
}

function ModelWearsItShowcase({ reduced }: { reduced: boolean }) {
  const modelSrc = MODEL_WEAR.tapToTryOn
  const youSrc = MODEL_WEAR.thisIsYou

  return (
    <div className="grid w-full grid-cols-1 items-start gap-10 xl:grid-cols-12 xl:gap-8">
      {/* Left — headline, tagline, your photo directly below tagline */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6 xl:col-span-4"
      >
        <div className="space-y-6">
          <motion.div variants={staggerItem}>
            <span
              className={`inline-flex items-center gap-2 rounded-full border ${ACCENT_BORDER} bg-[rgba(12,18,14,0.85)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${ACCENT}`}
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.09 4.26L17 5.27l-3.18 3.18L17 12l-4.91-.99L12 17l-1.09-4.99L6 12l3.18-3.55L6 5.27l4.91 1.99L12 2z" />
              </svg>
              Model wears it
            </span>
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-semibold leading-[1.06] tracking-tight text-white"
          >
            You in that{' '}
            <span className={ACCENT}>perfect look</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="max-w-[28ch] text-[14px] leading-relaxed text-[rgba(243,252,247,0.72)] md:text-[15px]">
            See how real outfits look on you, picked just for your vibe.
          </motion.p>
        </div>
        <motion.div
          variants={staggerItem}
          className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(10,14,12,0.92)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[rgba(210,248,232,0.25)]">
              <PmAssetImg
                src={MODEL_WEAR.yourPhoto}
                alt="Your uploaded photo"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Your photo</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[rgba(243,252,247,0.6)]">
                <svg className={`h-4 w-4 shrink-0 ${ACCENT}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Uploaded
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Model vs you — inset from left so strip sits slightly right, still inside shared max-width */}
      <motion.div
        className="relative min-h-0 min-w-0 xl:col-span-8 xl:flex xl:min-h-0 xl:flex-col xl:pl-4 2xl:pl-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="relative flex min-h-0 flex-1 items-stretch justify-center gap-2 md:gap-3">
            <div
              className="pointer-events-none absolute left-[6%] right-[6%] top-[42%] z-0 hidden border-t border-dashed border-[rgba(126,200,126,0.45)] md:block"
              aria-hidden
            />

            <div className="relative z-10 min-h-0 flex-1 self-stretch">
              <div className="relative h-[min(68vh,700px)] min-h-[400px] w-full overflow-hidden rounded-[22px] border border-[rgba(230,255,244,0.18)] bg-[rgba(8,18,12,0.65)] shadow-[0_24px_80px_rgba(5,15,8,0.45)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="model-wear-catalog"
                    className="absolute inset-0"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <img
                      src={modelSrc}
                      alt="Model wearing the piece"
                      className="pointer-events-none h-full w-full select-none object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
                <span className="absolute left-3 top-3 rounded-lg bg-black/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  Model
                </span>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eafff3] backdrop-blur-md">
                    <svg className="h-3.5 w-3.5 text-[var(--green-300)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" />
                    </svg>
                    Tap to try on
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 flex w-11 shrink-0 flex-col items-center justify-center self-center md:w-14">
              <motion.button
                type="button"
                className={`relative flex h-11 w-11 items-center justify-center rounded-full ${CTA_GRADIENT_BR} md:h-12 md:w-12`}
                aria-label="See on you"
                whileHover={reduced ? undefined : { scale: 1.06 }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>

            <div className="relative z-10 min-h-0 flex-1 self-stretch">
              <div className="relative h-[min(68vh,700px)] min-h-[400px] w-full overflow-hidden rounded-[22px] border-2 border-[var(--green-300)] bg-[rgba(8,18,12,0.65)] shadow-[0_0_36px_rgba(126,200,126,0.28),0_24px_80px_rgba(5,15,8,0.45)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="model-wear-you"
                    className="absolute inset-0"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <img
                      src={youSrc}
                      alt="The look on you"
                      className="pointer-events-none h-full w-full select-none object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
                <span className="absolute left-3 top-3 rounded-lg bg-black/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  You
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#d9ffe9] backdrop-blur-sm">
                  <svg className="h-3 w-3 text-[var(--green-300)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l2.09 6.26L20 9.27l-5.18 3.55L17 20l-5-3.27L7 20l2.18-7.18L4 9.27l5.91-1.01L12 2z" />
                  </svg>
                  Best match
                </span>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eafff3] backdrop-blur-md">
                    <svg className="h-3.5 w-3.5 text-[var(--green-300)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
                    </svg>
                    This is you
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] sm:gap-x-2 md:gap-x-3">
            <span className="hidden sm:block" aria-hidden />
            <span className="hidden sm:block" aria-hidden />
            <button
              type="button"
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${CTA_GRADIENT} sm:col-start-3`}
            >
              View product
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CoupleVibeToggleIcon({ kind }: { kind: 'evening' | 'beach' | 'date' }) {
  const cls = 'h-4 w-4 shrink-0'
  if (kind === 'evening') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path
          d="M20 14.5a7 7 0 11-10.59-6.08A7 7 0 0120 14.5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (kind === 'beach') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 3v18M8 17c2-4 6-4 8 0M6 21h12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FeatureCoupleSection({ reduced }: { reduced: boolean }) {
  const [vibeIdx, setVibeIdx] = useState(0)
  const vibe = COUPLE_VIBES[vibeIdx % COUPLE_VIBES.length]

  return (
    <section
      id="feature-04"
      className="relative overflow-hidden border-y border-[rgba(188,225,208,0.28)] bg-transparent"
    >
      <SectionParallaxBg src={MOOD_IMAGES['04']} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_10%,rgba(175,203,165,0.14),transparent_58%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
            className="space-y-7"
          >
            <motion.h2
              variants={staggerItem}
              className="max-w-[18ch] pt-1 font-[family-name:var(--font-display)] text-[clamp(2rem,4.2vw,3.15rem)] font-semibold leading-[1.06] tracking-tight text-[var(--elmir-text-on-green)]"
            >
              Couple confusion{' '}
              <span className={ACCENT}>solved</span>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="max-w-xl text-[15px] leading-[1.65] text-[#dffbf5] md:text-[16px]"
            >
              <span className="font-medium text-white">We style both of you — together.</span>{' '}
              Not sure how to match for that party, vacation, or date? ELMIR coordinates outfits that
              just work — for both of you.
            </motion.p>
            <motion.ul variants={staggerItem} className="space-y-3 pt-1">
              {[
                {
                  t: 'Two uploads',
                  icon: (
                    <>
                      <path
                        d="M7.5 18.5h9a4 4 0 003.5-6 5.5 5.5 0 00-10.5-1A3.5 3.5 0 007.5 18.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M12 15v4M10 17h4" strokeLinecap="round" />
                    </>
                  ),
                },
                {
                  t: 'Coordinated looks',
                  icon: (
                    <path
                      d="M6 10l3-4h6l3 4v10a2 2 0 01-2 2H8a2 2 0 01-2-2V10zM9 6V4a3 3 0 016 0v2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  t: 'Try on + buy',
                  icon: (
                    <>
                      <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 6L5 3H2" strokeLinecap="round" />
                      <circle cx="9" cy="20" r="1" fill="currentColor" />
                      <circle cx="18" cy="20" r="1" fill="currentColor" />
                    </>
                  ),
                },
              ].map((row) => (
                <li
                  key={row.t}
                  className="flex items-center gap-4 rounded-2xl border border-[rgba(180,230,200,0.2)] bg-[rgba(6,10,8,0.75)] px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.38)] backdrop-blur-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(126,200,126,0.28)] bg-[rgba(126,200,126,0.1)] text-[var(--green-300)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      {row.icon}
                    </svg>
                  </span>
                  <span className="text-[13px] font-medium tracking-tight text-[#eafff3]">{row.t}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[520px] md:mx-0 md:max-w-none md:justify-self-end"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.72, ease: EASE, delay: 0.06 }}
          >
            <div className="relative">
              <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
                <div className="flex justify-end">
                  <div className="relative w-full max-w-[120px] sm:max-w-[124px]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[rgba(210,248,232,0.25)] bg-[rgba(8,18,12,0.8)] shadow-[0_18px_52px_rgba(0,0,0,0.48)]">
                      <PmAssetImg
                        src={vibe.you}
                        alt="You"
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/68 px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        You
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative z-20 flex flex-col items-center justify-end pb-2">
                  <span className="whitespace-nowrap rounded-full border border-[rgba(126,200,126,0.5)] bg-[rgba(4,8,6,0.94)] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#d9ffe9] shadow-[0_8px_28px_rgba(126,200,126,0.2)] sm:px-3.5 sm:text-[9px] sm:tracking-[0.22em]">
                    Synced look generated
                  </span>
                </div>
                <div className="flex justify-start">
                  <div className="relative w-full max-w-[120px] sm:max-w-[124px]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[rgba(210,248,232,0.25)] bg-[rgba(8,18,12,0.8)] shadow-[0_18px_52px_rgba(0,0,0,0.48)]">
                      <PmAssetImg
                        src={vibe.partner}
                        alt="Partner"
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/68 px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        Partner
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mt-1 flex justify-center px-4" aria-hidden>
                <svg
                  viewBox="0 0 320 44"
                  className="h-11 w-full max-w-[280px] text-[var(--green-300)]/65 sm:max-w-[320px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                >
                  <path d="M56 2 C 56 24, 120 38, 160 42" />
                  <path d="M264 2 C 264 24, 200 38, 160 42" />
                </svg>
              </div>

              <div className="relative mt-1 overflow-hidden rounded-[28px] border border-[rgba(230,255,244,0.18)] bg-[rgba(8,18,12,0.55)] shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vibe.id}
                    className="relative aspect-[8/5] w-full sm:aspect-[3/2]"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <img
                      src={vibe.hero}
                      alt={`${vibe.lookLabel} — coordinated look`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/68 via-black/10 to-black/28" />
                    <div className="absolute bottom-4 left-4 max-w-[min(100%,240px)] rounded-xl border border-[rgba(255,255,255,0.12)] bg-black/58 px-3 py-2 backdrop-blur-md">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[rgba(223,251,245,0.75)]">
                        Look vibe
                      </p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[var(--green-300)]">{vibe.lookLabel}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-between sm:gap-3">
                {COUPLE_VIBES.map((v, i) => {
                  const active = i === vibeIdx
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibeIdx(i)}
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-300)] sm:px-4 sm:text-[11px] sm:tracking-[0.16em] ${
                        active
                          ? 'border-2 border-[var(--green-300)] bg-[rgba(126,200,126,0.14)] text-[#eafff3] shadow-[0_0_24px_rgba(126,200,126,0.18)]'
                          : 'border border-[rgba(255,255,255,0.14)] bg-[rgba(0,0,0,0.35)] text-[rgba(243,252,247,0.58)] hover:border-[rgba(255,255,255,0.22)] hover:text-[rgba(243,252,247,0.85)]'
                      }`}
                    >
                      <CoupleVibeToggleIcon kind={v.toggle} />
                      {v.label}
                    </button>
                  )
                })}
              </div>

              <motion.button
                type="button"
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] ${CTA_GRADIENT}`}
                whileHover={reduced ? undefined : { scale: 1.01 }}
                whileTap={reduced ? undefined : { scale: 0.99 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                Try both looks
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 rounded-[22px] border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.45)] px-6 py-10 backdrop-blur-md sm:px-10 sm:py-11">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                title: 'AI matching',
                body: 'Perfect coordination, every time.',
                icon: (
                  <>
                    <circle cx="9" cy="8" r="2.75" fill="none" />
                    <circle cx="15" cy="16" r="2.75" fill="none" />
                    <path d="M11.2 10.2l3.6 5.6" strokeLinecap="round" />
                  </>
                ),
              },
              {
                title: 'Same vibe',
                body: 'Outfits that match your energy.',
                icon: (
                  <path
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: 'Shop together',
                body: 'Buy both looks in one go.',
                icon: (
                  <>
                    <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L5 3H2" strokeLinecap="round" />
                    <circle cx="9" cy="20" r="1" fill="currentColor" />
                    <circle cx="18" cy="20" r="1" fill="currentColor" />
                  </>
                ),
              },
            ].map((cell) => (
              <div key={cell.title} className="flex gap-4">
                <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(126,200,126,0.35)] bg-[rgba(126,200,126,0.1)] text-[var(--green-300)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    {cell.icon}
                  </svg>
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">{cell.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[rgba(223,251,245,0.68)]">{cell.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturePasteGarmentLink({ reduced }: { reduced: boolean }) {
  const [typed, setTyped] = useState(0)
  const [showTryOn, setShowTryOn] = useState(false)

  useEffect(() => {
    if (!reduced) return
    const id = requestAnimationFrame(() => {
      setTyped(PASTE_URL_DEMO.length)
      setShowTryOn(true)
    })
    return () => cancelAnimationFrame(id)
  }, [reduced])

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    let phase: 'typing' | 'pause' | 'tryon' = 'typing'
    let count = 0
    const timeouts: number[] = []

    const id = window.setInterval(() => {
      if (cancelled || phase !== 'typing') return
      count += 1
      const next = Math.min(count, PASTE_URL_DEMO.length)
      setTyped(next)
      if (next < PASTE_URL_DEMO.length) return
      phase = 'pause'
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return
          setShowTryOn(true)
          phase = 'tryon'
          timeouts.push(
            window.setTimeout(() => {
              if (cancelled) return
              setShowTryOn(false)
              count = 0
              setTyped(0)
              phase = 'typing'
            }, 2100),
          )
        }, 650),
      )
    }, 38)

    return () => {
      cancelled = true
      window.clearInterval(id)
      timeouts.forEach((t) => window.clearTimeout(t))
    }
  }, [reduced])

  return (
    <section
      id="feature-03"
      className="relative overflow-hidden border-y border-[rgba(188,225,208,0.28)] bg-transparent"
    >
      <SectionParallaxBg src={MOOD_IMAGES['03']} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_10%,rgba(175,203,165,0.14),transparent_58%)]" />
      <div className="relative isolate mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22, margin: '0px 0px -10% 0px' }}
          className="min-w-0 space-y-8"
        >
          <motion.div variants={staggerItem}>
            <span
              className={`inline-flex items-center gap-2 rounded-full border ${ACCENT_BORDER} bg-[rgba(12,18,14,0.85)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${ACCENT}`}
            >
              Paste link
            </span>
          </motion.div>
          <motion.div variants={staggerItem}>
            <h2 className="max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-white">
              Paste any{' '}
              <span className={ACCENT}>garment link</span>
            </h2>
          </motion.div>
          <motion.p
            variants={staggerItem}
            className="max-w-xl text-[14px] leading-relaxed text-[rgba(243,252,247,0.72)] md:text-[15px]"
          >
            Drop a link from any store. See yourself in that outfit instantly.
          </motion.p>
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(10,14,12,0.92)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cde9df]">
              Garment link
            </p>
            <div className="mt-4 flex min-h-[52px] items-center gap-3 rounded-xl border border-[rgba(210,248,232,0.2)] bg-[rgba(8,18,12,0.55)] px-4 py-3">
              <svg
                className="h-5 w-5 shrink-0 text-[var(--green-300)]/85"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden
              >
                <path
                  d="M10 13a5 5 0 007.54.54l2-2a5 5 0 00-7.07-7.07l-1.1 1.09M14 11a5 5 0 00-7.54-.54l-2 2a5 5 0 007.07 7.07l1.1-1.09"
                  strokeLinecap="round"
                />
              </svg>
              <p className="min-w-0 flex-1 break-all font-mono text-[11px] leading-snug text-[#eafff3] sm:text-[12px]">
                {PASTE_URL_DEMO.slice(0, typed)}
                <motion.span
                  className="inline-block h-4 w-[2px] translate-y-[2px] bg-[var(--green-300)]"
                  animate={reduced ? undefined : { opacity: [1, 0, 1] }}
                  transition={
                    reduced
                      ? undefined
                      : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                  }
                  aria-hidden
                />
              </p>
            </div>
            <motion.button
              type="button"
              className={`mt-5 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${CTA_GRADIENT}`}
              whileHover={reduced ? undefined : { scale: 1.01 }}
              whileTap={reduced ? undefined : { scale: 0.99 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              See it on me
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto w-full min-w-0 max-w-[440px] md:justify-self-end"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
        >
          <div
            className={`relative overflow-hidden rounded-[22px] bg-[rgba(8,18,12,0.65)] shadow-[0_24px_80px_rgba(5,15,8,0.45)] transition-[border-color,box-shadow] duration-500 ease-out ${
              !reduced && showTryOn
                ? 'border-2 border-[var(--green-300)] shadow-[0_0_36px_rgba(126,200,126,0.28),0_24px_80px_rgba(5,15,8,0.45)]'
                : 'border border-[rgba(230,255,244,0.18)]'
            }`}
          >
            <div className="overflow-hidden">
              <motion.img
                src={PASTE_GARMENT.hero}
                alt="Virtual try-on preview"
                className="aspect-[3/4] w-full object-cover object-top"
                loading="lazy"
                animate={reduced ? undefined : { scale: showTryOn ? 1.03 : 1 }}
                transition={{ duration: 0.55, ease: EASE }}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-t from-black/45 via-transparent to-black/20" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Features() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = prefersReducedMotion ?? false

  // Section 02 — model vs you + product card (cycles outfit only)
  const [dualOutfitIdx, setDualOutfitIdx] = useState(0)

  useEffect(() => {
    const ms = reduced ? 4500 : 3800
    const t = window.setInterval(() => {
      setDualOutfitIdx((i) => (i + 1) % sameOutfitTwoModels.length)
    }, ms)
    return () => window.clearInterval(t)
  }, [reduced])

  const dualOutfit = sameOutfitTwoModels[dualOutfitIdx % sameOutfitTwoModels.length]

  return (
    <div id="features">
      {/* 01 — Photo match workbench (local assets only; no Unsplash) */}
      <FeaturePhotoMatchWorkbench />

      {/* 02 — Model wears it (three-column showroom) */}
      <motion.section
        id="feature-02"
        className="relative overflow-hidden border-y border-[rgba(188,225,208,0.28)]"
        animate={{ background: dualOutfit.bg }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <SectionParallaxBg src={MOOD_IMAGES['02']} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(230,255,244,0.14),transparent_62%)]" />

        <div className={`${FEATURE_PHOTO_PAIR_EDGE} py-16 md:py-24`}>
          <ModelWearsItShowcase reduced={reduced} />
        </div>
      </motion.section>

      {/* 03 — Paste garment link */}
      <FeaturePasteGarmentLink reduced={reduced} />

      {/* 04 — Couple (screenshot layout; no star icons) */}
      <FeatureCoupleSection reduced={reduced} />

      {/* 05 */}
      <SectionShell
        id="feature-05"
        index="05"
        title={
          <>
            Temperature‑smart{' '}
            <span className={ACCENT}>edits</span>
          </>
        }
        hint="A small weather read sets the tone. The temperature eases between forecasts while outfit picks update underneath — so suggestions feel tied to the day."
        right={<WeatherStage reduced={reduced} />}
      >
        <div className="flex flex-wrap gap-3 pt-1">
          {['Weather context', 'Live temperature', 'Outfit suggestions'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[rgba(218,245,232,0.32)] bg-[rgba(20,40,28,0.28)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#eafff3]"
            >
              {t}
            </span>
          ))}
        </div>
      </SectionShell>
    </div>
  )
}

const WEATHER_GLYPH_TILE =
  'pointer-events-none absolute right-2 top-2 z-[35] flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(220,248,236,0.4)] bg-[rgba(5,15,5,0.82)] text-[#f3fcf7] shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md'

function WeatherGlyph({
  label,
  reduced,
  className,
}: {
  label: string
  reduced: boolean
  /** Omit for absolute tile badge on forecast photos */
  className?: string
}) {
  const frame = className ?? WEATHER_GLYPH_TILE
  if (label === 'Sunny')
    return (
      <motion.div
        className={frame}
        aria-hidden
        animate={reduced ? undefined : { rotate: [0, 360] }}
        transition={
          reduced ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }
        }
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="4.25" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="3.2"
              x2="12"
              y2="5.8"
              strokeLinecap="round"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </svg>
      </motion.div>
    )
  if (label === 'Cloudy')
    return (
      <motion.div
        className={frame}
        aria-hidden
        animate={reduced ? undefined : { x: [0, 3, 0] }}
        transition={
          reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M6.5 15.2a4.2 4.2 0 117.2-3.7 3.5 3.5 0 116.9.8 2.6 2.6 0 01-.4 5.2H6.9a3.3 3.3 0 01-.4-6.3z" />
        </svg>
      </motion.div>
    )
  return (
    <div className={frame} aria-hidden>
      <motion.svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {[5, 12, 19].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1="8"
            x2={x}
            y2="17"
            animate={reduced ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={
              reduced
                ? undefined
                : {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.12,
                  }
            }
          />
        ))}
      </motion.svg>
    </div>
  )
}

function WeatherStage({ reduced }: { reduced: boolean }) {
  const forecasts = useMemo(
    () =>
      [
        {
          label: 'Sunny',
          temp: 29,
          tint: '#bff0d4',
          card: 'Linen midi',
          image:
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=480&q=80',
        },
        {
          label: 'Cloudy',
          temp: 23,
          tint: '#d9ffe9',
          card: 'Knit set',
          image:
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=480&q=80',
        },
        {
          label: 'Rain',
          temp: 19,
          tint: '#c7f6e2',
          card: 'Trench dress',
          image:
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=480&q=80',
        },
      ] satisfies {
        label: string
        temp: number
        tint: string
        card: string
        image: string
      }[],
    [],
  )

  const [idx, setIdx] = useState(0)
  const [temp, setTemp] = useState(reduced ? forecasts[0].temp : 0)
  const tempRef = useRef(reduced ? forecasts[0].temp : 0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -12% 0px',
  })
  const live = reduced || inView

  useEffect(() => {
    tempRef.current = temp
  }, [temp])

  useEffect(() => {
    if (!live || reduced) return
    const t = window.setInterval(() => {
      setIdx((p) => (p + 1) % forecasts.length)
    }, 2600)
    return () => window.clearInterval(t)
  }, [forecasts.length, live, reduced])

  useEffect(() => {
    if (!live || reduced) return
    const target = forecasts[idx].temp
    let raf = 0
    const start = performance.now()
    const from = tempRef.current
    const duration = idx === 0 && from === 0 ? 1100 : 520

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setTemp(Math.round(from + (target - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [idx, live, reduced, forecasts])

  const f = forecasts[idx]
  const displayTemp = reduced ? f.temp : live ? temp : 0

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[520px]">
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-[color:var(--elmir-glass-border)] bg-[rgba(22,40,28,0.38)] shadow-[0_30px_120px_rgba(10,26,18,0.55)]"
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between gap-4 p-7">
          <div className="flex items-start gap-4">
            <WeatherGlyph
              label={f.label}
              reduced={reduced}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(220,248,236,0.4)] bg-[rgba(5,15,5,0.78)] text-[#f3fcf7] shadow-[0_10px_28px_rgba(0,0,0,0.4)] backdrop-blur-md"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#cde9df]">
                Weather
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--elmir-text-on-green)]">
                {f.label}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#cde9df]">
              Temp
            </p>
            <p className="mt-2 text-[6rem] font-semibold leading-[0.95] tabular-nums tracking-tight text-[var(--elmir-text-on-green)] md:text-3xl md:leading-normal md:tracking-normal">
              {displayTemp}°C
            </p>
          </div>
        </div>

        <div className="relative border-t border-[rgba(210,248,232,0.22)] p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#dffbf5]">
              Suggested look: <span className="font-semibold">{f.card}</span>
            </p>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: f.tint }}
              aria-hidden
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {forecasts.map((x, i) => {
              const active = i === idx
              return (
                <motion.button
                  key={x.label}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`group relative overflow-hidden rounded-[22px] border bg-[rgba(12,22,16,0.65)] text-left shadow-[inset_0_1px_0_rgba(220,248,236,0.06)] outline-none transition-[border-color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-[var(--green-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,18,12,0.9)] ${
                    active
                      ? 'border-[var(--green-400)] shadow-[0_0_0_1px_rgba(126,200,126,0.35)]'
                      : 'border-[rgba(210,248,232,0.22)] hover:border-[rgba(220,248,236,0.38)]'
                  }`}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  animate={active ? { scale: 1.03 } : { scale: 1 }}
                  whileHover={{ scale: active ? 1.04 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  aria-pressed={active}
                  aria-label={`${x.label}: ${x.card}. ${active ? 'Selected forecast' : 'Show this forecast'}`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={x.image}
                      alt=""
                      width={480}
                      height={640}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#050f05]/95 via-[#071812]/25 to-transparent" />
                    <WeatherGlyph label={x.label} reduced={reduced} />
                    <div className="pointer-events-none absolute left-2 top-2 z-[25] rounded-full bg-[rgba(5,15,5,0.55)] px-2 py-0.5 backdrop-blur-sm">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full align-middle"
                        style={{ backgroundColor: x.tint }}
                        aria-hidden
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-[20] p-3 pt-8">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#eafff3]">
                        {x.label}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold leading-tight text-[#f3fcf7]">
                        {x.card}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
