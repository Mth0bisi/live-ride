import Link from 'next/link';

export const metadata = {
  title: 'Access Denied',
  description: 'You do not have access to this area.',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in-up">
      <div
        className="bg-white rounded-2xl border border-slate-200 px-10 py-12 text-center max-w-md w-full"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V7m0 0V5m0 2h2m-2 0H10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Access Denied
        </h1>

        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2">
          You do not have access to this area.
        </p>

        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
          If you believe this is an error, please contact your event organiser or log in with an account that has the required permissions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            id="unauthorized-login-btn"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
          >
            Sign in
          </Link>
          <Link
            href="/"
            id="unauthorized-home-btn"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
