import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let databaseReady = false;
  try {
    await db.authRateLimit.findFirst({ select: { key: true } });
    databaseReady = true;
  } catch {
    // The database migration or persistent database connection is still pending.
  }
  const secret = process.env.JWT_SECRET;
  const sessionReady = Boolean(secret && (process.env.NODE_ENV !== 'production' ||
    (secret.length >= 32 && !secret.startsWith('replace-with-') && !secret.startsWith('local-build-'))));
  const ready = databaseReady && sessionReady;
  return NextResponse.json({
    google: Boolean(ready && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI),
    email: Boolean(ready && process.env.RESEND_API_KEY && process.env.OTP_FROM_EMAIL),
    phone: Boolean(ready && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
