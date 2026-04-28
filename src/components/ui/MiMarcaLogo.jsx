/**
 * MI MARCA LOGO COMPONENT
 * -----------------------
 * SVG-based wordmark + icon. Three variants:
 *   - Full logo (default)
 *   - Small (size="sm")
 *   - Icon only (iconOnly)
 */

import clsx from 'clsx'

export default function MiMarcaLogo({ size = 'default', iconOnly = false }) {
  const iconSizes = {
    default: 'w-8 h-8',
    sm:      'w-7 h-7',
    lg:      'w-12 h-12',
  }
  const textSizes = {
    default: 'text-lg',
    sm:      'text-base',
    lg:      'text-2xl',
  }

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon mark */}
      <div className={clsx(
        'rounded-lg bg-brand-800 flex items-center justify-center shrink-0',
        'glow-brand-sm border border-brand-700',
        iconSizes[size] ?? iconSizes.default
      )}>
        <svg viewBox="0 0 24 24" fill="none" className="w-[55%] h-[55%]" aria-hidden="true">
          <path
            d="M3 20L8 4L12 14L16 4L21 20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="leading-none">
          <span className={clsx(
            'font-bold tracking-tight text-white',
            textSizes[size] ?? textSizes.default
          )}>
            Mi{' '}
            <span className="text-gradient-brand">Marca</span>
          </span>
          <p className="text-[9px] uppercase tracking-[0.18em] text-surface-500 mt-0.5 font-medium">
            Staff Portal
          </p>
        </div>
      )}
    </div>
  )
}
