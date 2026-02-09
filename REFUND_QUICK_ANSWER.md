# Quick Answer: What Happens to Items When You Cancel/Refund an Order?

## TL;DR

When an order is cancelled or refunded:
1. ✅ **Inventory is RESTORED** - Items go back into stock
2. ✅ **Product status updated** - If product was OUT_OF_STOCK, it becomes ACTIVE again
3. ✅ **Money refunded** - Customer gets their money back via Stripe
4. ✅ **Order marked** - Status changes to CANCELLED or REFUNDED

## Visual Flow

### Scenario 1: Customer Buys Product

```
BEFORE ORDER:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 10 units │
│ Status: ACTIVE      │
└─────────────────────┘

CUSTOMER ORDERS 2 UNITS
         ↓

AFTER ORDER:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 8 units  │ ← Decreased by 2
│ Status: ACTIVE      │
└─────────────────────┘

┌─────────────────────┐
│ Order #123          │
│ Status: PAID        │
│ Items: 2 × iPhone   │
│ Total: $1,998       │
└─────────────────────┘
```

### Scenario 2: Customer Cancels Order

```
CUSTOMER REQUESTS CANCELLATION
         ↓

SYSTEM PROCESSES:
1. Stripe refund created
2. Order status → CANCELLED
3. Inventory restored
4. Product status updated

         ↓

AFTER CANCELLATION:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 10 units │ ← Restored! Back to original
│ Status: ACTIVE      │
└─────────────────────┘

┌─────────────────────┐
│ Order #123          │
│ Status: CANCELLED   │ ← Changed
│ Items: 2 × iPhone   │
│ Total: $1,998       │
│ Refunded: $1,998    │ ← Money returned
│ Cancelled: 2/9/2026 │
└─────────────────────┘
```

### Scenario 3: Product Was Out of Stock

```
BEFORE ORDER:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 2 units  │
│ Status: ACTIVE      │
└─────────────────────┘

CUSTOMER ORDERS 2 UNITS
         ↓

AFTER ORDER:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 0 units  │ ← Sold out!
│ Status: OUT_OF_STOCK│ ← Auto-changed
└─────────────────────┘

CUSTOMER CANCELS
         ↓

AFTER CANCELLATION:
┌─────────────────────┐
│ Product: iPhone 15  │
│ Inventory: 2 units  │ ← Restored!
│ Status: ACTIVE      │ ← Back in stock! ✅
└─────────────────────┘
```

## Two Ways to Cancel

### Method 1: Automatic (Stripe Refund)
```
Admin processes refund in Stripe Dashboard
    ↓
Webhook automatically:
  • Updates order status
  • Restores inventory
  • Updates product status
```

### Method 2: Manual (API Call)
```
User clicks "Cancel Order" button
    ↓
API endpoint:
  • Validates cancellation
  • Processes Stripe refund
  • Restores inventory
  • Updates statuses
```

## Business Rules

### ✅ Can Cancel When:
- Order status: PENDING or PAID
- Order not yet SHIPPED
- User owns the order

### ❌ Cannot Cancel When:
- Order already SHIPPED or DELIVERED
- Order already CANCELLED or REFUNDED

## What Gets Restored

| Item Type | Full Refund | Partial Refund |
|-----------|-------------|----------------|
| Inventory | ✅ Restored | ❌ Manual only |
| Money | ✅ Refunded | ✅ Partial amount |
| Product Status | ✅ Updated | ✅ Updated |

## Example Code Usage

### Cancel an Order (Frontend)

```typescript
async function cancelOrder(orderId: string, reason: string) {
  const response = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Order cancelled!');
    console.log('Refund ID:', data.refundId);
    // Inventory automatically restored ✅
  }
}
```

### Check Order Status

```typescript
// Order statuses you might see:
- PENDING          // Just created, not paid
- PAID             // Payment successful
- SHIPPED          // On its way
- DELIVERED        // Arrived
- CANCELLED        // Cancelled by user/admin
- REFUNDED         // Full refund processed
- PARTIALLY_REFUNDED // Partial refund
- DISPUTED         // Payment disputed
```

## Summary

**Question:** What happens to the item if I cancel the order and refund the payment?

**Answer:** 
1. The item(s) are **automatically returned to inventory**
2. If the product was marked as "out of stock", it becomes **available again**
3. The customer receives a **full refund** via Stripe
4. The order is marked as **CANCELLED** or **REFUNDED**
5. Everything is **logged** for your records

**No manual inventory adjustment needed** - it's all automatic! 🎉
