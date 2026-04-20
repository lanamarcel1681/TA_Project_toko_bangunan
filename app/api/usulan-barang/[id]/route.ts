import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// PUT update suggestion (For employee editing and Owner reviewing)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = JSON.parse(session.value);
    const body = await request.json();
    const { 
      nama_barang_usulan, 
      id_kategori_barang, 
      deskripsi_usulan, 
      harga_beli_perkiraan, 
      harga_jual_perkiraan,
      status_usulan // Added for owner review
    } = body;

    // Check existing
    const existing = await prisma.usulanBarang.findUnique({
      where: { id_usulan_barang: parseInt(id) }
    });

    if (!existing) return NextResponse.json({ error: "Usulan tidak ditemukan" }, { status: 404 });
    
    // Only allow modification if status is currently "Pending"
    if (existing.status_usulan !== "Pending") {
      return NextResponse.json({ error: "Usulan yang sudah diproses tidak dapat diubah" }, { status: 400 });
    }

    // Logic for Status Update (Owner only)
    if (status_usulan && (status_usulan === "Approved" || status_usulan === "Rejected")) {
      if (user.role !== "owner") {
        return NextResponse.json({ error: "Hanya Owner yang dapat memberikan keputusan" }, { status: 403 });
      }

      const updatedStatus = await prisma.usulanBarang.update({
        where: { id_usulan_barang: parseInt(id) },
        data: { status_usulan },
      });

      return NextResponse.json(updatedStatus);
    }

    // Logic for Editing Content (Employee or Owner, only if Pending)
    if (user.role === "karyawan" && existing.id_pegawai !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedSuggestion = await prisma.usulanBarang.update({
      where: { id_usulan_barang: parseInt(id) },
      data: {
        nama_barang_usulan,
        deskripsi_usulan,
        id_kategori_barang: id_kategori_barang ? parseInt(id_kategori_barang) : undefined,
        harga_beli_perkiraan: harga_beli_perkiraan ? parseFloat(harga_beli_perkiraan) : undefined,
        harga_jual_perkiraan: harga_jual_perkiraan ? parseFloat(harga_jual_perkiraan) : undefined,
      },
    });

    return NextResponse.json(updatedSuggestion);
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return NextResponse.json({ error: "Gagal memperbarui data usulan" }, { status: 500 });
  }
}

// DELETE suggestion (Optional, only if Pending)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = JSON.parse(session.value);
    
    const existing = await prisma.usulanBarang.findUnique({
      where: { id_usulan_barang: parseInt(id) }
    });

    if (!existing) return NextResponse.json({ error: "Usulan tidak ditemukan" }, { status: 404 });
    if (existing.status_usulan !== "Pending") {
      return NextResponse.json({ error: "Hanya usulan pending yang dapat dihapus" }, { status: 400 });
    }
    if (user.role === "karyawan" && existing.id_pegawai !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.usulanBarang.delete({
      where: { id_usulan_barang: parseInt(id) },
    });

    return NextResponse.json({ message: "Usulan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json({ error: "Gagal menghapus data usulan" }, { status: 500 });
  }
}
