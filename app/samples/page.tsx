import Link from 'next/link';

export const metadata = {
  title: 'Academic Writing Samples & Previews',
  description: 'Examine redacted, approved samples of academic research papers, theses, literature reviews, and Turnitin reports by InkMonk Research.',
};

const SAMPLES = [
  {
    id: 'sample-1',
    title: 'Deep Residual Networks for Automated Pulmonary Radiograph Diagnostics',
    category: 'Research Paper',
    domain: 'Computer Science / Healthcare AI',
    language: 'English (Technical)',
    format: 'IEEE Two-Column, 10 Pages',
    abstract: 'This paper presents a customized deep residual convolutional neural network (ResNet-50 variant) evaluated on 14,000 public chest X-ray scans. Through transfer learning and adaptive focal loss, the framework achieves an AUC-ROC of 0.942 across four critical thoracic pathologies, addressing severe class imbalances typical of clinical radiological datasets.',
    highlights: [
      'Comprehensive mathematical formulation of focal loss adaptation',
      'Comparative benchmarking against baseline DenseNet and VGG models',
      'Full bibtex citation index with 38 peer-reviewed references',
      'Turnitin similarity score verified below 5%',
    ],
  },
  {
    id: 'sample-2',
    title: 'भारतीय संदर्भ में समावेशी शिक्षा और डिजिटल विभाजन का समाजशास्त्रीय अध्ययन',
    category: 'Review Paper',
    domain: 'Sociology & Educational Policy',
    language: 'Hindi (Non-Technical)',
    format: 'Standard Academic Layout, 18 Pages',
    abstract: 'प्रस्तुत शोध पत्र राष्ट्रीय शिक्षा नीति (NEP 2020) के संदर्भ में भारत के ग्रामीण और अर्ध-शहरी अंचलों में डिजिटल अवसंरचना और समावेशी शिक्षा के अंतर्संबंधों का समालोचनात्मक विश्लेषण करता है। अध्ययन विभिन्न राज्यों के प्राथमिक डेटा और सरकारी सर्वेक्षणों के सांख्यिकीय समन्वय के आधार पर नीतिगत अनुशंसाएं प्रस्तुत करता है।',
    highlights: [
      'शुद्ध मानक हिंदी शब्दावली और सुव्यवस्थित प्रारूप',
      'यूनेस्को और मानव संसाधन विकास मंत्रालय के आंकड़ों का तुलनात्मक विश्लेषण',
      'संदर्भ ग्रंथ सूची (APA 7th Edition) का सटीक प्रयोग',
      'अकादमिक निष्ठा और 0% AI योगदान प्रमाणीकरण',
    ],
  },
  {
    id: 'sample-3',
    title: 'Microgrid Energy Management System with Hybrid Solar-Wind Storage',
    category: 'Thesis Excerpt',
    domain: 'Electrical & Sustainable Energy Engineering',
    language: 'English (Technical with Model)',
    format: 'Dissertation Chapter 4 (Methodology & Simulation)',
    abstract: 'Chapter 4 develops the predictive model-predictive control (MPC) algorithm deployed for dynamic load-leveling across an islanded community microgrid. Simulation executed in MATLAB/Simulink validates bus frequency stability under volatile 48-hour solar irradiation drops and gust wind speed fluctuations.',
    highlights: [
      'Detailed Simulink block diagram architecture and parameter tables',
      'State-space equations governing bidirectional inverter switching',
      'Experimental convergence and efficiency loss tables',
      'Clean Python/MATLAB source code scripts provided',
    ],
  },
  {
    id: 'sample-4',
    title: 'Sample Turnitin Originality & AI Paraphrase Audit',
    category: 'Turnitin Report',
    domain: 'Plagiarism & AI Verification Audit',
    language: 'Bilingual Audit',
    format: 'Standard Turnitin PDF Report Preview',
    abstract: 'Instructor-tier Turnitin verification audit demonstrating overall similarity index breakdown, matching web repositories, student paper database matches, and Turnitin’s proprietary AI writing percentage detection indicator.',
    highlights: [
      'Overall Similarity Index: 4% (Green bracket)',
      'AI Generated Content Detection: 0% detected',
      'Complete color-coded source matrix and clickable passage citations',
      'Delivered within 2 hours under standard verification request',
    ],
  },
];

export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="orange-badge">Demonstrated Quality</div>
          <h1 className="section-heading mb-4">Sample Work &amp; Redacted Previews</h1>
          <p className="section-subheading">
            To strictly protect client confidentiality and proprietary research data, all personal information, institutional affiliations, and unpublished findings have been redacted. Real samples are continuously updated.
          </p>
        </div>

        {/* Samples List */}
        <div className="space-y-8 mb-16">
          {SAMPLES.map((sample) => (
            <div
              key={sample.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-card hover:border-orange-200 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-ink-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 bg-navy-50 text-navy-800 text-xs font-bold rounded-full">
                    {sample.category}
                  </span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">
                    {sample.domain}
                  </span>
                  <span className="px-3 py-1 bg-ink-100 text-ink-700 text-xs rounded-full">
                    {sample.language}
                  </span>
                </div>
                <div className="text-xs text-ink-500 font-medium">
                  {sample.format}
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-800 mb-3 leading-snug">
                {sample.title}
              </h2>

              <div className="mb-5 bg-ink-50/70 p-4 rounded-xl border border-ink-100 text-sm text-ink-700 leading-relaxed italic">
                <strong className="not-italic text-navy-800 block mb-1">Abstract Preview:</strong>
                "{sample.abstract}"
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                  Sample Structural Attributes:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sample.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-ink-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-100 flex flex-wrap justify-between items-center gap-4">
                <span className="text-xs text-ink-400">
                  Redacted under InkMonk Research Non-Disclosure Protocol
                </span>
                <Link
                  href="/quote"
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
                >
                  Order a similar paper
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="gradient-navy rounded-3xl p-8 md:p-12 text-white text-center shadow-float">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Have a Specific Format or Journal Requirement?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Whether your university requires IEEE, Springer LNCS, Elsevier, Harvard, or a customized university thesis template in English or Hindi, our team configures the exact style guide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/quote" className="btn-primary">
              Configure Your Project
            </Link>
            <Link href="/chat" className="btn-secondary">
              Consult with AI Assistant
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
