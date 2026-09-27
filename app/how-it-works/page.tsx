import Link from 'next/link';

export const metadata = {
  title: 'How It Works — Step-by-Step Academic Process',
  description: 'Learn how InkMonk Research executes your academic research and writing projects with rigorous peer-review quality and strict delivery timelines.',
};

const PHASES = [
  {
    step: '01',
    title: 'Consultation & Precise Scope Definition',
    desc: 'You provide your research topic, word count, institutional guidelines, target journal/university rubric, and deadline. Use our instant quote engine or consult our interactive local AI assistant.',
    subpoints: [
      'Identification of Technical vs Non-Technical taxonomy',
      'Determination of English or Hindi linguistic conventions',
      'Evaluation of code or model implementation requirements',
      'Immediate transparent price calculation based on established schedule',
    ],
  },
  {
    step: '02',
    title: 'Assignment to Domain Specialist',
    desc: 'Your project is assigned directly to qualified subject-matter researchers. For engineering and AI papers, computational specialists lead the architecture. For Hindi research, native scholars oversee grammar and terminology.',
    subpoints: [
      'Comprehensive primary literature search across peer-reviewed databases',
      'Synthesis of modern methodology and theoretical models',
      'Drafting of structural synopsis and outline for verification',
    ],
  },
  {
    step: '03',
    title: 'Rigorous Drafting & Model Experimentation',
    desc: 'The complete manuscript is drafted adhering strictly to your target citation style (IEEE, APA, MLA, Harvard, Chicago). When models are requested, scripts and benchmarks are produced and documented.',
    subpoints: [
      'Original synthesis without robotic repetition or fabricated data',
      'High-resolution figures, architecture schematics, and clean tables',
      'Accurate mathematical derivations and code documentation',
    ],
  },
  {
    step: '04',
    title: 'Turnitin Audit & Quality Assurance',
    desc: 'Every document undergoes an independent Turnitin plagiarism and AI detection audit before delivery to verify zero unintended overlap and authentic authorship.',
    subpoints: [
      'Turnitin similarity index verification below strict academic thresholds',
      'Language editing, structural coherence check, and typo rectification',
      'Turnitin digital audit report generated for client assurance',
    ],
  },
  {
    step: '05',
    title: 'Delivery, Review & Client Revisions',
    desc: 'Your files are delivered securely via your client portal and email. You have dedicated revision windows to address any committee or mentor feedback.',
    subpoints: [
      'Editable Word/LaTeX files and presentation slide decks',
      'Direct communication channel with InkMonk academic directors',
      'Prompt adjustments and rebuttal assistance for journal submissions',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="orange-badge">Transparent Methodology</div>
          <h1 className="section-heading mb-4">Our End-to-End Workflow</h1>
          <p className="section-subheading">
            At InkMonk Research, every paper, thesis, and monograph follows an unyielding quality-assurance pipeline founded on care, clarity, and academic integrity.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-8 mb-16">
          {PHASES.map((p, idx) => (
            <div
              key={p.step}
              className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-card flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-16 h-16 rounded-2xl gradient-orange text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
                {p.step}
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">
                  {p.title}
                </h2>
                <p className="text-ink-600 text-sm leading-relaxed mb-4">
                  {p.desc}
                </p>
                <div className="bg-ink-50/80 p-4 rounded-xl border border-ink-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-800 mb-2">
                    Key Deliverables in this Phase:
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-ink-700">
                    {p.subpoints.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-orange-500 font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confidentiality & Security Pledge */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-ink-100 shadow-card mb-12">
          <h3 className="font-serif text-2xl font-bold text-navy-800 mb-4 text-center">
            Our Confidentiality &amp; Academic Guarantee
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-5 rounded-2xl bg-ink-50 border border-ink-100">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-navy-800 text-base mb-1">Strict Non-Disclosure</h4>
              <p className="text-ink-600 text-xs leading-relaxed">
                Your research topics, client data, and raw findings are protected under confidentiality agreements and never repurposed or shared.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-ink-50 border border-ink-100">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold text-navy-800 text-base mb-1">Punctual Delivery</h4>
              <p className="text-ink-600 text-xs leading-relaxed">
                We respect academic calendar deadlines, defense schedules, and conference submission cutoffs with rigorous milestone tracking.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-ink-50 border border-ink-100">
              <div className="text-2xl mb-2">✍️</div>
              <h4 className="font-bold text-navy-800 text-base mb-1">Human Scholarship</h4>
              <p className="text-ink-600 text-xs leading-relaxed">
                Every project is researched and written by domain experts, audited through Turnitin, and verified against shallow AI hallucinations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/quote" className="btn-primary px-8 py-3.5 text-base">
            Get Your Project Underway →
          </Link>
        </div>

      </div>
    </div>
  );
}
