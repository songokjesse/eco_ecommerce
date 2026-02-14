import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { auth } from '@clerk/nextjs/server';
import { getUserWishlistProductIds } from '@/lib/wishlist';

async function getFeaturedProducts() {
    try {
        // Try to get featured products first
        let products = await prisma.product.findMany({
            where: {
                isFeatured: true,
                status: 'ACTIVE'
            },
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        });

        // Fallback to latest products if no featured ones found
        if (products.length === 0) {
            products = await prisma.product.findMany({
                where: { status: 'ACTIVE' },
                take: 4,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true
                }
            });
        }

        return products;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

export async function FeaturedProducts() {
    const products = await getFeaturedProducts();
    const { userId } = await auth();
    const wishlistProductIds = await getUserWishlistProductIds(userId);

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
                <Link href="/products">
                    <Button variant="default" className="rounded-full bg-primary/90 hover:bg-primary text-white">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        initialIsWishlisted={wishlistProductIds.includes(product.id)}
                    />
                ))}
            </div>
        </section>
    );
}
