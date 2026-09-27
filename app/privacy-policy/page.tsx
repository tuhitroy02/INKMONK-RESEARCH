import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — InkMonk Research',
  description: 'InkMonk Research privacy policy regarding non-disclosure, client data protection, and confidential academic manuscript handling.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-ink-100 shadow-card">
        <div className="orange-badge mb-3">Legal &amp; Privacy</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-800 mb-6">
          Privacy Policy
        </h1>
        <div className="text-xs text-ink-500 mb-8 pb-4 border-b border-ink-100">
          Last updated: September 2026 • InkMonk Research, Karunamoyee, Salt Lake, Kolkata
        </div>

        <div className="prose-inkmonk text-sm space-y-6 text-ink-700 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">1. Our Fundamental Commitment to Privacy</h2>
            <p>
              At InkMonk Research, founded by Tuhit Roy and Sampreeti Mukherjee, we recognize that research manuscripts, doctoral dissertations, datasets, and intellectual concepts require strict confidentiality. We treat all research concepts with absolute discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">2. Information We Collect</h2>
            <p>We collect information you explicitly provide when requesting an academic quote or communicating with us:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact details: Name, email address, phone/WhatsApp number.</li>
              <li>Project details: Subject domain, academic level, word count requirements, target deadlines, citation preferences.</li>
              <li>Drafts and reference materials you attach for analysis or Turnitin auditing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">3. Local AI Engine Privacy Guarantee</h2>
            <p>
              Our website features a proprietary, deterministic, server-hosted local AI assistant. Unlike typical AI chatbots, <strong>no chat transcripts or project details are ever transmitted to external commercial AI APIs</strong> (such as OpenAI, Google Gemini, or Anthropic). All logic runs locally on our dedicated server infrastructure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">4. Non-Disclosure &amp; Non-Resale</h2>
            <p>
              We guarantee that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your research will never be published under another client’s name.</li>
              <li>Your papers are never uploaded to public databases or shared with third parties.</li>
              <li>Turnitin reports are processed in non-repository mode to ensure your paper is not indexed prior to official submission.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">5. Contact Information</h2>
            <p>
              For questions concerning this Privacy Policy, please contact our data officer at:
            </p>
            <p className="font-semibold text-navy-800 mt-2">
              InkMonk Research<br />
              Email: <a href="mailto:inkmonkresearch@gmail.com" className="text-orange-600 underline">inkmonkresearch@gmail.com</a><br />
              WhatsApp: +91 7980470880<br />
              Office: Karunamoyee, Sector 2, Salt Lake, Kolkata 700091, West Bengal
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-100 flex justify-between items-center">
          <Link href="/" className="text-sm font-semibold text-navy-800 hover:text-orange-600">
            ← Back to Home
          </Link>
          <Link href="/terms" className="text-sm font-semibold text-orange-600 hover:underline">
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
