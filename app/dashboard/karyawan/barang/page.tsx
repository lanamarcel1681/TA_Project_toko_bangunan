import { PrismaClient } from '@prisma/client';
import KaryawanBarangManager from './KaryawanBarangManager';

const prisma = new PrismaClient();

export default async function ManajemenBarangKaryawanPage() {
    // Fetch actual data
    const products = await prisma.barang.findMany({
        include: {
            kategori: true,
            satuan: true,
            barang_supplier: true
        },
        orderBy: {
            id_barang: 'desc'
        }
    });

    const categories = await prisma.kategoriBarang.findMany({
        orderBy: { nama_kategori: 'asc' }
    });

    const units = await prisma.satuanBarang.findMany({
        orderBy: { satuan_barang: 'asc' }
    });

    const suppliers = await prisma.supplier.findMany({
        orderBy: { nama_perusahaan_supplier: 'asc' }
    });

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20">
            <KaryawanBarangManager initialProducts={products} categories={categories} units={units} suppliers={suppliers} />
        </div>
    );
}
