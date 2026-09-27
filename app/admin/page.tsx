'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lead {
  id: string;
  channel: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  language?: string;
  domain?: string;
  totalPaise?: number;
  breakdown?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST' | 'SPAM';
  requirements?: string;
  deadline?: string;
  createdAt: string;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  chatLeads: number;
  manualLeads: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/admin/leads');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setLeads(data.leads || []);
        setStats(data.stats || null);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [router]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: status as any } : l))
        );
      }
    } catch {
      alert('Could not update status.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredLeads = filter === 'ALL'
    ? leads
    : leads.filter(l => l.status === filter || l.channel === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-ink-600">Loading Management Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-card mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">
              InkMonk Management Console
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-800">
              Inquiries, Quotes &amp; Leads Hub
            </h1>
            <p className="text-xs text-ink-500">
              Founders: Tuhit Roy &amp; Sampreeti Mukherjee • Karunamoyee Office
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-xs font-semibold text-ink-600 hover:text-navy-800 px-3 py-2 rounded-xl border border-ink-200">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-ink-500 uppercase">Total Leads</div>
              <div className="font-serif text-2xl font-bold text-navy-800 mt-1">{stats.totalLeads}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-orange-600 uppercase">New Inquiries</div>
              <div className="font-serif text-2xl font-bold text-orange-600 mt-1">{stats.newLeads}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-blue-600 uppercase">Contacted</div>
              <div className="font-serif text-2xl font-bold text-blue-700 mt-1">{stats.contactedLeads}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-emerald-600 uppercase">Converted</div>
              <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">{stats.convertedLeads}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-indigo-600 uppercase">Chatbot Inquiries</div>
              <div className="font-serif text-2xl font-bold text-indigo-700 mt-1">{stats.chatLeads}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-sm">
              <div className="text-[11px] font-semibold text-purple-600 uppercase">Quote Form</div>
              <div className="font-serif text-2xl font-bold text-purple-700 mt-1">{stats.manualLeads}</div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'CHAT', 'MANUAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-white text-ink-600 hover:bg-ink-100 border border-ink-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-50/80 text-ink-500 uppercase tracking-wider text-[10px] border-b border-ink-100">
                <tr>
                  <th className="py-3 px-4">Date / Channel</th>
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Service &amp; Scope</th>
                  <th className="py-3 px-4">Calculated Quote</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ink-400">
                      No leads match this filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const waNum = lead.phone?.replace(/[^0-9]/g, '') || '';
                    const waLink = waNum ? `https://wa.me/${waNum}` : null;

                    return (
                      <tr key={lead.id} className="hover:bg-ink-50/50 transition-colors">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-navy-800">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                              lead.channel === 'CHAT'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {lead.channel}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-navy-800 text-sm">{lead.name}</div>
                          <div className="text-ink-500">{lead.email}</div>
                          {lead.phone && (
                            <div className="text-ink-600 font-mono text-[11px] mt-0.5">{lead.phone}</div>
                          )}
                        </td>

                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-medium text-navy-800">
                            {lead.service || 'General Inquiry'}
                          </div>
                          <div className="text-ink-500 text-[11px]">
                            {lead.language && `${lead.language} • `}
                            {lead.domain || 'Unspecified'}
                          </div>
                          {lead.requirements && (
                            <p className="text-[11px] text-ink-600 mt-1 line-clamp-2 italic">
                              "{lead.requirements}"
                            </p>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          {lead.totalPaise ? (
                            <div>
                              <div className="font-serif font-bold text-sm text-navy-800">
                                ₹{(lead.totalPaise / 100).toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-ink-400 font-mono">
                                {lead.breakdown}
                              </div>
                            </div>
                          ) : (
                            <span className="text-ink-400">Custom / Inquiry</span>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className="bg-ink-50 border border-ink-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="LOST">LOST</option>
                            <option value="SPAM">SPAM</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200 inline-block"
                            >
                              WhatsApp
                            </a>
                          )}
                          <a
                            href={`mailto:${lead.email}?subject=InkMonk Research - Quote Response`}
                            className="text-xs bg-ink-100 text-ink-700 hover:bg-ink-200 font-bold px-2.5 py-1.5 rounded-lg border border-ink-200 inline-block"
                          >
                            Email
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
