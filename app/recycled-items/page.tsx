import { CategoryPage } from '@/components/products/CategoryPage';
import { Recycle } from 'lucide-react';

export default function RecycledItemsPage() {
    return (
        <CategoryPage
            categorySlug="recycled-items"
            categoryName="Recycled Items"
            description="Give new life to recycled materials. Browse unique products made from upcycled and recycled materials, reducing waste and supporting circular economy."
            icon={<Recycle className="w-10 h-10" />}
        />
    );
}
