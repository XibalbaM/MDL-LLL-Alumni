import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const users = await prisma.user.findMany({
            where: {
                role: 'USER'
            },
            orderBy: {
                lastName: 'asc'
            }
        });

        const header = "Prénom,Nom,Email,Date de naissance,Promo\n";
        const rows = users.map(u => {
            const dob = new Date(u.dateOfBirth);
            const d = dob.getDate().toString().padStart(2, '0');
            const m = (dob.getMonth() + 1).toString().padStart(2, '0');
            const y = dob.getFullYear();
            const dobStr = `${d}/${m}/${y}`;

            // Handle potentially null fields cleanly, though schema says some are required, safeguard against nulls
            const promo = u.promoYear ? u.promoYear.toString() : '';

            return `${u.firstName},${u.lastName},${u.email},${dobStr},${promo}`;
        });

        const csv = header + rows.join('\n');

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="users_export.csv"'
            }
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
