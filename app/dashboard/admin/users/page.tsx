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
import { User, Shield, ShieldAlert, Users } from 'lucide-react';
import { AdminSearch } from '@/components/admin/Search';
import { UserRoleMakeAdmin } from './UserRoleActions';

export default async function AdminUsersPage(props: {
    searchParams?: Promise<{ q?: string; role?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';
    const roleFilter = searchParams?.role;

    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
        ];
    }

    if (roleFilter && roleFilter !== 'ALL') {
        where.role = roleFilter;
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500">Manage users and assign roles</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Suspense fallback={<div className="w-full max-w-sm h-10 bg-gray-100 rounded-md animate-pulse" />}>
                        <AdminSearch placeholder="Search users by name or email..." />
                    </Suspense>
                    <Link
                        href="/dashboard/admin/users"
                        className="px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </Link>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Joined Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    No users found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 text-gray-400">
                                            {user.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.image} alt={user.name || ''} className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-5 w-5" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-gray-900">{user.name || 'No Name'}</span>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`
                                                flex w-fit items-center gap-1
                                                ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                                ${user.role === 'SELLER' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                                ${user.role === 'BUYER' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' : ''}
                                            `}
                                        >
                                            {user.role === 'ADMIN' && <ShieldAlert className="w-3 h-3" />}
                                            {user.role === 'SELLER' && <Shield className="w-3 h-3" />}
                                            {user.role === 'BUYER' && <User className="w-3 h-3" />}
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserRoleMakeAdmin userId={user.id} currentRole={user.role} />
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
