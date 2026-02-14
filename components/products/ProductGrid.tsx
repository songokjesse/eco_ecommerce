import { ProductCard } from "./ProductCard";
import { Product } from "@prisma/client";

type ProductWithCategory = Product & {
    category: { name: string };
};

interface ProductGridProps {
    products: ProductWithCategory[];
    wishlistProductIds?: string[];
}

export function ProductGrid({ products, wishlistProductIds = [] }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    initialIsWishlisted={wishlistProductIds.includes(product.id)}
                />
            ))}
        </div>
    );
}
