import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { allowRate, authHash, normalizeIdentifier } from '@/lib/client-auth';

export async function POST(request: NextRequest) {
  try {
    const { identifier: raw } = await request.json();
    const identifier = normalizeIdentifier(raw);
    if (!identifier) return NextResponse.json({ error: 'Enter a valid email or phone number.' }, { status: 400 });
    const { kind, value } = identifier;
    const existing = kind === 'email'
      ? await db.user.findUnique({ where: { email: value } })
      : await db.user.findUnique({ where: { phone: value } });
    if (existing && (existing.role !== 'CLIENT' || existing.status !== 'ACTIVE')) {
      return NextResponse.json({ error: 'This account cannot use client OTP sign-in.' }, { status: 403 });
    }
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!await allowRate(`otp-ip:${ip}`, 20, 60 * 60_000) ||
        !await allowRate(`otp-send:${kind}:${value}`, 5, 60 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }

    if (kind === 'email') {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.OTP_FROM_EMAIL;
      if (!apiKey || !from) return NextResponse.json({ error: 'Email delivery is not configured yet.' }, { status: 503 });
      const now = new Date();
      const previous = await db.emailLoginCode.findUnique({ where: { email: value } });
      if (previous && now.getTime() - previous.lastSentAt.getTime() < 60_000) {
        return NextResponse.json({ error: 'Wait one minute before requesting another code.' }, { status: 429 });
      }
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [value], subject: 'Your InkMonk sign-in code',
          text: `Your InkMonk Research sign-in code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.` }),
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error('OTP email delivery failed:', response.status);
        return NextResponse.json({ error: 'Could not send the code. Please try again later.' }, { status: 502 });
      }
      await db.emailLoginCode.upsert({
        where: { email: value },
        create: { email: value, codeHash: authHash(`${value}:${code}`), expiresAt: new Date(now.getTime() + 600_000), lastSentAt: now },
        update: { codeHash: authHash(`${value}:${code}`), expiresAt: new Date(now.getTime() + 600_000), lastSentAt: now, attempts: 0, sends: { increment: 1 } },
      });
    } else {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const service = process.env.TWILIO_VERIFY_SERVICE_SID;
      if (!sid || !token || !service) return NextResponse.json({ error: 'SMS delivery is not configured yet.' }, { status: 503 });
      const response = await fetch(`https://verify.twilio.com/v2/Services/${encodeURIComponent(service)}/Verifications`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: value, Channel: 'sms' }), cache: 'no-store',
      });
      if (!response.ok) {
        console.error('OTP SMS delivery failed:', response.status);
        return NextResponse.json({ error: 'Could not send the SMS. Check the number and try again.' }, { status: 502 });
      }
    }
    return NextResponse.json({ success: true, message: 'Code sent. Check your email or phone.' });
  } catch (error) {
    console.error('OTP send failed:', error);
    return NextResponse.json({ error: 'Unable to send a code right now.' }, { status: 500 });
  }
}
