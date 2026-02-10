import { CategoryPage } from '@/components/products/CategoryPage';
import { Apple } from 'lucide-react';

interface SearchParams {
    minPrice?: string;
    maxPrice?: string;
    condition?: string | string[];
    minCo2?: string;
    maxCo2?: string;
    inStock?: string;
}

export default async function OrganicFoodPage(props: {
    searchParams: Promise<SearchParams>;
}) {
    const searchParams = await props.searchParams;

    return (
        <CategoryPage
            categorySlug="organic-food"
            categoryName="Organic Food"
            description="Discover fresh, locally-sourced organic produce and sustainable food products. Support local farmers and reduce your carbon footprint with every purchase."
            icon={<Apple className="w-10 h-10" />}
            searchParams={searchParams}
        />
    );
}
