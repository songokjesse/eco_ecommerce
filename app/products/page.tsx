import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import prisma from "@/lib/prisma";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
    title: "All Products | CircuCity",
    description: "Browse our collection of eco-friendly, sustainable products.",
};

interface SearchParams {
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    query?: string;
}

export default async function ProductsPage(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    // Process search params
    const categoryFilter = searchParams.category
        ? (Array.isArray(searchParams.category) ? searchParams.category : [searchParams.category])
        : undefined;

    const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
    const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
    const sort = searchParams.sort || 'newest';

    // Construct Prisma query
    const where: Prisma.ProductWhereInput = {
        status: 'ACTIVE',
        ...(categoryFilter && categoryFilter.length > 0 && {
            category: {
                name: { in: categoryFilter }
            }
        }),
        ...(minPrice !== undefined || maxPrice !== undefined ? {
            price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
            }
        } : {}),
    };

    // Sort mapping
    const orderBy: Prisma.ProductOrderByWithRelationInput =
        sort === 'price-asc' ? { price: 'asc' } :
            sort === 'price-desc' ? { price: 'desc' } :
                { createdAt: 'desc' }; // default 'newest'

    // Fetch products
    console.log('Querying products with filter:', Number(minPrice), Number(maxPrice));
    const products = await prisma.product.findMany({
        where,
        include: {
            category: true,
        },
        orderBy,
    });

    // Fetch categories for sidebar filter
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className="min-h-screen bg-[#f8f5f2]"> {/* Beige background as per request image style */}

            {/* Header / Breadcrumb Component Area */}
            <div className="bg-[#1e3a2f] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center text-xs sm:text-sm text-gray-300 mb-4 space-x-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">Products</span>
                    </nav>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-serif">
                        All Products
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg">
                        {products.length} {products.length === 1 ? 'product' : 'products'} found matching your criteria
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    {/* Sticky handled internally or via wrapper, mostly internal sticky content */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <ProductFilters categories={categories} />
                    </div>

                    {/* Product Grid Area */}
                    <div className="flex-1">

                        {/* Toolbar: Sort & Count */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200 gap-4">
                            <div className="text-sm text-gray-500 font-medium">
                                Showing {products.length} results
                            </div>

                            <ProductSort />
                        </div>

                        {/* Grid */}
                        <ProductGrid products={products} />
                    </div>
                </div>
            </main>
        </div>
    );
}
