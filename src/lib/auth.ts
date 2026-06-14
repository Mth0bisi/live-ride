/**
 * Auth types, roles, and viewer package definitions for the LiveRide platform.
 * No real auth implementation yet — these are frontend-first constants.
 * TODO: Wire up to a real auth provider (NextAuth / Supabase / Clerk) when ready.
 */

// ─── Role ────────────────────────────────────────────────────────────────────

export type Role = 'VIEWER' | 'GATE_MARSHAL' | 'JUDGE' | 'ORGANISER';

export const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: 'VIEWER',
    label: 'Viewer / Spectator',
    description: 'Watch live results, arena feeds, and running orders.',
  },
  {
    value: 'GATE_MARSHAL',
    label: 'Gate Marshal',
    description: 'Manage rider check-ins, gate queue, and warmup flow.',
  },
  {
    value: 'JUDGE',
    label: 'Judge / Timer',
    description: 'Capture scores, faults, penalties, and timing data.',
  },
  {
    value: 'ORGANISER',
    label: 'Organiser / Admin',
    description: 'Full event, arena, class, and result management.',
  },
];

// ─── Viewer Package ───────────────────────────────────────────────────────────

export type PackageType = 'ONE_DAY' | 'STANDARD' | 'PREMIUM' | 'FAMILY';
export type BillingPeriod = 'ONE_DAY' | 'SIX_MONTHS' | 'TWELVE_MONTHS';

export interface ViewerPackage {
  id: PackageType;
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  deviceLimit: number;
  billingPeriods: BillingPeriod[];
  features: string[];
  recommended?: boolean;
}

export const VIEWER_PACKAGES: ViewerPackage[] = [
  {
    id: 'ONE_DAY',
    name: 'One Day View',
    tagline: 'Single-day access, one device',
    price: 89,
    priceLabel: 'R89',
    deviceLimit: 1,
    billingPeriods: ['ONE_DAY'],
    features: [
      'Full live feed for one day',
      'Running orders & results',
      '1 active device',
      'Valid for 24 hours only',
    ],
  },
  {
    id: 'STANDARD',
    name: 'Standard Monthly',
    tagline: 'Perfect for the solo enthusiast',
    price: 125,
    priceLabel: 'R125/month',
    deviceLimit: 1,
    billingPeriods: ['SIX_MONTHS', 'TWELVE_MONTHS'],
    features: [
      'Unlimited live event access',
      'Full running orders & results',
      '1 logged-in device at a time',
      '6 or 12-month subscription',
    ],
    recommended: false,
  },
  {
    id: 'PREMIUM',
    name: 'Premium Monthly',
    tagline: 'Watch from two screens simultaneously',
    price: 149,
    priceLabel: 'R149/month',
    deviceLimit: 2,
    billingPeriods: ['SIX_MONTHS', 'TWELVE_MONTHS'],
    features: [
      'Unlimited live event access',
      'Full running orders & results',
      '2 logged-in devices at once',
      '6 or 12-month subscription',
    ],
    recommended: true,
  },
  {
    id: 'FAMILY',
    name: 'Family Monthly',
    tagline: 'The whole yard on one plan',
    price: 199,
    priceLabel: 'R199/month',
    deviceLimit: 4,
    billingPeriods: ['SIX_MONTHS', 'TWELVE_MONTHS'],
    features: [
      'Unlimited live event access',
      'Full running orders & results',
      '4 logged-in devices at once',
      '6 or 12-month subscription',
    ],
    recommended: false,
  },
];

export const BILLING_PERIOD_LABELS: Record<BillingPeriod, string> = {
  ONE_DAY: 'One Day',
  SIX_MONTHS: '6 Months',
  TWELVE_MONTHS: '12 Months',
};

// ─── Route Access Map ─────────────────────────────────────────────────────────

export const ROLE_ROUTES: Record<Role, string[]> = {
  VIEWER: ['/live', '/events', '/results', '/event'],
  GATE_MARSHAL: ['/gate', '/marshal', '/check-in'],
  JUDGE: ['/judge', '/scoring', '/timer'],
  ORGANISER: ['/admin', '/dashboard', '/events/manage', '/gate', '/timer'],
};

/**
 * Very basic placeholder role check.
 * TODO: Replace with real session-based auth guard when auth provider is integrated.
 */
export function hasRouteAccess(role: Role, pathname: string): boolean {
  const allowed = ROLE_ROUTES[role] ?? [];
  return allowed.some(r => pathname.startsWith(r));
}
