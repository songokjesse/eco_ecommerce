'use server';

import prisma from '@/lib/prisma';
import { ProductModerationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateProductModerationStatus(productId: string, status: ProductModerationStatus) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { moderationStatus: status },
        });
        revalidatePath('/dashboard/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to update product moderation status:', error);
        return { success: false, error: 'Failed to update product status' };
    }
}
