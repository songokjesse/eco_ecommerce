import { RefreshCw } from 'lucide-react';

export default function SellerSwapMarketPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-[#1e3a2f]/5 p-6 rounded-full mb-6">
                <RefreshCw className="w-16 h-16 text-[#1e3a2f]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a2f] mb-4 font-serif">
                Seller Swap Hub
            </h1>

            <p className="text-xl text-[#1e3a2f]/80 font-medium mb-4">
                Coming Soon
            </p>

            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Soon you'll be able to manage your swap listings, review incoming offers, and track your swap history directly from your dashboard.
            </p>
        </div>
    );
}
