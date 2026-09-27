'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'MANUAL',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          domain: formData.subject,
          requirements: formData.message,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Unable to send message right now. Please message us on WhatsApp directly at +91 7980470880.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="orange-badge">Direct Communication</div>
          <h1 className="section-heading mb-4">Contact InkMonk Research</h1>
          <p className="section-subheading">
            Connect directly with founders <strong>Tuhit Roy</strong> and <strong>Sampreeti Mukherjee</strong>. We respond swiftly to all inquiries, quotes, and research consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-card">
              <div className="w-10 h-10 rounded-xl gradient-navy text-white flex items-center justify-center text-xl mb-4 shadow">
                📍
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-800 mb-1">Office Address</h3>
              <p className="text-ink-600 text-sm leading-relaxed">
                Karunamoyee, Sector 2, Salt Lake City,<br />
                Kolkata 700091, West Bengal, India
              </p>
              <div className="text-xs text-ink-400 mt-2">Visits by prior appointment</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-card">
              <div className="w-10 h-10 rounded-xl gradient-orange text-white flex items-center justify-center text-xl mb-4 shadow">
                💬
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-800 mb-1">WhatsApp &amp; Phone</h3>
              <p className="text-ink-600 text-sm mb-3">
                Quickest channel for urgent deadlines and live consultations.
              </p>
              <a
                href="https://wa.me/917980470880"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs py-2 px-4 inline-flex"
              >
                Chat on WhatsApp (+91 7980470880)
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-ink-900 text-white flex items-center justify-center text-xl mb-4 shadow">
                📧
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-800 mb-1">Email Inquiries</h3>
              <p className="text-ink-600 text-sm mb-2">
                For detailed briefs, manuscript attachments, and institutional agreements.
              </p>
              <a
                href="mailto:inkmonkresearch@gmail.com"
                className="text-orange-600 font-medium text-sm hover:underline"
              >
                inkmonkresearch@gmail.com
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-ink-100 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">Send an Academic Inquiry</h2>
              <p className="text-ink-600 text-sm mb-6">
                Fill in your details below. We typically review and respond within 2 to 4 business hours.
              </p>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-fade-in">
                  <div className="text-4xl mb-3">✉️</div>
                  <h3 className="font-serif text-2xl font-bold text-emerald-900 mb-2">Message Dispatched!</h3>
                  <p className="text-emerald-700 text-sm max-w-md mx-auto mb-6">
                    Thank you for reaching out to InkMonk Research. Tuhit Roy and Sampreeti Mukherjee have received your message and will review your specifications shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-emerald-900 border-emerald-600 hover:bg-emerald-100 text-xs py-2 px-5"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. / Mr. / Ms. Name"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@university.edu"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Subject / Discipline</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Master's Thesis in Mechanical Engg"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Project Details / Requirements *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline the target word count, language (English/Hindi), urgency, and specific academic guidelines..."
                      className="input-field text-sm"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <span className="text-xs text-ink-400">
                      All research queries are covered under non-disclosure confidentiality.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Transmitting...' : 'Send Inquiry →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
