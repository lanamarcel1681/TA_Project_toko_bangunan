import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ items: [], totalItems: 0 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ items: [], totalItems: 0 });

        if (user.role !== 'customer') {
            return NextResponse.json({ items: [], totalItems: 0 });
        }

        const cartItems = await prisma.keranjang.findMany({
            where: { id_pembeli: user.id },
            include: { barang: true }
        });

        const totalItems = cartItems.reduce((acc, item) => acc + item.jumlah_barang, 0);

        return NextResponse.json({ items: cartItems, totalItems });
    } catch (error) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (user.role !== 'customer') {
            return NextResponse.json({ error: 'Hanya pembeli yang dapat menambah ke keranjang' }, { status: 403 });
        }

        const { productId, quantity } = await request.json();

        if (!productId || quantity <= 0) {
            return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
        }

        const existingItem = await prisma.keranjang.findFirst({
            where: {
                id_pembeli: user.id,
                id_barang: productId
            }
        });

        if (existingItem) {
            const updated = await prisma.keranjang.update({
                where: { id_keranjang: existingItem.id_keranjang },
                data: { jumlah_barang: existingItem.jumlah_barang + quantity }
            });
            return NextResponse.json({ success: true, item: updated });
        } else {
            const newItem = await prisma.keranjang.create({
                data: {
                    id_pembeli: user.id,
                    id_barang: productId,
                    jumlah_barang: quantity
                }
            });
            return NextResponse.json({ success: true, item: newItem });
        }
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { cartId, quantity } = await request.json();

        if (!cartId || quantity <= 0) {
            return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
        }

        const updated = await prisma.keranjang.update({
            where: {
                id_keranjang: cartId,
                id_pembeli: user.id
            },
            data: { jumlah_barang: quantity }
        });

        return NextResponse.json({ success: true, item: updated });
    } catch (error) {
        console.error("Cart PATCH Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const cartId = parseInt(searchParams.get('id') || '');

        if (!cartId) {
            return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
        }

        await prisma.keranjang.delete({
            where: {
                id_keranjang: cartId,
                id_pembeli: user.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart DELETE Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
