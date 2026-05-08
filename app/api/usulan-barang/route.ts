import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/app/utils/session";

const prisma = new PrismaClient();

// GET all suggestions for the logged-in employee or all for owner
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await decrypt(session.value);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (user.role === "karyawan") {
      where.id_pegawai = user.id;
    }
    if (search) {
      where.nama_barang_usulan = { contains: search };
    }

    const suggestions = await prisma.usulanBarang.findMany({
      where,
      include: {
        kategori: true,
        pegawai: {
          select: {
            nama_pegawai: true
          }
        },
        usulan_supplier: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: {
        tanggal_usulan: "desc",
      },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Gagal mengambil data usulan" }, { status: 500 });
  }
}

// POST new suggestion
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await decrypt(session.value);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { 
      nama_barang_usulan, 
      id_kategori_barang, 
      deskripsi_usulan, 
      harga_beli_perkiraan, 
      harga_jual_perkiraan,
      id_suppliers
    } = body;

    if (!nama_barang_usulan || !id_kategori_barang || !harga_beli_perkiraan) {
      return NextResponse.json({ error: "Kolom bertanda * wajib diisi" }, { status: 400 });
    }

    const newSuggestion = await prisma.usulanBarang.create({
      data: {
        nama_barang_usulan,
        deskripsi_usulan: deskripsi_usulan || "",
        id_kategori_barang: parseInt(id_kategori_barang),
        id_pegawai: user.id,
        harga_beli_perkiraan: parseFloat(harga_beli_perkiraan),
        harga_jual_perkiraan: parseFloat(harga_jual_perkiraan) || 0,
        tanggal_usulan: new Date(),
        status_usulan: "Pending",
        usulan_supplier: id_suppliers && Array.isArray(id_suppliers) && id_suppliers.length > 0 ? {
          create: id_suppliers.map((id: number) => ({
            id_supplier: id
          }))
        } : undefined
      },
    });

    return NextResponse.json(newSuggestion, { status: 201 });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return NextResponse.json({ error: "Gagal mengirim usulan" }, { status: 500 });
  }
}
