import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/utils/hash';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const pegawai = await prisma.pegawai.findMany({
            include: {
                jabatan: true
            },
            orderBy: {
                id_pegawai: 'desc'
            }
        });
        return NextResponse.json(pegawai);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Gagal memanggil data karyawan' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            nama_pegawai, 
            id_jabatan, 
            tanggal_lahir, 
            nomor_telepon, 
            email_pegawai, 
            password_pegawai 
        } = body;

        if (!nama_pegawai || !id_jabatan || !email_pegawai || !password_pegawai) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        if (!email_pegawai.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Gagal! Hanya email @gmail.com yang diizinkan.' }, { status: 400 });
        }

        const phoneRegex = /^\d{10,12}$/;
        if (!phoneRegex.test(nomor_telepon)) {
            return NextResponse.json({ error: 'Nomor telepon harus terdiri dari 10 hingga 12 digit angka.' }, { status: 400 });
        }

        const newPegawai = await prisma.pegawai.create({
            data: {
                nama_pegawai,
                id_jabatan: parseInt(id_jabatan),
                tanggal_lahir,
                nomor_telepon,
                email_pegawai,
                password_pegawai: hashPassword(password_pegawai),
                status_pegawai: 'Aktif'
            },
            include: {
                jabatan: true
            }
        });

        return NextResponse.json(newPegawai);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Gagal membuat data karyawan' }, { status: 500 });
    }
}
