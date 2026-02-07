import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';

export function CTA() {
    return (
        <section className="bg-gradient-to-br from-[#182f25] to-[#1e3a2f] py-20 text-center relative overflow-hidden">
            {/* Background decoration (optional/implied from screenshot context) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {/* Could use a pattern or subtle image here to match screenshot texture if needed */}
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

                {/* Icon */}
                <div className="mb-6 text-[#fad050]">
                    <Package className="h-16 w-16" strokeWidth={1.5} />
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Start Your Sustainable Journey Today
                </h2>

                {/* Subheading */}
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of conscious consumers making a difference with every purchase.
                </p>

                {/* Button */}
                <Link href="/products">
                    <Button className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold text-lg rounded-full px-8 py-6 h-auto">
                        Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
