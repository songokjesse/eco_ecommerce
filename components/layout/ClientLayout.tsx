'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TopBar } from '@/components/layout/TopBar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if we are in the seller dashboard
    const isSellerDashboard = pathname?.startsWith('/dashboard/seller');

    if (isSellerDashboard) {
        return <>{children}</>;
    }

    return (
        <>
            <TopBar />
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
