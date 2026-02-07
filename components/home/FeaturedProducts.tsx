import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Heart, Leaf } from 'lucide-react';

const products = [
    {
        available: true,
        id: 1,
        name: 'Organic Cotton Tote Bag',
        price: 24.99,
        image: '/product-1.png',
        tag: 'Go Plastic Free',
        co2: '0.4kg',
    },
    {
        available: true,
        id: 2,
        name: 'Bamboo Toothbrush Set',
        price: 12.99,
        image: '/product-2.png',
        tag: 'Go Plastic Free',
        co2: '1.2kg',
    },
    {
        available: true,
        id: 3,
        name: 'Solar Powered Phone Charger',
        price: 49.99,
        image: '/product-3.png',
        tag: 'Energy Saver',
        co2: '12.5kg',
    },
    {
        available: true,
        id: 4,
        name: 'Recycled Glass Water Bottle',
        price: 19.00,
        image: '/product-4.png',
        tag: 'Go Plastic Free',
        co2: '0.8kg',
    },
];

export function FeaturedProducts() {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
                <Button variant="default" className="rounded-full bg-primary/90 hover:bg-primary text-white">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10">
                        {/* Wishlist Button */}
                        <button className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                        </button>

                        {/* Image */}
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-green-600 px-2 py-0.5 rounded-full">
                                    <Leaf className="h-3 w-3" /> {product.tag}
                                </span>
                                <span className="text-[10px] text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                    {product.co2} CO₂ Saved
                                </span>
                            </div>

                            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-lg text-foreground">${product.price.toFixed(2)}</span>
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors">
                                    <ShoppingCart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
