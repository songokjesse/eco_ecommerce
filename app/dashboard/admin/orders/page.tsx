import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Eye, Package, ShoppingBag } from 'lucide-react';
import { AdminSearch } from '@/components/admin/Search';
import { Suspense } from 'react';

export default async function AdminOrdersPage(props: {
    searchParams?: Promise<{ q?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';
    const status = searchParams?.status;

    const where: any = {};

    if (query) {
        where.OR = [
            { id: { contains: query, mode: 'insensitive' } },
            { shippingName: { contains: query, mode: 'insensitive' } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
            { user: { name: { contains: query, mode: 'insensitive' } } }
        ];
    }

    if (status && status !== 'ALL') {
        where.status = status;
    }

    const orders = await prisma.order.findMany({
        where,
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            },
            _count: {
                select: { items: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50 // Limit for performance
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500">Manage and view all customer orders</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Suspense fallback={<div className="w-full max-w-sm h-10 bg-gray-100 rounded-md animate-pulse" />}>
                        <AdminSearch placeholder="Search orders..." />
                    </Suspense>
                    <Link
                        href="/dashboard/admin/orders"
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
                            <TableHead className="w-[120px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    No orders found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-mono text-xs text-gray-500 font-medium">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-gray-900">
                                                {order.shippingName || order.user?.name || 'Guest'}
                                            </span>
                                            <span className="text-xs text-gray-500">{order.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`
                                                ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                ${order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : ''}
                                                ${order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-700' : ''}
                                                ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                                                ${order.status === 'REFUNDED' ? 'bg-orange-100 text-orange-700' : ''}
                                            `}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-gray-600">
                                        {order._count.items}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-gray-900">
                                        ${Number(order.total).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={`/dashboard/admin/orders/${order.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Details
                                        </Link>
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
