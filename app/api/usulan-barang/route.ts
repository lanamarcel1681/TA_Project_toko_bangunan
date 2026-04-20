import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// GET all suggestions for the logged-in employee or all for owner
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = JSON.parse(session.value);
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

    const user = JSON.parse(session.value);
    const body = await request.json();
    const { 
      nama_barang_usulan, 
      id_kategori_barang, 
      deskripsi_usulan, 
      harga_beli_perkiraan, 
      harga_jual_perkiraan 
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
        status_usulan: "Pending"
      },
    });

    return NextResponse.json(newSuggestion, { status: 201 });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return NextResponse.json({ error: "Gagal mengirim usulan" }, { status: 500 });
  }
}
