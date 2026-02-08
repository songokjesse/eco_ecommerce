'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from 'next/link';
import {
    DollarSign,
    ShoppingBag,
    Eye,
    Leaf,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    activeProducts: number;
    storeViews?: number; // Mocked
    co2Saved?: number; // Mocked
}

export default function SellerDashboard() {
    const { user } = useUser();
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalOrders: 0,
        activeProducts: 0,
        storeViews: 1245,
        co2Saved: 845,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch real stats from API
                const res = await fetch('/api/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchStats();
        }
    }, [user]);

    // Mock Data for Charts/Lists
    const topSelling = [
        { name: 'Organic Cotton T-Shirt', sales: 124, status: 'Trending' },
        { name: 'Bamboo Toothbrush', sales: 85, status: 'Trending' },
        { name: 'Recycled Tote Bag', sales: 54, status: 'Low' },
        { name: 'Metal Straw Set', sales: 42, status: 'Trending' },
    ];

    const recentOrders = [
        { id: '#2024', items: '2 items', total: '$145.00', date: 'Oct 23, 2026', status: 'Paid' },
        { id: '#2023', items: '1 item', total: '$45.00', date: 'Oct 22, 2026', status: 'Processing' },
        { id: '#2022', items: '3 items', total: '$210.50', date: 'Oct 21, 2026', status: 'Shipped' },
    ];

    return (
        <div className="space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalSales.toLocaleString()}`}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                />
                <StatCard
                    title="Active Orders"
                    value={stats.totalOrders.toString()}
                    trend="+4"
                    trendUp={true}
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Store Views"
                    value={stats.storeViews?.toLocaleString() || '0'}
                    trend="+24%"
                    trendUp={true}
                    icon={Eye}
                />
                <StatCard
                    title="CO₂ Saved"
                    value={`${stats.co2Saved} kg`}
                    trend="+8%"
                    trendUp={true}
                    icon={Leaf}
                />
            </div>

            {/* Middle Section: Chart + Top Selling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart (Mock) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-[#1e3a2f]">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Daily revenue performance for the current week</p>
                        </div>
                    </div>

                    {/* Simple CSS Chart Placeholder */}
                    <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
                        {/* Mock bars/lines */}
                        {[30, 45, 35, 60, 75, 50, 80].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full">
                                <div
                                    className="w-full bg-[#1e3a2f]/10 rounded-t-sm hover:bg-[#1e3a2f]/20 transition-all relative group"
                                    style={{ height: `${h}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1e3a2f] text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                        ${h * 100}
                                    </div>
                                    {/* Line connector simulation (simplified as bars for robustness) */}
                                    <div className="w-full bg-[#1e3a2f] h-1 absolute top-0 rounded-full"></div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-[#1e3a2f] mb-1">Top Selling</h3>
                    <p className="text-sm text-gray-500 mb-6">Most popular items this week</p>

                    <div className="flex-1 space-y-4">
                        {topSelling.map((product, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-[#fcf9f2] rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Package className="h-5 w-5 text-[#1e3a2f]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1e3a2f]">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sales} sold</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.status === 'Trending'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full mt-6 border-dashed border-[#1e3a2f]/30 text-[#1e3a2f] hover:bg-[#fcf9f2]">
                        View All Products
                    </Button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#1e3a2f]">Recent Orders</h3>
                    <Link href="/dashboard/seller/orders" className="text-sm font-medium text-[#1e3a2f] hover:underline">
                        View All Orders
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-[#fcf9f2]/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-50 p-2 rounded-lg">
                                                <Package className="h-5 w-5 text-gray-400 group-hover:text-[#1e3a2f]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1e3a2f]">Order {order.id}</p>
                                                <p className="text-xs text-gray-500">{order.items} • {order.total}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-500 text-right">
                                        {order.date}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#1e3a2f]">
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, trendUp, icon: Icon }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-[#1e3a2f]">{value}</span>
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
                {trendUp ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingUp className="h-3 w-3 text-red-600" />}
                <span className={trendUp ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{trend}</span>
                <span className="text-gray-400 ml-1">vs. last month</span>
            </div>
        </div>
    );
}
