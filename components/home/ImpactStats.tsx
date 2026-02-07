import Image from 'next/image';
import { Leaf } from 'lucide-react';

export function ImpactStats() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">

                <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full w-fit mb-6">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Lifespan</span>
                </div>

                <h2 className="text-xl md:text-2xl font-medium text-foreground mb-2">Global CO2 Saved</h2>

                <div className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
                    127,561 kg
                </div>

                <p className="text-muted-foreground max-w-lg">
                    Together, our community has made a real environmental impact.
                </p>

            </div>

            {/* Background Globe Effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none -z-0">
                <Image
                    src="/globe.png"
                    alt="Globe Background"
                    fill
                    className="object-contain animate-spin-slow"
                />
            </div>

            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none"></div>
        </section>
    );
}
