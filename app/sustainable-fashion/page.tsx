import { CategoryPage } from '@/components/products/CategoryPage';
import { Shirt } from 'lucide-react';

export default function SustainableFashionPage() {
    return (
        <CategoryPage
            categorySlug="sustainable-fashion"
            categoryName="Sustainable Fashion"
            description="Look good, feel good, do good. Discover ethically-made clothing and accessories from sustainable materials. Fashion that doesn't cost the Earth."
            icon={<Shirt className="w-10 h-10" />}
        />
    );
}
