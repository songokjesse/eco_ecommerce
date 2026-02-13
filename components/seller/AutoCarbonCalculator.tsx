
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AutoCarbonCalculatorProps {
    category: string;
    initialWeight?: string;
    onCalculationComplete: (footprint: string, saved: string) => void;
}

export function AutoCarbonCalculator({ category, initialWeight = '', onCalculationComplete }: AutoCarbonCalculatorProps) {
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const weightInput = document.getElementById('weight') as HTMLInputElement;
        const priceInput = document.getElementById('price') as HTMLInputElement;

        const handleCalculation = async () => {
            const name = nameInput?.value;
            const weight = weightInput?.value;
            const price = priceInput?.value;

            if (!name || !category || !weight) return;

            setCalculating(true);
            try {
                const res = await fetch('/api/carbon/estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, category, price, weight })
                });

                const data = await res.json();

                if (!data.error) {
                    const newFootprint = `${data.footprint.toFixed(2)} ${data.unit}`;
                    const newSaved = data.saved.toFixed(2);
                    onCalculationComplete(newFootprint, newSaved);
                }
            } catch (error) {
                console.error("Calculation failed", error);
            } finally {
                setCalculating(false);
            }
        };

        const debouncedCalculation = debounce(handleCalculation, 1000);

        // Add event listeners for input changes
        const inputs = [nameInput, weightInput, priceInput];
        inputs.forEach(input => input?.addEventListener('input', debouncedCalculation));

        // Initial calculation if values exist (e.g., edit mode or filled)
        if (weightInput?.value && category) {
            handleCalculation();
        }

        // Cleanup
        return () => {
            inputs.forEach(input => input?.removeEventListener('input', debouncedCalculation));
        };
    }, [category]); // Re-run effect if category changes

    function debounce(func: Function, wait: number) {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    if (!calculating) return null;

    return (
        <div className="flex items-center gap-2 text-xs text-green-600 mb-2 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Calculating impact...
        </div>
    );
}
