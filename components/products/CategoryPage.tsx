import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { Leaf, Package } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { PaginationControls } from '@/components/ui/pagination-controls';

interface CategoryPageProps {
    categorySlug: string;
    categoryName: string;
    description: string;
    icon?: React.ReactNode;
    searchParams?: {
        minPrice?: string;
        maxPrice?: string;
        condition?: string | string[];
        minCo2?: string;
        maxCo2?: string;
        inStock?: string;
        page?: string;
        limit?: string;
    };
}

async function getCategoryProducts(categorySlug: string, searchParams?: CategoryPageProps['searchParams']) {
    // Find category by name (case-insensitive)
    const category = await prisma.category.findFirst({
        where: {
            name: {
                equals: categorySlug.replace(/-/g, ' '),
                mode: 'insensitive'
            }
        }
    });

    if (!category) {
        return { products: [], total: 0 };
    }

    // Process search params
    const conditionFilter = searchParams?.condition
        ? (Array.isArray(searchParams.condition) ? searchParams.condition : [searchParams.condition])
        : undefined;

    const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
    const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
    const minCo2 = searchParams?.minCo2 ? Number(searchParams.minCo2) : undefined;
    const maxCo2 = searchParams?.maxCo2 ? Number(searchParams.maxCo2) : undefined;
    const inStockOnly = searchParams?.inStock === 'true';

    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 12;
    const skip = (page - 1) * limit;

    // Construct Prisma query
    const where: Prisma.ProductWhereInput = {
        categoryId: category.id,
        status: 'ACTIVE',
        ...(conditionFilter && conditionFilter.length > 0 && {
            condition: { in: conditionFilter as any }
        }),
        ...(minPrice !== undefined || maxPrice !== undefined ? {
            price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
            }
        } : {}),
        ...(minCo2 !== undefined || maxCo2 !== undefined ? {
            co2Saved: {
                ...(minCo2 !== undefined && { gte: minCo2 }),
                ...(maxCo2 !== undefined && { lte: maxCo2 }),
            }
        } : {}),
        ...(inStockOnly && {
            inventory: {
                gt: 0
            }
        })
    };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                shop: true,
                category: true,
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        }),
        prisma.product.count({ where })
    ]);

    return { products, total };
}

import { auth } from '@clerk/nextjs/server';
import { getUserWishlistProductIds } from '@/lib/wishlist';

async function CategoryProductsContent({ categorySlug, searchParams }: { categorySlug: string; searchParams?: CategoryPageProps['searchParams'] }) {
    const { products, total } = await getCategoryProducts(categorySlug, searchParams);
    const { userId } = await auth();
    const wishlistProductIds = await getUserWishlistProductIds(userId);

    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 12;
    const totalPages = Math.ceil(total / limit);

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500">Check back soon for new eco-friendly products!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            price: Number(product.price),
                            co2Saved: Number(product.co2Saved)
                        }}
                        initialIsWishlisted={wishlistProductIds.includes(product.id)}
                    />
                ))}
            </div>

            {total > limit && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <PaginationControls
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={total}
                        itemsPerPage={limit}
                    />
                </div>
            )}
        </div>
    );
}

export async function CategoryPage({ categorySlug, categoryName, description, icon, searchParams }: CategoryPageProps) {
    return (
        <div className="min-h-screen bg-[#f8f5f2]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1e3a2f] to-[#2d5a45] text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-4">
                        {icon || <Leaf className="w-10 h-10" />}
                        <h1 className="text-4xl font-bold font-serif">{categoryName}</h1>
                    </div>
                    <p className="text-lg text-green-100 max-w-3xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                            <CategoryFilter categorySlug={categorySlug} />
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <Suspense fallback={
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                                        <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        }>
                            <CategoryProductsContent categorySlug={categorySlug} searchParams={searchParams} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}
