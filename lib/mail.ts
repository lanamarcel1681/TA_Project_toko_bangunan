import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string, attachments?: any[]) => {
    try {
        const info = await transporter.sendMail({
            from: `"Toko Bangunan Lumbung Jaya" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

export const EmailTemplates = {
    paymentVerified: (customerName: string, invoice: string, amount: string, isPickup: boolean) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Pembayaran Berhasil Diverifikasi</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Terima kasih atas pembayaran Anda untuk pesanan <strong>${invoice}</strong> sebesar <strong>Rp ${amount}</strong>.</p>
            <p>Pembayaran Anda telah berhasil kami verifikasi. ${isPickup
            ? '<strong>Pesanan Anda sudah Siap Diambil di Toko Bangunan Lumbung Jaya!</strong> Silakan datang pada jam operasional kami.'
            : 'Pesanan Anda sedang kami proses dan masuk ke tahap pengemasan.'}</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    orderShipped: (customerName: string, invoice: string, driverName: string, eta: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2196F3;">Pesanan Anda Sedang Dikirim!</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Pesanan Anda dengan nomor <strong>${invoice}</strong> sedang dalam perjalanan menuju lokasi Anda.</p>
            <p>Kurir kami, <strong>${driverName}</strong>, diperkirakan akan tiba dalam <strong>${eta}</strong>.</p>
            <br>
            <p>Harap bersiap untuk menerima pesanan Anda.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    orderArrived: (customerName: string, invoice: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Pesanan Telah Sampai</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Pesanan Anda dengan nomor <strong>${invoice}</strong> telah berhasil dikirimkan ke alamat Anda.</p>
            <p>Terima kasih telah berbelanja di Toko kami. Kami harap Anda puas dengan layanan kami.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    orderPickedUp: (customerName: string, invoice: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Pesanan Telah Diambil</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Terima kasih telah melakukan pengambilan pesanan <strong>${invoice}</strong> di toko kami.</p>
            <p>Terima kasih telah berbelanja di Toko Bangunan Lumbung Jaya. Kami harap Anda puas dengan layanan kami.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    refundCompleted: (customerName: string, invoice: string, amount: string, proofUrl: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF9800;">Proses Pengembalian Dana (Refund) Selesai</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Pengajuan retur Anda untuk pesanan <strong>${invoice}</strong> telah selesai diproses.</p>
            <p>Kami telah mentransfer pengembalian dana sebesar <strong>Rp ${amount}</strong> ke rekening yang Anda berikan. Berikut adalah bukti transfernya:</p>
            <div style="text-align: center; margin: 20px 0;">
                <img src="${proofUrl}" alt="Bukti Transfer" style="max-width: 100%; border-radius: 8px; border: 1px solid #eee;" />
            </div>
            <p>Silakan cek mutasi rekening Anda atau periksa bukti transfer di dashboard Anda.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    orderCreatedCash: (customerName: string, invoice: string, amount: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF9800;">Pesanan Berhasil Dibuat (Menunggu Pembayaran)</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Terima kasih telah melakukan pemesanan di Toko Bangunan Lumbung Jaya.</p>
            <p>Pesanan Anda dengan nomor <strong>${invoice}</strong> telah kami terima. Karena Anda memilih metode pembayaran <strong>Tunai (Cash)</strong>, silakan datang langsung ke toko kami untuk melakukan pembayaran sebesar <strong>Rp ${amount}</strong> sekaligus mengambil pesanan Anda.</p>
            <br>
            <p>Harap tunjukkan nomor invoice ini atau email ini kepada kasir kami.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    passwordResetRequest: (customerName: string, resetLink: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #F44336;">Permintaan Reset Password</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset password akun Anda di Toko Bangunan Lumbung Jaya.</p>
            <p>Silakan klik tombol di bawah ini untuk membuat password baru. Tautan ini hanya berlaku selama 15 menit.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #F44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Atur Ulang Password</a>
            </div>
            <p>Jika Anda tidak meminta reset password, silakan abaikan email ini.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    passwordResetSuccess: (customerName: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Password Berhasil Diubah</h2>
            <p>Halo <strong>${customerName}</strong>,</p>
            <p>Password akun Anda di Toko Bangunan Lumbung Jaya telah berhasil diubah.</p>
            <p>Jika bukan Anda yang melakukan perubahan ini, harap segera hubungi kami karena akun Anda mungkin dalam bahaya.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Toko Bangunan Lumbung Jaya</strong></p>
        </div>
    `,
    transactionReceipt: (
        customerName: string,
        invoice: string,
        tanggal: string,
        items: { nama: string; jumlah: number; harga_satuan: number; subtotal: number }[],
        ongkosKirim: number,
        totalBayar: number,
        metodePengantaran: string
    ) => {
        const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;
        const itemRows = items.map(item => `
            <tr>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151;">${item.nama}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151; text-align:center;">${item.jumlah}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151; text-align:right;">${formatRp(item.harga_satuan)}</td>
                <td style="padding:10px 12px; border-bottom:1px solid #f3f4f6; font-size:14px; font-weight:bold; color:#111827; text-align:right;">${formatRp(item.subtotal)}</td>
            </tr>
        `).join('');

        const isDelivery = metodePengantaran === 'Diantar ke Rumah';

        return `
        <!DOCTYPE html>
        <html lang="id">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                <!-- Header -->
                <div style="background:linear-gradient(135deg,#ea580c 0%,#f97316 100%);padding:36px 40px;">
                    <table width="100%">
                        <tr>
                            <td>
                                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.75);">NOTA PEMBELIAN</p>
                                <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">TB. Lumbung Jaya</h1>
                            </td>
                            <td style="text-align:right;">
                                <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 16px;display:inline-block;">
                                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.8);">No. Transaksi</p>
                                    <p style="margin:4px 0 0;font-size:14px;font-weight:900;color:#ffffff;letter-spacing:1px;">${invoice}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Body -->
                <div style="padding:36px 40px;">
                    <!-- Greeting -->
                    <p style="margin:0 0 8px;font-size:16px;color:#374151;">Halo, <strong style="color:#111827;">${customerName}</strong> 👋</p>
                    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">
                        Transaksi Anda telah <strong style="color:#16a34a;">berhasil diselesaikan</strong>. Berikut adalah nota pembelian Anda. Simpan email ini sebagai bukti transaksi resmi.
                    </p>

                    <!-- Info Row -->
                    <table width="100%" style="margin-bottom:28px;">
                        <tr>
                            <td style="width:50%;padding:14px;background:#f9fafb;border-radius:10px 0 0 10px;border:1px solid #f3f4f6;border-right:none;">
                                <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Tanggal Transaksi</p>
                                <p style="margin:0;font-size:13px;font-weight:700;color:#111827;">${tanggal}</p>
                            </td>
                            <td style="width:50%;padding:14px;background:#f9fafb;border-radius:0 10px 10px 0;border:1px solid #f3f4f6;">
                                <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Metode Pengantaran</p>
                                <p style="margin:0;font-size:13px;font-weight:700;color:${isDelivery ? '#2563eb' : '#16a34a'};">
                                    ${isDelivery ? '🚚 Diantar ke Rumah' : '🏪 Ambil di Toko'}
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- Items Table -->
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;">Detail Barang</p>
                    <table width="100%" style="border-collapse:collapse;border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                        <thead>
                            <tr style="background:#f9fafb;">
                                <th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Produk</th>
                                <th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;text-align:center;border-bottom:1px solid #e5e7eb;">Qty</th>
                                <th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb;">Harga</th>
                                <th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;text-align:right;border-bottom:1px solid #e5e7eb;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${itemRows}</tbody>
                    </table>

                    <!-- Totals -->
                    <table width="100%" style="margin-bottom:32px;">
                        ${ongkosKirim > 0 ? `
                        <tr>
                            <td style="padding:6px 0;font-size:14px;color:#6b7280;">Ongkos Kirim</td>
                            <td style="padding:6px 0;font-size:14px;color:#374151;text-align:right;">${formatRp(ongkosKirim)}</td>
                        </tr>` : ''}
                        <tr>
                            <td style="padding:14px 0 0;font-size:16px;font-weight:900;color:#111827;border-top:2px solid #f3f4f6;">Total Pembayaran</td>
                            <td style="padding:14px 0 0;font-size:18px;font-weight:900;color:#ea580c;text-align:right;border-top:2px solid #f3f4f6;">${formatRp(totalBayar)}</td>
                        </tr>
                    </table>

                    <!-- Thank You Banner -->
                    <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa;border-radius:12px;padding:20px 24px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 4px;font-size:18px;">🎉</p>
                        <p style="margin:0 0 4px;font-size:15px;font-weight:800;color:#c2410c;">Terima kasih telah berbelanja!</p>
                        <p style="margin:0;font-size:13px;color:#9a3412;">Kami senang melayani Anda di Toko Bangunan Lumbung Jaya.</p>
                    </div>

                    <!-- Footer Note -->
                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;text-align:center;">
                        Jika ada pertanyaan mengenai pesanan Anda, hubungi kami melalui WhatsApp atau kunjungi toko kami langsung.<br>
                        <strong style="color:#374151;">Toko Bangunan Lumbung Jaya</strong>
                    </p>
                </div>

                <!-- Footer Bar -->
                <div style="background:#1f2937;padding:20px 40px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#6b7280;">© ${new Date().getFullYear()} TB. Lumbung Jaya · Nota ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
};

export const getAdminEmails = async (role: 'owner' | 'karyawan') => {
    try {
        const pegawai = await prisma.pegawai.findMany({
            where: { status_pegawai: 'Aktif' },
            include: { jabatan: true }
        });
        
        return pegawai.filter(p => {
            const isOwner = p.id_jabatan === 1 || p.jabatan.nama_jabatan.toLowerCase().includes('pemilik');
            return role === 'owner' ? isOwner : !isOwner;
        }).map(p => p.email_pegawai);
    } catch (e) {
        console.error("Error fetching admin emails:", e);
        return [];
    }
};

export const InternalEmailTemplates = {
    lowStockNotification: (itemName: string, currentStock: number) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #F44336;">Peringatan Stok Menipis</h2>
            <p>Sistem mendeteksi bahwa stok untuk barang berikut telah mencapai batas minimum (<= 10):</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nama Barang</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${itemName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Sisa Stok</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd; color: red;"><strong>${currentStock}</strong></td>
                </tr>
            </table>
            <br>
            <p>Segera lakukan pemesanan ulang (Purchase Order) kepada Supplier.</p>
        </div>
    `,
    newOrderNotification: (invoice: string, amount: string, paymentMethod: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2196F3;">Pesanan Baru Masuk</h2>
            <p>Ada pesanan baru yang membutuhkan perhatian Anda:</p>
            <ul>
                <li><strong>No Transaksi:</strong> ${invoice}</li>
                <li><strong>Total Tagihan:</strong> Rp ${amount}</li>
                <li><strong>Metode Pembayaran:</strong> ${paymentMethod}</li>
            </ul>
            <p>${paymentMethod === 'CASH' ? 'Menunggu pembeli datang ke toko untuk membayar Tunai.' : 'Harap segera cek dan <strong>verifikasi pembayaran</strong> di Dashboard Karyawan jika bukti transfer sudah dilampirkan.'}</p>
        </div>
    `,
    newReturnRefundNotification: (invoice: string, type: 'Retur' | 'Batal', reason: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #FF9800;">Pengajuan ${type} Baru</h2>
            <p>Seorang pembeli baru saja mengajukan <strong>${type}</strong> untuk pesanan:</p>
            <ul>
                <li><strong>No Transaksi:</strong> ${invoice}</li>
                <li><strong>Alasan:</strong> ${reason}</li>
            </ul>
            <p>Silakan segera tinjau permintaan ini di Dashboard Karyawan untuk melakukan *Approve* atau *Reject*.</p>
        </div>
    `,
    deliveryAssignedNotification: (invoice: string, customerName: string, address: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Penugasan Pengiriman Baru</h2>
            <p>Anda telah ditugaskan untuk melakukan pengiriman pesanan berikut:</p>
            <ul>
                <li><strong>No Transaksi:</strong> ${invoice}</li>
                <li><strong>Nama Pembeli:</strong> ${customerName}</li>
                <li><strong>Alamat Tujuan:</strong> ${address}</li>
            </ul>
            <p>Pastikan barang diserahkan dengan aman. Jangan lupa konfirmasi <strong>"Selesai"</strong> di Dashboard Karyawan setelah barang diterima oleh pelanggan.</p>
        </div>
    `
};
