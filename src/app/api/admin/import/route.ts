import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hashPassword, formatDateForDefaultPassword } from "@/lib/hash";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

        const text = await file.text();
        const lines = text.split('\n').filter(l => l.trim().length > 0);

        // Skip header if present (Assumption: Heuristic check or explicit rule)
        const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;

        const results = {
            total: 0,
            success: 0,
            errors: [] as string[]
        };

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            // Basic CSV split, assumes no commas in fields for now (MVP)
            const [firstName, lastName, email, dobRaw, promoRaw] = line.split(',').map(s => s.trim());

            results.total++;

            if (!email || !dobRaw) {
                results.errors.push(`Line ${i + 1}: Missing fields`);
                continue;
            }

            try {
                // Parse DOB DD/MM/YYYY
                const [d, m, y] = dobRaw.split('/').map(Number);
                const dob = new Date(y, m - 1, d);
                if (isNaN(dob.getTime())) throw new Error("Invalid Date");

                const password = formatDateForDefaultPassword(dob);
                const hash = await hashPassword(password);

                await prisma.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        dateOfBirth: dob,
                        passwordHash: hash,
                        promoYear: parseInt(promoRaw || '0'),
                        role: 'USER',
                        isFirstLogin: true,
                        gdprConsent: false
                    }
                });
                results.success++;
            } catch (e: any) {
                if (e.code === 'P2002') {
                    results.errors.push(`Line ${i + 1}: Email ${email} already exists`);
                } else {
                    results.errors.push(`Line ${i + 1}: ${e.message}`);
                }
            }
        }

        return NextResponse.json(results);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
