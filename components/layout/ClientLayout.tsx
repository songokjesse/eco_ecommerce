'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminFooter } from '@/components/admin/AdminFooter';

export function ClientLayout({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
    const pathname = usePathname();

    const isSellerDashboard = pathname?.startsWith('/dashboard/seller');
    const isAdminDashboard = pathname?.startsWith('/dashboard/admin');

    if (isSellerDashboard) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header isAdmin={isAdmin} hideNavigation={isAdminDashboard} />
            <main className="flex-1">
                {children}
            </main>
            {isAdminDashboard ? <AdminFooter /> : <Footer />}
        </div>
    );
}
