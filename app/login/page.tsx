'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen" />}><LoginContent /></Suspense>;
}

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [staff, setStaff] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(params.has('error') ? 'Google sign-in could not be completed. Please try again.' : null);

  async function post(url: string, body: object) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try again.');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    const result = await post('/api/auth/otp/send', { identifier });
    if (result) setSent(true);
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    const result = await post('/api/auth/otp/verify', { identifier, code });
    if (result) router.replace('/client');
  }

  async function staffLogin(event: React.FormEvent) {
    event.preventDefault();
    const result = await post('/api/auth/login', { email, password });
    if (result) router.replace(result.user.role === 'CLIENT' ? '/client' : '/admin');
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F9F7F4] px-4 py-10 sm:py-16 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-7">
          <h1 className="font-serif text-3xl font-bold text-[#0A1128] mb-2">CLIENT LOGIN</h1>
          <p className="text-slate-600 text-sm">Access your InkMonk Research dashboard.</p>
        </div>
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          {!staff ? <>
            <a href="/api/auth/google" className="w-full min-h-12 flex items-center justify-center gap-3 rounded-xl border border-slate-300 text-[#0A1128] hover:bg-slate-50 text-sm font-bold">
              <span aria-hidden="true" className="text-xl font-bold text-blue-600">G</span> Continue with Google
            </a>
            <div className="flex items-center gap-3 my-6 text-xs text-slate-500"><span className="h-px bg-slate-200 flex-1" />OR USE A ONE-TIME CODE<span className="h-px bg-slate-200 flex-1" /></div>
            <form onSubmit={sent ? verifyCode : sendCode} className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm text-[#0A1128] mb-2">Email or phone number</label>
                <input id="identifier" autoComplete="username" required value={identifier}
                  onChange={(event) => { setIdentifier(event.target.value); setSent(false); setCode(''); }}
                  placeholder="name@example.com or +91 9876543210"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0A1128] bg-white" />
              </div>
              {sent && <div>
                <label htmlFor="code" className="block text-sm text-[#0A1128] mb-2">Code sent to {identifier}</label>
                <input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code}
                  onChange={(event) => setCode(event.target.value)} maxLength={8} placeholder="Enter your code"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0A1128] bg-white" />
              </div>}
              {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl p-3">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary-glow w-full text-sm disabled:opacity-60">
                {loading ? 'Please wait…' : sent ? 'Verify and sign in' : 'Send me a code'}
              </button>
              {sent && <button type="button" disabled={loading} onClick={() => { setSent(false); setCode(''); }} className="block mx-auto text-sm text-orange-700 underline">Request another code</button>}
            </form>
            <p className="mt-5 text-xs text-slate-500">Indian 10-digit numbers use +91. Other numbers need a country code.</p>
          </> : <form onSubmit={staffLogin} className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A1128]">Staff and admin sign-in</h2>
            <label className="block text-sm text-[#0A1128]">Email
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="block mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <label className="block text-sm text-[#0A1128]">Password
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="block mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl p-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary-glow w-full text-sm disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
          </form>}
          <button type="button" onClick={() => { setStaff(!staff); setError(null); }} className="block mx-auto mt-6 text-xs text-slate-600 underline">
            {staff ? 'Back to client login' : 'Staff or admin? Sign in with password'}
          </button>
        </div>
        <div className="text-center mt-6"><Link href="/" className="text-sm text-slate-600 hover:text-[#0A1128]">← Back to home</Link></div>
      </div>
    </div>
  );
}
