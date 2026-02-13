'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';


export function ClientLayout({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
    const pathname = usePathname();

    // Check if we are in the seller dashboard
    const isSellerDashboard = pathname?.startsWith('/dashboard/seller');

    if (isSellerDashboard) {
        return <>{children}</>;
    }

    return (
        <>

            <Header isAdmin={isAdmin} hideNavigation={pathname?.startsWith('/dashboard/admin')} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
