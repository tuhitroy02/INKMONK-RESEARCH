'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'General & Confidentiality',
    q: 'What is InkMonk Research and who founded it?',
    a: 'InkMonk Research is an academic writing and research consultancy based in Karunamoyee, Salt Lake, Kolkata, founded by Tuhit Roy and Sampreeti Mukherjee. Our mission is encapsulated in our tagline: "Research with care. Writing with clarity." We serve researchers, postgraduate scholars, faculty, and industry professionals in English and Hindi.',
  },
  {
    category: 'General & Confidentiality',
    q: 'Is my research topic and work kept completely confidential?',
    a: 'Yes, 100%. InkMonk Research operates under strict non-disclosure principles. We never resell, license, publish, or reveal your project briefs, raw findings, personal details, or completed manuscripts to any third party.',
  },
  {
    category: 'Pricing & Estimates',
    q: 'How does InkMonk Research calculate quotes without publishing public prices?',
    a: 'We uphold professional academic standards by evaluating each project on its technical complexity, domain, language (English or Hindi), word count tier, and code/simulation requirements. Our guided quote calculator and local AI assistant use our server-side rate schedule to provide exact, transparent estimates.',
  },
  {
    category: 'Pricing & Estimates',
    q: 'How much does a Turnitin report cost and what does it include?',
    a: 'Turnitin reports are fixed at ₹200 per scanned file. The audit checks for web similarity, repository matching, and includes Turnitin’s proprietary AI writing detection indicator without submitting your file to the public repository.',
  },
  {
    category: 'Services & Scope',
    q: 'Do you offer research papers and theses in Hindi?',
    a: 'Yes! Co-founder Sampreeti Mukherjee leads our dedicated Hindi academic writing division. We handle Shodh Patra (research papers), Shodh Prabandh (theses), book writing, articles, and presentations using standardized Devanagari terminology across humanities, social sciences, and technical domains.',
  },
  {
    category: 'Services & Scope',
    q: 'Can you implement AI, Machine Learning, or Deep Learning models for my thesis?',
    a: 'Yes. Led by founder Tuhit Roy, our computational division writes, trains, and validates machine learning and deep learning pipelines in Python (TensorFlow, PyTorch, Scikit-learn), MATLAB, or full web applications with reproducible results and documentation.',
  },
  {
    category: 'Process & Revisions',
    q: 'What happens if my university committee or journal reviewers request revisions?',
    a: 'We provide dedicated revision support within the agreed project scope. If your guide or peer-reviewers provide specific critique on methodology, literature references, or formatting, our team promptly updates the manuscript.',
  },
  {
    category: 'Process & Revisions',
    q: 'How does the Local AI Chatbot work without API keys?',
    a: 'Our AI assistant is custom-engineered with a deterministic Finite State Machine (FSM) and local natural language classification algorithms running directly on our server. It requires zero third-party API keys (no OpenAI, Anthropic, or Google Cloud fees), guarantees absolute privacy, and provides instantaneous responses.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'General & Confidentiality', 'Pricing & Estimates', 'Services & Scope', 'Process & Revisions'];

  const filteredFaqs = filter === 'All' ? FAQS : FAQS.filter(f => f.category === filter);

  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="orange-badge">Frequently Asked Questions</div>
          <h1 className="section-heading mb-4">Got Questions? We Have Answers</h1>
          <p className="section-subheading">
            Clear, transparent answers about our academic workflows, pricing estimates, confidentiality protocols, and research standards.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-navy-800 text-white shadow-md'
                  : 'bg-white text-ink-600 hover:bg-ink-100 border border-ink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-ink-50/50 transition-colors"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-navy-800">
                    {faq.q}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-ink-100 text-navy-800 flex items-center justify-center shrink-0 text-sm font-bold">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-ink-600 leading-relaxed border-t border-ink-100 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="gradient-navy rounded-3xl p-8 text-white text-center shadow-float">
          <h3 className="font-serif text-2xl font-bold mb-2">Have a Question Not Listed Here?</h3>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-6">
            Ask our instant local AI assistant or talk directly with our founders on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/chat" className="btn-primary">
              Ask AI Assistant
            </Link>
            <a
              href="https://wa.me/917980470880"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-2.5 px-6 inline-flex justify-center"
            >
              WhatsApp (+91 7980470880)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
