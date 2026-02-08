import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default async function ProductsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    if (!shop) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Shop Found</h2>
                <p className="text-gray-500 mb-6">You need to create a shop before adding products.</p>
                <Link href="/become-seller">
                    <Button>Create Shop</Button>
                </Link>
            </div>
        );
    }

    const products = await prisma.product.findMany({
        where: { shopId: shop.id },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">


            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* Toolbar: Search & Add Product */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10 bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        />
                    </div>
                    <Link href="/dashboard/seller/products/new">
                        <Button className="bg-[#1e3a2f] hover:bg-[#162d24] text-white font-medium rounded-lg px-6">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#f9fafb]">
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Product</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Price</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Stock</th>
                                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">
                                        No products found. Start by adding your first product!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-4">
                                                {/* Product Image could go here if detailed, standard list usually has name mostly */}
                                                <div className="h-10 w-10 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {product.images && product.images.length > 0 ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400">
                                                            <div className="w-4 h-4 rounded-full bg-gray-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-[#1e3a2f]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${product.inventory > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {product.inventory > 0 ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-medium text-[#1e3a2f]">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {product.inventory}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1e3a2f]">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
