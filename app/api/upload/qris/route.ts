import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload ke folder public/uploads
        // Pastikan folder ini ada, bisa dibuat manual atau otomatis.
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // Buat folder jika belum ada (opsional, untuk amannya sebaiknya folder sudah disiapkan atau ditangani fs)
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueName = `qris-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(uploadDir, uniqueName);
        
        await writeFile(path, buffer);

        return NextResponse.json({ success: true, filePath: `/uploads/${uniqueName}` });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
    }
}
