'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming I have this or will create it, otherwise Input for now.
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
                                <Input // Using Input as textarea might not be set up yet
                                    id="description"
                                    name="description"
                                    type="text"
                                    required // Assuming required in DB
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
