import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { Leaf, Package } from 'lucide-react';

interface CategoryPageProps {
    categorySlug: string;
    categoryName: string;
    description: string;
    icon?: React.ReactNode;
}

async function getCategoryProducts(categorySlug: string) {
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
        return [];
    }

    const products = await prisma.product.findMany({
        where: {
            categoryId: category.id,
            status: 'ACTIVE',
            inventory: {
                gt: 0
            }
        },
        include: {
            shop: true,
            category: true,
            reviews: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return products;
}

async function CategoryProductsContent({ categorySlug }: { categorySlug: string }) {
    const products = await getCategoryProducts(categorySlug);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export async function CategoryPage({ categorySlug, categoryName, description, icon }: CategoryPageProps) {
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
                            <CategoryProductsContent categorySlug={categorySlug} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}
