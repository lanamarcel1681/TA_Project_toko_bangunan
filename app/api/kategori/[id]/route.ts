import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT update kategori
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id_kategori_barang = parseInt(idStr, 10);
    
    if (isNaN(id_kategori_barang)) {
      return NextResponse.json({ error: "ID kategori tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const { nama_kategori } = body;

    if (!nama_kategori || nama_kategori.trim() === "") {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const updatedKategori = await prisma.kategoriBarang.update({
      where: { id_kategori_barang },
      data: {
        nama_kategori: nama_kategori.trim()
      },
      include: {
        _count: {
          select: { barang: true }
        }
      }
    });

    return NextResponse.json(updatedKategori);
  } catch (error) {
    console.error("Error updating kategori:", error);
    return NextResponse.json({ error: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

// DELETE kategori
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id_kategori_barang = parseInt(idStr, 10);
    
    if (isNaN(id_kategori_barang)) {
      return NextResponse.json({ error: "ID kategori tidak valid" }, { status: 400 });
    }

    // Check if category is used by any barang.
    // Actually Prisma might throw an error if constrained, but checking is cleaner for error messages.
    const usedBy = await prisma.barang.count({
      where: { id_kategori_barang }
    });

    if (usedBy > 0) {
      return NextResponse.json(
        { error: `Gagal menghapus: Kategori ini sedang digunakan oleh ${usedBy} barang.` }, 
        { status: 400 }
      );
    }
    
    await prisma.kategoriBarang.delete({
      where: { id_kategori_barang }
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting kategori:", error);
    if (error.code === 'P2003') {
      return NextResponse.json({ error: "Kategori tidak dapat dihapus karena masih terhubung dengan data barang." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
