import { NextRequest, NextResponse } from 'next/server';
import { searchEmissionFactors, estimateEmissions } from '@/lib/climatiq';

const MATERIALS = [
    'cotton', 'polyester', 'nylon', 'wool', 'silk', 'leather', 'denim', 'linen',
    'wood', 'bamboo', 'metal', 'steel', 'aluminum', 'copper', 'plastic', 'glass',
    'ceramic', 'paper', 'cardboard', 'rubber', 'silicone', 'electronics'
];

function extractAttributes(text: string): string {
    if (!text) return '';
    const lowerText = text.toLowerCase();
    const found = MATERIALS.filter(m => lowerText.includes(m));
    return found.join(' ');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, category, weight, price, weightUnit = 'kg', currency = 'USD' } = body;

        if (!weight || !category) {
            return NextResponse.json(
                { error: 'Weight and Category are required for estimation' },
                { status: 400 }
            );
        }

        // 1. Search Strategy
        let factors: any[] = [];
        const attributes = extractAttributes(description);

        // A. Try "Category + Attributes + Name" (Most Specific)
        if (attributes) {
            factors = await searchEmissionFactors(`${category} ${attributes} ${name}`);
        }

        // B. Try "Category + Name"
        if (factors.length === 0) {
            factors = await searchEmissionFactors(`${category} ${name}`);
        }

        // C. Try "Attributes + Category" (If name is too specific)
        if (factors.length === 0 && attributes) {
            factors = await searchEmissionFactors(`${attributes} ${category}`);
        }

        // D. Try "Name" alone
        if (factors.length === 0) {
            factors = await searchEmissionFactors(name);
        }

        // E. Try "Category" alone (Fallback)
        if (factors.length === 0) {
            factors = await searchEmissionFactors(category);
        }

        // F. Try generic fallback
        if (factors.length === 0) {
            factors = await searchEmissionFactors("Consumer Goods");
        }

        if (factors.length === 0) {
            return NextResponse.json(
                { error: 'No emission factors found for this category/product' },
                { status: 404 }
            );
        }

        // Pick the best factor. Ideally, one with unit_type matching our input (Weight or Money)
        // We prefer Weight-based factors for physical goods.
        const weightFactor = factors.find((f: any) => f.unit_type === 'Weight');
        const moneyFactor = factors.find((f: any) => f.unit_type === 'Money');

        let selectedFactor = weightFactor || moneyFactor || factors[0];

        // 2. Estimate Emissions
        let amount = parseFloat(weight);
        let unit = weightUnit;

        if (selectedFactor.unit_type === 'Money') {
            amount = parseFloat(price);
            unit = currency;

            // Check if price is valid number
            if (isNaN(amount) || amount <= 0) {
                return NextResponse.json(
                    { error: 'Valid price required for money-based estimation' },
                    { status: 400 }
                );
            }
        } else {
            // Weight based
            if (isNaN(amount) || amount <= 0) {
                return NextResponse.json(
                    { error: 'Valid weight required for weight-based estimation' },
                    { status: 400 }
                );
            }
        }

        const estimate = await estimateEmissions(selectedFactor.id, amount, unit, selectedFactor.unit_type);

        if (!estimate) {
            return NextResponse.json(
                { error: 'Failed to calculate estimate' },
                { status: 500 }
            );
        }

        // 3. Calculate "Saved"
        // Assumption: Buying Used saves ~90% of production emissions
        const newProductFootprint = estimate.co2e;
        const avoidedEmissions = newProductFootprint * 0.9;

        return NextResponse.json({
            footprint: newProductFootprint,
            saved: avoidedEmissions,
            unit: estimate.co2e_unit,
            factor_name: selectedFactor.name,
            factor_category: selectedFactor.category
        });

    } catch (error) {
        console.error('Estimate API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
