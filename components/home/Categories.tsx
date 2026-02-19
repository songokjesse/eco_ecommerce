import { Apple, Shirt, Sparkles, Home, Zap, Recycle } from 'lucide-react';

const categories = [
    { name: 'Organic Food', icon: Apple },
    { name: 'Sustainable Fashion', icon: Shirt },
    { name: 'Skincare', icon: Sparkles },
    { name: 'Eco Home', icon: Home },
    { name: 'Green Gadgets', icon: Zap },
    { name: 'Recycled Items', icon: Recycle },
];

export function Categories() {
    return (
        <section className="py-16 px-4 bg-[#F5F0E6]">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl text-center mb-12">Shop By Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="bg-white p-8 rounded-xl text-center border-2 border-transparent hover:border-[#2D5F3F] hover:scale-105 transition-all cursor-pointer group"
                        >
                            <category.icon className="w-12 h-12 mx-auto mb-3 text-[#2D5F3F]" />
                            <h3 className="text-lg group-hover:text-[#2D5F3F] transition-colors">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
