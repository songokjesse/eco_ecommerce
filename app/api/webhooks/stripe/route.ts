import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
    console.log('=== STRIPE WEBHOOK RECEIVED ===');

    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    // DEBUG LOGGING
    console.log("Webhook received. Signature:", signature ? "Present" : "Missing");
    console.log("Using Secret:", process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 10) + "...");
    console.log("Body length:", body.length);

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
        }

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("✅ Webhook signature verified successfully");
        console.log("Event type:", event.type);
    } catch (error: any) {
        console.error("❌ Webhook signature verification failed:", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    console.log(`Processing event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('=== CHECKOUT SESSION COMPLETED ===');
        console.log('Session ID:', session.id);
        console.log('Payment Status:', session.payment_status);
        console.log('Amount Total:', session.amount_total);

        try {
            // Retrieve the session to get line items and expanded details
            console.log('Retrieving session with line items...');
            const retrievedSession = await stripe.checkout.sessions.retrieve(
                session.id,
                {
                    expand: ['line_items.data.price.product'],
                }
            );

            const userId = retrievedSession.metadata?.userId;
            const lineItems = retrievedSession.line_items?.data;

            console.log(`User ID from metadata: ${userId}`);
            console.log(`Found ${lineItems?.length || 0} line items`);

            if (!userId) {
                console.error("❌ Missing userId in session metadata");
                console.log("Available metadata:", retrievedSession.metadata);
                return new NextResponse('Webhook Error: Missing userId in metadata', { status: 400 });
            }

            if (!lineItems || lineItems.length === 0) {
                console.error("❌ No line items found in session");
                return new NextResponse('Webhook Error: No line items found', { status: 400 });
            }

            // Verify user exists in database
            console.log('Verifying user exists in database...');
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!userExists) {
                console.error(`❌ User ${userId} not found in database`);
                return new NextResponse('Webhook Error: User not found', { status: 400 });
            }
            console.log('✅ User verified');

            // Extract shipping details
            const sessionData = retrievedSession as any;
            const shippingDetails = sessionData.shipping_details;
            const address = shippingDetails?.address;

            console.log('Shipping details:', {
                name: shippingDetails?.name,
                city: address?.city,
                country: address?.country
            });

            // Validate and prepare order items
            console.log('Validating line items...');
            const orderItemsData = [];

            for (let i = 0; i < lineItems.length; i++) {
                const item = lineItems[i] as any;
                console.log(`\nProcessing line item ${i + 1}:`, {
                    id: item.id,
                    description: item.description,
                    quantity: item.quantity,
                    amount: item.amount_total
                });

                if (!item.price) {
                    console.error(`❌ Line item ${i + 1} missing price data`);
                    throw new Error(`Line item ${i + 1} missing price data`);
                }

                const product = item.price.product as Stripe.Product;
                console.log('Product metadata:', product.metadata);

                const productId = product.metadata?.productId;

                if (!productId) {
                    console.error(`❌ Missing productId in metadata for item ${item.id}`);
                    console.log('Available metadata:', product.metadata);
                    throw new Error(`Missing productId for item: ${item.description || 'Unknown'}`);
                }

                // Verify product exists in database
                const dbProduct = await prisma.product.findUnique({
                    where: { id: productId }
                });

                if (!dbProduct) {
                    console.error(`❌ Product ${productId} not found in database`);
                    throw new Error(`Product ${productId} not found in database`);
                }

                console.log(`✅ Product ${productId} verified in database`);

                orderItemsData.push({
                    productId: productId,
                    quantity: item.quantity || 1,
                    price: Number(item.price.unit_amount) / 100
                });
            }

            console.log('\n=== CREATING ORDER ===');
            console.log('Order data:', {
                userId,
                total: Number(retrievedSession.amount_total) / 100,
                itemCount: orderItemsData.length
            });

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
                        create: orderItemsData
                    }
                },
                include: {
                    items: true
                }
            });

            console.log(`✅ Order ${order.id} created successfully with ${order.items.length} items`);

            // Update Inventory
            console.log('\n=== UPDATING INVENTORY ===');
            for (const item of lineItems) {
                if (!item.price) continue;

                const product = item.price.product as Stripe.Product;
                const productId = product.metadata?.productId;
                const quantity = item.quantity || 1;

                if (productId) {
                    console.log(`Updating inventory for product ${productId}, decrementing by ${quantity}`);

                    await prisma.product.update({
                        where: { id: productId },
                        data: {
                            inventory: {
                                decrement: quantity
                            },
                        },
                    });

                    // Check if we need to update status
                    const updatedProduct = await prisma.product.findUnique({
                        where: { id: productId },
                        select: { id: true, inventory: true, status: true }
                    });

                    console.log(`Product ${productId} inventory after update:`, updatedProduct?.inventory);

                    if (updatedProduct && updatedProduct.inventory <= 0) {
                        console.log(`Setting product ${productId} status to OUT_OF_STOCK`);
                        await prisma.product.update({
                            where: { id: productId },
                            data: { status: 'OUT_OF_STOCK' }
                        });
                    }
                }
            }

            console.log('✅ Inventory updated successfully');
            console.log('=== WEBHOOK PROCESSING COMPLETE ===\n');

            return new NextResponse(JSON.stringify({
                received: true,
                orderId: order.id
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (error: any) {
            console.error('❌ ERROR CREATING ORDER:');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            // Return 500 so Stripe will retry
            return new NextResponse(
                JSON.stringify({
                    error: 'Database write failed',
                    details: error.message
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    // For other event types
    console.log(`Event type ${event.type} received but not processed`);
    return new NextResponse(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
