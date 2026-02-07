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
        <section className="py-16 bg-[#fcf9f2]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-foreground mb-12">Shop By Category</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <div key={category.name} className="flex flex-col items-center gap-4 group cursor-pointer">
                            <div className="h-24 w-24 rounded-3xl bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all text-primary group-hover:bg-primary group-hover:text-white border border-transparent group-hover:border-primary/20">
                                <category.icon className="h-10 w-10" />
                            </div>
                            <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{category.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
