export const POSTNORD_CONTRACT_RATES = {
    "3": 77.60,
    "5": 106.40,
    "10": 143.20,
    "15": 175.20,
    "20": 205.60,
    "25": 271.20,
    "30": 317.60
};

export const HANDLING_FEE_PERCENTAGE = 0.10; // 10%

export function calculateShippingCost(weightKg: number): {
    postnordCost: number;
    handlingFee: number;
    totalShippingPrice: number;
} {
    // Find appropriate weight tier (fallback to highest if over 30kg, or handle custom)
    const tiers = Object.keys(POSTNORD_CONTRACT_RATES).map(Number).sort((a, b) => a - b);
    let tier = tiers.find(t => t >= weightKg);

    // Default to max tier if heavier (or handle error/custom quote)
    if (!tier) tier = tiers[tiers.length - 1];

    const postnordCost = POSTNORD_CONTRACT_RATES[tier as any as keyof typeof POSTNORD_CONTRACT_RATES];
    const handlingFee = parseFloat((postnordCost * HANDLING_FEE_PERCENTAGE).toFixed(2));
    const totalShippingPrice = parseFloat((postnordCost + handlingFee).toFixed(2));

    return {
        postnordCost,
        handlingFee,
        totalShippingPrice
    };
}
