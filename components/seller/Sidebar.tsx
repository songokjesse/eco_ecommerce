'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    RefreshCw,
    BarChart3,
    Store,
    Settings,
    LifeBuoy,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, based on earlier context

const menuItems = [
    { name: 'Overview', href: '/dashboard/seller', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/seller/products', icon: Package },
    { name: 'Orders', href: '/dashboard/seller/orders', icon: ShoppingBag },
    { name: 'Swap Market', href: '/dashboard/seller/swap', icon: RefreshCw },
    { name: 'Analytics', href: '/dashboard/seller/analytics', icon: BarChart3 },
    { name: 'My Store', href: '/dashboard/seller/store', icon: Store },
    { name: 'Settings', href: '/dashboard/seller/settings', icon: Settings },
    { name: 'Support', href: '/dashboard/seller/support', icon: LifeBuoy },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-sm">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-50">
                <div className="bg-[#1e3a2f] h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-[#1e3a2f] font-bold text-lg tracking-tight">Seller Hub</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                    Menu
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-[#1e3a2f] text-white shadow-md shadow-green-900/10 translate-x-1"
                                    : "text-gray-500 hover:bg-green-50 hover:text-[#1e3a2f]"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-[#1e3a2f]")} strokeWidth={1.5} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-xl transition-all text-sm font-medium"
                >
                    <LogOut className="h-5 w-5" strokeWidth={1.5} />
                    <span>Back to Marketplace</span>
                </Link>
            </div>
        </aside>
    );
}
