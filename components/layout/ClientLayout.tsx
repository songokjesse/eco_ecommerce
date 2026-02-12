'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';


export function ClientLayout({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
    const pathname = usePathname();

    // Check for seller or admin dashboard
    const isDashboard = pathname?.startsWith('/dashboard/seller') || pathname?.startsWith('/dashboard/admin');

    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <>

            <Header isAdmin={isAdmin} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
