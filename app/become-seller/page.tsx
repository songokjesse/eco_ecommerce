"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Leaf, Store, Users } from "lucide-react";
import { registerShop } from "../actions/shop";
import { useRouter } from "next/navigation";

export default function BecomeSellerPage() {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await registerShop(formData);

            if (result && !result.success) {
                alert(result.message);
                if (result.redirectUrl) {
                    router.push(result.redirectUrl);
                }
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left Column: Text & Features */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#1e3a2f] mb-4">
                            Become a CircuCity Seller
                        </h2>
                        <p className="text-lg text-gray-600">
                            Join the world's fastest-growing eco-friendly marketplace.
                            Turn your sustainable passion into a thriving business.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#fae8b4] flex items-center justify-center text-[#1e3a2f]">
                                <Store className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1e3a2f]">Dedicated Storefront</h3>
                                <p className="text-gray-600">Customize your shop, manage inventory, and tell your brand's story.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#fae8b4] flex items-center justify-center text-[#1e3a2f]">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1e3a2f]">Reach Conscious Consumers</h3>
                                <p className="text-gray-600">Connect directly with millions of shoppers who care about the planet.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#fae8b4] flex items-center justify-center text-[#1e3a2f]">
                                <Leaf className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1e3a2f]">Impact Tracking</h3>
                                <p className="text-gray-600">Showcase your environmental impact with our built-in carbon footprint tools.</p>
                            </div>
                        </div>
                    </div>

                    {/* Did you know box */}
                    <div className="bg-[#1e3a2f] rounded-xl p-8 text-white relative overflow-hidden">
                        <h4 className="text-xl font-bold mb-2 relative z-10">Did you know?</h4>
                        <p className="text-gray-200 relative z-10">
                            Sellers on CircuCity see an average of <span className="font-bold">40% growth</span> in their first 3 months.
                        </p>
                    </div>
                </div>

                {/* Right Column: Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-[#1e3a2f] py-10 px-8 text-center">
                        <div className="mx-auto flex justify-center mb-6">
                            <Store className="h-20 w-20 text-[#fad050]" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">Create Shop</h3>
                        <p className="text-[#aebcb6]">Start your journey today.</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop Name
                                </label>
                                <Input
                                    id="shopName"
                                    name="shopName"
                                    type="text"
                                    required
                                    placeholder="e.g. Green Earth Goods"
                                    className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop Description
                                </label>
                                <Input
                                    id="description"
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="What makes your products sustainable?"
                                    className="bg-gray-50 border-gray-200 focus:ring-[#1e3a2f] focus:border-[#1e3a2f]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 bg-[#fad050] hover:bg-[#eac040] text-[#1e3a2f] font-bold text-lg rounded-xl transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Shop"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
