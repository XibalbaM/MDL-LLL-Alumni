import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const formData = await request.formData();
        const target = formData.get('target') as string;
        const promo = formData.get('promo') as string;
        const subject = formData.get('subject') as string;
        const content = formData.get('content') as string;

        let whereClause = {};
        if (target === 'promo' && promo) {
            whereClause = { promoYear: parseInt(promo) };
        } else if (target === 'admins') {
            whereClause = { role: 'ADMIN' };
        }
        // 'all' implies {}

        const users = await prisma.user.findMany({
            where: whereClause,
            select: { email: true, firstName: true }
        });

        // Simulate Sending
        console.log(`[MAILING] Sending "${subject}" to ${users.length} recipients...`);
        // Mock delay
        // await new Promise(r => setTimeout(r, 1000));

        users.forEach(u => {
            console.log(`   -> Sent to ${u.email}`);
        });

        return NextResponse.json({
            success: true,
            count: users.length,
            message: `Email queued for ${users.length} users.`
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
