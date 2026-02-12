'use server';

import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, role: Role) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to update user role:', error);
        return { success: false, error: 'Failed to update user role' };
    }
}
