"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
                {sessionId && <span className="block text-xs text-gray-400 mt-2">Session ID: {sessionId.slice(0, 10)}...</span>}
            </p>
            <div className="space-y-3">
                <Link href="/">
                    <Button className="w-full">Continue Shopping</Button>
                </Link>
                <Link href="/dashboard">
                    <Button variant="outline" className="w-full">View Orders</Button>
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
