import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: Variant
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading,
  className,
  disabled,
  children,
  ...rest
}: Props) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      className={cn(
        'relative inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-full px-8 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green-400)]',
        variant === 'primary' &&
          'border border-[var(--green-400)] bg-transparent text-[var(--white)]',
        variant === 'secondary' &&
          'border border-[rgba(220,248,236,0.35)] bg-[var(--white-08)] text-[var(--elmir-text-on-green)]',
        variant === 'ghost' && 'border-0 bg-transparent text-[var(--white-60)]',
        variant === 'danger' &&
          'border border-[var(--error)] bg-transparent text-[var(--error)]',
        isDisabled && 'cursor-not-allowed opacity-30',
        className,
      )}
      whileHover={
        isDisabled ? undefined : { scale: variant === 'ghost' ? 1 : 1.02 }
      }
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      {...rest}
    >
      <span
        className={cn(
          'transition-opacity duration-200',
          loading ? 'opacity-0' : 'opacity-100',
        )}
      >
        {children}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--green-300)] border-t-transparent"
            aria-hidden
          />
        </span>
      ) : null}
    </motion.button>
  )
}
