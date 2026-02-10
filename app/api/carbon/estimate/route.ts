import { NextRequest, NextResponse } from 'next/server';
import { searchEmissionFactors, estimateEmissions } from '@/lib/climatiq';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, category, weight, price, weightUnit = 'kg', currency = 'USD' } = body;

        if (!weight || !category) {
            return NextResponse.json(
                { error: 'Weight and Category are required for estimation' },
                { status: 400 }
            );
        }

        // 1. Find relevant emission factor
        // Broad search first: category + name
        let factors = await searchEmissionFactors(`${category} ${name}`);

        // If no results, try just category
        if (factors.length === 0) {
            factors = await searchEmissionFactors(category);
        }

        // If still no results, try generic "Consumer Goods" or similar if we had a fallback
        if (factors.length === 0) {
            return NextResponse.json(
                { error: 'No emission factors found for this category/product' },
                { status: 404 }
            );
        }

        // Pick the best factor. Ideally, one with unit_type matching our input (Weight or Money)
        // We prefer Weight-based factors for physical goods.
        const weightFactor = factors.find(f => f.unit_type === 'Weight');
        const moneyFactor = factors.find(f => f.unit_type === 'Money');

        let selectedFactor = weightFactor || moneyFactor || factors[0];

        // 2. Estimate Emissions
        let amount = weight;
        let unit = weightUnit;

        if (selectedFactor.unit_type === 'Money') {
            amount = price;
            unit = currency;
            if (!price) {
                return NextResponse.json(
                    { error: 'Price required for money-based estimation' },
                    { status: 400 }
                );
            }
        }

        const estimate = await estimateEmissions(selectedFactor.id, amount, unit);

        if (!estimate) {
            return NextResponse.json(
                { error: 'Failed to calculate estimate' },
                { status: 500 }
            );
        }

        // 3. Calculate "Saved"
        // Assumption: Buying Used saves ~90% of production emissions (only transport/logistics remaining)
        // Or "Avoided Emissions" = New Product Footprint - User's Product Footprint (if refurbished/used)
        // We assume the calculated estimate IS the "New Product Footprint".
        // And the "Used Product Footprint" is negligible (e.g., 5% for transport).
        // So Saved = 95% of New.

        const newProductFootprint = estimate.co2e; // in kgCO2e (Climatiq usually gives kg or we normalize it)
        const avoidedEmissions = newProductFootprint * 0.9; // 90% savings

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
