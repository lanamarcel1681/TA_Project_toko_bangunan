import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

    // Dummy user data details
    const userRoleText = user.role === 'owner' ? 'Pemilik Toko' : 'Karyawan';
    const userEmail = user.name.toLowerCase().replace(/\s+/g, '.') + '@bangunanku.com';
    const userPhone = '0812-3456-7890';
    const joinDate = user.role === 'owner' ? 'Januari 2020' : 'Maret 2023';

    return (
        <div className="px-8 py-8 md:max-w-4xl w-full mx-auto relative pb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Profil Saya</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola informasi pribadi dan keamanan akun</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full bg-orange-100 border-4 border-white text-orange-600 flex items-center justify-center font-bold text-4xl shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Profile Header Info */}
                <div className="pt-16 pb-6 px-8 border-b border-gray-50 flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-100 text-orange-700">
                                {userRoleText}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Bergabung sejak {joinDate}
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Edit Profil
                    </button>
                </div>

                <div className="px-8 py-6 grid md:grid-cols-2 gap-8">
                    {/* Data Diri */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Informasi Pribadi</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap</label>
                                <div className="text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                    {user.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Alamat Email</label>
                                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    {userEmail}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Keamanan */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Keamanan Akun</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Kata Sandi</label>
                                <div className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                    <div className="text-sm text-gray-900 font-medium tracking-widest pl-1">
                                        ••••••••
                                    </div>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                        Ubah Sandi
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Nomor Telepon</label>
                                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    {userPhone}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
