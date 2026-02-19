import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store } from 'lucide-react';

export function Partner() {
    return (

        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#2D5F3F] rounded-[30px] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                            <Store className="w-4 h-4 text-[#F4D35E]" />
                            <span className="text-sm font-medium text-[#F4D35E]">For Business</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Partner with CircuCity</h2>

                        <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                            Join our marketplace of eco-conscious sellers. Reach customers who care about the planet and grow your sustainable business.
                        </p>

                        <Link href="/become-seller" className="inline-flex items-center gap-2 bg-[#F4D35E] text-[#2D5F3F] px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Become a Seller
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <Store className="absolute -right-12 -bottom-12 text-white/5 w-96 h-96 transform rotate-12" />
                </div>
            </div>
        </section>
    );
}
