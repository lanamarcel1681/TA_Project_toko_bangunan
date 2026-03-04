export interface User {
    name: string;
    role: 'owner' | 'employee';
    email: string;
}

const DUMMY_USERS = [
    {
        email: 'pemilik@bangunan.com',
        password: 'pemilik123',
        name: 'Pemilik Toko',
        role: 'owner' as const,
    },
    {
        email: 'karyawan@bangunan.com',
        password: 'karyawan123',
        name: 'Budi Santoso',
        role: 'employee' as const,
    },
];

export function verifyCredentials(email: string, password: string): User | null {
    const user = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password
    );
    if (!user) return null;
    return { name: user.name, role: user.role, email: user.email };
}
