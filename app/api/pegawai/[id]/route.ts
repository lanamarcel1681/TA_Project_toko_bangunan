import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        const body = await request.json();
        const { 
            nama_pegawai, 
            id_jabatan, 
            tanggal_lahir, 
            nomor_telepon, 
            email_pegawai, 
            status_pegawai 
        } = body;

        const phoneRegex = /^\d{10,12}$/;
        if (nomor_telepon && !phoneRegex.test(nomor_telepon)) {
            return NextResponse.json({ error: 'Nomor telepon harus terdiri dari 10 hingga 12 digit angka.' }, { status: 400 });
        }

        const updated = await prisma.pegawai.update({
            where: { id_pegawai: id },
            data: {
                nama_pegawai,
                id_jabatan: parseInt(id_jabatan),
                tanggal_lahir,
                nomor_telepon,
                email_pegawai,
                status_pegawai
            },
            include: {
                jabatan: true
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Gagal memperbarui data karyawan' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        const body = await request.json();
        const { status_pegawai } = body;

        const updated = await prisma.pegawai.update({
            where: { id_pegawai: id },
            data: { status_pegawai },
            include: {
                jabatan: true
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Gagal merubah status karyawan' }, { status: 500 });
    }
}
