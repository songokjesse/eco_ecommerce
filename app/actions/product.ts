'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { searchEmissionFactors, estimateEmissions } from "@/lib/climatiq";
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
    const co2Saved = parseFloat(formData.get("co2Saved") as string) || 0.0;

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

    let finalCo2Saved = co2Saved;

    // Automatic Fallback: Calculate CO2 if not provided
    if (finalCo2Saved === 0) {
        try {
            // 1. Find best emission factor
            let factors = await searchEmissionFactors(`${categoryName} ${name}`);
            if (factors.length === 0) factors = await searchEmissionFactors(categoryName);

            // 2. Estimate
            if (factors.length > 0) {
                // Prefer weight-based
                let factor = factors.find(f => f.unit_type === 'Weight') || factors[0];

                // We need weight for calculation. 
                // Since weight wasn't in the original form data passed to backend separately (it was just for frontend calc),
                // we might need to rely on what we can infer or if we add 'weight' to the form submission.
                // For now, let's assume if frontend failed, we might skip or use a default.
                // BETTER: Let's ensure 'weight' is passed in formData even if just for this.

                const weightVal = parseFloat(formData.get("weight") as string);

                if (weightVal && !isNaN(weightVal)) {
                    const estimate = await estimateEmissions(factor.id, weightVal, 'kg');
                    if (estimate) {
                        // 90% savings assumption for used goods
                        finalCo2Saved = estimate.co2e * 0.9;
                    }
                }
            }
        } catch (error) {
            console.error("Auto-calculation failed:", error);
            // Continue without crashing, just saving 0
        }
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
                co2Saved: finalCo2Saved,
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
