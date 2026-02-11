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

        // 1. Search Strategy
        let factors: any[] = [];

        // A. Try "Category Name" (Specific)
        factors = await searchEmissionFactors(`${category} ${name}`);

        // B. Try "Name" alone (if Category+Name was too specific/noisy)
        if (factors.length === 0) {
            factors = await searchEmissionFactors(name);
        }

        // C. Try "Category" alone (Fallback)
        if (factors.length === 0) {
            factors = await searchEmissionFactors(category);
        }

        // D. Try generic fallback
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
                // If price is invalid but we have weight, try to force fallback to weight factor if available?
                // But we chose money factor because weight factor likely wasn't found or money was preferred?
                // Actually my logic above prefers Weight. So if we are here, Weight factor was NOT found.
                // So we MUST use Money.
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

        const estimate = await estimateEmissions(selectedFactor.id, amount, unit);

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
