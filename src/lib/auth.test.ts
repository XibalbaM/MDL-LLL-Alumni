import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword, formatDateForDefaultPassword } from '@/lib/hash';
import { POST as LoginPOST } from '@/app/api/login/route';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findFirst: vi.fn(),
        },
    },
}));

// Mock Session
vi.mock('@/lib/session', () => ({
    getSession: vi.fn(),
}));

describe('Authentication Utils', () => {
    it('should hash and verify passwords correctly', async () => {
        const password = 'mySecretPassword';
        const hash = await hashPassword(password);

        expect(await verifyPassword(password, hash)).toBe(true);
        expect(await verifyPassword('wrong', hash)).toBe(false);
    });

    it('should format default password from DOB correctly', () => {
        // 13 Dec 2000
        const date = new Date(2000, 11, 13);
        const formatted = formatDateForDefaultPassword(date);
        expect(formatted).toBe('13122000');
    });
});

describe('Login API', () => {
    const mockSave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (getSession as any).mockResolvedValue({
            save: mockSave,
            user: undefined,
            forceUpdateToken: undefined
        });
    });

    it('should reject missing credentials', async () => {
        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        const res = await LoginPOST(req as any);
        expect(res.status).toBe(400);
    });

    it('should handle First Login with DOB correctly', async () => {
        const dob = new Date(2005, 4, 12); // 12 May 2005
        (prisma.user.findFirst as any).mockResolvedValue({
            id: '123',
            firstName: 'Marc',
            lastName: 'Dupont',
            isFirstLogin: true,
            dateOfBirth: dob,
            role: 'USER',
            passwordHash: 'irrelevant_hash'
        });

        // Correct DOB password: 12052005
        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({ username: 'marc.dupont', password: '12052005' }),
        });

        const res = await LoginPOST(req as any);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.redirect).toBe('/first-login');
        expect(mockSave).toHaveBeenCalled();
        // Verify session was set with forceUpdateToken
        const session = await getSession(); // Mock returns the object we modified
        expect(session.forceUpdateToken).toBe(true);
    });

    it('should fail First Login with wrong DOB', async () => {
        const dob = new Date(2005, 4, 12);
        (prisma.user.findFirst as any).mockResolvedValue({
            id: '123',
            firstName: 'Marc',
            lastName: 'Dupont',
            isFirstLogin: true,
            dateOfBirth: dob,
        });

        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({ username: 'marc.dupont', password: 'wrongpassword' }),
        });

        const res = await LoginPOST(req as any);
        expect(res.status).toBe(401);
    });
});
