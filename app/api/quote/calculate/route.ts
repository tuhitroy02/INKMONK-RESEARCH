import { NextRequest, NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/pricing/catalogue';
import { z } from 'zod';

const QuoteSchema = z.object({
  language: z.enum(['EN', 'HI', 'TURNITIN']),
  workType: z.enum(['TECH', 'NON_TECH', 'NA']).optional(),
  service: z.string().min(1),
  package: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = QuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Server-side calculation — never trust client-provided price
    const result = calculateQuote({
      language: parsed.data.language,
      workType: parsed.data.workType as 'TECH' | 'NON_TECH' | undefined,
      service: parsed.data.service,
      package: parsed.data.package,
      quantity: parsed.data.quantity,
    });

    return NextResponse.json({
      success: true,
      quote: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Calculation error';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
