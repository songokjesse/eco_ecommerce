import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PromoBanners() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sustainable Fashion Banner */}
                    <div className="bg-[#E3E3E3] rounded-[30px] p-8 md:p-12 flex items-center relative overflow-hidden min-h-[450px]">
                        <div className="relative z-10 max-w-[60%] flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#F4D35E] text-[#2D5F3F] font-bold px-4 py-2 rounded-[80px] inline-flex items-center justify-center text-[15px] w-fit">
                                    Flat 20% Discount
                                </div>
                                <h3 className="text-4xl md:text-[48px] font-black text-[#474747] leading-tight">
                                    Sustainable Fashion
                                </h3>
                            </div>
                            <div className="flex flex-col gap-8">
                                <p className="text-[#848484] text-[18px] leading-[28px] max-w-md">
                                    Ethically made clothing using organic cotton and recycled materials.
                                </p>
                                <Link href="/products?category=sustainable-fashion" className="inline-flex items-center justify-center gap-2 w-[276px] h-[67px] bg-[#2D5F3F] text-white rounded-[60px] font-bold text-[18px] hover:bg-[#1a3a28] transition-all hover:shadow-lg">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="absolute right-[-100px] top-[-50px] bottom-[-50px] w-[60%] pointer-events-none">
                            <Image
                                src="/banner-1.png"
                                alt="Sustainable Fashion"
                                fill
                                className="object-contain object-center scale-125"
                            />
                        </div>
                    </div>

                    {/* Organic Soap Banner */}
                    <div className="bg-[#F4D35E] rounded-[30px] p-8 md:p-12 flex items-center relative overflow-hidden min-h-[450px]">
                        <div className="relative z-10 w-full md:w-[55%] flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#2D5F3F] text-[#F4D35E] font-bold px-4 py-2 rounded-[80px] inline-flex items-center justify-center text-[15px] w-fit">
                                    Flat 20% Discount
                                </div>
                                <h3 className="text-4xl md:text-[48px] font-black text-[#2D5F3F] leading-tight">
                                    Organic Soap
                                </h3>
                            </div>
                            <div className="flex flex-col gap-8">
                                <p className="text-[#2D5F3F] text-[18px] leading-[28px] max-w-md">
                                    Zero-waste essentials for a cleaner, smoother healthy skin
                                </p>
                                <Link href="/products?category=organic-soap" className="inline-flex items-center justify-center gap-2 w-[276px] h-[67px] bg-[#2D5F3F] text-white rounded-[60px] font-bold text-[18px] hover:bg-[#1a3a28] transition-all hover:shadow-lg">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none flex items-center justify-center z-0">
                            <Image
                                src="/banner-2.png"
                                alt="Organic Soap"
                                fill
                                className="object-contain object-center scale-90"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
