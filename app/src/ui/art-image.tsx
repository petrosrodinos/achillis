import type { CSSProperties, ReactNode } from 'react';
import { cn } from './cn';
import { useImageStatus } from './hooks';

/** Painterly CSS fallbacks used while art loads or when it is missing. */
export const ART_FALLBACKS = {
  dusk: 'radial-gradient(120% 80% at 70% 15%, #6e4a22 0%, transparent 55%), radial-gradient(90% 60% at 20% 90%, #20301c 0%, transparent 60%), linear-gradient(180deg, #33291f 0%, #1c1712 55%, #0b0908 100%)',
  night: 'radial-gradient(80% 60% at 30% 20%, #34373b 0%, transparent 60%), linear-gradient(180deg, #1c1712 0%, #0b0908 100%)',
  forest: 'radial-gradient(100% 70% at 50% 10%, #4b6b3a 0%, transparent 60%), linear-gradient(180deg, #2c4026 0%, #172214 70%, #0b0908 100%)',
  ember: 'radial-gradient(90% 70% at 60% 30%, #9b2f29 0%, transparent 60%), linear-gradient(180deg, #4a1513 0%, #13100d 100%)',
  portrait: 'radial-gradient(70% 70% at 50% 35%, #4a4e54 0%, #26282b 55%, #13100d 100%)',
} as const;

export type ArtFallback = keyof typeof ART_FALLBACKS;

export interface ArtImageProps {
  src?: string | null;
  alt: string;
  fallback?: ArtFallback;
  /** Rendered centred over the fallback when the image is missing (e.g. an icon or initials). */
  placeholder?: ReactNode;
  className?: string;
  imgClassName?: string;
  /** object-position for the image. */
  position?: string;
  style?: CSSProperties;
  /** Greyscale + darken (e.g. locked content). */
  dimmed?: boolean;
}

/**
 * Image that never shows a broken-image icon: paints a gradient fallback, preloads the art,
 * and fades the image in only once it has decoded.
 */
export function ArtImage({ src, alt, fallback = 'dusk', placeholder, className, imgClassName, position = 'center', style, dimmed }: ArtImageProps) {
  const ok = useImageStatus(src);
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: ART_FALLBACKS[fallback], ...style }}
      role={ok ? undefined : 'img'}
      aria-label={ok ? undefined : alt || undefined}
    >
      {ok && src ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={cn('absolute inset-0 size-full animate-fade-in object-cover', dimmed && 'brightness-[0.45] grayscale', imgClassName)}
          style={{ objectPosition: position }}
        />
      ) : (
        placeholder && <div className={cn('absolute inset-0 flex items-center justify-center', dimmed && 'opacity-50')}>{placeholder}</div>
      )}
    </div>
  );
}

export interface BackdropProps {
  src: string;
  fallback?: ArtFallback;
  /** Extra darkening for text legibility, 0..1. */
  dim?: number;
  className?: string;
  children?: ReactNode;
}

/** Full-bleed screen backdrop (title/menu art) with vignette; degrades to a painted gradient. */
export function Backdrop({ src, fallback = 'dusk', dim = 0.35, className, children }: BackdropProps) {
  return (
    <div className={cn('relative min-h-dvh w-full overflow-hidden', className)}>
      <ArtImage src={src} alt="" fallback={fallback} className="!absolute inset-0" />
      <div aria-hidden="true" className="wk-backdrop-vignette absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: `rgb(5 4 3 / ${dim})` }} />
      <div className="relative z-[1] min-h-dvh">{children}</div>
    </div>
  );
}
