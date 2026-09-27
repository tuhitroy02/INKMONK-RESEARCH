import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = {
  Services: [
    { label: 'English Research Papers', href: '/services#english-research' },
    { label: 'Hindi Research Papers', href: '/services#hindi-research' },
    { label: 'Thesis & Dissertation', href: '/services#thesis' },
    { label: 'Book Writing (100–300 pp)', href: '/services#books' },
    { label: 'Academic Presentations', href: '/services#ppt' },
    { label: 'Turnitin Verification', href: '/services#turnitin' },
  ],
  Company: [
    { label: 'About Founders', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Redacted Samples', href: '/samples' },
    { label: 'Academic FAQ', href: '/faq' },
    { label: 'Kolkata Office', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Portal Access', href: '/login' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050814] text-white border-t border-slate-800">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready to Begin Your Research Project?
          </h2>
          <p className="text-white/90 text-base max-w-xl mx-auto mb-6">
            "Research with care. Writing with clarity." Let our specialized team assist your academic journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="bg-white text-[#0A1128] hover:bg-slate-100 font-bold px-7 py-3 rounded-full text-sm shadow-lg transition-all"
            >
              Get an Instant Quote
            </Link>
            <a
              href="https://wa.me/917980470880"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/30 hover:bg-black/40 text-white border border-white/30 font-bold px-7 py-3 rounded-full text-sm transition-all"
            >
              WhatsApp Us (+91 7980470880)
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-white p-1">
                <Image src="/logo.png" alt="InkMonk Logo" fill sizes="44px" className="object-contain" />
              </div>
              <div>
                <div className="font-serif font-bold text-xl leading-none">InkMonk Research</div>
                <div className="text-xs text-orange-400 font-medium mt-1">Research with care. Writing with clarity.</div>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Professional research paper drafting, doctoral thesis structuring, book writing, and Turnitin audits in English and Hindi.
            </p>

            <div className="text-xs text-slate-400 space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">📍</span>
                <span>Karunamoyee, Sector 2, Salt Lake, Kolkata 700091, West Bengal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">📧</span>
                <a href="mailto:inkmonkresearch@gmail.com" className="hover:text-white transition-colors">
                  inkmonkresearch@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">📞</span>
                <a href="tel:+917980470880" className="hover:text-white transition-colors">
                  +91 7980470880
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-orange-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} InkMonk Research. Founded by Tuhit Roy &amp; Sampreeti Mukherjee. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/login" className="hover:text-slate-400">Portal Login</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
