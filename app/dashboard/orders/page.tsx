
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ChevronLeft, Package, Calendar, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default async function OrdersPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Fetch recent orders for the buyer
    const orders = await prisma.order.findMany({
        where: { userId: userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-[#f8f5f2] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Order History</h1>
                        <p className="text-gray-600 mt-1">View and track all your past purchases.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#1e3a2f] flex items-center transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                </div>

                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                            <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a2f] hover:bg-[#152a22] shadow-lg hover:shadow-xl transition-all">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                                <div className="p-6 flex flex-col sm:flex-row gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.id.slice(-6).toUpperCase()}
                                                </h3>
                                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={order.status === 'PAID' ? 'default' : 'secondary'}
                                                className={order.status === 'PAID' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item.id} className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={item.product.images[0] || '/placeholder.png'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {item.quantity > 1 && (
                                                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                                                            x{item.quantity}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 font-medium text-sm">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-row sm:flex-col justify-between items-end sm:border-l sm:border-gray-50 sm:pl-6 min-w-[140px]">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
                                            <p className="text-xl font-bold text-[#1e3a2f]">${Number(order.total).toFixed(2)}</p>
                                        </div>
                                        <Link href={`/dashboard/orders/${order.id}`} className="w-full sm:w-auto">
                                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full group-hover:border-[#1e3a2f] group-hover:text-[#1e3a2f]">
                                                View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
