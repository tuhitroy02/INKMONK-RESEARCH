'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/services',     label: 'Services' },
  { href: '/samples',      label: 'Samples' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about',        label: 'About' },
  { href: '/faq',          label: 'FAQ' },
  { href: '/contact',      label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When on homepage and at top, use luxury dark glass. Everywhere else, use ultra-clean white glass.
  const isDark = isHomePage && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-[#0A1128]/85 backdrop-blur-md border-b border-white/10'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-md p-1 border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors">
              <Image
                src="/logo.png"
                alt="InkMonk Research Logo"
                fill
                sizes="48px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-serif font-black text-xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#0A1128]'}`}>
                  InkMonk
                </span>
                <span className="font-sans font-bold text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded leading-none">
                  RESEARCH
                </span>
              </div>
              <span className={`text-[11px] font-medium tracking-wide mt-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                Research with care. Writing with clarity.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? isDark
                        ? 'text-orange-400 bg-white/10 shadow-inner'
                        : 'text-orange-600 bg-orange-50'
                      : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-white/10'
                      : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3.5">
            <Link
              href="/login"
              className={`text-sm font-bold px-3 py-2 rounded-xl transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#0A1128]'
              }`}
            >
              Portal Login
            </Link>
            <Link
              href="/quote"
              className="btn-primary-glow text-sm !py-2.5 !px-6"
            >
              Get a Quote →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl ${
              isDark ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 shadow-xl space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-slate-800 font-semibold py-2 hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-600 font-semibold py-2"
            >
              Client / Admin Login
            </Link>
            <Link
              href="/quote"
              onClick={() => setMobileOpen(false)}
              className="btn-primary-glow w-full text-center"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
