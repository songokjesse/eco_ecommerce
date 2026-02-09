'use server';

import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';

export async function createCheckoutSession(productId: string) {
    const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: product.images,
                    },
                    // Stripe expects amount in cents
                    unit_amount: Math.round(Number(product.price) * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
    });

    if (session.url) {
        redirect(session.url);
    }
}
