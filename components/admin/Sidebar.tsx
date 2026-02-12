'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    Undo2,
    Banknote,
    LifeBuoy,
    ShieldAlert,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingBag },
    { name: 'Sellers', href: '/dashboard/admin/sellers', icon: Users },
    { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Moderation', href: '/dashboard/admin/products', icon: Package },
    { name: 'Refunds', href: '/dashboard/admin/refunds', icon: Undo2 },
    { name: 'Payouts', href: '/dashboard/admin/payouts', icon: Banknote },
    { name: 'Support', href: '/dashboard/admin/tickets', icon: LifeBuoy },
    { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: ShieldAlert },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#1a1f2c] border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-40 text-gray-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Admin Console</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                    Main Menu
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    // Special case for dashboard root to strictly match or it matches everything
                    const isRoot = item.href === '/dashboard/admin';
                    const activeState = isRoot ? pathname === item.href : isActive;

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                activeState
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-colors", activeState ? "text-blue-400" : "text-gray-500 group-hover:text-white")} strokeWidth={1.5} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all text-sm font-medium"
                >
                    <LogOut className="h-5 w-5" strokeWidth={1.5} />
                    <span>Exit Admin</span>
                </Link>
            </div>
        </aside>
    );
}
