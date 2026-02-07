'use client';

import { useActionState, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/app/actions/product";
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { UploadButton } from "@/utils/uploadthing";
import Image from 'next/image';

const initialState = {
    message: '',
};

export default function AddProductForm() {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    const [imageUrl, setImageUrl] = useState<string>('');

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard/seller" className="flex items-center text-sm font-medium text-[#1e3a2f] hover:underline transition-all">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-[#1e3a2f] py-8 px-8 text-center">
                        <h2 className="text-3xl font-bold text-white">
                            Add New Product
                        </h2>
                        <p className="text-[#aebcb6] mt-2">Share your sustainable goods with the world.</p>
                    </div>

                    <div className="p-8">
                        <form action={formAction} className="space-y-6">

                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Bamboo Toothbrush"
                                    className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    placeholder="Describe your product details, materials, and sustainability impact..."
                                    className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f] min-h-[120px]"
                                />
                            </div>

                            {/* Price & Inventory Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($)
                                    </label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="9.99"
                                        className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Inventory
                                    </label>
                                    <Input
                                        id="inventory"
                                        name="inventory"
                                        type="number"
                                        min="0"
                                        required
                                        placeholder="100"
                                        className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <Input
                                    id="category"
                                    name="category"
                                    type="text"
                                    required
                                    placeholder="e.g. Personal Care, Home & Living"
                                    className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>

                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                    {imageUrl ? (
                                        <div className="relative w-full h-48 mb-4">
                                            <Image
                                                src={imageUrl}
                                                alt="Product Preview"
                                                fill
                                                className="object-contain rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                            >
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                <ImageIcon className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <p className="text-sm text-gray-500">Upload a high-quality image of your product</p>
                                        </div>
                                    )}

                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setImageUrl(res[0].url);
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                        appearance={{
                                            button: "bg-[#1e3a2f] hover:bg-[#2d4a3e] text-white text-sm font-medium px-4 py-2 rounded-lg",
                                            allowedContent: "hidden"
                                        }}
                                    />
                                </div>
                                {/* Hidden input to submit the URL */}
                                <input type="hidden" name="imageUrl" value={imageUrl} />
                            </div>

                            {state?.message && (
                                <div aria-live="polite" className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                                    {state.message}
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold text-lg rounded-xl transition-colors shadow-sm"
                                    disabled={isPending}
                                >
                                    {isPending ? "Listing Product..." : "List Product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
