import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Banknote } from 'lucide-react';
import { AdminSearch } from '@/components/admin/Search';

export default async function AdminPayoutsPage(props: {
    searchParams?: Promise<{ q?: string }>;
}) {
    // Basic placeholder query for now as we just created the table
    const payouts = await prisma.payout.findMany({
        include: {
            shop: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payouts</h1>
                    <p className="text-sm text-gray-500">Manage seller payouts and commissions</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Suspense fallback={<div className="w-full max-w-sm h-10 bg-gray-100 rounded-md animate-pulse" />}>
                        <AdminSearch placeholder="Search payouts..." />
                    </Suspense>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead>Payout ID</TableHead>
                            <TableHead>Shop</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                            <TableHead className="text-right">Processed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    <Banknote className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    No payouts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payouts.map((payout) => (
                                <TableRow key={payout.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        #{payout.id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>{payout.shop.name}</TableCell>
                                    <TableCell className="font-medium">${Number(payout.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{payout.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-gray-500">
                                        {new Date(payout.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-gray-500">
                                        {payout.processedAt ? new Date(payout.processedAt).toLocaleDateString() : '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
