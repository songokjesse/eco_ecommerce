import { auth } from '@clerk/nextjs/server';

export const checkRole = async (role: 'admin' | 'seller') => {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata.role === role;
};
