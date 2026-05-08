import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/app/utils/session';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');

    try {
        const user: any = await decrypt(session.value);
        if (!user) throw new Error('Invalid session');
        if (user.role === 'owner') redirect('/dashboard/owner');
        else redirect('/dashboard/karyawan');
    } catch {
        redirect('/login');
    }
}
