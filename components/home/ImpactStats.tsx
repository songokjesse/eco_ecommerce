import Image from 'next/image';
import { Leaf } from 'lucide-react';

export function ImpactStats() {
    return (
        <section className="relative overflow-hidden py-16 px-4 bg-white">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] w-[600px] h-[600px] opacity-10 pointer-events-none">
                <div className="w-full h-full text-[#2D5F3F]">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full" style={{ transform: 'rotate(318.654deg)' }}>
                        <circle cx="50" cy="50" r="48"></circle>
                        <ellipse cx="50" cy="50" rx="48" ry="15"></ellipse>
                        <ellipse cx="50" cy="50" rx="48" ry="30"></ellipse>
                        <ellipse cx="50" cy="50" rx="48" ry="45"></ellipse>
                        <ellipse cx="50" cy="50" rx="15" ry="48"></ellipse>
                        <ellipse cx="50" cy="50" rx="30" ry="48"></ellipse>
                        <ellipse cx="50" cy="50" rx="45" ry="48"></ellipse>
                        <ellipse cx="50" cy="50" rx="48" ry="22" transform="rotate(45 50 50)"></ellipse>
                        <ellipse cx="50" cy="50" rx="22" ry="48" transform="rotate(45 50 50)"></ellipse>
                        <ellipse cx="50" cy="50" rx="48" ry="22" transform="rotate(135 50 50)"></ellipse>
                        <ellipse cx="50" cy="50" rx="22" ry="48" transform="rotate(135 50 50)"></ellipse>
                    </svg>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4D35E]/20 rounded-full mb-4">
                    <Leaf className="w-5 h-5 text-[#2D5F3F]" />
                    <span className="text-sm text-[#2D5F3F]">Live Impact</span>
                </div>

                <h2 className="text-4xl mb-4">Global CO₂ Saved</h2>

                <div className="text-6xl md:text-8xl text-[#2D5F3F] mb-4 tabular-nums">
                    127,639 kg
                </div>

                <p className="text-gray-600">
                    Together, our community has made a real environmental impact
                </p>
            </div>
        </section>
    );
}
