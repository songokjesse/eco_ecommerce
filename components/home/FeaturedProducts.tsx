import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Heart, Leaf } from 'lucide-react';
import prisma from '@/lib/prisma';

async function getFeaturedProducts() {
    try {
        // Try to get featured products first
        let products = await prisma.product.findMany({
            where: {
                isFeatured: true,
                status: 'ACTIVE'
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });

        // Fallback to latest products if no featured ones found
        if (products.length === 0) {
            products = await prisma.product.findMany({
                where: { status: 'ACTIVE' },
                take: 4,
                orderBy: { createdAt: 'desc' }
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
                    <Link href={`/products/${product.id}`} key={product.id} className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10 block">
                        {/* Image */}
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                            {product.images && product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                                    <Leaf className="h-8 w-8" />
                                </div>
                            )}

                            {/* Wishlist Button Placeholder - purely visual for now */}
                            <div className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors pointer-events-none">
                                <Heart className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-green-600 px-2 py-0.5 rounded-full">
                                    <Leaf className="h-3 w-3" /> Eco-Friendly
                                </span>
                                {product.co2Saved > 0 && (
                                    <span className="text-[10px] text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                        {product.co2Saved}kg CO₂ Saved
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-lg text-foreground">${Number(product.price).toFixed(2)}</span>
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ShoppingCart className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
