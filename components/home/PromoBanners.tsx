import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PromoBanners() {
    return (
        <section className="py-12 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Banner 1 */}
                <div className="relative overflow-hidden rounded-3xl h-[300px] flex items-center bg-gray-100 group">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/banner-1.png"
                            alt="Sustainable Fashion"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 max-w-sm">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-black text-xs font-bold mb-4">
                            Get 20% Discount
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Sustainable Fashion</h3>
                        <p className="text-gray-700 text-sm mb-6">Ethically made clothing using organic cotton and recycled materials.</p>
                        <Button className="rounded-full bg-[#2d4a3e] hover:bg-[#1e332a] text-white border-none">
                            Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="relative overflow-hidden rounded-3xl h-[300px] flex items-center bg-[#fdeca6] group">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/banner-2.png"
                            alt="Organic Soap"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-yellow-400/20 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-20 flex items-center justify-end p-8 md:p-12 w-full h-full">
                        <div className="max-w-[60%] ml-auto text-right flex flex-col items-end">
                            <span className="inline-block py-1 px-3 rounded-full bg-[#2d4a3e] text-white text-xs font-bold mb-4">
                                Eco Spa Line
                            </span>
                            <h3 className="text-3xl font-bold text-[#2d4a3e] mb-2">Organic Soap</h3>
                            <p className="text-[#2d4a3e]/80 text-sm mb-6">Zero-waste essentials for a cleaner, smoother healthy skin.</p>
                            <Button className="rounded-full bg-[#2d4a3e] hover:bg-[#1e332a] text-white border-none">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
