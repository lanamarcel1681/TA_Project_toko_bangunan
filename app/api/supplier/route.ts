import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all suppliers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const suppliers = await prisma.supplier.findMany({
      where: search ? {
        OR: [
          { nama_supplier: { contains: search } },
          { nama_perusahaan_supplier: { contains: search } },
        ],
      } : {},
      orderBy: {
        id_supplier: "desc",
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Gagal mengambil data supplier" }, { status: 500 });
  }
}

// POST new supplier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nama_supplier, 
      nomor_telepon_supplier, 
      tanggal_lahir_supplier, 
      nama_perusahaan_supplier 
    } = body;

    if (!nama_supplier || !nomor_telepon_supplier || !nama_perusahaan_supplier) {
      return NextResponse.json({ error: "Semua atribut wajib diisi" }, { status: 400 });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        nama_supplier,
        nomor_telepon_supplier,
        tanggal_lahir_supplier: tanggal_lahir_supplier || "",
        nama_perusahaan_supplier,
      },
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ error: "Gagal menambahkan supplier" }, { status: 500 });
  }
}
