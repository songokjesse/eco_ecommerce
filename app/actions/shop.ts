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

    // 0. Ensure User exists in Prisma
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            throw new Error("User does not have an email address");
        }

        await prisma.user.create({
            data: {
                id: userId,
                email: email,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                image: clerkUser.imageUrl,
            },
        });
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

    redirect("/dashboard/seller");
}
