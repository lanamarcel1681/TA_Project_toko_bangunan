import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'customer') {
            return NextResponse.json({ error: 'Hanya pembeli yang dapat melakukan checkout' }, { status: 403 });
        }

        const formData = await request.formData();
        const metodePengiriman = formData.get('metodePengiriman') as string;
        const metodePembayaran = formData.get('metodePembayaran') as string;
        const ongkosKirim = parseFloat(formData.get('ongkosKirim') as string || '0');
        const catatan = formData.get('catatan') as string || '';
        const totalTagihan = parseFloat(formData.get('totalTagihan') as string || '0');
        const alamatTujuan = formData.get('alamatTujuan') as string || '';
        const file = formData.get('buktiPembayaran') as File | null;

        // Validation: Cash only for Pickup
        if (metodePembayaran === 'CASH' && metodePengiriman !== 'Diambil Sendiri ke Toko') {
            return NextResponse.json({ error: 'Pembayaran tunai hanya tersedia untuk metode Ambil di Toko' }, { status: 400 });
        }

        let storageLink = '';

        if (metodePembayaran === 'CASH') {
            storageLink = 'BAYAR_DI_TOKO';
        } else {
            if (!file) {
                return NextResponse.json({ error: 'Bukti pembayaran wajib diunggah untuk metode ini' }, { status: 400 });
            }

            // 3. Handle File Upload
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'payments');

            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (e) { }

            const filePath = join(uploadDir, filename);
            await writeFile(filePath, buffer);
            storageLink = `/uploads/payments/${filename}`;
        }

        // 1. Fetch Cart Items
        const cartItems = await prisma.keranjang.findMany({
            where: { id_pembeli: user.id },
            include: { barang: true }
        });

        if (cartItems.length === 0) {
            return NextResponse.json({ error: 'Keranjang Anda kosong' }, { status: 400 });
        }

        // 2. Validate Stock & Determine Wholesale Status
        // 2. Validate Stock & Determine Discount Status
        const subtotalOriginal = cartItems.reduce((sum, item) => sum + item.barang.harga_barang * item.jumlah_barang, 0);
        const isWholesale = cartItems.some(item => item.jumlah_barang > 10);

        let baseDiscountRate = 0;
        if (isWholesale) {
            baseDiscountRate = 0.02; // Wholesale discount
        } else if (subtotalOriginal > 1000000) {
            baseDiscountRate = 0.10; // Retail big spender discount
        }

        for (const item of cartItems) {
            if (item.barang.stok_barang < item.jumlah_barang) {
                return NextResponse.json({
                    error: `Stok barang "${item.barang.nama_barang}" tidak mencukupi (Tersisa: ${item.barang.stok_barang})`
                }, { status: 400 });
            }
        }

        // 4. Prisma Transaction
        const lowStockItems: { name: string, stock: number }[] = [];
        const result = await prisma.$transaction(async (tx) => {
            // Generate Transaction Number (INV-YYYYMMDD-XXXX)
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
            const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
            const noTransaksi = `INV-${dateStr}-${randomStr}`;

            // a. Create TransaksiPenjualan_Barang
            const transaksi = await tx.transaksiPenjualanBarang.create({
                data: {
                    no_transaksi: noTransaksi,
                    id_pembeli: user.id,
                    tanggal_penjualan: now,
                    ongkos_kirim: ongkosKirim,
                    status_penjualan: 'Menunggu Verifikasi Pembayaran',
                    metode_pengantaran: metodePengiriman,
                }
            });

            // b. Create Detail Records & Update Stock
            for (const item of cartItems) {
                const itemTotalOriginal = item.barang.harga_barang * item.jumlah_barang;
                let itemRate = baseDiscountRate;
                if (item.jumlah_barang > 50) {
                    itemRate += 0.05; // Additional 5% for items > 50
                }
                const itemTotalFinal = itemTotalOriginal * (1 - itemRate);

                await tx.detailTransaksiPenjualanBarang.create({
                    data: {
                        id_transaksipenjualan: transaksi.id_transaksipenjualan,
                        id_barang: item.id_barang,
                        jumlah_penjualan_barang: item.jumlah_barang,
                        total_harga: itemTotalFinal
                    }
                });

                // DEDUCT STOCK
                const updatedBarang = await tx.barang.update({
                    where: { id_barang: item.id_barang },
                    data: {
                        stok_barang: {
                            decrement: item.jumlah_barang
                        }
                    }
                });

                if (updatedBarang.stok_barang <= 10) {
                    lowStockItems.push({ name: updatedBarang.nama_barang, stock: updatedBarang.stok_barang });
                }
            }

            // c. Create Pembayaran
            await tx.pembayaran.create({
                data: {
                    id_transaksipenjualan: transaksi.id_transaksipenjualan,
                    tanggal_pembayaran: now,
                    foto_bukti_pembayaran: storageLink,
                    status_pembayaran: metodePembayaran === 'CASH' ? 'Belum Bayar' : 'Menunggu Verifikasi'
                }
            });


            // d. Create Pengiriman if needed
            if (metodePengiriman === 'Diantar ke Rumah') {
                await tx.pengiriman.create({
                    data: {
                        id_transaksipenjualan: transaksi.id_transaksipenjualan,
                        status_pengiriman: 'Menunggu Pengemasan',
                        catatan_pengiriman: catatan,
                        alamat_tujuan: alamatTujuan
                    }
                });
            }

            // e. Clear Cart
            await tx.keranjang.deleteMany({
                where: { id_pembeli: user.id }
            });

            return transaksi;
        });

        const { sendEmail, getAdminEmails, InternalEmailTemplates, EmailTemplates } = await import('@/lib/mail');

        // Send internal emails
        const ownerEmails = await getAdminEmails('owner');
        const karyawanEmails = await getAdminEmails('karyawan');
        const allAdminEmails = [...ownerEmails, ...karyawanEmails];

        // 1. Low Stock Notification
        if (lowStockItems.length > 0) {
            for (const item of lowStockItems) {
                for (const email of allAdminEmails) {
                    await sendEmail(email, `Peringatan Stok Menipis - ${item.name}`, InternalEmailTemplates.lowStockNotification(item.name, item.stock));
                }
            }
        }

        // 2. New Order Notification (To Karyawan only)
        for (const email of karyawanEmails) {
            await sendEmail(email, `Pesanan Baru Masuk - ${result.no_transaksi}`, InternalEmailTemplates.newOrderNotification(result.no_transaksi, totalTagihan.toLocaleString('id-ID'), metodePembayaran));
        }

        // Send email for CASH payment (to Customer)
        if (metodePembayaran === 'CASH') {
            await sendEmail(
                user.email,
                `Menunggu Pembayaran Tunai - ${result.no_transaksi}`,
                EmailTemplates.orderCreatedCash(user.name, result.no_transaksi, totalTagihan.toLocaleString('id-ID'))
            );
        }

        return NextResponse.json({ 
            success: true, 
            transaksiId: result.id_transaksipenjualan,
            no_transaksi: result.no_transaksi 
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan saat memproses pesanan' }, { status: 500 });
    }
}
