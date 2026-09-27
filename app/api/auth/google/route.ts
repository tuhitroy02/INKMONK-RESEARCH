import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET || !redirectUri) {
    return NextResponse.redirect(new URL('/login?error=google-unavailable', request.url));
  }
  const state = randomBytes(24).toString('base64url');
  const nonce = randomBytes(24).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri,
    response_type: 'code', scope: 'openid email profile', state, nonce,
    code_challenge: challenge, code_challenge_method: 'S256' }).toString();
  const response = NextResponse.redirect(url);
  response.cookies.set('inkmonk_oauth', Buffer.from(JSON.stringify({ state, nonce, verifier })).toString('base64url'), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 600,
  });
  return response;
}
