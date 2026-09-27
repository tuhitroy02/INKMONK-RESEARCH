import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { allowRate, authHash, clientSession, getOrCreateClient, normalizeIdentifier } from '@/lib/client-auth';

export async function POST(request: NextRequest) {
  try {
    const { identifier: raw, code } = await request.json();
    const identifier = normalizeIdentifier(raw);
    if (!identifier || typeof code !== 'string' || !/^\d{4,8}$/.test(code)) {
      return NextResponse.json({ error: 'Enter a valid code and email or phone number.' }, { status: 400 });
    }
    const { kind, value } = identifier;
    if (!await allowRate(`otp-check:${kind}:${value}`, 15, 60 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    if (kind === 'email') {
      const challenge = await db.emailLoginCode.findUnique({ where: { email: value } });
      if (!challenge || challenge.expiresAt <= new Date() || challenge.attempts >= 5) {
        return NextResponse.json({ error: 'Code expired or invalid. Request another.' }, { status: 401 });
      }
      if (challenge.codeHash !== authHash(`${value}:${code}`)) {
        await db.emailLoginCode.update({ where: { email: value }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ error: 'Incorrect code.' }, { status: 401 });
      }
      const consumed = await db.emailLoginCode.deleteMany({ where: { email: value, codeHash: challenge.codeHash, expiresAt: { gt: new Date() }, attempts: { lt: 5 } } });
      if (consumed.count !== 1) return NextResponse.json({ error: 'Code already used. Request another.' }, { status: 401 });
    } else {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const service = process.env.TWILIO_VERIFY_SERVICE_SID;
      if (!sid || !token || !service) return NextResponse.json({ error: 'SMS verification is not configured yet.' }, { status: 503 });
      const response = await fetch(`https://verify.twilio.com/v2/Services/${encodeURIComponent(service)}/VerificationCheck`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: value, Code: code }), cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok || result.status !== 'approved') return NextResponse.json({ error: 'Incorrect or expired code.' }, { status: 401 });
    }
    const user = await getOrCreateClient(identifier);
    if (!user) return NextResponse.json({ error: 'This account cannot use client OTP sign-in.' }, { status: 403 });
    return clientSession(user);
  } catch (error) {
    console.error('OTP verification failed:', error);
    return NextResponse.json({ error: 'Unable to verify the code right now.' }, { status: 500 });
  }
}
