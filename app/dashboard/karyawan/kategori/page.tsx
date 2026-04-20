import { PrismaClient } from '@prisma/client';
import KaryawanKategoriManager from './KaryawanKategoriManager';

const prisma = new PrismaClient();

export default async function KategoriBarangPage() {
    // Fetch categories including count of associated items
    const categories = await prisma.kategoriBarang.findMany({
        include: {
            _count: {
                select: { barang: true }
            }
        },
        orderBy: {
            id_kategori_barang: 'desc'
        }
    });

    return (
        <KaryawanKategoriManager initialCategories={categories} />
    );
}
