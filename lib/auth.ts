/**
 * InkMonk Research — Authentication Utilities
 * JWT-based auth using jose (Edge Runtime compatible)
 * Role-based access: CLIENT | STAFF | ADMIN
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function sessionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || (process.env.NODE_ENV === 'production' &&
      (secret.length < 32 || secret.startsWith('replace-with-') || secret.startsWith('local-build-')))) {
    throw new Error('Set a unique JWT_SECRET (at least 32 characters in production).');
  }
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(sessionKey());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, sessionKey());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('inkmonk_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireRole(role: 'CLIENT' | 'STAFF' | 'ADMIN'): Promise<JWTPayload> {
  const session = await requireSession();
  const roleHierarchy = { CLIENT: 1, STAFF: 2, ADMIN: 3 };
  if ((roleHierarchy[session.role as keyof typeof roleHierarchy] ?? 0) < roleHierarchy[role]) {
    throw new Error('Forbidden');
  }
  return session;
}
