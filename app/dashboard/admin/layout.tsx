import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopBar } from "@/components/admin/TopBar";

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
        // Redirect unauthorized users
        redirect('/');
    }
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Fixed Left */}
            <AdminSidebar />

            {/* Main Content - Right of Sidebar */}
            <main className="flex-1 ml-64 relative bg-gray-50">
                <AdminTopBar />

                {/* Children (The specific dashboard pages) */}
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
