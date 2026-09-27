import { NextRequest, NextResponse } from 'next/server';
import { processChat, buildWhatsAppMessage } from '@/lib/chatbot/engine';
import type { ChatState, ChatContext } from '@/lib/chatbot/engine';
import { db } from '@/lib/db';
import { z } from 'zod';

const ChatSchema = z.object({
  state: z.string(),
  userMessage: z.string().max(2000),
  context: z.record(z.string(), z.unknown()),
  sessionToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { state, userMessage, context, sessionToken } = parsed.data;

    // Process through chatbot FSM
    const turn = processChat(
      state as ChatState,
      userMessage,
      context as ChatContext,
    );

    // Save lead if contact data collected
    let leadId: string | undefined;
    if (turn.leadData && turn.leadData.email && turn.leadData.name) {
      try {
        const lead = await db.lead.create({
          data: {
            channel: 'CHAT',
            language: turn.leadData.language || undefined,
            domain: turn.leadData.domain || undefined,
            workType: turn.leadData.workType || undefined,
            service: turn.leadData.service || undefined,
            package: turn.leadData.package || undefined,
            requirements: turn.leadData.requirements || undefined,
            deadline: turn.leadData.deadline || undefined,
            quantity: turn.leadData.quantity ?? undefined,
            totalPaise: turn.leadData.totalPaise ?? undefined,
            breakdown: turn.leadData.breakdown || undefined,
            name: turn.leadData.name || undefined,
            email: turn.leadData.email || undefined,
            phone: turn.leadData.phone || undefined,
            status: 'NEW',
          },
        });
        leadId = lead.id;

        // Track analytics event (no PII)
        await db.analyticsEvent.create({
          data: { event: 'CHAT_COMPLETE', channel: 'CHAT' },
        });
      } catch (dbError) {
        console.error('Lead save error:', dbError);
        // Don't fail the chat on DB error
      }
    }

    // Build WhatsApp URL if in SUMMARY or DONE state
    let whatsappUrl: string | undefined;
    let whatsappDirectUrl: string | undefined;
    if (turn.nextState === 'SUMMARY' || turn.nextState === 'DONE') {
      const waMsg = buildWhatsAppMessage(turn.context);
      whatsappUrl = `https://wa.me/917980470880?text=${waMsg}`;
      whatsappDirectUrl = `https://wa.me/917980470880`;
    }

    return NextResponse.json({
      success: true,
      botMessage: turn.botMessage,
      nextState: turn.nextState,
      options: turn.options,
      context: turn.context,
      leadId,
      whatsappUrl,
      whatsappDirectUrl,
    });

  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Chat service unavailable. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}

// Track WhatsApp click
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
        channel: 'CHAT',
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
