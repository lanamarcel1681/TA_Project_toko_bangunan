const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Buat Jabatan Owner/Pemilik
  const jabatanOwner = await prisma.jabatan.create({
    data: {
      nama_jabatan: 'Pemilik Toko',
    },
  });

  // 2. Buat Jabatan Karyawan
  const jabatanKaryawan = await prisma.jabatan.create({
    data: {
      nama_jabatan: 'Karyawan',
    },
  });

  // 3. Buat Akun Owner
  // Kita gunakan upsert agar jika di-run berulang kali tidak menyebabkan error constraint email
  const owner = await prisma.pegawai.upsert({
    where: { email_pegawai: 'owner@gmail.com' },
    update: {},
    create: {
      id_jabatan: jabatanOwner.id_jabatan,
      nama_pegawai: 'Ahmad Owner',
      tanggal_lahir: '1980-01-01',
      nomor_telepon: '081234567890',
      email_pegawai: 'owner@gmail.com',
      password_pegawai: 'owner123', // NOTE: Di aplikasi nyata, sebaiknya Anda melakukan proses hashing (seperti bcrypt) pada password ini
    },
  });

  // 4. Buat Akun Karyawan
  const karyawan = await prisma.pegawai.upsert({
    where: { email_pegawai: 'karyawan@gmail.com' },
    update: {},
    create: {
      id_jabatan: jabatanKaryawan.id_jabatan,
      nama_pegawai: 'Siti Karyawan',
      tanggal_lahir: '1995-05-05',
      nomor_telepon: '089876543210',
      email_pegawai: 'karyawan@gmail.com',
      password_pegawai: 'karyawan123', // NOTE: Di aplikasi nyata, sebaiknya Anda melakukan proses hashing (seperti bcrypt) pada password ini
    },
  });

  console.log(`Seeding finished.`);
  console.log('Owner Account:', owner);
  console.log('Karyawan Account:', karyawan);

  // 5. Seed Satuan Barang (khusus toko bangunan)
  const satuanList = [
    { id_satuan_barang: 1, satuan_barang: 'Sak' },           // Semen, pasir, dll
    { id_satuan_barang: 2, satuan_barang: 'Kg' },            // Besi, pasir eceran
    { id_satuan_barang: 3, satuan_barang: 'Ton' },           // Pasir, batu split bulk
    { id_satuan_barang: 4, satuan_barang: 'Buah' },          // Bata, genteng, keramik satuan
    { id_satuan_barang: 5, satuan_barang: 'Pcs' },           // Mur, baut, paku satuan
    { id_satuan_barang: 6, satuan_barang: 'Meter' },         // Besi beton, pipa, kayu
    { id_satuan_barang: 7, satuan_barang: 'Meter Persegi' }, // Cat tembok, keramik, triplek
    { id_satuan_barang: 8, satuan_barang: 'Meter Kubik' },   // Pasir, batu, kayu kubik
    { id_satuan_barang: 9, satuan_barang: 'Lembar' },        // Triplek, seng, GRC, kalsiboard
    { id_satuan_barang: 10, satuan_barang: 'Batang' },        // Besi beton, besi hollow, pipa
    { id_satuan_barang: 11, satuan_barang: 'Lonjor' },        // Pipa PVC, besi, kayu
    { id_satuan_barang: 12, satuan_barang: 'Kaleng' },        // Cat, thinner, waterproofing
    { id_satuan_barang: 13, satuan_barang: 'Liter' },         // Cat eceran, thinner, lem
    { id_satuan_barang: 14, satuan_barang: 'Roll' },          // Kabel listrik, kawat, geotextile
    { id_satuan_barang: 15, satuan_barang: 'Dus' },           // Keramik per dus, paku per dus
    { id_satuan_barang: 16, satuan_barang: 'Set' },           // Kunci, engsel, handle pintu
    { id_satuan_barang: 17, satuan_barang: 'Kubik' },         // Cor beton, pasir, batu
    { id_satuan_barang: 18, satuan_barang: 'Unit' },          // Pompa air, mesin, kanopi
  ];

  let satuanCount = 0;
  for (const satuan of satuanList) {
    await prisma.satuanBarang.upsert({
      where: { id_satuan_barang: satuan.id_satuan_barang },
      update: { satuan_barang: satuan.satuan_barang },
      create: {
        id_satuan_barang: satuan.id_satuan_barang,
        satuan_barang: satuan.satuan_barang,
      },
    });
    satuanCount++;
  }
  console.log(`✅ Seeded ${satuanCount} satuan barang.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
