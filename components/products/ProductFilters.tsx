'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface ProductFiltersProps {
    categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const initialCategories = searchParams.getAll('category');
    const initialMinPrice = Number(searchParams.get('minPrice')) || 0;
    const initialMaxPrice = Number(searchParams.get('maxPrice')) || 1000;

    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);

    // Handle updates
    const applyFilters = useDebouncedCallback((newCategories: string[], newPriceRange: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update categories
        params.delete('category');
        newCategories.forEach(cat => params.append('category', cat));

        // Update price
        if (newPriceRange[0] > 0) params.set('minPrice', newPriceRange[0].toString());
        else params.delete('minPrice');

        if (newPriceRange[1] < 1000) params.set('maxPrice', newPriceRange[1].toString());
        else params.delete('maxPrice');

        router.push(`?${params.toString()}`, { scroll: false });
    }, 500);

    // Sync state with URL changes (back/forward)
    useEffect(() => {
        setSelectedCategories(searchParams.getAll('category'));
        setPriceRange([
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 1000
        ]);
    }, [searchParams]);

    const handleCategoryChange = (checked: boolean, categoryName: string) => {
        const nextCategories = checked
            ? [...selectedCategories, categoryName]
            : selectedCategories.filter((c) => c !== categoryName);

        setSelectedCategories(nextCategories);
        applyFilters(nextCategories, priceRange);
    };

    const handlePriceChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        setPriceRange(newRange);
        applyFilters(selectedCategories, newRange);
    };


    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Category</h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3 group">
                            <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.name)}
                                onCheckedChange={(checked) => handleCategoryChange(checked as boolean, category.name)}
                                className="border-gray-300 data-[state=checked]:bg-[#1e3a2f] data-[state=checked]:border-[#1e3a2f] transition-colors"
                            />
                            <Label
                                htmlFor={category.id}
                                className="text-sm text-gray-600 group-hover:text-[#1e3a2f] cursor-pointer font-medium transition-colors"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Price Range</h3>
                <div className="px-1">
                    <Slider
                        defaultValue={[0, 1000]}
                        value={[priceRange[0], priceRange[1]]}
                        max={1000}
                        step={10}
                        minStepsBetweenThumbs={1}
                        onValueChange={handlePriceChange}
                        className="my-6"
                    />
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                    <span className="bg-gray-100 px-3 py-1 rounded-md min-w-[60px] text-center">${priceRange[0]}</span>
                    <span className="text-gray-400">-</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-md min-w-[60px] text-center">${priceRange[1]}+</span>
                </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-sm h-9"
                    onClick={() => {
                        setSelectedCategories([]);
                        setPriceRange([0, 1000]);
                        router.push('/products');
                    }}
                >
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0 pr-8 border-r border-gray-100 min-h-screen">
                <div className="sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
                        <Filter className="w-5 h-5" />
                        <h2>Filters</h2>
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Filters Trigger */}
            <div className="lg:hidden mb-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filters
                            </span>
                            {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                                <span className="bg-[#1e3a2f] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <div className="mt-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
