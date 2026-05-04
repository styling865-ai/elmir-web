import { useId } from 'react'

type LogoProps = {
  className?: string
  /** Use on #595F52 backgrounds — white wordmark + warm mint gradient mark */
  inverted?: boolean
  /** Hide the “ELMIR” wordmark (mark only — e.g. intro beside typing) */
  showWordmark?: boolean
  /** Extra classes on the mark SVG (e.g. `h-12 w12`) */
  iconClassName?: string
  /** Larger mark + wordmark sized to match footer nav caps */
  variant?: 'default' | 'footer'
}

export function Logo({
  className = '',
  inverted = false,
  showWordmark = true,
  iconClassName = '',
  variant = 'default',
}: LogoProps) {
  const rid = useId().replace(/:/g, '')
  const gradId = inverted ? `elmirGradInv-${rid}` : `elmirGrad-${rid}`

  const iconBase =
    variant === 'footer' ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-10 w-10'
  const gap = variant === 'footer' ? 'gap-3' : 'gap-2.5'
  const wordClass =
    variant === 'footer'
      ? 'text-[11px] font-semibold uppercase tracking-[0.22em]'
      : 'text-sm font-semibold tracking-[0.35em]'

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <svg
        className={`shrink-0 ${iconBase} ${iconClassName}`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="8" x2="40" y2="40">
            {inverted ? (
              <>
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#d7ebe4" />
              </>
            ) : (
              <>
                <stop stopColor="#c8dcc4" />
                <stop offset="1" stopColor="#595F52" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M14 12h22v22H14"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 34h10"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path fill={`url(#${gradId})`} d="M22 18h10v12H22z" opacity="0.9" />
      </svg>
      {showWordmark ? (
        <span
          className={`${wordClass} ${inverted ? 'text-[#fffef9]' : 'text-[#595F52]'}`}
        >
          ELMIR
        </span>
      ) : null}
    </div>
  )
}
