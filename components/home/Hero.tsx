import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export function Hero() {
    return (
        <section className="bg-background relative overflow-hidden pb-12 pt-8 md:pt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Text Content */}
                    <div className="flex flex-col gap-6 max-w-xl z-10">
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full w-fit shadow-sm border border-border">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-medium text-foreground">100% Eco-Friendly & Sustainable</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Your Destination for <span className="text-primary">Sustainable Living</span>
                        </h1>

                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            From organic foods to upcycled fashion, find everything you need to reduce your footprint without compromising on quality.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/products">
                                <Button size="lg" className="rounded-full px-8 text-base h-12">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12 bg-transparent border-primary/20 text-foreground hover:bg-primary/5">
                                    Explore Categories
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                        {/* Placeholder for avatars */}
                                        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <span className="text-sm font-medium">4.9 Ratings+</span>
                                <span className="text-xs text-muted-foreground">Trusted by 10k+ Customers</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative h-[500px] md:h-[600px] w-full rounded-[2rem] overflow-hidden mt-8 md:mt-0">
                        <div className="absolute inset-0 bg-[#f0ebd8] rounded-[2rem] -z-10 transform rotate-2 scale-95 opacity-50"></div>
                        <Image
                            src="/hero-image.png"
                            alt="Sustainable Fashion Model"
                            fill
                            className="object-cover object-center rounded-[2rem] shadow-xl"
                            priority
                        />

                        {/* Floating badges */}
                        <div className="absolute top-1/4 right-8 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">Secure Payment</span>
                            </div>
                        </div>

                        <div className="absolute bottom-1/3 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow delay-700">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold">Free Shipping</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
