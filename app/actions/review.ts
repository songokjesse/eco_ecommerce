'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addReview(productId: string, rating: number, comment: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'You must be logged in to submit a review.' };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5.' };
    }

    if (!comment || comment.trim().length === 0) {
        return { success: false, error: 'Comment cannot be empty.' };
    }

    try {
        // Check if user has already reviewed this product?
        // For now, we allow multiple reviews or stick to one. Let's enforce one per user per product to be safe.
        const existingReview = await prisma.review.findFirst({
            where: {
                userId,
                productId,
            },
        });

        if (existingReview) {
            return { success: false, error: 'You have already reviewed this product.' };
        }

        await prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
            },
        });

        revalidatePath(`/products/${productId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, error: 'Failed to submit review. Please try again.' };
    }
}
