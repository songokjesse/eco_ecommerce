import { Sidebar } from "@/components/seller/Sidebar";
import { TopBar } from "@/components/seller/TopBar";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#fcf9f2]">
            {/* Sidebar - Fixed Left */}
            <Sidebar />

            {/* Main Content - Right of Sidebar */}
            <main className="flex-1 ml-64 relative bg-[#fcf9f2]">
                <TopBar />

                {/* Children (The specific dashboard pages) */}
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
