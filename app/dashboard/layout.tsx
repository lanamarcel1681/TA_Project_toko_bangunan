import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from '../components/DashboardLayoutClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        redirect('/login');
    }

    let user = { name: 'User', role: 'owner' as 'owner' | 'employee' };
    try {
        user = JSON.parse(session.value);
    } catch {
        redirect('/login');
    }

    return (
        <DashboardLayoutClient userName={user.name} role={user.role as 'owner' | 'employee'}>
            {children}
        </DashboardLayoutClient>
    );
}
