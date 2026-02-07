import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, ShoppingBag } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link';

export default async function SellerDashboard() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    const isSeller = await checkRole('seller');

    // If neither shop nor role exists, user is unauthorized
    if (!shop && !isSeller) {
        redirect('/');
    }

    // If role exists but shop doesn't, redirect to registration
    if (!shop) {
        redirect("/become-seller");
    }

    // Fetch stats
    const productCount = await prisma.product.count({
        where: { shopId: shop.id }
    });

    const orderItems = await prisma.orderItem.findMany({
        where: {
            product: {
                shopId: shop.id
            }
        },
        select: {
            price: true,
            quantity: true,
            orderId: true
        }
    });

    const totalSales = orderItems.reduce((acc, item) => {
        return acc + (Number(item.price) * item.quantity);
    }, 0);

    const totalOrders = new Set(orderItems.map(item => item.orderId)).size;

    // Fetch recent products
    const products = await prisma.product.findMany({
        where: { shopId: shop.id },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center font-bold text-primary text-xl">
                                {shop.name} Dashboard
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            ${totalSales.toFixed(2)}
                        </dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalOrders}</dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{productCount}</dd>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
                    <Button asChild>
                        <Link href="/dashboard/seller/products/new">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                {/* Product List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {products.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    ${Number(product.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Inventory: {product.inventory}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
