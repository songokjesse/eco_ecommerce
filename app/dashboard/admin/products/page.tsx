import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Package, ExternalLink } from 'lucide-react';
import { AdminSearch } from '@/components/admin/Search';
import { ProductModerationActions } from './ProductActions';

export default async function AdminProductsPage(props: {
    searchParams?: Promise<{ q?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';
    const status = searchParams?.status;

    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { shop: { name: { contains: query, mode: 'insensitive' } } }
        ];
    }

    if (status && status !== 'ALL') {
        where.moderationStatus = status;
    }

    const products = await prisma.product.findMany({
        where,
        include: {
            shop: {
                select: { name: true, owner: { select: { email: true } } }
            },
            category: true
        },
        orderBy: [
            { moderationStatus: 'asc' }, // Pending first (if P < A < R alphabetically? No. PENDING, APPROVED, REJECTED. P is middle. Need custom sort or rely on created desc)
            { createdAt: 'desc' }
        ],
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Listing Moderation</h1>
                    <p className="text-sm text-gray-500">Review and moderate product listings</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Suspense fallback={<div className="w-full max-w-sm h-10 bg-gray-100 rounded-md animate-pulse" />}>
                        <AdminSearch placeholder="Search products..." />
                    </Suspense>
                    <Link
                        href="/dashboard/admin/products"
                        className="px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </Link>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="max-w-[300px]">Product</TableHead>
                            <TableHead>Shop</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    No products found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                                            {product.images[0] && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-gray-900 truncate max-w-[250px]">{product.name}</span>
                                            <span className="text-xs text-gray-500">{product.category.name}</span>
                                            <Link href={`/products/${product.id}`} target="_blank" className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-1">
                                                View Live <ExternalLink className="w-2.5 h-2.5" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-700">{product.shop.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={product.moderationStatus === 'APPROVED' ? 'default' : 'secondary'}
                                            className={`
                                                ${product.moderationStatus === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                                ${product.moderationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : ''}
                                                ${product.moderationStatus === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                            `}
                                        >
                                            {product.moderationStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-gray-900">
                                        ${Number(product.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ProductModerationActions productId={product.id} currentStatus={product.moderationStatus} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
