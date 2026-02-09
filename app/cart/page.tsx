'use client';

import { useCart } from '@/components/providers/CartProvider';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { createCartCheckoutSession } from '@/app/actions/stripe';

export default function CartPage() {
    const { state, removeItem, updateQuantity } = useCart();
    const { items } = state;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50 logic (reused from product page text)
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8f5f2] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/products">
                        <Button className="w-full bg-[#1e3a2f] hover:bg-[#152a22] text-white">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f5f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.id} className="p-6 sm:flex sm:items-center sm:justify-between gap-6">
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                            {/* Quantity */}
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="text-right min-w-[80px]">
                                                <div className="font-semibold text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="w-full">
                                <SignedIn>
                                    <Button
                                        onClick={async () => {
                                            // Extract simplified items for server action
                                            const cartItems = items.map(item => ({
                                                productId: item.id,
                                                quantity: item.quantity
                                            }));
                                            await createCartCheckoutSession(cartItems);
                                        }}
                                        className="w-full bg-[#1e3a2f] hover:bg-[#152a22] text-white py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <Button className="w-full bg-[#1e3a2f] hover:bg-[#152a22] text-white py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">
                                            Login to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </SignInButton>
                                </SignedOut>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <Link href="/products" className="text-sm text-gray-500 hover:text-[#1e3a2f] underline decoration-gray-300 hover:decoration-[#1e3a2f] transition-all">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
