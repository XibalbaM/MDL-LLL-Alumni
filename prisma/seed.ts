
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hashPassword, formatDateForDefaultPassword } from '../src/lib/hash'

const prisma = new PrismaClient()

async function main() {
    // Clear existing
    await prisma.connectionRequest.deleteMany({});
    await prisma.user.deleteMany({});

    // Admin User
    // DOB: 01/01/2000 -> Pwd: "01012000"
    const adminDob = new Date(2000, 0, 1);
    const adminPwd = formatDateForDefaultPassword(adminDob);
    // We store the hash of the DOB as the initial password?
    // No, logic says: if isFirstLogin, check against calculated DOB format directly, NOT hash.
    // BUT the schema says `passwordHash` is required.
    // The Login API logic: "If isFirstLogin... check against DOB... else check hash."
    // So `passwordHash` can be anything or empty for first login users?
    // Let's set it to a dummy hash or the hashed DOB just in case logic changes.
    const adminHash = await hashPassword(adminPwd);

    await prisma.user.create({
        data: {
            firstName: 'Admin',
            lastName: 'MDL',
            email: 'admin@mdl.fr', // Placeholder, will be updated on first login
            passwordHash: adminHash,
            dateOfBirth: adminDob,
            promoYear: 2015,
            role: 'ADMIN',
            isFirstLogin: true,
            gdprConsent: false,
        }
    });

    // Regular User
    // DOB: 12/05/2005 -> Pwd: "12052005"
    const userDob = new Date(2005, 4, 12);
    const userPwd = formatDateForDefaultPassword(userDob);
    const userHash = await hashPassword(userPwd);

    await prisma.user.create({
        data: {
            firstName: 'Marc',
            lastName: 'Dupont',
            email: 'marc.dupont@student.fr',
            passwordHash: userHash,
            dateOfBirth: userDob,
            promoYear: 2023,
            role: 'USER',
            isFirstLogin: true,
            gdprConsent: false,
        }
    });

    // Jules Clement
    // DOB: 29/04/2008
    const julesDob = new Date(2008, 3, 29); // Month is 0-indexed: April = 3
    const julesPwd = formatDateForDefaultPassword(julesDob);
    const julesHash = await hashPassword(julesPwd);

    await prisma.user.create({
        data: {
            firstName: 'Jules',
            lastName: 'Clement',
            email: 'jules.clement@student.fr',
            passwordHash: julesHash,
            dateOfBirth: julesDob,
            promoYear: 2026,
            role: 'USER',
            isFirstLogin: true,
            gdprConsent: false,
        }
    });

    console.log("Seeding complete: Admin, Marc, Jules created.");

    console.log("Seeding complete: Admin.MDL (01012000) & Marc.Dupont (12052005) created.");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
