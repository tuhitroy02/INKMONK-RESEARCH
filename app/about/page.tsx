import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us — InkMonk Research',
  description: 'Learn about InkMonk Research, our academic philosophy, founders Tuhit Roy and Sampreeti Mukherjee, and our headquarters in Kolkata, West Bengal.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="orange-badge">Our Story &amp; Philosophy</div>
          <h1 className="section-heading mb-4">About InkMonk Research</h1>
          <p className="text-orange-600 font-serif italic text-xl mb-4">
            "Research with care. Writing with clarity."
          </p>
          <p className="section-subheading">
            InkMonk Research was established to bridge academic rigor with meticulous editorial craftsmanship. We support researchers, scholars, and professionals across India and abroad in translating complex ideas into peer-recognized publications.
          </p>
        </div>

        {/* Brand Meaning & Mascot */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-ink-100 shadow-card mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-800 mb-4">
                The InkMonk Philosophy
              </h2>
              <p className="text-ink-700 text-sm leading-relaxed mb-4">
                The name <strong>InkMonk</strong> embodies two eternal qualities: the focused, disciplined contemplation of a monk and the precision of the scholar's pen.
              </p>
              <p className="text-ink-700 text-sm leading-relaxed mb-4">
                Our mascot—a monk adorned with a graduation cap holding a classic fountain pen—reflects our commitment to scholarly enlightenment, deliberate patience, and unyielding intellectual honesty.
              </p>
              <p className="text-ink-700 text-sm leading-relaxed">
                Whether structuring an IEEE machine learning investigation or composing a sociological review in standard Devanagari Hindi, our methodology remains grounded in authentic scholarship.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full gradient-navy p-6 flex items-center justify-center shadow-float">
                <Image
                  src="/logo.png"
                  alt="InkMonk Research Official Mascot"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Founders */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="orange-badge">Leadership</div>
            <h2 className="section-heading">Meet the Founders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full gradient-navy text-white font-serif font-bold text-3xl flex items-center justify-center mb-6 shadow-md border-4 border-white">
                TR
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-800 mb-1">Tuhit Roy</h3>
              <div className="text-orange-600 font-semibold text-sm mb-4">Founder &amp; Research Director</div>
              <p className="text-ink-600 text-sm leading-relaxed">
                Tuhit Roy spearheads academic methodologies, computational research initiatives, and technical paper structuring at InkMonk Research. With deep insight into contemporary peer-review expectations, he ensures every project meets high publishing standards.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full gradient-orange text-white font-serif font-bold text-3xl flex items-center justify-center mb-6 shadow-md border-4 border-white">
                SM
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-800 mb-1">Sampreeti Mukherjee</h3>
              <div className="text-orange-600 font-semibold text-sm mb-4">Co-Founder &amp; Editorial Director</div>
              <p className="text-ink-600 text-sm leading-relaxed">
                Sampreeti Mukherjee oversees editorial standards, linguistic accuracy, client consultations, and the specialized Hindi research and publication division. She is dedicated to authentic academic expression and nuanced prose.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Presence */}
        <div className="gradient-navy rounded-3xl p-8 md:p-12 text-white shadow-float text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Based in the Intellectual Capital of Kolkata
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed mb-6">
            Our physical operations are situated in Karunamoyee, Salt Lake Sector 2, Kolkata—a premier academic and technological hub. We serve clients across all Indian states and overseas universities.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs text-white/90 border border-white/20 mb-8">
            <span>📍 Karunamoyee, Sector 2, Salt Lake, Kolkata 700091, West Bengal</span>
          </div>
          <div>
            <Link href="/contact" className="btn-primary">
              Get in Touch with our Directors
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
