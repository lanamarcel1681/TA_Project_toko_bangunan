# UI/UX Design System - E-Commerce Toko Bangunan (Lumbung Jaya)

Dokumen ini memuat panduan gaya antarmuka pengguna (UI) dan alur pengalaman pengguna (UX) yang diterapkan di dalam aplikasi.

## 1. Panduan Gaya (UI Style Guide)

### a. Warna (Color Palette)
Sistem menggunakan palet warna dari Tailwind CSS dengan tujuan memberikan nuansa profesional, bersih, dan mudah dibaca:
*   **Warna Latar (Background)**: `bg-gray-50` (Abu-abu terang untuk latar halaman agar tidak menyilaukan), `bg-white` (untuk card/kontainer).
*   **Warna Teks Utama**: `text-gray-800` (Abu-abu sangat gelap, lebih nyaman di mata dibanding hitam pekat).
*   **Warna Aksen (Brand/Action)**:
    *   **Sukses & Selesai**: `teal-600` (Teks) & `teal-100` (Background) - Digunakan untuk pesanan selesai, retur disetujui, refund selesai.
    *   **Peringatan & Proses**: `orange-600` (Teks) & `orange-100` (Background) - Digunakan untuk status pending, menunggu verifikasi, sedang dikirim.
    *   **Kesalahan & Pembatalan**: `red-500` / `red-600` - Digunakan untuk pesanan batal atau pesan error.

### b. Tipografi (Typography)
*   **Font Family**: *Sans-Serif* (Diatur menggunakan font **Poppins** melalui `@font-face`), yang memberikan kesan modern dan rapi.
*   **Font Weights**:
    *   `font-black` atau `font-bold` dengan `uppercase` dan `tracking-widest` digunakan untuk label status (badges).
    *   `font-medium` untuk teks sekunder atau deskripsi.

### c. Komponen Utama (Core Components)
1.  **Badges (Label Status)**: Sering digunakan dalam tabel pesanan atau riwayat (misalnya `[Selesai]` atau `[Menunggu Pengemasan]`). Desain badge biasanya menggunakan teks ukuran kecil (`text-[9px]` atau `text-xs`), tebal (`font-black`), huruf kapital (`uppercase`), dan padding kecil (`px-2 py-0.5 rounded-full`).
2.  **Tabel Data**: Digunakan di *Dashboard* Karyawan/Owner untuk menampilkan daftar pesanan, stok, atau data presensi. Dilengkapi dengan filter interaktif.
3.  **Cards**: Digunakan untuk menampilkan produk di halaman utama atau rincian keranjang belanja. Memberikan separasi visual dari latar belakang `gray-50`.
4.  **Toast Notification**: Menggunakan komponen toast untuk memberikan umpan balik (feedback) instan ketika aksi (seperti "Pengiriman Diselesaikan") berhasil dilakukan (`toast.success` dsb).
5.  **Modal/Dialog**: Digunakan untuk aksi konfirmasi (misalnya saat karyawan ingin mengubah status pesanan).

---

## 2. Alur Pengalaman Pengguna (UX Flows)

### a. UX Flow: Pembeli (User Journey)
1.  **Eksplorasi & Discovery**: Pengguna masuk ke `HeroSection` dan `FeaturedProducts` di halaman utama -> Melihat detail barang.
2.  **Add to Cart**: Pengguna menambahkan barang ke keranjang belanja. Terdapat validasi stok secara _real-time_.
3.  **Checkout & Pengantaran**: Memilih alamat tujuan dan memilih metode (Ambil di Toko / Pengantaran).
4.  **Pembayaran**: Pengguna dihadapkan pada timer batas waktu (misal untuk QRIS). Mengunggah bukti bayar atau menunggu verifikasi otomatis.
5.  **Pelacakan (Order Tracking)**: Di halaman `history-transaksi`, pengguna melihat lini masa (timeline) pesanan mereka dengan visual ikon (seperti `Package`, `Truck`, `CheckCircle`) agar progres mudah dipahami.
6.  **Purna Jual (Post-Purchase)**: Setelah barang diterima (status: Selesai), pembeli dapat memberikan ulasan (Bintang & Komentar) atau mengajukan Retur jika ada kendala.

### b. UX Flow: Karyawan (Admin/Staf)
1.  **Verifikasi (Triage)**: Staf melihat daftar pesanan baru (Menunggu Verifikasi) secara efisien melalui dashboard berbasis *Tabel*.
2.  **Proses Fulfillment**: Karyawan memproses pengemasan barang.
3.  **Pengantaran (Delivery)**: Untuk pesanan _Delivery_, kurir melihat rute dan menekan tombol konfirmasi _Selesaikan Pengiriman_ (yang akan memicu Toast sukses dan mengubah status ke "Selesai").
4.  **Pekerjaan Harian**: Staf dapat dengan mudah melakukan Presensi "Masuk" dan "Selesai", serta mengajukan Izin dari dashboard tanpa harus menemui Owner.

### c. UX Flow: Owner
1.  **Monitoring Utama**: Memiliki akses ke *Chart* (`OwnerCharts.tsx`) dan metrik bisnis harian di halaman depan dashboard Owner.
2.  **Approval (Persetujuan)**: Melihat dan menyetujui Usulan Barang Baru dari pegawai.
3.  **Pengendalian Inventaris (Stok Opname)**: Alur yang terpisah dan aman untuk melakukan pencocokan stok fisik dan sistem tanpa mengganggu transaksi berjalan.

---
*Dokumen ini merupakan panduan konseptual Desain UI/UX yang dapat dijadikan referensi ketika membuat desain ulang (redesign) di Figma atau saat mengembangkan komponen baru.*
