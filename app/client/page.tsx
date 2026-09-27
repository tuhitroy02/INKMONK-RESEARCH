'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  title: string;
  service: string;
  language: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  progress: number;
  deadline: string;
  totalAmount: string;
  updatedAt: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock initial demo projects
  const [projects] = useState<Project[]>([
    {
      id: 'PRJ-1082',
      title: 'Deep Learning Model & Paper on Medical Image Segmentation',
      service: 'Research Paper Writing (English Technical)',
      language: 'English',
      status: 'IN_PROGRESS',
      progress: 65,
      deadline: '15 Oct 2026',
      totalAmount: '₹34,000',
      updatedAt: 'Yesterday',
    },
    {
      id: 'PRJ-1045',
      title: 'Turnitin AI & Originality Verification Scan',
      service: 'Turnitin Plagiarism Report',
      language: 'Bilingual',
      status: 'COMPLETED',
      progress: 100,
      deadline: 'Delivered',
      totalAmount: '₹200',
      updatedAt: '2 days ago',
    },
  ]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-ink-600">Accessing Client Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Portal Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-card mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">
              Client Portal
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-800">
              Welcome back, {user?.name || 'Scholar'}
            </h1>
            <p className="text-ink-500 text-xs sm:text-sm">
              Account: {user?.email} • Karunamoyee Office Support: +91 7980470880
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/quote" className="btn-primary text-xs py-2 px-4 shadow-none">
              + New Project Quote
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-ink-600 hover:text-navy-800 px-3 py-2 rounded-xl border border-ink-200 hover:bg-ink-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-ink-100 shadow-card">
            <div className="text-xs font-semibold text-ink-500 uppercase">Active Research Projects</div>
            <div className="font-serif text-3xl font-bold text-navy-800 mt-2">1</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">In progress on schedule</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-ink-100 shadow-card">
            <div className="text-xs font-semibold text-ink-500 uppercase">Completed Deliverables</div>
            <div className="font-serif text-3xl font-bold text-navy-800 mt-2">1</div>
            <div className="text-xs text-ink-400 font-medium mt-1">Turnitin audit archive</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-ink-100 shadow-card">
            <div className="text-xs font-semibold text-ink-500 uppercase">Dedicated Supervisor</div>
            <div className="font-serif text-xl font-bold text-navy-800 mt-2">Tuhit Roy / Sampreeti M.</div>
            <div className="text-xs text-orange-600 font-medium mt-1">Direct inquiry channel open</div>
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-card mb-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-ink-100">
            <h2 className="font-serif text-xl font-bold text-navy-800">Your Active &amp; Past Projects</h2>
            <span className="text-xs text-ink-400">{projects.length} recorded items</span>
          </div>

          <div className="space-y-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-ink-100 bg-ink-50/50 hover:bg-white hover:border-orange-200 transition-all shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-navy-800 bg-white px-2 py-0.5 rounded border border-ink-200">
                        {p.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-navy-800">
                      {p.title}
                    </h3>
                    <div className="text-xs text-ink-500">{p.service}</div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-xs text-ink-500">Agreed Amount</div>
                    <div className="font-serif font-bold text-lg text-navy-800">{p.totalAmount}</div>
                    <div className="text-[11px] text-ink-400">Target: {p.deadline}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-ink-600 mb-1">
                    <span>Drafting &amp; Review Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ink-200 overflow-hidden">
                    <div
                      className="h-full gradient-orange transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100 flex justify-between items-center text-xs">
                  <span className="text-ink-400">Last activity: {p.updatedAt}</span>
                  <a
                    href="https://wa.me/917980470880"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Contact Supervisor</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
