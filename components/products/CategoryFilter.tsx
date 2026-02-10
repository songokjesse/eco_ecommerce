'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface CategoryFilterProps {
    categorySlug: string;
}

export function CategoryFilter({ categorySlug }: CategoryFilterProps) {
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);

    const conditions = [
        { id: 'new', label: 'New' },
        { id: 'like-new', label: 'Like New' },
        { id: 'refurbished', label: 'Refurbished' }
    ];

    const handleReset = () => {
        setPriceRange([0, 1000]);
        setSelectedConditions([]);
        setInStockOnly(false);
    };

    const toggleCondition = (conditionId: string) => {
        setSelectedConditions(prev =>
            prev.includes(conditionId)
                ? prev.filter(id => id !== conditionId)
                : [...prev, conditionId]
        );
    };

    return (
        <div className="space-y-6">
            {/* Price Range */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            {/* Condition */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Condition</h3>
                <div className="space-y-2">
                    {conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={condition.id}
                                checked={selectedConditions.includes(condition.id)}
                                onCheckedChange={() => toggleCondition(condition.id)}
                            />
                            <Label
                                htmlFor={condition.id}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {condition.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <Label
                        htmlFor="in-stock"
                        className="text-sm font-normal cursor-pointer"
                    >
                        In Stock Only
                    </Label>
                </div>
            </div>

            {/* Reset Button */}
            <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
            >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
            </Button>
        </div>
    );
}
