import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await requireRole('STAFF');

    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const stats = {
      totalLeads: await db.lead.count(),
      newLeads: await db.lead.count({ where: { status: 'NEW' } }),
      contactedLeads: await db.lead.count({ where: { status: 'CONTACTED' } }),
      convertedLeads: await db.lead.count({ where: { status: 'CONVERTED' } }),
      chatLeads: await db.lead.count({ where: { channel: 'CHAT' } }),
      manualLeads: await db.lead.count({ where: { channel: 'MANUAL' } }),
    };

    return NextResponse.json({ success: true, leads, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole('STAFF');
    const { id, status, notes } = await request.json();

    const updated = await db.lead.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
