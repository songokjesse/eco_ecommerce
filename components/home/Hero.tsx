import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative bg-[#F5F0E6] pt-10 pb-20 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
                        <span className="text-sm font-medium text-gray-800">100% Eco-Friendly & Sustainable</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
                        Your Destination for <span className="text-[#2D5F3F]">Sustainable Living</span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        From organic foods to upcycled fashion, find everything you need to reduce your footprint without compromising on quality.
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mb-12">
                        <Link href="/products" className="px-8 py-4 bg-[#2D5F3F] text-white rounded-full flex items-center gap-2 hover:bg-[#1a3a28] transition-all shadow-lg hover:shadow-xl">
                            Shop Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/products" className="text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-[#2D5F3F] transition-colors">
                            Explore Categories
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                    {/* Placeholder for avatars */}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#F4D35E] flex items-center justify-center text-sm font-bold text-[#2D5F3F]">+</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg text-neutral-900">4.8 Ratings+</div>
                            <div className="text-sm text-gray-600">Trusted by 75k+ Customers</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Image
                        src="/hero-image.png"
                        alt="Woman wearing sustainable clothes"
                        width={600}
                        height={600}
                        className="w-full h-auto object-contain relative z-10"
                        priority
                    />

                    <div className="absolute top-1/3 right-0 bg-white p-3 rounded-xl shadow-lg z-20 flex items-center gap-3 animate-bounce-slow">
                        <div className="p-2 bg-[#2D5F3F] rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        </div>
                        <div>
                            <div className="font-bold text-sm text-neutral-900">Secure Payment</div>
                        </div>
                    </div>

                    <div className="absolute bottom-24 left-16 bg-white p-3 rounded-xl shadow-lg z-20 flex items-center gap-3 animate-bounce-slow delay-150">
                        <div className="p-2 bg-[#2D5F3F] rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
                        </div>
                        <div>
                            <div className="font-bold text-sm text-neutral-900">Eco-Shipping</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
