/**
 * AdSpace — sponsor advertisement banner component.
 *
 * Sponsor: Western Shoppe (Traders in Fine Saddlery and Equestrian Supplies)
 *
 * Placement types:
 *   'banner'  → top & bottom leaderboard areas — uses western-shoppe-banner.png
 *   'square'  → right sidebar compact slot    — uses western-shoppe-square.png
 *   'legacy'  → legacy leaderboard slot       — falls back to banner image
 */

type AdPlacement = 'banner' | 'square' | 'legacy';

interface AdSpaceProps {
  /** Which slot this ad fills. Defaults to 'banner'. */
  placement?: AdPlacement;
  /** Override the destination URL */
  href?: string;
  className?: string;
  /**
   * @deprecated Use placement instead.
   * Legacy prop kept for backwards-compat — 'leaderboard'/'sidebar'/'banner'
   * are mapped to the new placement values automatically.
   */
  size?: 'leaderboard' | 'sidebar' | 'banner';
  /** @deprecated Single sponsor — this prop is ignored but kept for compat. */
  sponsor?: string;
}

const WS_HREF = 'https://www.westernshoppe.co.za';
const WS_ALT  = 'Western Shoppe – Traders in Fine Saddlery and Equestrian Supplies';

/** Resolve the correct image path and dimensions for each placement. */
function getConfig(placement: AdPlacement) {
  switch (placement) {
    case 'square':
      return {
        src:             '/sponsors/western-shoppe-square.png',
        containerStyle:  { width: '100%', maxWidth: '300px', aspectRatio: '1 / 1' },
        imgStyle:        { width: '100%', height: '100%', objectFit: 'contain' as const },
        containerClass:  'overflow-hidden rounded-xl border border-slate-200/60 shadow-md',
      };
    case 'banner':
    case 'legacy':
    default:
      return {
        src:            '/sponsors/western-shoppe-banner.png',
        containerStyle: { width: '100%', maxHeight: '90px' },
        imgStyle:       { width: '100%', height: '90px', objectFit: 'contain' as const },
        containerClass: 'w-full overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white',
      };
  }
}

/** Map the legacy `size` prop to the new placement system. */
function resolvePlacement(
  placement: AdPlacement | undefined,
  size: AdSpaceProps['size'] | undefined,
): AdPlacement {
  if (placement) return placement;
  if (size === 'sidebar') return 'square';
  return 'banner';
}

export default function AdSpace({
  placement,
  size,
  href,
  className = '',
}: AdSpaceProps) {
  const resolved = resolvePlacement(placement, size);
  const cfg      = getConfig(resolved);
  const finalHref = href ?? WS_HREF;

  return (
    <div
      className={`ad-space-wrapper group relative ${cfg.containerClass} ${className}`}
      style={cfg.containerStyle}
      role="complementary"
      aria-label="Sponsored by Western Shoppe"
    >
      {/* Sponsored micro-label */}
      <div className="absolute top-1 left-2 z-10 pointer-events-none">
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(0,0,0,0.35)',
            color: 'rgba(255,255,255,0.80)',
            padding: '1px 5px',
            borderRadius: '3px',
            backdropFilter: 'blur(4px)',
          }}
        >
          Sponsored
        </span>
      </div>

      <a
        href={finalHref}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full h-full transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        aria-label={`Advertisement: ${WS_ALT}`}
        id={`ad-western-shoppe-${resolved}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cfg.src}
          alt={WS_ALT}
          style={cfg.imgStyle}
          loading="lazy"
        />
      </a>
    </div>
  );
}
