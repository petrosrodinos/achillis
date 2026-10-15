import type { SVGProps } from 'react';

/** Inline line-art icons drawn for the medieval UI. All inherit `currentColor` and are aria-hidden by default. */
export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
    ...rest,
  };
}

export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" fill="currentColor" fillOpacity="0.15" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.2" r="1.3" fill="currentColor" />
    <path d="M12 16.4v2" />
  </svg>
);

export const IconSword = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19.5 3.5 10 13l1 1 9.5-9.5V3.5z" fill="currentColor" fillOpacity="0.18" />
    <path d="M6.5 13.5l4 4M8 16l-3.5 3.5M5 18l1 1" />
    <path d="M19.5 3.5h-1L9 13l2 2 8.5-9.5z" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 4.5 5.5v6c0 4.5 3.2 7.7 7.5 9.5 4.3-1.8 7.5-5 7.5-9.5v-6z" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 6v12M7.5 11h9" />
  </svg>
);

export const IconCrown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 17.5 3 7.5l5 4 4-6.5 4 6.5 5-4-1 10z" fill="currentColor" fillOpacity="0.18" />
    <path d="M4.5 20.5h15" />
  </svg>
);

export const IconSkull = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.5 1.2 4 2.5 5v3h10v-3c1.3-1 2.5-2.5 2.5-5A7.5 7.5 0 0 0 12 3z" fill="currentColor" fillOpacity="0.15" />
    <circle cx="9" cy="11" r="1.6" fill="currentColor" />
    <circle cx="15" cy="11" r="1.6" fill="currentColor" />
    <path d="M10 18.5V21M14 18.5V21M12 14l-.8 1.6h1.6z" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity="0.12" />
    <path d="M12 7v5.2l3.2 2" />
  </svg>
);

export const IconTrophy = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="currentColor" fillOpacity="0.15" />
    <path d="M7 6H4.5v1.5A3 3 0 0 0 7.5 10.5M17 6h2.5v1.5a3 3 0 0 1-3 3M12 14v3.5M8.5 20.5h7M9.5 17.5h5" />
  </svg>
);

export const IconScroll = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4h11a2 2 0 0 1 0 4h-1v10a2 2 0 0 1-2 2H6a2 2 0 0 1 0-4h1z" fill="currentColor" fillOpacity="0.12" />
    <path d="M7 16V4M10 9h4M10 12.5h4" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth={2.4} />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" strokeWidth={2.2} />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" strokeWidth={2.2} />
  </svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" strokeWidth={2.2} />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" strokeWidth={2.2} />
  </svg>
);

export const IconEye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 3l18 18M10.6 5.6A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const IconGear = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.15" />
    <path d="M4 20.5c1.2-4 4.3-6 8-6s6.8 2 8 6" />
  </svg>
);

export const IconDoor = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 4H6.5v16H14" />
    <path d="M10.5 12H21M17.5 8.5 21 12l-3.5 3.5" />
  </svg>
);

export const IconFlag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 21V4" />
    <path d="M5 4.5h11l-2.5 4 2.5 4H5" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const IconInfo = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5v.5" strokeWidth={2.4} />
  </svg>
);

export const IconWarning = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 2.5 20h19z" fill="currentColor" fillOpacity="0.12" />
    <path d="M12 10v4.5M12 17v.5" strokeWidth={2.4} />
  </svg>
);

export const IconHorse = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 20v-5.5c0-3 1.5-5.5 4-7l-.5-3 2.5 2c3.5 0 6.5 2.5 7.5 6l-2.5 1.5-2-1.5-1.5 2.5V20" fill="currentColor" fillOpacity="0.12" />
    <circle cx="14.5" cy="9.5" r=".6" fill="currentColor" />
  </svg>
);

export const IconBoot = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 3.5h5v9l6 3v4.5H6.5V17L8 12z" fill="currentColor" fillOpacity="0.12" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 5v14l11-7z" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);
