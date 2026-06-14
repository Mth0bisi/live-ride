/**
 * AdSpace — Western Shoppe sponsor advertisement component.
 *
 * Placements:
 *   'banner' → full-width horizontal strip (top + bottom of pages)
 *              Image: /sponsors/western-shoppe-banner.png
 *              Sizing: full width, height auto (image fills naturally), max-height 120px
 *
 *   'square' → compact sidebar slot (right column)
 *              Image: /sponsors/western-shoppe-square.png
 *              Sizing: fixed square, 200×200px max
 *
 * Backwards-compat: legacy `size` prop ('leaderboard' → 'banner', 'sidebar' → 'square')
 */

type AdPlacement = 'banner' | 'square' | 'legacy';

interface AdSpaceProps {
  placement?: AdPlacement;
  href?: string;
  className?: string;
  /** @deprecated Use placement instead */
  size?: 'leaderboard' | 'sidebar' | 'banner';
  /** @deprecated Single sponsor — prop ignored, kept for compat */
  sponsor?: string;
}

const WS_HREF = 'https://www.westernshoppe.co.za';
const WS_ALT  = 'Western Shoppe – Traders in Fine Saddlery and Equestrian Supplies';

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
  const resolved  = resolvePlacement(placement, size);
  const finalHref = href ?? WS_HREF;

  if (resolved === 'square') {
    // ── Square sidebar slot ───────────────────────────────────────────────
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-200/60 shadow-md bg-white ${className}`}
        style={{ width: '100%', maxWidth: '260px' }}
        role="complementary"
        aria-label="Sponsored by Western Shoppe"
      >
        <SponsoredLabel />
        <a
          href={finalHref}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block hover:opacity-90 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-label={`Advertisement: ${WS_ALT}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="ad-western-shoppe-square"
            src="/sponsors/western-shoppe-square.png"
            alt={WS_ALT}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            loading="lazy"
          />
        </a>
      </div>
    );
  }

  // ── Banner / leaderboard slot ─────────────────────────────────────────────
  // Use full-width natural image sizing so the logo always fills the container
  // width regardless of image intrinsic dimensions.
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white ${className}`}
      style={{ width: '100%' }}
      role="complementary"
      aria-label="Sponsored by Western Shoppe"
    >
      <SponsoredLabel />
      <a
        href={finalHref}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center justify-center w-full hover:opacity-90 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 py-3 px-6"
        aria-label={`Advertisement: ${WS_ALT}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="ad-western-shoppe-banner"
          src="/sponsors/western-shoppe-banner.png"
          alt={WS_ALT}
          style={{
            width:     '100%',
            maxWidth:  '800px',
            height:    'auto',
            maxHeight: '100px',
            objectFit: 'contain',
            display:   'block',
          }}
          loading="lazy"
        />
      </a>
    </div>
  );
}

function SponsoredLabel() {
  return (
    <div className="absolute top-1 left-2 z-10 pointer-events-none">
      <span
        style={{
          fontSize:        '9px',
          fontWeight:      700,
          textTransform:   'uppercase',
          letterSpacing:   '0.08em',
          background:      'rgba(0,0,0,0.25)',
          color:           'rgba(255,255,255,0.85)',
          padding:         '1px 5px',
          borderRadius:    '3px',
          backdropFilter:  'blur(4px)',
        }}
      >
        Sponsored
      </span>
    </div>
  );
}
