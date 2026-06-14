import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AdSpace from "@/components/AdSpace";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LiveRide — Equestrian Show Platform",
    template: "%s | LiveRide",
  },
  description:
    "Live equestrian showjumping and showriding telemetry platform. Monitor arena flow, track gate queues, and view live results in real time.",
  keywords: ["showjumping", "showriding", "equestrian", "SANESA", "live results", "horse show"],
  openGraph: {
    title: "LiveRide — Equestrian Show Platform",
    description: "Real-time equestrian show telemetry and arena management.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>

        {/* ── Navigation Header ─────────────────────────────────────────── */}
        <header
          className="bg-slate-900 text-white sticky top-0 z-50 nav-gradient-border"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className="font-black text-xl tracking-tight flex items-center gap-2.5 group"
              aria-label="LiveRide – Home"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white transition-all duration-200 group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
              >
                LR
              </span>
              <span>
                Live<span className="text-blue-400">Ride</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {[
                { href: "/", label: "Events" },
                { href: "/admin", label: "Admin" },
                { href: "/gate", label: "Gate" },
                { href: "/timer", label: "Timer" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
                >
                  {label}
                </Link>
              ))}

              {/* Auth links */}
              <div className="ml-2 flex items-center gap-1.5 border-l border-slate-700 pl-3">
                <Link
                  href="/login"
                  id="nav-login"
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  id="nav-signup"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-white transition-all duration-150"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="bg-slate-900 text-slate-400 mt-12">

          {/* Western Shoppe leaderboard footer ad */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <AdSpace sponsor="western-shoppe" size="leaderboard" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center font-black text-xs text-white"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)" }}
              >
                LR
              </span>
              <div>
                <p className="text-white font-bold text-sm leading-tight">LiveRide</p>
                <p className="text-slate-500 text-xs">Equestrian Show Platform</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap gap-4 text-xs font-semibold" aria-label="Footer navigation">
              <Link href="/" className="hover:text-white transition-colors">Events</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
              <Link href="/gate" className="hover:text-white transition-colors">Gate Marshal</Link>
              <Link href="/timer" className="hover:text-white transition-colors">Timer</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            </nav>

            {/* Copyright */}
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} LiveRide. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
