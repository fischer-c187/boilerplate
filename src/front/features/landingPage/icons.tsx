import type { ReactNode, SVGProps } from 'react'

export type LandingIconName =
  | 'bar-chart-2'
  | 'box'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'credit-card'
  | 'database'
  | 'globe'
  | 'layout-dashboard'
  | 'lock'
  | 'mail'
  | 'play-circle'
  | 'shield'
  | 'user-plus'
  | 'wind'
  | 'zap'

type LandingIconProps = SVGProps<SVGSVGElement> & {
  name: LandingIconName
}

const paths: Record<LandingIconName, ReactNode> = {
  zap: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  'play-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8Z" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2.5 2.5L16 9" />
    </>
  ),
  'user-plus': (
    <>
      <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M17 11h6" />
    </>
  ),
  box: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.3 7.4 12 12l8.7-4.6" />
      <path d="M12 22V12" />
    </>
  ),
  wind: (
    <>
      <path d="M3 8h10a3 3 0 1 0-3-3" />
      <path d="M4 16h14a3 3 0 1 1-3 3" />
      <path d="M2 12h15a3 3 0 1 1-3 3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h6" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" />
      <path d="M12 7v10" />
    </>
  ),
  'bar-chart-2': (
    <>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2c3 3 3 17 0 20" />
      <path d="M12 2c-3 3-3 17 0 20" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'layout-dashboard': (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="10" width="7" height="11" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
}

export function LandingIcon({ name, ...props }: LandingIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
