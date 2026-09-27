'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-orange text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            IM
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-800 mb-2">Portal Access</h1>
          <p className="text-ink-600 text-sm">
            Sign in to your client dashboard or administrative management console.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-ink-100 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@inkmonkresearch.com"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3"
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-ink-100">
            <div className="text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
              Default Demonstration Credentials:
            </div>
            <div className="space-y-2 text-xs text-ink-600 bg-ink-50 p-3 rounded-xl border border-ink-100">
              <div>
                <strong>Admin Portal:</strong> <span className="font-mono text-navy-800">admin@inkmonk.com</span> / <span className="font-mono text-navy-800">admin123</span>
              </div>
              <div>
                <strong>Client Portal:</strong> <span className="font-mono text-navy-800">client@inkmonk.com</span> / <span className="font-mono text-navy-800">client123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-ink-500 hover:text-navy-800">
            ← Back to InkMonk Research Home
          </Link>
        </div>

      </div>
    </div>
  );
}
