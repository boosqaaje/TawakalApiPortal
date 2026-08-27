export default function SoftwayLogo({ wordmark = true, light = false, className = '' }) {
  return (
    <span className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <path d="M5 7.5 15.5 16 5 24.5 8.5 16 5 7.5Z" fill="#2E82E4" />
        <path d="M27 7.5 16.5 16 27 24.5 23.5 16 27 7.5Z" fill="#2AA467" />
      </svg>
      {wordmark ? (
        <span className={['text-lg font-semibold tracking-tight', light ? 'text-white' : 'text-slate-900'].join(' ')}>
          Softway
        </span>
      ) : null}
    </span>
  )
}
