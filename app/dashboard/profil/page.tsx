import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        redirect('/login');
    }

    let user = { name: 'User', role: 'employee' as 'owner' | 'employee' };
    try {
        user = JSON.parse(session.value);
    } catch {
        redirect('/login');
    }

    // Dummy user data details (Isi tetap sama yang lama)
    const userEmail = user.name.toLowerCase().replace(/\s+/g, '.') + '@bangunanku.com';
    const userPhone = '0812-3456-7890';
    const joinDate = user.role === 'owner' ? 'Januari 2020' : 'Maret 2023';

    return (
        <ProfileClient 
            userData={user}
            userEmail={userEmail}
            userPhone={userPhone}
            joinDate={joinDate}
        />
    );
}
