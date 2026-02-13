import { AdminSidebar } from "@/components/admin/Sidebar";
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminFooter } from "@/components/admin/AdminFooter";

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
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 relative bg-gray-50 flex flex-col min-h-screen">
                <div className="p-8 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
                <div className="px-8 pb-4">
                    <AdminFooter />
                </div>
            </main>
        </div>
    );
}
