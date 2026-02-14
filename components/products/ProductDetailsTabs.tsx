'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";

interface ProductDetailsTabsProps {
    description: string;
    ingredients?: string;
    shippingInfo?: string;
    sustainability?: string;
}

export function ProductDetailsTabs({ description, ingredients, shippingInfo, sustainability }: ProductDetailsTabsProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'shipping' | 'sustainability'>('details');

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'ingredients', label: 'Ingredients/Materials' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'sustainability', label: 'Sustainability' },
    ] as const;

    return (
        <div className="mt-16 lg:mt-24">
            <div className="border-b border-gray-200 mb-8 overflow-x-auto">
                <nav className="flex space-x-8 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "border-b-2 py-4 px-1 font-medium text-sm transition-colors whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-[#1e3a2f] text-[#1e3a2f]"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="prose prose-green max-w-none text-gray-600 animate-in fade-in duration-300">
                {activeTab === 'details' && (
                    <div>
                        <p className="whitespace-pre-line">{description}</p>
                    </div>
                )}
                {activeTab === 'ingredients' && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredients & Materials</h3>
                        <p>{ingredients || "No ingredients or materials information available for this product."}</p>
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Information</h3>
                        <p>{shippingInfo || "Free shipping on orders over 500 kr. Standard shipping takes 3-5 business days."}</p>
                    </div>
                )}
                {activeTab === 'sustainability' && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Sustainability Impact</h3>
                        <p>{sustainability || "This product is verified eco-friendly and sustainably sourced."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
