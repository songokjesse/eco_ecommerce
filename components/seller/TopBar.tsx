'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopBar() {
    const { user } = useUser();
    const pathname = usePathname();

    // Determine title based on path
    const getTitle = () => {
        if (pathname === '/dashboard/seller') return 'Overview';
        if (pathname.includes('/products')) return 'Products';
        if (pathname.includes('/orders')) return 'Orders';
        if (pathname.includes('/settings')) return 'Settings';
        return 'Dashboard';
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-8 py-4 mb-8 shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a2f]">{getTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-[#1e3a2f] transition-colors rounded-full hover:bg-gray-50">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-[#1e3a2f]">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">Seller</p>
                    </div>
                    <UserButton />
                </div>
            </div>
        </header>
    );
}
