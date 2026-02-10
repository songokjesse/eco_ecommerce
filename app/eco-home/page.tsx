import { CategoryPage } from '@/components/products/CategoryPage';
import { Home } from 'lucide-react';

export default function EcoHomePage() {
    return (
        <CategoryPage
            categorySlug="eco-home"
            categoryName="Eco Home"
            description="Transform your living space with sustainable home products. From bamboo kitchenware to energy-efficient appliances, create an eco-friendly home you'll love."
            icon={<Home className="w-10 h-10" />}
        />
    );
}
