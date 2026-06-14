'use client';

import type { PackageType, BillingPeriod, ViewerPackage } from '@/lib/auth';
import { VIEWER_PACKAGES, BILLING_PERIOD_LABELS } from '@/lib/auth';


interface ViewerPackageSelectorProps {
  selectedPackage: PackageType | null;
  selectedBilling: BillingPeriod | null;
  onPackageChange: (pkg: PackageType) => void;
  onBillingChange: (billing: BillingPeriod) => void;
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ViewerPackageSelector({
  selectedPackage,
  selectedBilling,
  onPackageChange,
  onBillingChange,
}: ViewerPackageSelectorProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3
          className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3"
        >
          Select your viewer plan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VIEWER_PACKAGES.map((pkg: ViewerPackage) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                id={`pkg-option-${pkg.id.toLowerCase()}`}
                onClick={() => {
                  onPackageChange(pkg.id);
                  // Auto-select first available billing period
                  if (pkg.billingPeriods.length > 0) {
                    onBillingChange(pkg.billingPeriods[0]);
                  }
                }}
                className={[
                  'relative text-left rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500',
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                ].join(' ')}
              >
                {/* Recommended badge */}
                {pkg.recommended && (
                  <span
                    className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                  >
                    Popular
                  </span>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className={`font-bold text-sm leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {pkg.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{pkg.tagline}</p>
                  </div>
                  {/* Selection indicator */}
                  <div
                    className={[
                      'mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300',
                    ].join(' ')}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <p className={`text-lg font-black mb-2 ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                  {pkg.priceLabel}
                </p>

                <ul className="space-y-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* Billing period selector — only shown for monthly plans */}
      {selectedPackage && selectedPackage !== 'ONE_DAY' && (
        <div
          className="animate-fade-in-up"
          id="billing-period-selector"
        >
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
            Subscription duration
          </h3>
          <div className="flex gap-3">
            {(VIEWER_PACKAGES.find(p => p.id === selectedPackage)?.billingPeriods ?? []).map(
              (period: BillingPeriod) => {
                const isSelected = selectedBilling === period;
                const discount = period === 'TWELVE_MONTHS' ? 'Save 15%' : period === 'SIX_MONTHS' ? 'Save 8%' : null;
                return (
                  <button
                    key={period}
                    type="button"
                    id={`billing-${period.toLowerCase()}`}
                    onClick={() => onBillingChange(period)}
                    className={[
                      'relative flex-1 rounded-xl border-2 px-4 py-3 text-center transition-all duration-150 cursor-pointer',
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300',
                    ].join(' ')}
                  >
                    {discount && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-emerald-500 whitespace-nowrap">
                        {discount}
                      </span>
                    )}
                    <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {BILLING_PERIOD_LABELS[period]}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* One-day note */}
      {selectedPackage === 'ONE_DAY' && (
        <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 font-medium">
          ⏱ &nbsp;One Day View access is valid for <strong>24 hours</strong> from activation on a <strong>single device</strong>. No recurring subscription.
        </p>
      )}
    </div>
  );
}
