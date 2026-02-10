import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getPostNordClient } from '@/lib/postnord';

/**
 * POST /api/shipments
 * Create a new shipment for an order
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            orderId,
            serviceCode = '19', // Default to standard parcel service
            weight,
            length,
            width,
            height,
            senderInfo,
        } = body;

        // Verify the order exists and user has permission
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if user is the seller (shop owner) - they should be able to create shipments
        // For now, we'll allow any authenticated user, but you may want to add seller verification
        const userRole = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (userRole?.role !== 'SELLER' && userRole?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only sellers can create shipments' },
                { status: 403 }
            );
        }

        // Validate shipping address
        if (
            !order.shippingName ||
            !order.shippingAddressLine1 ||
            !order.shippingCity ||
            !order.shippingPostalCode ||
            !order.shippingCountry
        ) {
            return NextResponse.json(
                { error: 'Order missing shipping information' },
                { status: 400 }
            );
        }

        // Create shipment with PostNord
        const postnordClient = getPostNordClient();

        const shipmentResponse = await postnordClient.createShipment({
            sender: {
                name: senderInfo?.name || 'CircuCity Seller',
                address: senderInfo?.address || 'Default Warehouse Address',
                city: senderInfo?.city || 'Stockholm',
                postalCode: senderInfo?.postalCode || '11122',
                countryCode: senderInfo?.countryCode || 'SE',
                phone: senderInfo?.phone,
                email: senderInfo?.email,
            },
            recipient: {
                name: order.shippingName,
                address: order.shippingAddressLine1,
                city: order.shippingCity,
                postalCode: order.shippingPostalCode,
                countryCode: order.shippingCountry,
            },
            parcel: {
                weight: weight || 1.0, // Default 1kg if not specified
                length,
                width,
                height,
            },
            serviceCode,
            reference: orderId,
        });

        // Save shipment to database
        const shipment = await prisma.shipment.create({
            data: {
                orderId,
                trackingNumber: shipmentResponse.trackingNumber,
                carrier: 'PostNord',
                serviceType: serviceCode,
                status: 'PENDING',
                estimatedDelivery: shipmentResponse.estimatedDelivery
                    ? new Date(shipmentResponse.estimatedDelivery)
                    : null,
                senderName: senderInfo?.name || 'CircuCity Seller',
                senderAddress: senderInfo?.address || 'Default Warehouse Address',
                senderCity: senderInfo?.city || 'Stockholm',
                senderPostalCode: senderInfo?.postalCode || '11122',
                senderCountry: senderInfo?.countryCode || 'SE',
                recipientName: order.shippingName,
                recipientAddress: order.shippingAddressLine1,
                recipientCity: order.shippingCity,
                recipientPostalCode: order.shippingPostalCode,
                recipientCountry: order.shippingCountry,
                weight,
                length,
                width,
                height,
                postnordShipmentId: shipmentResponse.shipmentId,
                labelUrl: shipmentResponse.labelUrl,
            },
        });

        // Update order status to SHIPPED
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'SHIPPED' },
        });

        return NextResponse.json({
            success: true,
            shipment: {
                id: shipment.id,
                trackingNumber: shipment.trackingNumber,
                labelUrl: shipment.labelUrl,
                estimatedDelivery: shipment.estimatedDelivery,
            },
        });
    } catch (error) {
        console.error('Error creating shipment:', error);
        return NextResponse.json(
            {
                error: 'Failed to create shipment',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/shipments?orderId=xxx
 * Get all shipments for an order
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify the order exists and user has permission to view it
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { userId: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.userId !== userId) {
            // Check if user is seller/admin
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });

            if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // Get shipments with tracking events
        const shipments = await prisma.shipment.findMany({
            where: { orderId },
            include: {
                trackingEvents: {
                    orderBy: { timestamp: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ shipments });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shipments' },
            { status: 500 }
        );
    }
}
