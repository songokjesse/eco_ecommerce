import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function BuyerDashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Fetch user's orders
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PAID').length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="min-h-screen bg-[#f8f5f2] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">My Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track your orders and manage your account</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">All time purchases</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Lifetime value</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingOrders}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedOrders}</div>
                            <p className="text-xs text-muted-foreground">Delivered orders</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Your latest purchases and their status</CardDescription>
                            </div>
                            <Link
                                href="/dashboard/orders"
                                className="text-sm text-[#1e3a2f] hover:underline font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                                <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a2f] hover:bg-[#152a22] shadow-lg hover:shadow-xl transition-all"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/dashboard/orders/${order.id}`}
                                        className="block p-4 border border-gray-100 rounded-lg hover:border-[#1e3a2f] hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Order #{order.id.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    className={`${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                                    order.status === 'CANCELLED' || order.status === 'REFUNDED' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {order.status}
                                                </Badge>
                                                <span className="font-bold text-[#1e3a2f]">
                                                    ${Number(order.total).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item.id} className="relative w-12 h-12 bg-gray-50 rounded border border-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={item.product.images[0] || '/placeholder.png'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <Link href="/products">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 group-hover:text-[#1e3a2f] transition-colors">
                                    <ShoppingBag className="w-5 h-5" />
                                    Continue Shopping
                                </CardTitle>
                                <CardDescription>
                                    Discover more sustainable products
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <Link href="/dashboard/orders">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 group-hover:text-[#1e3a2f] transition-colors">
                                    <Package className="w-5 h-5" />
                                    View All Orders
                                </CardTitle>
                                <CardDescription>
                                    Track and manage your purchases
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
