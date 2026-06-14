import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AdSpace from "@/components/AdSpace";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const uid = cookieStore.get('lr_uid')?.value || null;
  const role = cookieStore.get('lr_role')?.value || null;
  const name = cookieStore.get('lr_name')?.value || null;

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>

        {/* ── Navigation Header ─────────────────────────────────────────────
            Dynamic Navbar renders depending on login/role status.
        */}
        <header
          className="bg-slate-900 text-white sticky top-0 z-50 nav-gradient-border"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          <Navbar initialUid={uid} initialRole={role} initialName={name} />
        </header>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="bg-slate-900 text-slate-400 mt-12">

          {/* Western Shoppe bottom banner ad */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <AdSpace placement="banner" />
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

            {/* Public footer nav — no internal staff links */}
            <nav className="flex flex-wrap gap-4 text-xs font-semibold" aria-label="Footer navigation">
              <Link href="/" className="hover:text-white transition-colors">Events</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
              <Link href="/unauthorized" className="hover:text-white transition-colors text-slate-600">Access Help</Link>
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
