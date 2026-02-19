'use client'; // Client Component for interactivity

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Leaf } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Product } from '@prisma/client';
import { toggleWishlist } from '@/app/actions/wishlist'; // Import server action
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/pricing';

interface ProductCardProps {
    // Modify price type to allow number/string for serialization
    product: Omit<Product, 'price'> & {
        price: number | string | any;
        category: { name: string }
    };
    initialIsWishlisted?: boolean; // Pass improved initial state if possible in future
}

export function ProductCard({ product, initialIsWishlisted = false }: ProductCardProps) {
    const mainImage = product.images[0] || '/placeholder.png';
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [isLoading, setIsLoading] = useState(false);
    const { isSignedIn } = useAuth(); // Check user auth on client side for immediate feedback

    const handleWishlistClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product details
        e.stopPropagation();

        if (!isSignedIn) {
            toast.error("Please sign in to add to your wishlist!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await toggleWishlist(product.id);
            if (result.success && result.isWishlisted !== undefined) {
                setIsWishlisted(result.isWishlisted);
                toast.success(result.isWishlisted ? "Added to wishlist!" : "Removed from wishlist!");
            } else {
                toast.error("Something went wrong with your wishlist.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update wishlist.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative bg-[#F5F0E6] rounded-xl overflow-hidden border-2 border-transparent hover:border-[#2D5F3F] transition-all h-full">
            {/* Wishlist Button - Absolute Top Right */}
            <button
                onClick={handleWishlistClick}
                disabled={isLoading}
                className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-sm transition-all hover:scale-110 
                    ${isWishlisted ? 'bg-white text-red-500 hover:bg-red-50' : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'}
                `}
            >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} />
            </button>

            <Link href={`/products/${product.id}`} className="block h-full">
                <div className="aspect-square overflow-hidden bg-white relative">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ${product.inventory <= 0 ? 'grayscale' : ''}`}
                    />

                    {product.inventory <= 0 && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center pointer-events-none">
                            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold border border-red-100 rotate-12 shadow-sm">
                                Sold Out
                            </span>
                        </div>
                    )}

                    {/* Cart Button - Absolute Bottom Right */}
                    {product.inventory > 0 && (
                        <button className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-[#2D5F3F] text-gray-600 hover:text-white shadow-sm transition-all hover:scale-110">
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="p-4">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#2D5F3F] text-white rounded-full text-xs mb-2">
                        <Leaf className="w-3 h-3" />
                        Eco-Friendly
                    </div>

                    <h3 className="text-lg mb-2 group-hover:text-[#2D5F3F] transition-colors font-medium line-clamp-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-[#2D5F3F]">
                            {formatPrice(Number(product.price))}
                        </span>

                        {product.co2Saved > 0 && (
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Leaf className="w-4 h-4 text-green-600" />
                                {product.co2Saved}kg CO₂
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
