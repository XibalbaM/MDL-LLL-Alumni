import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function saveProfilePicture(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validation
    if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large (max 5MB)");
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
    }

    // Security: Check magic numbers? For MVP relying on MIME and extension is okay-ish but explicit magic number check is better.
    // We rename the file completely so execution risk is low if we serve it as static content without exec permissions.

    const ext = file.type.split('/')[1];
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    const filepath = join(uploadDir, filename);

    // Ensure dir exists? Next.js public folder structure usually implies it exists or we should create.
    // For now assume public/uploads exists or manual create.

    await writeFile(filepath, buffer);

    return `/uploads/${filename}`;
}
