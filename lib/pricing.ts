export const WEBSITE_FEE_PERCENTAGE = 0.10; // 10% fee

/**
 * Formats a number as a SEK currency string.
 * @param amount The amount in SEK.
 * @returns Formatted string (e.g., "100 kr").
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Calculates the final price for the buyer, including the website fee.
 * @param basePrice The price the seller wants to earn (before fee).
 * @returns The final listed price.
 */
export function calculateFinalPrice(basePrice: number): number {
    return Number((basePrice * (1 + WEBSITE_FEE_PERCENTAGE)).toFixed(2));
}

/**
 * Calculates the seller's earnings from the final listed price.
 * @param finalPrice The price the buyer pays.
 * @returns The amount the seller earns.
 */
export function calculateSellerEarnings(finalPrice: number): number {
    return Number((finalPrice / (1 + WEBSITE_FEE_PERCENTAGE)).toFixed(2));
}

/**
 * Calculates the fee amount from the base price.
 * @param basePrice The price the seller wants to earn.
 * @returns The fee amount.
 */
export function calculateFeeAmount(basePrice: number): number {
    return Number((basePrice * WEBSITE_FEE_PERCENTAGE).toFixed(2));
}
