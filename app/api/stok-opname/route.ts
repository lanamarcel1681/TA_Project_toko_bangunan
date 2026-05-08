import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/app/utils/session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await decrypt(session.value);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { items } = body; // Array of { id_barang: number, stok_fisik: number, keterangan_temuan: string }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Data audit tidak valid atau kosong" }, { status: 400 });
    }

    // 1. Create StokOpname record
    const stokOpname = await prisma.stokOpname.create({
      data: {
        id_pegawai: user.id,
        tanggal_opname: new Date(),
        status_dokumen: "Pending Review",
        catatan_pengiriman: `Audit stok oleh ${user.name}`,
      },
    });

    // 2. Create DetailStokOpname records
    const detailData = await Promise.all(items.map(async (item: any) => {
        // Fetch system stock for calculation
        const barang = await prisma.barang.findUnique({
            where: { id_barang: item.id_barang }
        });

        const systemStock = barang?.stok_barang || 0;
        const selisih = item.stok_fisik - systemStock;

        return {
            id_opname: stokOpname.id_opname,
            id_barang: item.id_barang,
            stok_fisik: item.stok_fisik,
            keterangan_temuan: item.keterangan_temuan || "",
            selisih: selisih
        };
    }));

    await prisma.detailStokOpname.createMany({
        data: detailData
    });

    return NextResponse.json({ 
        message: "Stock Opname berhasil disimpan",
        id_opname: stokOpname.id_opname 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating stock opname:", error);
    return NextResponse.json({ error: "Gagal menyimpan data Stock Opname" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await decrypt(session.value);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userRole = user.role?.toLowerCase();

    console.log(`Fetching Stock Opname for user: ${user.name}, Role: ${userRole}`);

    // If Owner, fetch all audits
    if (userRole === "owner") {
      const allAudits = await prisma.stokOpname.findMany({
        include: {
          pegawai: true,
          detail_opname: {
            include: {
              barang: {
                include: {
                  satuan: true
                }
              }
            }
          }
        },
        orderBy: { tanggal_opname: 'desc' }
      });
      console.log(`Owner found ${allAudits.length} total audits.`);
      return NextResponse.json(allAudits);
    }

    // If Employee, fetch personal history
    const history = await prisma.stokOpname.findMany({
      where: { id_pegawai: user.id },
      include: {
        detail_opname: {
          include: {
            barang: {
              include: {
                satuan: true
              }
            }
          }
        }
      },
      orderBy: { tanggal_opname: 'desc' }
    });
    console.log(`Employee found ${history.length} personal audits.`);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching stock opname history:", error);
    return NextResponse.json({ error: "Gagal mengambil riwayat Stock Opname" }, { status: 500 });
  }
}
