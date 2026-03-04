import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');

    try {
        const user = JSON.parse(session.value);
        if (user.role === 'owner') redirect('/dashboard/owner');
        else redirect('/dashboard/karyawan');
    } catch {
        redirect('/login');
    }
}
