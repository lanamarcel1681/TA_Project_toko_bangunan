import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all barang
export async function GET() {
  try {
    const barang = await prisma.barang.findMany({
      include: {
        kategori: true,
        satuan: true,
        ulasan: true,
        detail_jual: true,
        barang_supplier: {
          include: { supplier: true }
        }
      },
      orderBy: {
        id_barang: 'desc'
      }
    });

    // Transform and calculate averages/totals
    const transformed = barang.map(b => {
      const reviewCount = b.ulasan.length;
      const totalRating = b.ulasan.reduce((acc, curr) => acc + curr.rating, 0);
      const rating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0";
      const soldCount = b.detail_jual.reduce((acc, curr) => acc + curr.jumlah_penjualan_barang, 0);

      return {
        ...b,
        rating: parseFloat(rating),
        reviewCount: reviewCount,
        soldCount: soldCount
      };
    });

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching barang:", error);
    return NextResponse.json({ error: "Gagal mengambil data barang" }, { status: 500 });
  }
}

// POST new barang
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nama_kategori, 
      nama_barang, 
      harga_barang, 
      satuan_barang, 
      stok_barang,
      deskripsi_barang,
      berat_barang,
      minimum_barang,
      dimensi_barang,
      merk_barang,
      foto_barang,
      id_suppliers // Added for many-to-many
    } = body;

    // Validate required inputs
    if (!nama_barang || !harga_barang || !stok_barang || !nama_kategori || !satuan_barang) {
      return NextResponse.json(
        { error: "Nama barang, harga, stok, kategori, dan satuan wajib diisi" }, 
        { status: 400 }
      );
    }

    // 1. Find or create KategoriBarang
    let kategori = await prisma.kategoriBarang.findFirst({
      where: { nama_kategori }
    });
    if (!kategori) {
      kategori = await prisma.kategoriBarang.create({
        data: { nama_kategori }
      });
    }

    // 2. Find or create SatuanBarang
    let satuan = await prisma.satuanBarang.findFirst({
      where: { satuan_barang }
    });
    if (!satuan) {
      satuan = await prisma.satuanBarang.create({
        data: { satuan_barang }
      });
    }

    // 3. Determine status based on stock
    let status_barang = "Tersedia";
    if (stok_barang <= 0) {
      status_barang = "Habis";
    } else if (minimum_barang && stok_barang <= minimum_barang) {
      status_barang = "Menipis";
    } else if (stok_barang <= 10) { // Default threshold if minimum_barang not set
      status_barang = "Menipis";
    }

    // 4. Create Barang
    const newBarang = await prisma.barang.create({
      data: {
        id_kategori_barang: kategori.id_kategori_barang,
        id_satuan_barang: satuan.id_satuan_barang,
        nama_barang,
        harga_barang: parseFloat(harga_barang.toString()),
        stok_barang: parseInt(stok_barang.toString(), 10),
        deskripsi_barang: deskripsi_barang || "",
        foto_barang: foto_barang || null,
        status_barang,
        berat_barang: berat_barang ? parseFloat(berat_barang.toString()) : 0,
        minimum_barang: minimum_barang ? parseFloat(minimum_barang.toString()) : 0,
        dimensi_barang: dimensi_barang || null,
        merk_barang: merk_barang || null,
        barang_supplier: {
          create: (id_suppliers || []).map((id: number) => ({ id_supplier: id }))
        }
      },
      include: {
        kategori: true,
        satuan: true,
        barang_supplier: {
          include: { supplier: true }
        }
      }
    });

    return NextResponse.json(newBarang, { status: 201 });
  } catch (error) {
    console.error("Error creating barang:", error);
    return NextResponse.json({ error: "Gagal menambahkan data barang" }, { status: 500 });
  }
}
