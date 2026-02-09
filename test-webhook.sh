#!/bin/bash

# Stripe Webhook Test Script
# This script helps you test the Stripe webhook locally

echo "🔍 Stripe Webhook Testing Script"
echo "=================================="
echo ""

# Check if dev server is running
echo "📋 Step 1: Checking if dev server is running on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Dev server is running"
else
    echo "❌ Dev server is NOT running"
    echo "   Please run 'npm run dev' in another terminal first"
    exit 1
fi

echo ""
echo "📋 Step 2: Starting Stripe webhook forwarding..."
echo "   This will output a webhook secret - copy it to your .env.local"
echo "   Press Ctrl+C to stop"
echo ""
echo "⚠️  IMPORTANT: After you see the webhook secret (whsec_...):"
echo "   1. Copy the webhook secret"
echo "   2. Update STRIPE_WEBHOOK_SECRET in .env.local"
echo "   3. Restart your dev server"
echo "   4. Run this script again"
echo ""

# Start stripe listen
stripe listen --forward-to localhost:3000/api/webhooks/stripe
