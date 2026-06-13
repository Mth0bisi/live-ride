import Image from 'next/image';

type Sponsor = 'toyota' | 'western-shoppe';
type AdSize = 'leaderboard' | 'sidebar' | 'banner';

interface AdSpaceProps {
  sponsor: Sponsor;
  size: AdSize;
  href?: string;
  className?: string;
}

const AD_CONFIG: Record<
  Sponsor,
  { href: string; alt: string; label: string }
> = {
  toyota: {
    href: 'https://www.toyota.co.za',
    alt: "Toyota – Official Vehicle Partner – Let's Go Places",
    label: 'Toyota',
  },
  'western-shoppe': {
    href: 'https://www.westernshoppe.co.za',
    alt: 'Western Shoppe – Gear Up. Ride On. Premium Equestrian Clothing & Gear',
    label: 'Western Shoppe',
  },
};

/** Pixel height for each ad slot — constrains the container so the image crops to fit */
const SIZE_HEIGHT: Record<AdSize, number> = {
  leaderboard: 350,
  sidebar:     260,
  banner:       80,
};

const SIZE_CONFIG: Record<
  AdSize,
  { containerClass: string; imgSrc: Record<Sponsor, string> }
> = {
  leaderboard: {
    containerClass: 'w-full overflow-hidden rounded-xl border border-slate-200/60 shadow-sm',
    imgSrc: {
      toyota: '/ad-toyota-leaderboard.png',
      'western-shoppe': '/ad-western-shoppe-sidebar.png',
    },
  },
  sidebar: {
    containerClass: 'w-full max-w-[300px] overflow-hidden rounded-xl border border-slate-200/60 shadow-md',
    imgSrc: {
      toyota: '/ad-toyota-leaderboard.png',
      'western-shoppe': '/ad-western-shoppe-sidebar.png',
    },
  },
  banner: {
    containerClass: 'w-full overflow-hidden rounded-lg border border-slate-200/60 shadow-sm',
    imgSrc: {
      toyota: '/ad-toyota-leaderboard.png',
      'western-shoppe': '/ad-western-shoppe-sidebar.png',
    },
  },
};

export default function AdSpace({
  sponsor,
  size,
  href,
  className = '',
}: AdSpaceProps) {
  const ad       = AD_CONFIG[sponsor];
  const sizeConf = SIZE_CONFIG[size];
  const height   = SIZE_HEIGHT[size];
  const finalHref = href ?? ad.href;
  const imgSrc   = sizeConf.imgSrc[sponsor];

  return (
    <div
      className={`ad-space-wrapper group relative ${sizeConf.containerClass} ${className}`}
      style={{ height: `${height}px` }}
      role="complementary"
      aria-label={`Sponsored by ${ad.label}`}
    >
      {/* Sponsored label */}
      <div className="absolute top-1.5 left-2 z-10 pointer-events-none">
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(0,0,0,0.45)',
            color: 'rgba(255,255,255,0.75)',
            padding: '2px 6px',
            borderRadius: '4px',
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
        className="relative block w-full h-full transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        aria-label={`Advertisement: ${ad.alt}`}
        id={`ad-${sponsor}-${size}`}
      >
        <Image
          src={imgSrc}
          alt={ad.alt}
          fill
          className="object-cover object-center"
          loading="lazy"
          unoptimized
        />
      </a>
    </div>
  );
}
