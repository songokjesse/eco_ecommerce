"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Store } from "lucide-react";

export default function BecomeSellerPage() {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);

    // Placeholder for when we have the Server Action
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Call server action to:
        // 1. Update Clerk metadata { role: 'seller' }
        // 2. Create Shop in Prisma

        alert("This feature requires a database connection to function!");
        setLoading(false);
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Leaf className="h-12 w-12 text-primary" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Become a CircuCity Seller
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join the sustainable revolution and start selling your eco-friendly products today.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                                Shop Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="shopName"
                                    name="shopName"
                                    type="text"
                                    required
                                    placeholder="e.g. Green Earth Goods"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Shop Description
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="description"
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="What makes your products sustainable?"
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={loading}>
                                {loading ? "Registering..." : "Register Shop"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
