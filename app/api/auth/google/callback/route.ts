import { timingSafeEqual } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateClient } from '@/lib/client-auth';
import { signToken } from '@/lib/auth';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function GET(request: NextRequest) {
  const redirect = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));
  const cookie = request.cookies.get('inkmonk_oauth')?.value;
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');
  if (!cookie || !state || !code) return redirect('google-failed');
  try {
    const data = JSON.parse(Buffer.from(cookie, 'base64url').toString('utf8'));
    if (typeof data.state !== 'string' || state.length !== data.state.length ||
        !timingSafeEqual(Buffer.from(state), Buffer.from(data.state))) return redirect('google-failed');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) return redirect('google-unavailable');
    const exchange = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: redirectUri, grant_type: 'authorization_code', code_verifier: data.verifier }),
      cache: 'no-store',
    });
    if (!exchange.ok) return redirect('google-failed');
    const tokens = await exchange.json();
    if (typeof tokens.id_token !== 'string') return redirect('google-failed');
    const { payload } = await jwtVerify(tokens.id_token, googleKeys, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'], audience: clientId,
    });
    if (payload.nonce !== data.nonce || payload.email_verified !== true ||
        typeof payload.email !== 'string' || typeof payload.sub !== 'string') return redirect('google-failed');
    const user = await getOrCreateClient({ kind: 'email', value: payload.email.toLowerCase() },
      typeof payload.name === 'string' ? payload.name : undefined);
    if (!user) return redirect('client-only');
    const response = NextResponse.redirect(new URL('/client', request.url));
    response.cookies.set('inkmonk_session', await signToken({ userId: user.id, name: user.name, email: user.email, role: user.role }), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      path: '/', maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.delete('inkmonk_oauth');
    return response;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    return redirect('google-failed');
  }
}
