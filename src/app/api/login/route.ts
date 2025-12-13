
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { verifyPassword, formatDateForDefaultPassword } from "@/lib/hash";
import { User } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Login Attempt:", body); // Log input
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Nom d'utilisateur et mot de passe requis" }, { status: 400 });
        }

        const [firstName, lastName] = username.split('.');

        if (!firstName || !lastName) {
            return NextResponse.json({ error: "Format invalide. Utilisez prenom.nom" }, { status: 400 });
        }

        // Fetch candidates using startsWith (SQLite CI)
        const users = await prisma.user.findMany({
            where: {
                firstName: { startsWith: firstName },
                lastName: { startsWith: lastName },
            },
        });

        console.log(`Found ${users.length} candidates for ${firstName}.${lastName}`);

        // Case-insensitive filtering
        const user = users.find((u: any) => {
            console.log(`Checking candidate: ${u.firstName}.${u.lastName} `);
            return u.firstName.toLowerCase() === firstName.toLowerCase() &&
                u.lastName.toLowerCase() === lastName.toLowerCase();
        });

        if (!user) {
            console.log("No matching user found after specific filtering.");
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
        }

        console.log(`User found: ${user.id} `);

        const session = await getSession();

        if (user.isFirstLogin) {
            // Check against Date of Birth (DDMMYYYY)
            const dobPassword = formatDateForDefaultPassword(user.dateOfBirth);
            console.log("Checking first login:", { input: password, expected: dobPassword, dob: user.dateOfBirth });

            if (password !== dobPassword) {
                return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
            }

            // Set restricted session
            session.user = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isFirstLogin: true,
            };
            session.forceUpdateToken = true;
            await session.save();

            return NextResponse.json({ redirect: "/first-login" });
        } else {
            // Normal login check
            const isValid = await verifyPassword(password, user.passwordHash);

            if (!isValid) {
                return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
            }

            // Set full session
            session.user = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isFirstLogin: false,
            };
            await session.save();

            if (user.role === 'ADMIN') {
                return NextResponse.json({ redirect: "/admin/dashboard" });
            }

            return NextResponse.json({ redirect: "/dashboard" });
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
