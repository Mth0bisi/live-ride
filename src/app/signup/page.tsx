'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import ViewerPackageSelector from '@/components/ViewerPackageSelector';
import { ROLES, type Role, type PackageType, type BillingPeriod } from '@/lib/auth';

export default function SignupPage() {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]                     = useState<Role | ''>('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<BillingPeriod | null>(null);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [success, setSuccess]               = useState(false);

  const isViewer = role === 'VIEWER';
  const isStaff  = role === 'GATE_MARSHAL' || role === 'JUDGE';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!role) { setError('Please select a role.'); return; }
    if (isViewer && !selectedPackage) { setError('Please select a viewer plan.'); return; }
    if (isViewer && selectedPackage !== 'ONE_DAY' && !selectedBilling) {
      setError('Please select a subscription duration.'); return;
    }

    setLoading(true);

    // TODO: Integrate real auth provider (NextAuth / Supabase / Clerk)
    // Payload that would be sent to the API:
    const _payload = {
      name,
      email,
      password,
      role,
      ...(isViewer && {
        packageType: selectedPackage,
        billingPeriod: selectedBilling,
      }),
    };

    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in-up">
        <div
          className="bg-white rounded-2xl border border-slate-200 px-10 py-12 text-center max-w-md w-full"
          style={{ boxShadow: 'var(--shadow-elevated)' }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Account created!
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
            Welcome to LiveRide, <strong className="text-slate-700">{name}</strong>.{' '}
            {isViewer
              ? 'Your viewer plan has been noted. Payment setup is coming soon.'
              : 'Your access request will be reviewed by the event organiser.'}
          </p>
          <Link
            href="/login"
            id="signup-success-login"
            className="inline-block py-3 px-8 rounded-xl font-black text-sm uppercase tracking-wider text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-12 animate-fade-in-up">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          style={{ boxShadow: 'var(--shadow-elevated)' }}
        >
          {/* Card header */}
          <div
            className="px-8 pt-8 pb-6 border-b border-slate-100"
            style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
              >
                LR
              </span>
              <span className="font-black text-slate-900 text-lg">
                Live<span className="text-blue-500">Ride</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Join the LiveRide equestrian show platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5" noValidate>

            {/* Error */}
            {error && (
              <div
                role="alert"
                id="signup-error"
                className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium animate-fade-in-up"
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane van der Merwe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="signup-confirm-password" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Confirm password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                I am a…
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLES.map(r => {
                  const isSelected = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      id={`role-option-${r.value.toLowerCase()}`}
                      onClick={() => {
                        setRole(r.value);
                        // Reset package when switching roles
                        setSelectedPackage(null);
                        setSelectedBilling(null);
                      }}
                      className={[
                        'text-left rounded-xl border-2 px-4 py-3 transition-all duration-150 cursor-pointer',
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                        {r.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {r.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Viewer package selector ─────────────────────────────────── */}
            {isViewer && (
              <div className="animate-fade-in-up border-t border-slate-100 pt-5">
                <ViewerPackageSelector
                  selectedPackage={selectedPackage}
                  selectedBilling={selectedBilling}
                  onPackageChange={pkg => {
                    setSelectedPackage(pkg);
                    setSelectedBilling(null);
                  }}
                  onBillingChange={setSelectedBilling}
                />
              </div>
            )}

            {/* ── Staff access notice ─────────────────────────────────────── */}
            {isStaff && (
              <div className="animate-fade-in-up border border-blue-100 bg-blue-50 rounded-xl px-5 py-4 text-sm text-blue-800 font-medium leading-relaxed">
                <svg className="w-5 h-5 text-blue-400 inline-block mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Access is assigned by the organiser for approved event staff. Create your account and the event team will grant you access once verified.
              </div>
            )}

            {/* ── Payment placeholder ─────────────────────────────────────── */}
            {isViewer && selectedPackage && (
              <div className="animate-fade-in-up text-center text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium">
                💳 &nbsp;Secure payment integration <strong className="text-slate-600">coming soon</strong>. Your plan selection will be saved.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="signup-submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? '#64748b' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link
                href="/login"
                id="signup-login-link"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in →
              </Link>
            </p>
          </form>
        </div>

        {/* Sponsor strip */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-medium mb-2">Proudly supported by</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sponsors/western-shoppe-logo.png"
            alt="Western Shoppe"
            className="h-7 mx-auto opacity-60 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}
