import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ShipmentTracker from '@/components/shipment/ShipmentTracker';
import CreateShipmentForm from '@/components/shipment/CreateShipmentForm';

interface OrderDetailsPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function OrderDetailsPage({
    params,
}: OrderDetailsPageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const { orderId } = await params;

    // Fetch order details
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
            shipments: {
                include: {
                    trackingEvents: {
                        orderBy: { timestamp: 'desc' },
                    },
                },
            },
        },
    });

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
            </div>
        );
    }

    // Check if user has permission to view this order
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    const isOwner = order.userId === userId;
    const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

    if (!isOwner && !isSeller) {
        redirect('/dashboard');
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Order Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Order Details
                </h1>
                <p className="text-gray-600">Order ID: {order.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                                >
                                    {item.product.images[0] && (
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        ${Number(item.price).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipment Tracking */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Shipment Tracking
                        </h2>
                        <ShipmentTracker orderId={order.id} />
                    </div>

                    {/* Create Shipment (Sellers Only) */}
                    {isSeller && order.shipments.length === 0 && order.status === 'PAID' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Create Shipment
                            </h2>
                            <CreateShipmentForm orderId={order.id} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium text-gray-900">
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total</span>
                                <span className="font-semibold text-gray-900">
                                    ${Number(order.total).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Date</span>
                                <span className="text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingName && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-900">
                                    Shipping Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="font-medium text-gray-900">{order.shippingName}</p>
                                <p className="text-gray-600 mt-2">
                                    {order.shippingAddressLine1}
                                </p>
                                {order.shippingAddressLine2 && (
                                    <p className="text-gray-600">{order.shippingAddressLine2}</p>
                                )}
                                <p className="text-gray-600">
                                    {order.shippingCity}, {order.shippingState}{' '}
                                    {order.shippingPostalCode}
                                </p>
                                <p className="text-gray-600">{order.shippingCountry}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
