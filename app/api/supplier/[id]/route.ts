import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single supplier
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id_supplier: parseInt(id) },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Supplier tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data supplier" }, { status: 500 });
  }
}

// PUT update supplier
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      nama_supplier, 
      nomor_telepon_supplier, 
      tanggal_lahir_supplier, 
      nama_perusahaan_supplier 
    } = body;

    const updatedSupplier = await prisma.supplier.update({
      where: { id_supplier: parseInt(id) },
      data: {
        nama_supplier,
        nomor_telepon_supplier,
        tanggal_lahir_supplier,
        nama_perusahaan_supplier,
      },
    });

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json({ error: "Gagal memperbarui data supplier" }, { status: 500 });
  }
}

// DELETE supplier
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.supplier.delete({
      where: { id_supplier: parseInt(id) },
    });

    return NextResponse.json({ message: "Supplier berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json({ error: "Gagal menghapus supplier. Pastikan tidak ada transaksi terkait." }, { status: 500 });
  }
}
