import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export function normalizeIdentifier(value: unknown): { kind: 'email' | 'phone'; value: string } | null {
  if (typeof value !== 'string') return null;
  const input = value.trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) && input.length <= 254) {
    return { kind: 'email', value: input };
  }
  const compact = input.replace(/[\s()-]/g, '');
  const phone = /^\d{10}$/.test(compact) ? `+91${compact}` : compact;
  if (/^\+[1-9]\d{7,14}$/.test(phone)) return { kind: 'phone', value: phone };
  return null;
}

export function authHash(value: string): string {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return createHmac('sha256', process.env.JWT_SECRET).update(value).digest('hex');
}

export async function allowRate(key: string, max: number, durationMs: number): Promise<boolean> {
  const id = authHash(key);
  const now = new Date();
  const record = await db.authRateLimit.findUnique({ where: { key: id } });
  if (!record || record.resetAt <= now) {
    await db.authRateLimit.upsert({
      where: { key: id },
      create: { key: id, count: 1, resetAt: new Date(now.getTime() + durationMs) },
      update: { count: 1, resetAt: new Date(now.getTime() + durationMs) },
    });
    return true;
  }
  if (record.count >= max) return false;
  await db.authRateLimit.update({ where: { key: id }, data: { count: { increment: 1 } } });
  return true;
}

export async function clientSession(user: { id: string; name: string; email: string; role: string }) {
  const token = await signToken({ userId: user.id, name: user.name, email: user.email, role: user.role });
  const response = NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
  response.cookies.set('inkmonk_session', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}

export async function getOrCreateClient(identifier: { kind: 'email' | 'phone'; value: string }, name?: string) {
  const user = identifier.kind === 'email'
    ? await db.user.findUnique({ where: { email: identifier.value } })
    : await db.user.findUnique({ where: { phone: identifier.value } });
  if (user) {
    if (user.role !== 'CLIENT' || user.status !== 'ACTIVE') return null;
    return user;
  }
  return db.user.create({ data: {
    email: identifier.kind === 'email' ? identifier.value : `${identifier.value.slice(1)}@phone.inkmonk.invalid`,
    phone: identifier.kind === 'phone' ? identifier.value : null,
    name: name?.trim().slice(0, 100) || (identifier.kind === 'phone' ? 'Client' : identifier.value.split('@')[0]),
    provider: identifier.kind === 'phone' ? 'phone_otp' : 'email_otp', role: 'CLIENT',
  } });
}
