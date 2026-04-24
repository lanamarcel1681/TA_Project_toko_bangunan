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
    `
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
