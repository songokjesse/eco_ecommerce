'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductState = {
    message?: string;
    errors?: {
        name?: string[];
        description?: string[];
        price?: string[];
        inventory?: string[];
        category?: string[];
        imageUrl?: string[];
    };
    success?: boolean;
};

export async function createProduct(prevState: ProductState, formData: FormData): Promise<ProductState> {
    const { userId } = await auth();

    if (!userId) {
        return { message: "Unauthorized" };
    }

    // specific validation logic or Zod could go here
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    // Handle price: remove '$', ensure it's a valid number string for Decimal
    const priceRaw = formData.get("price") as string;
    const price = priceRaw.replace(/[^0-9.]/g, '');
    const inventory = parseInt(formData.get("inventory") as string);
    const categoryName = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Basic server-side validation
    if (!name || !description || !price || isNaN(inventory) || !categoryName) {
        return { message: "Please fill in all required fields." };
    }

    // 1. Get Shop ID
    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    if (!shop) {
        return { message: "You must have a shop to create products." };
    }

    try {
        // 2. Find or Create Category
        // Using connectOrCreate relative to the product creation or separately
        // Since we need the ID, let's do upsert or findFirst
        // Actually, let's let Prisma handle it within the create if possible, or just upsert the category first.
        // Prisma's `connectOrCreate` is great here.

        await prisma.product.create({
            data: {
                name,
                description,
                price: price, // Decimal handles string
                inventory,
                status: (formData.get("status") as "ACTIVE" | "DRAFT") || "ACTIVE",
                images: imageUrl ? [imageUrl] : [],
                shop: {
                    connect: { id: shop.id }
                },
                category: {
                    connectOrCreate: {
                        where: { name: categoryName },
                        create: { name: categoryName }
                    }
                }
            },
        });

        revalidatePath("/dashboard/seller/products");
    } catch (error) {
        return { message: "Failed to create product. Please try again.", success: false };
    }

    return { message: "Product created successfully!", success: true };
}
