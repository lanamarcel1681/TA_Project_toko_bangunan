import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = JSON.parse(session.value);
    const userRole = user.role?.toLowerCase();

    if (userRole !== "owner") {
        return NextResponse.json({ error: "Hanya Owner yang dapat melakukan persetujuan" }, { status: 403 });
    }

    const { status } = await request.json(); // "Approved" or "Rejected"
    const id_opname = parseInt(id);

    if (!["Approved", "Rejected"].includes(status)) {
        return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    console.log(`PATCH request for ID: ${id_opname}, New Status: ${status}, User Role: ${userRole}`);

    const stokOpname = await prisma.stokOpname.findUnique({
        where: { id_opname },
        include: { detail_opname: true }
    });

    if (!stokOpname) {
        console.log(`Audit with ID ${id_opname} not found.`);
        return NextResponse.json({ error: "Data Stock Opname tidak ditemukan" }, { status: 404 });
    }

    console.log(`Found audit: ID ${stokOpname.id_opname}, Current Status: ${stokOpname.status_dokumen}`);

    if (stokOpname.status_dokumen !== "Pending Review") {
        console.log(`Audit ${id_opname} cannot be processed because status is ${stokOpname.status_dokumen}`);
        return NextResponse.json({ error: "Data sudah diproses atau status tidak valid untuk persetujuan" }, { status: 400 });
    }

    // Use transaction to ensure both status and stock are updated together
    const result = await prisma.$transaction(async (tx) => {
        // 1. Update Stok Opname Status
        const updatedOpname = await tx.stokOpname.update({
            where: { id_opname },
            data: { status_dokumen: status }
        });

        // 2. If Approved, Update main stock in Barang table
        if (status === "Approved") {
            for (const detail of stokOpname.detail_opname) {
                await tx.barang.update({
                    where: { id_barang: detail.id_barang },
                    data: {
                        stok_barang: detail.stok_fisik
                    }
                });
            }
        }

        return updatedOpname;
    });

    return NextResponse.json({ 
        message: `Stock Opname berhasil di-${status === 'Approved' ? 'setujui' : 'tolak'}`,
        data: result
    });

  } catch (error) {
    console.error("Error updating stock opname status:", error);
    return NextResponse.json({ 
        error: "Gagal memperbarui status Stock Opname",
        details: error instanceof Error ? error.message : "Terjadi kesalahan internal"
    }, { status: 500 });
  }
}
