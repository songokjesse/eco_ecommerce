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
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl text-foreground">Featured Products</h2>
                    <Link href="/products" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2D5F3F] text-white hover:bg-[#1a3b25] transition-colors text-[14px]">
                        <span className="font-bold text-lg text-[13px] p-[0px] whitespace-nowrap">View All</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                price: Number(product.price)
                            }}
                            initialIsWishlisted={wishlistProductIds.includes(product.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
