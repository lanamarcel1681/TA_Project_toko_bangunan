import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT update barang
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id_barang = parseInt(idStr, 10);
    
    if (isNaN(id_barang)) {
      return NextResponse.json({ error: "ID barang tidak valid" }, { status: 400 });
    }

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

    // 1. Find or create KategoriBarang (if provided)
    let id_kategori_barang;
    if (nama_kategori) {
      let kategori = await prisma.kategoriBarang.findFirst({
        where: { nama_kategori }
      });
      if (!kategori) {
        kategori = await prisma.kategoriBarang.create({
          data: { nama_kategori }
        });
      }
      id_kategori_barang = kategori.id_kategori_barang;
    }

    // 2. Find or create SatuanBarang (if provided)
    let id_satuan_barang;
    if (satuan_barang) {
      let satuan = await prisma.satuanBarang.findFirst({
        where: { satuan_barang }
      });
      if (!satuan) {
        satuan = await prisma.satuanBarang.create({
          data: { satuan_barang }
        });
      }
      id_satuan_barang = satuan.id_satuan_barang;
    }

    // 3. Determine status based on stock if stock is updated
    let status_barang;
    if (stok_barang !== undefined) {
      const stockVal = parseInt(stok_barang.toString(), 10);
      const minVal = minimum_barang ? parseFloat(minimum_barang.toString()) : 0;
      
      status_barang = "Tersedia";
      if (stockVal <= 0) {
        status_barang = "Habis";
      } else if (minVal > 0 && stockVal <= minVal) {
        status_barang = "Menipis";
      } else if (stockVal <= 10) {
        status_barang = "Menipis";
      }
    }

    // 4. Update Barang
    const updatedBarang = await prisma.barang.update({
      where: { id_barang },
      data: {
        ...(id_kategori_barang && { id_kategori_barang }),
        ...(id_satuan_barang && { id_satuan_barang }),
        ...(nama_barang && { nama_barang }),
        ...(harga_barang !== undefined && { harga_barang: parseFloat(harga_barang.toString()) }),
        ...(stok_barang !== undefined && { stok_barang: parseInt(stok_barang.toString(), 10) }),
        ...(deskripsi_barang !== undefined && { deskripsi_barang }),
        ...(foto_barang !== undefined && { foto_barang }),
        ...(status_barang && { status_barang }),
        ...(berat_barang !== undefined && { berat_barang: parseFloat(berat_barang.toString()) }),
        ...(minimum_barang !== undefined && { minimum_barang: parseFloat(minimum_barang.toString()) }),
        ...(dimensi_barang !== undefined && { dimensi_barang: dimensi_barang || null }),
        ...(merk_barang !== undefined && { merk_barang: merk_barang || null }),
        barang_supplier: {
          deleteMany: {},
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

    return NextResponse.json(updatedBarang);
  } catch (error) {
    console.error("Error updating barang:", error);
    return NextResponse.json({ error: "Gagal memperbarui data barang" }, { status: 500 });
  }
}

// DELETE barang
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id_barang = parseInt(idStr, 10);
    
    if (isNaN(id_barang)) {
      return NextResponse.json({ error: "ID barang tidak valid" }, { status: 400 });
    }

    // Since we have relations (Keranjang, UlasanBarang, DetailTransaksiPembelianBarang, DetailTransaksiPenjualanBarang),
    // a safe delete might be required or we just delete it and let Prisma handle constraints (might fail if constrained).
    // Usually it's better to implement soft delete or ensure no relations exist. For now, we attempt hard delete.
    
    await prisma.barang.delete({
      where: { id_barang }
    });

    return NextResponse.json({ message: "Barang berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting barang:", error);
    if (error.code === 'P2003') {
      return NextResponse.json({ error: "Barang tidak dapat dihapus karena masih terhubung dengan data transaksi/keranjang." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal menghapus data barang" }, { status: 500 });
  }
}
