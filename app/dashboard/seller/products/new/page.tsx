'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/app/actions/product";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const initialState = {
    message: '',
};

export default function AddProductForm() {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard/seller" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Add New Product
                        </h2>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Bamboo Toothbrush"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    placeholder="Describe your product..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price ($)
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="9.99"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                                    Inventory
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="inventory"
                                        name="inventory"
                                        type="number"
                                        min="0"
                                        required
                                        placeholder="100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="category"
                                    name="category"
                                    type="text"
                                    required
                                    placeholder="e.g. Personal Care"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                Image URL
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        {/* Carbon Footprint Calculation */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Carbon Footprint Impact
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="weight" className="block text-xs font-medium text-green-800 mb-1">
                                        Weight (kg)
                                    </label>
                                    <Input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.5"
                                        className="bg-white"
                                        onBlur={(e) => {
                                            const form = e.currentTarget.closest('form');
                                            if (form) {
                                                const btn = form.querySelector('#calc-btn') as HTMLButtonElement;
                                                if (btn) btn.click();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        id="calc-btn"
                                        onClick={async (e) => {
                                            const form = e.currentTarget.closest('form');
                                            if (!form) return;

                                            // Get values safely
                                            const nameInput = form.querySelector('#name') as HTMLInputElement;
                                            const categoryInput = form.querySelector('#category') as HTMLInputElement;
                                            const priceInput = form.querySelector('#price') as HTMLInputElement;
                                            const weightInput = form.querySelector('#weight') as HTMLInputElement;

                                            const name = nameInput?.value;
                                            const category = categoryInput?.value;
                                            const price = priceInput?.value;
                                            const weight = weightInput?.value;

                                            // Auto-calc only runs if we have minimum data
                                            if (!name || !category || !weight) {
                                                return; // Silent fail for auto-calc
                                            }

                                            try {
                                                const btn = e.currentTarget;
                                                const originalText = btn.innerText;
                                                btn.innerText = "Calculating...";
                                                btn.disabled = true;

                                                const res = await fetch('/api/carbon/estimate', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ name, category, price, weight })
                                                });

                                                const data = await res.json();

                                                if (!data.error) {
                                                    const footprintEl = document.getElementById('carbon-footprint');
                                                    const savedEl = document.getElementById('carbon-saved');
                                                    const hiddenInput = document.getElementById('co2SavedInput') as HTMLInputElement;

                                                    if (footprintEl) footprintEl.innerText = `${data.footprint.toFixed(2)} ${data.unit}`;
                                                    if (savedEl) savedEl.innerText = `${data.saved.toFixed(2)} ${data.unit}`;
                                                    if (hiddenInput) hiddenInput.value = data.saved.toFixed(2);
                                                } else {
                                                    console.error("Error calculating carbon footprint:", data.error);
                                                }

                                                btn.innerText = originalText;
                                                btn.disabled = false;
                                            } catch (err) {
                                                console.error("Failed to calculate carbon footprint:", err);
                                                e.currentTarget.disabled = false;
                                                e.currentTarget.innerText = "Refresh Impact";
                                            }
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-green-700 border-green-200 hover:bg-green-100"
                                    >
                                        Refresh Impact
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm bg-white p-3 rounded border border-green-100">
                                <div>
                                    <span className="text-gray-500 block text-xs">Footprint (New):</span>
                                    <span id="carbon-footprint" className="font-bold text-gray-900">-</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-green-600 block text-xs">CO2e Saved (Used):</span>
                                    <span id="carbon-saved" className="font-bold text-green-600">-</span>
                                </div>
                            </div>
                            <input type="hidden" name="co2Saved" id="co2SavedInput" value="0" />
                        </div>

                        {state?.message && (
                            <div aria-live="polite" className="text-sm text-red-600">
                                {state.message}
                            </div>
                        )}

                        <div>
                            <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Product"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
