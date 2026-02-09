# Stripe Webhook Debugging Guide

## Critical Issues Found & How to Fix Them

### 🔴 Issue 1: Malformed Webhook Secret (MOST LIKELY CAUSE)

**Problem:** Your `.env.local` has an invalid webhook secret:
```
STRIPE_WEBHOOK_SECRET=whsec_placeholderwhsec_b8b3c5d5804ab0d2ddeda0fd779f0c12d7f57b48cfa6f057591db2d6c86b889f
```

This contains `whsec_placeholder` followed by another `whsec_`, which will cause signature verification to fail.

**Fix:**
1. **For Local Testing (using Stripe CLI):**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This will output a webhook secret like: `whsec_xxxxxxxxxxxxx`
   
   Update your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Use the actual secret from stripe listen
   ```

2. **For Production (Vercel/deployed environment):**
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events to listen to: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to your Vercel environment variables

### 🟡 Issue 2: User Not in Database

**Problem:** The webhook tries to create an order for a user that doesn't exist in your database.

**Fix:** Ensure users are created in your database when they sign up with Clerk. You may need a Clerk webhook handler:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
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
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    
    await prisma.user.create({
      data: {
        id: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        image: image_url || null,
      },
    });
  }

  return new Response('', { status: 200 });
}
```

## Testing Steps

### Step 1: Install Stripe CLI
```bash
brew install stripe/stripe-cli/stripe
```

### Step 2: Login to Stripe
```bash
stripe login
```

### Step 3: Start Your Dev Server
```bash
npm run dev
```

### Step 4: Forward Webhooks to Local
In a new terminal:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret from the output and update `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx  # From stripe listen output
```

Restart your dev server after updating the secret.

### Step 5: Test a Payment

1. Create a test checkout session
2. Complete the payment using test card: `4242 4242 4242 4242`
3. Watch the terminal running `stripe listen` for webhook events
4. Check your application logs for the detailed output from the enhanced webhook handler

### Step 6: Verify Order Creation

Check your database:
```bash
npx prisma studio
```

Look for:
- New order in the `Order` table
- Order items in the `OrderItem` table
- Updated inventory in the `Product` table

## Common Errors and Solutions

### Error: "Webhook signature verification failed"
**Cause:** Wrong webhook secret
**Solution:** Make sure you're using the correct secret from `stripe listen` for local testing

### Error: "Missing userId in session metadata"
**Cause:** The checkout session wasn't created with userId in metadata
**Solution:** Verify your `createCheckoutSession` function includes:
```typescript
metadata: {
  userId,
  // ... other metadata
}
```

### Error: "User not found in database"
**Cause:** User doesn't exist in your Prisma database
**Solution:** 
1. Set up Clerk webhook to sync users
2. Or manually create the user before testing

### Error: "Product not found in database"
**Cause:** Product ID in Stripe metadata doesn't match database
**Solution:** Verify the product exists and the ID matches

## Monitoring Webhooks

### View Webhook Logs in Stripe Dashboard
1. Go to https://dashboard.stripe.com/webhooks
2. Click on your webhook endpoint
3. View the "Events" tab to see delivery attempts and responses

### Enable Detailed Logging
The updated webhook handler now includes comprehensive logging. Check your console for:
- ✅ Success indicators
- ❌ Error indicators
- Detailed information at each step

## Production Deployment Checklist

- [ ] Add webhook endpoint in Stripe Dashboard
- [ ] Copy the signing secret to Vercel environment variables
- [ ] Test with a real payment in test mode
- [ ] Monitor webhook delivery in Stripe Dashboard
- [ ] Set up error alerting (e.g., Sentry, LogRocket)
- [ ] Verify orders are being created in production database

## Debugging Commands

### Trigger a test webhook manually:
```bash
stripe trigger checkout.session.completed
```

### View recent events:
```bash
stripe events list --limit 10
```

### Resend a failed webhook:
```bash
stripe events resend evt_xxxxxxxxxxxxx
```
