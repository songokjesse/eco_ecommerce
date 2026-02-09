"use client";

import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { useCart } from '@/components/providers/CartProvider';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCart();

    // Clear cart on successful payment
    useEffect(() => {
        if (sessionId) {
            console.log('Payment successful, clearing cart...');
            try {
                clearCart();
                console.log('✅ Cart cleared successfully');
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    }, [sessionId, clearCart]);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and your cart has been cleared.
                {sessionId && <span className="block text-xs text-gray-400 mt-2">Session ID: {sessionId.slice(0, 10)}...</span>}
            </p>
            <div className="space-y-3">
                <a
                    href="/dashboard/orders"
                    className="block w-full bg-[#1e3a2f] hover:bg-[#152a22] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                    View My Orders
                </a>
                <a
                    href="/"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors duration-200 text-center"
                >
                    Continue Shopping
                </a>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="animate-pulse">
                        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                    </div>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
