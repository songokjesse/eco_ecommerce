import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-16 px-4 bg-gradient-to-br from-[#2D5F3F] to-[#1a3a28] text-white">
            <div className="max-w-4xl mx-auto text-center">
                <Package className="w-16 h-16 mx-auto mb-6 text-[#F4D35E]" />

                <h2 className="text-4xl mb-4">Start Your Sustainable Journey Today</h2>

                <p className="text-xl text-gray-200 mb-8">
                    Join thousands of conscious consumers making a difference with every purchase.
                </p>

                <Link href="/products" className="px-8 py-4 bg-[#F4D35E] text-[#2D5F3F] rounded-full inline-flex items-center gap-2 hover:bg-[#f0c840] transition-all shadow-lg">
                    Browse Products
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
}
