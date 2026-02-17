'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Truck, Store, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShopSettings {
    name: string;
    description: string;
}

export default function SellerSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<ShopSettings>({
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/shop/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        name: data.name || '',
                        description: data.description || '',
                    });
                } else {
                    console.error('Failed to fetch settings');
                    toast.error('Failed to load shop settings');
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                toast.error('Error loading settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/shop/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                toast.success('Settings updated successfully');
                router.refresh();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a2f]">Shop Settings</h1>
                <p className="text-gray-500 mt-1">Manage your shop details and shipping integrations.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shop Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-[#1e3a2f]">
                            <Store className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#1e3a2f]">Shop Information</h2>
                            <p className="text-sm text-gray-500">Basic details about your store</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={settings.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a2f]/20 focus:border-[#1e3a2f] transition-all"
                                placeholder="My Awesome Shop"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700 block">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={settings.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a2f]/20 focus:border-[#1e3a2f] transition-all resize-none"
                                placeholder="Tell customers what makes your shop special..."
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping Integration Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Truck className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#1e3a2f]">Shipping Integration (PostNord)</h2>
                            <p className="text-sm text-gray-500">Platform-wide shipping configuration</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex gap-3 text-green-700 text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>
                                Shipping labels are automatically generated using the platform's PostNord integration.
                                No additional configuration required on your end.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-[#1e3a2f] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e3a2f]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-lg shadow-green-900/10"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
