type P = { className?: string }

export const HomeOutline = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
)

export const HomeFill = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4"
    strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3.2 11.2l8.8-6.8 8.8 6.8V20a1 1 0 0 1-1 1h-4.6v-6h-6.4v6H4.2a1 1 0 0 1-1-1z" />
  </svg>
)

export const StoreOutline = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 9l2-5h14l2 5" />
    <path d="M3 9v11h18V9" />
    <path d="M9 14h6" />
  </svg>
)

export const StoreFill = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2"
    strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 4.5h18L22.5 9a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 13.5 9a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 4.5 9 2.5 2.5 0 0 1 1.5 9L3 4.5z" />
    <path d="M4 11.5V20h6v-5h4v5h6v-8.5" />
  </svg>
)

export const CubeOutline = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M4 7.5l8 4.5 8-4.5" />
    <path d="M12 12v9" />
  </svg>
)

export const CubeFill = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2"
    strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 2.6L3.4 7.4v9.2L12 21.4l8.6-4.8V7.4L12 2.6zm0 2.2 6.6 3.7L12 12.2 5.4 8.5 12 4.8z" opacity="0.55" />
    <path d="M12 12.2L5.4 8.5v8l6.6 3.7v-8zm0 0 6.6-3.7v8L12 20.2v-8z" />
  </svg>
)

export const BagOutline = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7V4a3 3 0 016 0v3" />
  </svg>
)

export const BagFill = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2"
    strokeLinejoin="round" className={className} aria-hidden>
    <path d="M6.2 7.5h11.6l-1.05 12.6a1 1 0 0 1-1 .9H8.25a1 1 0 0 1-1-.9L6.2 7.5z" />
    <path d="M8.5 9V5.5a3.5 3.5 0 0 1 7 0V9" fill="none" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
