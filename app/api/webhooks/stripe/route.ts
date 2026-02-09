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
            // Stripe types are sometimes tricky. We'll cast to any to bypass the specific property check if standard types fail us,
            // or just use the index signature trick.
            const sessionData = retrievedSession as any;
            const shippingDetails = sessionData.shipping_details;
            const address = shippingDetails?.address;

            // Create the order
            const order = await prisma.order.create({
                data: {
                    userId: userId,
                    total: Number(retrievedSession.amount_total) / 100,
                    status: 'PAID',
                    // Shipping Info
                    shippingName: shippingDetails?.name,
                    shippingAddressLine1: address?.line1,
                    shippingAddressLine2: address?.line2,
                    shippingCity: address?.city,
                    shippingState: address?.state,
                    shippingPostalCode: address?.postal_code,
                    shippingCountry: address?.country,

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
                if (!item.price) continue;

                const product = item.price.product as Stripe.Product;
                const productId = product.metadata.productId;
                const quantity = item.quantity || 1;

                if (productId) {
                    await prisma.product.update({
                        where: { id: productId },
                        data: {
                            inventory: {
                                decrement: quantity
                            },
                        },
                    });

                    // Check if we need to update status
                    const updatedProduct = await prisma.product.findUnique({ where: { id: productId } });
                    if (updatedProduct && updatedProduct.inventory <= 0) {
                        await prisma.product.update({
                            where: { id: productId },
                            data: { status: 'OUT_OF_STOCK' as any }
                        });
                    }
                }
            }

        } catch (error) {
            console.error('Error creating order:', error);
            return new NextResponse('Webhook Error: Database write failed', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
