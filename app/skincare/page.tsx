import { CategoryPage } from '@/components/products/CategoryPage';
import { Sparkles } from 'lucide-react';

export default function SkincarePage() {
    return (
        <CategoryPage
            categorySlug="skincare"
            categoryName="Skincare"
            description="Pamper your skin with natural, cruelty-free skincare products. From organic moisturizers to eco-friendly cleansers, find everything for your sustainable beauty routine."
            icon={<Sparkles className="w-10 h-10" />}
        />
    );
}
