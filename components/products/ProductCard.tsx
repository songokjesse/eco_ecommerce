import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Leaf } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from '@prisma/client';

interface ProductCardProps {
    product: Product & { category: { name: string } };
}

export function ProductCard({ product }: ProductCardProps) {
    const mainImage = product.images[0] || '/placeholder.png';

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 relative">
            {product.inventory <= 0 && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold border border-red-100 rotate-12 shadow-sm">
                        Sold Out
                    </span>
                </div>
            )}

            <div className="relative aspect-square bg-gray-100">
                <Link href={`/products/${product.id}`} className="block w-full h-full relative">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className={`object-cover object-center group-hover:scale-105 transition-transform duration-500 ${product.inventory <= 0 ? 'grayscale' : ''}`}
                    />
                </Link>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm z-20">
                    <Heart className="w-4 h-4" />
                </button>

                {/* Add to Cart Button - Appears on Hover (or always visible in mobile) */}
                {product.inventory > 0 && (
                    <button className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-[#1e3a2f] hover:text-white text-gray-700 transition-all shadow-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    <Badge variant="secondary" className="bg-[#1e3a2f]/90 text-white hover:bg-[#1e3a2f] text-xs font-normal backdrop-blur-md">
                        Eco
                    </Badge>
                    {/* Logic for "New" badge could be added here based on CreatedAt */}
                    {new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                        <Badge variant="outline" className="bg-white/90 text-xs font-normal backdrop-blur-md border-transparent shadow-sm">
                            New
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        {product.category.name}
                    </div>
                    <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-[#1e3a2f] transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-lg text-[#1e3a2f]">
                        ${Number(product.price).toFixed(2)}
                    </span>

                    {/* CO2 Saved - if applicable */}
                    {product.co2Saved > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-[#1e3a2f] font-medium bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-[#dcfce7]">
                            <Leaf className="w-3 h-3 text-[#2ecc71]" strokeWidth={2.5} />
                            {product.co2Saved}kg
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
