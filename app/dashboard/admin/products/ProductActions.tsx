'use client';

import { ProductModerationStatus } from '@prisma/client';
import { updateProductModerationStatus, updateProductFeaturedStatus } from './actions';
import { toast } from 'sonner';
import { Check, X, ShieldAlert, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function ProductModerationActions({
    productId,
    currentStatus,
    isFeatured
}: {
    productId: string,
    currentStatus: ProductModerationStatus,
    isFeatured: boolean
}) {
    const handleStatusChange = async (status: ProductModerationStatus) => {
        const result = await updateProductModerationStatus(productId, status);
        if (result.success) {
            toast.success(`Product status updated to ${status}`);
        } else {
            toast.error('Failed to update product status');
        }
    };

    const handleFeaturedChange = async (featured: boolean) => {
        const result = await updateProductFeaturedStatus(productId, featured);
        if (result.success) {
            toast.success(featured ? 'Product featured successfully' : 'Product removed from featured');
        } else {
            toast.error('Failed to update featured status');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {currentStatus !== 'APPROVED' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('APPROVED')}>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                    </DropdownMenuItem>
                )}
                {currentStatus !== 'REJECTED' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('REJECTED')}>
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                    </DropdownMenuItem>
                )}
                {currentStatus !== 'PENDING' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('PENDING')}>
                        <ShieldAlert className="mr-2 h-4 w-4 text-yellow-600" />
                        Mark as Pending
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {!isFeatured ? (
                    <DropdownMenuItem onClick={() => handleFeaturedChange(true)}>
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        Feature Product
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => handleFeaturedChange(false)}>
                        <StarOff className="mr-2 h-4 w-4 text-gray-500" />
                        Unfeature Product
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
