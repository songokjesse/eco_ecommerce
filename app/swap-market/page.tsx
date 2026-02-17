import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function SwapMarketPage() {
    return (
        <div className="min-h-screen bg-[#f8f5f2] flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="bg-[#1e3a2f]/5 p-6 rounded-full mb-6">
                <RefreshCw className="w-16 h-16 text-[#1e3a2f]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a2f] mb-4 font-serif">
                Swap Market
            </h1>

            <p className="text-xl md:text-2xl text-[#1e3a2f]/80 font-medium mb-4">
                Coming Soon
            </p>

            <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                We're building a sustainable way for you to swap items directly with other community members.
                Stay tuned for a new way to refresh your life without waste!
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#fad050] text-[#1e3a2f] px-8 py-3 rounded-full font-semibold hover:bg-[#eaca40] transition-colors shadow-sm hover:shadow-md"
            >
                <ArrowLeft className="w-4 h-4" />
                Return Home
            </Link>
        </div>
    );
}
