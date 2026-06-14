'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const returnTo     = searchParams.get('return') ?? null;

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password)      { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json() as {
        error?: string;
        user?: { role: string; name: string };
        redirectTo?: string;
      };

      if (!res.ok || data.error) {
        setError(data.error ?? 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Store role in localStorage for client-side session helper
      if (data.user?.role) {
        localStorage.setItem('lr_role', data.user.role);
        localStorage.setItem('lr_name', data.user.name ?? '');
      }

      // Redirect: honour the ?return= param first, then role default
      const target = returnTo ?? data.redirectTo ?? '/';
      router.push(target);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in-up">
      <div className="w-full max-w-md">

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
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Sign in to your LiveRide account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5" noValidate>

            {/* Error banner */}
            {error && (
              <div
                role="alert"
                id="login-error"
                className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium animate-fade-in-up"
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* ReturnTo context hint */}
            {returnTo && !error && (
              <div className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 font-medium">
                🔒 &nbsp;Sign in to continue to your requested page.
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="login-email"
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
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                {/* TODO: Add forgot password flow */}
                <span className="text-xs text-slate-400 font-medium cursor-not-allowed" title="Coming soon">
                  Forgot password?
                </span>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
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
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>

            {/* Signup link */}
            <p className="text-center text-sm text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                id="login-signup-link"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create one →
              </Link>
            </p>
          </form>
        </div>

        {/* Sponsor strip */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-medium mb-2">Proudly supported by</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sponsors/western-shoppe-banner.png"
            alt="Western Shoppe"
            className="h-8 mx-auto object-contain opacity-70"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
