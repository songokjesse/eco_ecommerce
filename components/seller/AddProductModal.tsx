'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, ProductState } from "@/app/actions/product";
import { Plus, Image as ImageIcon, XCircle } from 'lucide-react';
import { UploadButton } from "@/utils/uploadthing";
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const initialState: ProductState = {
    message: '',
};

export function AddProductModal() {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [open, setOpen] = useState(false);

    // Close modal on success
    useEffect(() => {
        if (state.success && !isPending) {
            setOpen(false);
            setImageUrl('');
            // Ensure any other state resets here if needed
        }
    }, [state.success, isPending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#1e3a2f] hover:bg-[#162d24] text-white font-medium rounded-lg px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#1e3a2f]">Add New Product</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to list a new product on your shop.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-6 mt-4">

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
                            placeholder="Describe your product materials and sustainability impact..."
                            className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f] min-h-[100px]"
                        />
                    </div>

                    {/* Price & Inventory Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                Stock Quantity
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

                    {/* Category & Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <Input
                                id="category"
                                name="category"
                                type="text"
                                required
                                placeholder="e.g. Personal Care"
                                className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <Select name="status" defaultValue="ACTIVE">
                                <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                            {imageUrl ? (
                                <div className="relative w-full h-40 mb-2">
                                    <Image
                                        src={imageUrl}
                                        alt="Product Preview"
                                        fill
                                        className="object-contain rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                    >
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center mb-2">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                        <ImageIcon className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <p className="text-xs text-gray-500">Upload product image</p>
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
                                    button: "bg-[#1e3a2f] hover:bg-[#2d4a3e] text-white text-xs font-medium px-3 py-1.5 rounded-lg",
                                    allowedContent: "hidden"
                                }}
                            />
                        </div>
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </div>

                    {state?.message && !state.success && (
                        <div aria-live="polite" className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                            {state.message}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold"
                            disabled={isPending}
                        >
                            {isPending ? "Creating..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}
