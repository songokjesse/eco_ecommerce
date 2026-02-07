'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ... imports

export type RegisterShopState = {
    success: boolean;
    message?: string;
    redirectUrl?: string;
};

export async function registerShop(formData: FormData): Promise<RegisterShopState | void> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

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

    // ... (rest of the logic: user sync, shop creation)

    try {
        // ... create shop
        // ... update metadata

        revalidatePath("/");
    } catch (error) {
        console.error("Failed to register shop:", error);
        return { success: false, message: "Failed to register shop. Please try again." };
    }

    redirect("/dashboard/seller");
}
