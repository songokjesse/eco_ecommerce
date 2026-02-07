'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function registerShop(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const shopName = formData.get("shopName") as string;
    const description = formData.get("description") as string;

    if (!shopName || !description) {
        throw new Error("Missing required fields");
    }

    try {
        // 1. Create Shop in Prisma
        await prisma.shop.create({
            data: {
                name: shopName,
                description,
                ownerId: userId,
            },
        });

        // 2. Update Clerk metadata
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "seller",
            },
        });

        revalidatePath("/");
    } catch (error) {
        console.error("Failed to register shop:", error);
        throw new Error("Failed to register shop");
    }

    redirect("/dashboard");
}
