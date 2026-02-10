import { CategoryPage } from '@/components/products/CategoryPage';
import { Smartphone } from 'lucide-react';

export default function GreenGadgetsPage() {
    return (
        <CategoryPage
            categorySlug="green-gadgets"
            categoryName="Green Gadgets"
            description="Explore innovative eco-friendly technology and gadgets. Solar chargers, energy-efficient devices, and sustainable tech solutions for the modern environmentalist."
            icon={<Smartphone className="w-10 h-10" />}
        />
    );
}
