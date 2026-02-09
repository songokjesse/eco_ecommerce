'use server';

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type RegisterShopState = {
    success: boolean;
    message?: string;
    redirectUrl?: string;
};

export async function registerShop(formData: FormData): Promise<RegisterShopState> {
    // Authenticate user
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Parse Form Data
    const shopName = formData.get("shopName") as string;
    const description = formData.get("description") as string;

    if (!shopName || !description) {
        return {
            success: false,
            message: "Missing required fields: Shop Name and Description."
        };
    }

    try {
        // Check if user already has a shop
        const existingShop = await prisma.shop.findUnique({
            where: { ownerId: userId },
        });

        if (existingShop) {
            return {
                success: false,
                message: "You already have a shop! Redirecting to your dashboard...",
                redirectUrl: "/dashboard/seller"
            };
        }

        // Database Operations: Upsert User & Create Shop
        await prisma.$transaction(async (tx) => {
            // 1. Ensure User exists and update Role to SELLER
            await tx.user.upsert({
                where: { id: userId },
                create: {
                    id: userId,
                    email: userEmail,
                    role: 'SELLER',
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
                    image: user.imageUrl,
                },
                update: {
                    role: 'SELLER'
                }
            });

            // 2. Create the Shop
            await tx.shop.create({
                data: {
                    name: shopName,
                    description: description,
                    ownerId: userId,
                }
            });
        });

        // 3. Sync Role to Clerk (for frontend/middleware checks)
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'SELLER'
            }
        });

        revalidatePath("/");

        return { success: true, redirectUrl: "/dashboard/seller" };

    } catch (error) {
        console.error("Failed to register shop:", error);
        return {
            success: false,
            message: "Failed to register shop. Please try again. " + (error instanceof Error ? error.message : "")
        };
    }
}
