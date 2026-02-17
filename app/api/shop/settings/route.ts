import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET: Retrieve shop settings
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const shop = await prisma.shop.findUnique({
            where: { ownerId: userId },
            select: {
                id: true,
                name: true,
                description: true,

                logo: true,
                coverImage: true
            }
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        return NextResponse.json(shop);
    } catch (error) {
        console.error('Error fetching shop settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update shop settings
export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, logo, coverImage } = body;

        // Ensure shop exists for this owner
        const existingShop = await prisma.shop.findUnique({
            where: { ownerId: userId },
            select: { id: true }
        });

        if (!existingShop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const updatedShop = await prisma.shop.update({
            where: { ownerId: userId },
            data: {
                name,
                description,
                logo,
                coverImage,
            }
        });

        return NextResponse.json(updatedShop);
    } catch (error) {
        console.error('Error updating shop settings:', error);
        return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 });
    }
}
