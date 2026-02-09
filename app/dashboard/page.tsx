import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Package, User } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const isSeller = await checkRole('seller');

    // Check if they have a shop in DB (in case role is not yet synced in token)
    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    if (isSeller || shop) {
        redirect("/dashboard/seller");
    }

    // Default to buyer dashboard
    return (
        <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center space-y-6">
                <div className="mx-auto bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-[#1e3a2f]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">Welcome to your Dashboard</h1>
                <p className="text-gray-600">
                    Track your orders, manage your account, and explore new products.
                </p>

                <div className="space-y-3 pt-4">
                    <Link href="/dashboard/orders" className="block w-full">
                        <Button className="w-full bg-[#1e3a2f] hover:bg-[#152a22] text-white py-6 text-lg">
                            <Package className="w-5 h-5 mr-2" /> View My Orders
                        </Button>
                    </Link>

                    <Link href="/products" className="block w-full">
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6 text-lg">
                            Browse Products
                        </Button>
                    </Link>
                </div>

                {!isSeller && (
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <p className="text-sm text-gray-500 mb-4">Want to sell on CircuCity?</p>
                        <Link href="/become-seller" className="text-[#1e3a2f] font-medium hover:underline text-sm">
                            Become a Seller
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
