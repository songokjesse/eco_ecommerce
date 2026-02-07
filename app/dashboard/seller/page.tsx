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

    const isSeller = await checkRole('seller');
    if (!isSeller) redirect('/');

    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    if (!shop) {
        // Handle edge case where role is seller but shop not found
        redirect("/become-seller");
    }

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
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>

                {/* Product List Placeholder */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
