import { CategoryPage } from '@/components/products/CategoryPage';
import { Apple } from 'lucide-react';

export default function OrganicFoodPage() {
    return (
        <CategoryPage
            categorySlug="organic-food"
            categoryName="Organic Food"
            description="Discover fresh, locally-sourced organic produce and sustainable food products. Support local farmers and reduce your carbon footprint with every purchase."
            icon={<Apple className="w-10 h-10" />}
        />
    );
}
