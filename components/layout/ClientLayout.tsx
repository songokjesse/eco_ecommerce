'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TopBar } from '@/components/layout/TopBar';

export function ClientLayout({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
    const pathname = usePathname();

    // Check if we are in the seller dashboard
    const isSellerDashboard = pathname?.startsWith('/dashboard/seller');

    if (isSellerDashboard) {
        return <>{children}</>;
    }

    return (
        <>
            <TopBar />
            <Header isAdmin={isAdmin} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
