import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        // Retrieve the session to get line items and expanded details
        const retrievedSession = await stripe.checkout.sessions.retrieve(
            session.id,
            {
                expand: ['line_items.data.price.product'],
            }
        );

        const userId = retrievedSession.metadata?.userId;
        const lineItems = retrievedSession.line_items?.data;

        if (!userId || !lineItems) {
            return new NextResponse('Webhook Error: Missing metadata or line items', { status: 400 });
        }

        try {
            // Create the order
            const order = await prisma.order.create({
                data: {
                    userId: userId,
                    total: Number(retrievedSession.amount_total) / 100,
                    status: 'PAID',
                    items: {
                        create: lineItems.map((item: any) => {
                            const product = item.price.product as Stripe.Product;
                            const productId = product.metadata.productId; // We stored this in product_data.metadata

                            // Fallback if metadata is missing (shouldn't happen if properly set in session)
                            if (!productId) {
                                console.error(`Missing productId in metadata for item ${item.id}`);
                                // We might need a better error handling strategy here
                                // For now, we assume productId is present
                                throw new Error(`Missing productId for item ${item.description}`);
                            }

                            return {
                                productId: productId,
                                quantity: item.quantity || 1,
                                price: Number(item.price.unit_amount) / 100
                            };
                        })
                    }
                }
            });

            console.log(`Order ${order.id} created successfully`);

            // Update Inventory
            for (const item of lineItems) {
                const product = item.price.product as Stripe.Product;
                const productId = product.metadata.productId;
                const quantity = item.quantity || 1;

                if (productId) {
                    await prisma.product.update({
                        where: { id: productId },
                        data: {
                            inventory: {
                                decrement: quantity
                            }
                        }
                    });
                }
            }

        } catch (error) {
            console.error('Error creating order:', error);
            return new NextResponse('Webhook Error: Database write failed', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
