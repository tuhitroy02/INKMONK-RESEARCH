import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — InkMonk Research',
  description: 'Terms and conditions governing academic research assistance, quotations, and deliverables at InkMonk Research.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-ink-100 shadow-card">
        <div className="orange-badge mb-3">Terms &amp; Agreements</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-800 mb-6">
          Terms of Service
        </h1>
        <div className="text-xs text-ink-500 mb-8 pb-4 border-b border-ink-100">
          Effective Date: September 2026 • InkMonk Research, Karunamoyee, Salt Lake, Kolkata
        </div>

        <div className="prose-inkmonk text-sm space-y-6 text-ink-700 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">1. Scope of Academic Assistance</h2>
            <p>
              InkMonk Research provides professional research, technical writing, manuscript preparation, data analysis, and Turnitin similarity auditing services. All deliverables are designed as model academic reference material, foundational literature synthesis, and editorial refinement to assist scholars in their legitimate intellectual endeavors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">2. Quotation and Payment Terms</h2>
            <p>
              Project fees are computed strictly based on technical complexity (Technical vs. Non-Technical), word count volume, language tier (English or Hindi), and simulation/computational requirements. Formal project commencement requires an agreed milestone advance deposit.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">3. Revisions and Modifications</h2>
            <p>
              We provide comprehensive revision support within the initial agreed scope and specifications. Revisions must be requested within 30 days of milestone delivery. Substantial alterations to the original topic, methodology change, or additional chapters outside the agreed brief will be quoted separately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">4. Originality &amp; Turnitin Policy</h2>
            <p>
              We warrant that all prose composed by InkMonk Research is original. Each document is verified using instructor-level Turnitin audits to ensure similarity indexes fall within universally acceptable academic parameters (standardly below 10-15% excluding bibliographies).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">5. Governing Law &amp; Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising out of service agreements shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-100 flex justify-between items-center">
          <Link href="/" className="text-sm font-semibold text-navy-800 hover:text-orange-600">
            ← Back to Home
          </Link>
          <Link href="/privacy-policy" className="text-sm font-semibold text-orange-600 hover:underline">
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
