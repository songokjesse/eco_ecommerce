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

import { getCategories } from "@/app/actions/category";

const initialState: ProductState = {
    message: '',
};

export function AddProductModal() {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    // Close modal on success
    useEffect(() => {
        if (state.success && !isPending) {
            setOpen(false);
            setImageUrl('');
            setSelectedCategory('');
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

                <form action={formAction} className="space-y-3 mt-2">

                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Bamboo Toothbrush"
                            className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-0.5">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Describe your product..."
                            className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f] min-h-[60px] text-sm"
                        />
                    </div>

                    {/* Price, Stock, Weight Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-0.5">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="9.99"
                                className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                            />
                        </div>

                        <div>
                            <label htmlFor="inventory" className="block text-xs font-medium text-gray-700 mb-0.5">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="inventory"
                                name="inventory"
                                type="number"
                                min="0"
                                required
                                placeholder="100"
                                className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                            />
                        </div>

                        <div>
                            <label htmlFor="weight" className="block text-xs font-medium text-gray-700 mb-0.5">
                                Weight (kg) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.5"
                                className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                onBlur={(e) => {
                                    const form = e.currentTarget.closest('form');
                                    if (form) {
                                        const btn = form.querySelector('#calc-btn') as HTMLButtonElement;
                                        if (btn) btn.click();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Category & Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-0.5">
                                Category
                            </label>
                            <Select
                                name="category"
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                required
                            >
                                <SelectTrigger className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                    {categories.length === 0 && (
                                        <div className="p-2 text-sm text-gray-500 text-center">No categories found</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <input type="hidden" name="category" value={selectedCategory} />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-0.5">
                                Status
                            </label>
                            <Select name="status" defaultValue="ACTIVE">
                                <SelectTrigger className="h-8 text-sm bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Carbon Footprint Calculation */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-semibold text-green-900 flex items-center gap-1">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Carbon Impact
                            </h3>
                            <Button
                                type="button"
                                id="calc-btn"
                                onClick={async (e) => {
                                    const form = e.currentTarget.closest('form');
                                    if (!form) return;

                                    const nameInput = form.querySelector('#name') as HTMLInputElement;
                                    const categoryInput = form.querySelector('[name="category"]') as HTMLInputElement; // Select stores value in hidden input or we get from state
                                    const priceInput = form.querySelector('#price') as HTMLInputElement;
                                    const weightInput = form.querySelector('#weight') as HTMLInputElement;

                                    const name = nameInput?.value;
                                    const category = categoryInput?.value || selectedCategory;
                                    const price = priceInput?.value;
                                    const weight = weightInput?.value;

                                    if (!name || !category || !weight) return;

                                    try {
                                        const btn = e.currentTarget;
                                        const originalText = btn.innerText;
                                        btn.innerText = "...";
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
                                        }

                                        btn.innerText = originalText;
                                        btn.disabled = false;
                                    } catch (err) {
                                        console.error(err);
                                        e.currentTarget.disabled = false;
                                        e.currentTarget.innerText = "Refresh";
                                    }
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-5 text-[10px] text-green-700 hover:bg-green-100 px-2"
                            >
                                Refresh
                            </Button>
                        </div>

                        <div className="flex justify-between text-xs bg-white p-2 rounded border border-green-100">
                            <div>
                                <span className="text-gray-500 block text-[10px]">New Footprint:</span>
                                <span id="carbon-footprint" className="font-bold text-gray-900">-</span>
                            </div>
                            <div className="text-right">
                                <span className="text-green-600 block text-[10px]">CO2 Saved:</span>
                                <span id="carbon-saved" className="font-bold text-green-600">-</span>
                            </div>
                        </div>
                        <input type="hidden" name="co2Saved" id="co2SavedInput" value="0" />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Product Image
                        </label>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                            {imageUrl ? (
                                <div className="relative w-full h-24 mb-1">
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
                                <div className="flex flex-col items-center mb-1">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Upload product image</p>
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
                                    button: "bg-[#1e3a2f] hover:bg-[#2d4a3e] text-white text-[10px] font-medium px-2 py-1 rounded-md h-6",
                                    allowedContent: "hidden"
                                }}
                            />
                        </div>
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </div>

                    {state?.message && !state.success && (
                        <div aria-live="polite" className="p-2 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
                            {state.message}
                        </div>
                    )}

                    <div className="pt-1 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                            className="h-8 text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold h-8 text-sm"
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
