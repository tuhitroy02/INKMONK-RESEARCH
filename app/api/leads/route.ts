import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const LeadSchema = z.object({
  channel: z.enum(['MANUAL', 'CHAT']),
  language: z.enum(['EN', 'HI', 'TURNITIN']).optional(),
  domain: z.string().max(200).optional(),
  workType: z.enum(['TECH', 'NON_TECH']).optional(),
  service: z.string().max(50).optional(),
  package: z.string().max(50).optional(),
  requirements: z.string().max(5000).optional(),
  deadline: z.string().max(100).optional(),
  quantity: z.number().int().min(1).optional(),
  totalPaise: z.number().int().min(0).optional(),
  breakdown: z.string().optional(),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        ...parsed.data,
        status: 'NEW',
      },
    });

    // Analytics (no PII)
    await db.analyticsEvent.create({
      data: {
        event: 'QUOTE_COMPLETE',
        channel: parsed.data.channel,
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });

  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Could not save enquiry. Please try again.' }, { status: 500 });
  }
}

// Track WhatsApp click (no auth needed — just event tracking)
export async function PATCH(request: NextRequest) {
  try {
    const { leadId, type } = await request.json();

    if (leadId) {
      await db.lead.update({
        where: { id: leadId },
        data: { whatsAppClickedAt: new Date() },
      });
    }

    await db.analyticsEvent.create({
      data: {
        event: type === 'direct' ? 'DIRECT_CHAT_CLICK' : 'WHATSAPP_CLICK',
        channel: 'MANUAL',
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
