import { Recycle, Timer, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SwapMarketPage() {
    return (
        <main className="min-h-screen bg-[#F5F0E6] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 transform -rotate-12">
                    <Recycle className="w-64 h-64 text-[#2D5F3F]" />
                </div>
                <div className="absolute bottom-10 right-10 transform rotate-45">
                    <Recycle className="w-96 h-96 text-[#2D5F3F]" />
                </div>
            </div>

            <div className="relative z-10 max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F4D35E]/20 backdrop-blur-sm rounded-full mb-8 border border-[#F4D35E]/30 animate-pulse">
                    <Timer className="w-5 h-5 text-[#2D5F3F]" />
                    <span className="font-bold text-[#2D5F3F]">Coming Soon</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-[#2D5F3F] mb-6 leading-tight">
                    The Swap Market is <br />
                    <span className="text-[#F4D35E]">Almost Here!</span>
                </h1>

                <p className="text-xl md:text-2xl text-[#4a6b56] mb-12 leading-relaxed max-w-2xl mx-auto">
                    Get ready to join the circular economy. Trade items, reduce waste, and connect with our eco-conscious community.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/">
                        <Button className="rounded-full bg-[#2D5F3F] hover:bg-[#1e3a28] text-white px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl transition-all">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>

                    <Button variant="outline" className="rounded-full border-[#2D5F3F] text-[#2D5F3F] hover:bg-[#2D5F3F]/5 px-8 py-6 text-lg h-auto">
                        <Mail className="mr-2 h-5 w-5" />
                        Notify Me When Ready
                    </Button>
                </div>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-8 text-[#4a6b56] text-sm md:text-base opacity-80">
                © {new Date().getFullYear()} CircuCity. Transforming consumption, one swap at a time.
            </div>
        </main>
    );
}
