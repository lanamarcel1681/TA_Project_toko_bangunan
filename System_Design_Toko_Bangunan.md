# Desain Sistem - Aplikasi E-Commerce Toko Bangunan (Lumbung Jaya)

Dokumen ini mendeskripsikan rancangan sistem dari aplikasi toko bangunan yang telah dikembangkan.

## 1. Arsitektur Teknologi (Tech Stack)
*   **Frontend & Backend**: Next.js (App Router) - Fullstack Framework
*   **Database**: MySQL
*   **ORM**: Prisma
*   **Styling**: Tailwind CSS
*   **Bahasa Pemrograman**: TypeScript / JavaScript

## 2. Aktor Sistem (Role)
Sistem ini memiliki 3 aktor utama:
1.  **Pembeli (User)**: Dapat melihat katalog barang, mengelola keranjang, melakukan checkout, membayar, melacak pesanan, dan memberikan ulasan serta mengajukan retur/pembatalan.
2.  **Karyawan (Admin/Staf)**: Menangani verifikasi pembayaran, proses pengemasan, pengantaran/pengiriman, menangani retur dan pembatalan, serta melakukan presensi dan pengajuan izin.
3.  **Owner (Pemilik)**: Memantau keseluruhan laporan penjualan/pembelian, mengelola data master (karyawan, barang, supplier, persetujuan usulan barang), dan melihat stok opname.

## 3. Modul & Fungsionalitas Utama
*   **Modul Kepegawaian**: Manajemen data pegawai, pencatatan presensi harian, dan pengajuan izin cuti/sakit.
*   **Modul Inventaris (Barang & Stok)**: Pengelolaan data barang, kategori, satuan. Termasuk fitur Stok Opname untuk mencocokkan stok fisik, serta Usulan Barang baru.
*   **Modul Penjualan (E-Commerce)**: Keranjang belanja, manajemen alamat pembeli, proses transaksi (Pickup & Delivery), pembayaran dengan bukti transfer/gateway, pengiriman barang, pembatalan pesanan, dan proses pengajuan retur barang (Refund).
*   **Modul Pembelian & Supplier**: Manajemen data supplier dan pencatatan transaksi pembelian barang ke supplier (restok).
*   **Modul Interaksi Pelanggan**: Sistem ulasan dan rating pada barang yang telah dibeli (pesanan selesai).

## 4. Desain Database (Struktur Entitas Utama)

### a. Pengguna & Kepegawaian
*   **Pegawai**: Menyimpan profil staf, berelasi dengan `Jabatan`, `PresensiPegawai`, dan `PengajuanIzin`.
*   **Pembeli**: Menyimpan profil pelanggan, berelasi dengan `Alamat`, `Keranjang`, dan `TransaksiPenjualanBarang`.
*   **Supplier**: Menyimpan profil penyedia barang, berelasi dengan `TransaksiPembelianBarang` dan `UsulanBarangSupplier`.

### b. Katalog & Inventori
*   **Barang**: Entitas utama produk. Memiliki referensi ke `KategoriBarang` dan `SatuanBarang`. Terhubung ke `Keranjang` dan detail transaksi.
*   **UsulanBarang**: Pengajuan penambahan barang baru oleh pegawai ke owner.
*   **StokOpname & DetailStokOpname**: Catatan audit fisik stok barang secara berkala.

### c. Transaksi Penjualan & Order Fulfillment
*   **TransaksiPenjualanBarang**: Tabel inti pesanan pelanggan. Mencatat status pesanan, ongkos kirim, dan metode pengantaran.
*   **DetailTransaksiPenjualanBarang**: Daftar barang yang dibeli per transaksi.
*   **Pembayaran**: Mencatat tanggal dan foto bukti pembayaran dari pembeli.
*   **Pengiriman**: Mencatat status logistik (tanggal berangkat, sampai, staf kurir pengantar).
*   **PembatalanTransaksi**: Menangani alur pembatalan dan pencatatan refund.
*   **ReturTransaksi**: Menangani pengajuan retur barang, alasan, bukti foto, dan pencatatan refund apabila retur disetujui.

### d. Transaksi Pembelian (Restok)
*   **TransaksiPembelianBarang**: Pencatatan pembelian/belanja stok dari toko ke Supplier.

---
*Dokumen ini digenerate secara otomatis berdasarkan skema database (Prisma) dan struktur project.*
