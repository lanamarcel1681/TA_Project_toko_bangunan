import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all kategori
export async function GET() {
  try {
    const kategori = await prisma.kategoriBarang.findMany({
      include: {
        _count: {
          select: { barang: true }
        }
      },
      orderBy: {
        id_kategori_barang: 'desc'
      }
    });
    return NextResponse.json(kategori);
  } catch (error) {
    console.error("Error fetching kategori:", error);
    return NextResponse.json({ error: "Gagal mengambil data kategori" }, { status: 500 });
  }
}

// POST new kategori
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_kategori } = body;

    if (!nama_kategori || nama_kategori.trim() === "") {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" }, 
        { status: 400 }
      );
    }

    const newKategori = await prisma.kategoriBarang.create({
      data: {
        nama_kategori: nama_kategori.trim(),
      },
      include: {
        _count: {
          select: { barang: true }
        }
      }
    });

    return NextResponse.json(newKategori, { status: 201 });
  } catch (error) {
    console.error("Error creating kategori:", error);
    return NextResponse.json({ error: "Gagal menambahkan kategori" }, { status: 500 });
  }
}
