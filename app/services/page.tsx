import Link from 'next/link';

export const metadata = {
  title: 'Academic Writing & Research Services',
  description: 'Full overview of InkMonk Research services in English and Hindi: Research papers, theses, book writing, articles, synopses, and Turnitin reports.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="orange-badge">Academic Excellence</div>
          <h1 className="section-heading mb-4">Our Research &amp; Writing Services</h1>
          <p className="section-subheading">
            InkMonk Research provides rigorously formatted, plagiarism-free academic and research content in both <strong>English</strong> and <strong>Hindi</strong>.
          </p>
        </div>

        {/* 3 Main Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 border border-ink-100 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl gradient-navy flex items-center justify-center text-white text-2xl mb-5 shadow">
                🇬🇧
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">English Services</h2>
              <p className="text-ink-600 text-sm mb-6 leading-relaxed">
                Comprehensive support for international journals, university submissions, doctoral dissertations, and technical documentation.
              </p>
              <ul className="space-y-3 text-sm text-ink-700 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Research &amp; Review Papers (Up to 10k words)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Thesis Writing (With / Without Model)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Book Writing (100, 200, 300 pages)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Articles (₹0.60–0.70/word)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Academic Presentations (₹120–150/slide)
                </li>
              </ul>
            </div>
            <Link href="/quote?lang=EN" className="btn-primary w-full justify-center">
              Request English Quote
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-orange-300 shadow-card flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6 bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Hindi Specialists
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center text-white text-2xl mb-5 shadow">
                🇮🇳
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">Hindi Services</h2>
              <p className="text-ink-600 text-sm mb-6 leading-relaxed">
                Dedicated Hindi academic team ensuring authentic scholarly vocabulary, correct Devanagari grammar, and structured methodology.
              </p>
              <ul className="space-y-3 text-sm text-ink-700 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Shodh Patra / Hindi Research Papers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Shodh Prabandh / Hindi Thesis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Hindi Book Writing (100–300 pages)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Articles (₹0.75–0.80/word)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Hindi Presentations (₹150–170/slide)
                </li>
              </ul>
            </div>
            <Link href="/quote?lang=HI" className="btn-primary w-full justify-center">
              Request Hindi Quote
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-ink-100 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-ink-900 flex items-center justify-center text-white text-2xl mb-5 shadow">
                🛡️
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">Turnitin Reports</h2>
              <p className="text-ink-600 text-sm mb-6 leading-relaxed">
                Verified instructor-grade Turnitin check with complete AI percentage detection and highlighted originality breakdown.
              </p>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 mb-6 text-center">
                <span className="text-xs text-orange-600 font-semibold block uppercase">Fixed Rate</span>
                <span className="font-serif text-3xl font-bold text-navy-800">₹200</span>
                <span className="text-xs text-ink-500 block">per scanned file</span>
              </div>
              <ul className="space-y-3 text-sm text-ink-700 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> AI Writing &amp; Paraphrasing Detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Source Similarity Index
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Non-Repository Submission (Safe)
                </li>
              </ul>
            </div>
            <Link href="/quote?type=TURNITIN" className="btn-secondary text-navy-800 border-navy-800 hover:bg-navy-50 w-full justify-center">
              Order Turnitin Report
            </Link>
          </div>
        </div>

        {/* Detailed Breakdown of Specific Capabilities */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-ink-100 shadow-card mb-16">
          <h2 className="font-serif text-3xl font-bold text-navy-800 mb-8 text-center">
            Service Capabilities &amp; Formats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-orange text-white flex items-center justify-center font-bold shrink-0">
                  01
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Research &amp; Review Papers</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    IEEE, Springer, Elsevier, UGC CARE, Scopus-standard structures. Includes Abstract, Literature Review, Methodology, Data Analysis, Results, Discussion, and Reference formatting (APA, IEEE, Harvard, MLA, Chicago).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-orange text-white flex items-center justify-center font-bold shrink-0">
                  02
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Master &amp; Doctoral Theses</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    End-to-end dissertation drafting. Optional hands-on Machine Learning, Deep Learning, statistical analysis, or custom web architecture model implementation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-orange text-white flex items-center justify-center font-bold shrink-0">
                  03
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Book &amp; Monograph Writing</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    Complete manuscripts structured into chapters, index, preface, and bibliography. Formatted for ISBN publication in 100, 200, or 300 page editions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-navy text-white flex items-center justify-center font-bold shrink-0">
                  04
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Model &amp; Code Implementation</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    Practical code generation and experimentation in Python (TensorFlow, PyTorch, Scikit-learn, OpenCV), R, MATLAB, or full web prototypes for engineering projects.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-navy text-white flex items-center justify-center font-bold shrink-0">
                  05
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Professional Presentations (PPT)</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    Clean, visually appealing conference and thesis defense slide decks designed to highlight core contributions, equations, figures, and key takeaways.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg gradient-navy text-white flex items-center justify-center font-bold shrink-0">
                  06
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-800">Turnitin Plagiarism Verification</h3>
                  <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                    Pre-submission verification to ensure complete academic integrity. Reports delivered with clear guidance on high-similarity passages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/quote" className="btn-primary text-base px-8 py-3.5 shadow-lg">
            Start Your Custom Quotation →
          </Link>
        </div>

      </div>
    </div>
  );
}
