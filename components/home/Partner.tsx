import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store } from 'lucide-react';

export function Partner() {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="bg-[#1e3a2f] rounded-[2rem] p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">

                    {/* Background decoration (Store Icon) */}
                    <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none transform rotate-[-10deg]">
                        <Store className="h-96 w-96 text-white" strokeWidth={0.5} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-xl text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-[#fad050] text-sm font-medium mb-6">
                            <Store className="h-4 w-4" />
                            <span>For Business</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Partner with CircuCity
                        </h2>

                        <p className="text-gray-200 text-lg leading-relaxed mb-8">
                            Join our marketplace of eco-conscious sellers. Reach customers who care about the planet and grow your sustainable business.
                        </p>

                        <Link href="/become-seller">
                            <Button className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold text-lg rounded-full px-8 py-6 h-auto">
                                Become a Seller <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Right side spacer if needed, or maybe an image? Design shows textual alignment to left, icon on right. */}
                    <div className="md:w-1/3"></div>
                </div>
            </div>
        </section>
    );
}
