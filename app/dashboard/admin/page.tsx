
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardOverview() {
    // Fetch key metrics
    const totalGMV = await prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { total: true }
    });

    const totalNetRevenue = await prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { processingFee: true }
    });

    const pendingOrders = await prisma.order.count({
        where: { status: { in: ['PENDING', 'PAID'] } } // Need shipping
    });

    const activeListings = await prisma.product.count({
        where: { status: 'ACTIVE', moderationStatus: 'APPROVED' }
    });

    const pendingApprovals = await prisma.product.count({
        where: { moderationStatus: 'PENDING' }
    });

    const totalUsers = await prisma.user.count();

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GMV</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${Number(totalGMV._sum.total || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-muted-foreground">Total Sales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
                        <div className="h-4 w-4 text-green-600 font-bold">$</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">${Number(totalNetRevenue._sum.processingFee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Platform Fees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">To Fulfill</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Total Registered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approvals</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">Pending Listings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.user.name || 'Guest'}</p>
                                        <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                    </div>
                                    <div className="ml-auto font-medium">+${Number(order.total).toFixed(2)}</div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No recent orders.</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/dashboard/admin/products" className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium">
                            Review Pending Listings ({pendingApprovals})
                        </Link>
                        <Link href="/dashboard/admin/sellers" className="block w-full text-center py-2 px-4 border border-input rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                            Manage Sellers
                        </Link>
                        <Link href="/dashboard/admin/users" className="block w-full text-center py-2 px-4 border border-input rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                            User Management
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
