'use server';

import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

/**
 * Ensure user exists in database before checkout
 * This prevents the "blank order" bug for regular buyers
 */
async function ensureUserExists(userId: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (existingUser) {
        return existingUser;
    }

    // User doesn't exist - create from Clerk data
    console.log('User not in database, creating from Clerk data...');
    const clerkUser = await currentUser();

    if (!clerkUser) {
        throw new Error('Could not fetch user from Clerk');
    }

    const user = await prisma.user.create({
        data: {
            id: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            image: clerkUser.imageUrl || null,
            role: 'BUYER', // Default role
        },
    });

    console.log('✅ User created in database:', user.id);
    return user;
}

import { calculateShippingCost } from '@/lib/shipping-pricing';

// ... (existing imports)

// ... (existing ensureUserExists function)

export async function createCheckoutSession(productId: string) {
    const { userId } = await auth();
    if (!userId) {
        redirect('/sign-in');
    }

    // CRITICAL: Ensure user exists in database before checkout
    await ensureUserExists(userId);

    // ... (origin logic)
    let origin = process.env.NEXT_PUBLIC_URL;
    if (!origin && process.env.VERCEL_URL) {
        origin = `https://${process.env.VERCEL_URL}`;
    }
    if (!origin) {
        origin = 'http://localhost:3000';
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    // Calculate shipping
    const weight = product.weight || 0; // Default to 0 if not set (will map to min tier)
    const { totalShippingPrice } = calculateShippingCost(weight);

    // Stripe expects amount in cents (SEK is 2 decimal currency, so * 100)
    const shippingAmountInCents = Math.round(totalShippingPrice * 100);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'sek', // Changed to SEK
                    product_data: {
                        name: product.name,
                        images: product.images,
                        metadata: {
                            productId: product.id,
                            shopId: product.shopId,
                        }
                    },
                    // Stripe expects amount in cents
                    unit_amount: Math.round(Number(product.price) * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: shippingAmountInCents,
                        currency: 'sek',
                    },
                    display_name: 'PostNord Shipping + Handling',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 2,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 5,
                        },
                    },
                },
            },
        ],
        shipping_address_collection: {
            allowed_countries: ['SE', 'DK', 'NO', 'FI', 'DE'], // Focus on Nordics/EU
        },
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        metadata: {
            userId,
            orderType: 'single_product',
            productId: product.id,
        }
    });

    if (session.url) {
        redirect(session.url);
    }
}

export async function createCartCheckoutSession(items: { productId: string; quantity: number }[]) {
    const { userId } = await auth();
    if (!userId) {
        redirect('/sign-in');
    }

    // CRITICAL: Ensure user exists in database before checkout
    await ensureUserExists(userId);

    let origin = process.env.NEXT_PUBLIC_URL;
    if (!origin && process.env.VERCEL_URL) {
        origin = `https://${process.env.VERCEL_URL}`;
    }
    if (!origin) {
        origin = 'http://localhost:3000';
    }

    // Fetch all products from DB to verify prices
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    // Create a map for easy lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    let totalWeight = 0;

    const line_items = items.map(item => {
        const product = productMap.get(item.productId);
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }

        // Calculate weight contribution
        totalWeight += (product.weight || 0) * item.quantity;

        return {
            price_data: {
                currency: 'sek', // Changed to SEK
                product_data: {
                    name: product.name,
                    images: product.images,
                    metadata: {
                        productId: product.id,
                        shopId: product.shopId
                    }
                },
                unit_amount: Math.round(Number(product.price) * 100),
            },
            quantity: item.quantity,
        };
    });

    // Calculate total shipping
    const { totalShippingPrice } = calculateShippingCost(totalWeight);
    const shippingAmountInCents = Math.round(totalShippingPrice * 100);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: shippingAmountInCents,
                        currency: 'sek',
                    },
                    display_name: 'PostNord Shipping + Handling',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 2,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 5,
                        },
                    },
                },
            },
        ],
        shipping_address_collection: {
            allowed_countries: ['SE', 'DK', 'NO', 'FI', 'DE'],
        },
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        metadata: {
            userId,
            orderType: 'cart',
        }
    });

    if (session.url) {
        redirect(session.url);
    }
}
