import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${uniqueSuffix}-${originalName}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
        
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore
        }

        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const storageLink = `/uploads/profiles/${filename}`;

        return NextResponse.json({ success: true, url: storageLink });

    } catch (e) {
        console.error('File upload error:', e);
        return NextResponse.json({ error: 'Gagal mengunggah file' }, { status: 500 });
    }
}
