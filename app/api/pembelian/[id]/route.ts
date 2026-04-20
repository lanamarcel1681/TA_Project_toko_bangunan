import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single transaksi pembelian
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const transaksi = await prisma.transaksiPembelianBarang.findUnique({
      where: { id_transaksipembelian: id },
      include: {
        supplier: true,
        pegawai: true,
        detail: {
          include: {
            barang: true,
          },
        },
      },
    });

    if (!transaksi) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error fetching transaksi pembelian:", error);
    return NextResponse.json({ error: "Gagal mengambil data transaksi" }, { status: 500 });
  }
}

// PUT update transaksi pembelian
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { id_supplier, tanggal_pembelian, items } = body;

    // 1. Dapatkan detail transaksi lama untuk menyesuaikan stok
    const oldTransaksi = await prisma.transaksiPembelianBarang.findUnique({
      where: { id_transaksipembelian: id },
      include: { detail: true },
    });

    if (!oldTransaksi) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    // Hitung total biaya baru
    const total_biaya = items.reduce(
      (sum: number, item: { jumlah: number; harga_satuan: number }) =>
        sum + item.jumlah * item.harga_satuan,
      0
    );

    // Update transaksi menggunakan transaksi Prisma
    const updatedTransaksi = await prisma.$transaction(async (tx) => {
      // a. Kembalikan stok lama (decrement)
      for (const oldDetail of oldTransaksi.detail) {
        await tx.barang.update({
          where: { id_barang: oldDetail.id_barang },
          data: {
            stok_barang: {
              decrement: oldDetail.jumlah_pembelian_barang,
            },
          },
        });
      }

      // b. Hapus detail lama
      await tx.detailTransaksiPembelianBarang.deleteMany({
        where: { id_transaksipembelian: id },
      });

      // c. Update transaksi utama
      const updated = await tx.transaksiPembelianBarang.update({
        where: { id_transaksipembelian: id },
        data: {
          id_supplier: parseInt(id_supplier),
          total_biaya,
          tanggal_pembelian: new Date(tanggal_pembelian),
          detail: {
            create: items.map(
              (item: {
                id_barang: number;
                jumlah: number;
                harga_satuan: number;
              }) => ({
                id_barang: parseInt(item.id_barang.toString()),
                jumlah_pembelian_barang: parseFloat(item.jumlah.toString()),
                harga_satuan_barang: parseFloat(item.harga_satuan.toString()),
              })
            ),
          },
        },
        include: {
          supplier: true,
          detail: {
            include: {
              barang: true,
            },
          },
        },
      });

      // d. Tambahkan stok baru (increment)
      for (const item of items) {
        await tx.barang.update({
          where: { id_barang: parseInt(item.id_barang.toString()) },
          data: {
            stok_barang: {
              increment: parseFloat(item.jumlah.toString()),
            },
          },
        });
      }

      return updated;
    });

    return NextResponse.json(updatedTransaksi);
  } catch (error) {
    console.error("Error updating transaksi pembelian:", error);
    return NextResponse.json({ error: "Gagal memperbarui transaksi" }, { status: 500 });
  }
}

// DELETE transaksi pembelian
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const transaksi = await prisma.transaksiPembelianBarang.findUnique({
      where: { id_transaksipembelian: id },
      include: { detail: true },
    });

    if (!transaksi) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Kurangi stok barang (karena pembelian dibatalkan/dihapus)
      for (const detail of transaksi.detail) {
        await tx.barang.update({
          where: { id_barang: detail.id_barang },
          data: {
            stok_barang: {
              decrement: detail.jumlah_pembelian_barang,
            },
          },
        });
      }

      // Hapus detail transakis
      await tx.detailTransaksiPembelianBarang.deleteMany({
        where: { id_transaksipembelian: id },
      });

      // Hapus transaksi utama
      await tx.transaksiPembelianBarang.delete({
        where: { id_transaksipembelian: id },
      });
    });

    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting transaksi pembelian:", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi" }, { status: 500 });
  }
}
