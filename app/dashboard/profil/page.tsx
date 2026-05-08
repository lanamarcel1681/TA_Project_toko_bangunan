import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export default async function ProfilPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        redirect('/login');
    }

    let userSession: any;
    try {
        userSession = await decrypt(session.value);
        if (!userSession) throw new Error('Invalid session');
    } catch {
        redirect('/login');
    }

    const employee = await prisma.pegawai.findUnique({
        where: { id_pegawai: userSession.id },
        include: { jabatan: true }
    });

    if (!employee) {
        redirect('/login');
    }

    // Tentukan role berdasarkan id_jabatan (1 biasanya Owner) atau nama jabatan
    const role = (employee.id_jabatan === 1 || employee.jabatan.nama_jabatan.toLowerCase().includes('pemilik')) 
        ? 'owner' 
        : 'employee';

    return (
        <ProfileClient 
            userData={{
                id: employee.id_pegawai,
                name: employee.nama_pegawai,
                role: role
            }}
            userEmail={employee.email_pegawai}
            userPhone={employee.nomor_telepon}
            joinDate="Januari 2024"
            birthDate={employee.tanggal_lahir}
        />
    );
}
