import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all transaksi pembelian
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const transaksi = await prisma.transaksiPembelianBarang.findMany({
      where: search
        ? {
            OR: [
              {
                supplier: {
                  nama_perusahaan_supplier: { contains: search },
                },
              },
              {
                supplier: {
                  nama_supplier: { contains: search },
                },
              },
            ],
          }
        : {},
      include: {
        supplier: true,
        pegawai: true,
        detail: {
          include: {
            barang: true,
          },
        },
      },
      orderBy: {
        tanggal_pembelian: "desc",
      },
    });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error("Error fetching transaksi pembelian:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi pembelian" },
      { status: 500 }
    );
  }
}

// POST new transaksi pembelian
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_supplier, id_pegawai, tanggal_pembelian, items } = body;

    if (!id_supplier || !id_pegawai || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Supplier, pegawai, dan item wajib diisi" },
        { status: 400 }
      );
    }

    // Hitung total biaya
    const total_biaya = items.reduce(
      (sum: number, item: { jumlah: number; harga_satuan: number }) =>
        sum + item.jumlah * item.harga_satuan,
      0
    );

    // Buat transaksi berserta detail
    const newTransaksi = await prisma.transaksiPembelianBarang.create({
      data: {
        id_supplier: parseInt(id_supplier),
        id_pegawai: parseInt(id_pegawai),
        total_biaya,
        tanggal_pembelian: tanggal_pembelian
          ? new Date(tanggal_pembelian)
          : new Date(),
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
        pegawai: true,
        detail: {
          include: {
            barang: true,
          },
        },
      },
    });

    // Update stok barang
    for (const item of items) {
      await prisma.barang.update({
        where: { id_barang: parseInt(item.id_barang.toString()) },
        data: {
          stok_barang: {
            increment: parseInt(item.jumlah.toString()),
          },
        },
      });
    }

    return NextResponse.json(newTransaksi, { status: 201 });
  } catch (error) {
    console.error("Error creating transaksi pembelian:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi pembelian" },
      { status: 500 }
    );
  }
}
