import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    console.log('=== CLERK WEBHOOK RECEIVED ===');

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('❌ CLERK_WEBHOOK_SECRET is not defined');
        throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('❌ Missing svix headers');
        return new NextResponse('Error: Missing svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
        console.log('✅ Webhook signature verified');
    } catch (err) {
        console.error('❌ Error verifying webhook:', err);
        return new NextResponse('Error: Verification failed', { status: 400 });
    }

    console.log('Event type:', evt.type);

    // Handle user.created event
    if (evt.type === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        console.log('Creating user:', {
            id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ''} ${last_name || ''}`.trim()
        });

        try {
            const user = await prisma.user.create({
                data: {
                    id: id,
                    email: email_addresses[0].email_address,
                    name: `${first_name || ''} ${last_name || ''}`.trim() || null,
                    image: image_url || null,
                },
            });

            console.log('✅ User created successfully:', user.id);
        } catch (error: any) {
            console.error('❌ Error creating user:', error.message);

            // If user already exists, that's okay
            if (error.code === 'P2002') {
                console.log('ℹ️  User already exists, skipping');
                return new NextResponse('User already exists', { status: 200 });
            }

            return new NextResponse('Error creating user', { status: 500 });
        }
    }

    // Handle user.updated event
    if (evt.type === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        console.log('Updating user:', id);

        try {
            await prisma.user.update({
                where: { id },
                data: {
                    email: email_addresses[0].email_address,
                    name: `${first_name || ''} ${last_name || ''}`.trim() || null,
                    image: image_url || null,
                },
            });

            console.log('✅ User updated successfully');
        } catch (error: any) {
            console.error('❌ Error updating user:', error.message);
            return new NextResponse('Error updating user', { status: 500 });
        }
    }

    // Handle user.deleted event
    if (evt.type === 'user.deleted') {
        const { id } = evt.data;

        console.log('Deleting user:', id);

        try {
            await prisma.user.delete({
                where: { id: id as string },
            });

            console.log('✅ User deleted successfully');
        } catch (error: any) {
            console.error('❌ Error deleting user:', error.message);
            return new NextResponse('Error deleting user', { status: 500 });
        }
    }

    return new NextResponse('', { status: 200 });
}
