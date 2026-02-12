'use client';

import { ProductModerationStatus } from '@prisma/client';
import { updateProductModerationStatus } from './actions';
import { toast } from 'sonner';
import { Check, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProductModerationActions({ productId, currentStatus }: { productId: string, currentStatus: ProductModerationStatus }) {
    const handleStatusChange = async (status: ProductModerationStatus) => {
        const result = await updateProductModerationStatus(productId, status);
        if (result.success) {
            toast.success(`Product status updated to ${status}`);
        } else {
            toast.error('Failed to update product status');
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
