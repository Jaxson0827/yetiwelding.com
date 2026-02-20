# Shipping (Parcel + Flat-Rate Freight + Local Pickup)

This repo supports **three delivery options**:

- **Local Pickup**: $0. Pick up at our facility in Springville, UT. Always available for all cart types.
- **Parcel (Shippo)**: used for small **steel embed plate** orders that are parcel-eligible.
- **Freight (flat-rate tiers you control)**: used for **dumpster gates**, **mixed carts**, and **heavy embed orders**.

The goal is to avoid “broken shipping quotes” by using **live parcel rates** where they’re reliable, and **freight tiers** where LTL is unpredictable.

---

## 1) The clean mental model

Every checkout answers one question:

> **Does this shipment go Parcel or Freight?**

We do **not** split shipments (e.g., gates freight + embeds parcel). If any item requires freight, the **entire order ships freight**.

---

## 2) Local Pickup

**Local Pickup** is always offered as the first shipping option:

- **Cost**: $0
- **Location**: Springville, UT (origin ZIP 84663)
- **Availability**: All cart types (embeds, gates, mixed)
- **When address is missing**: The shipping API returns pickup-only options so users can select pickup before entering an address
- **Implementation**: `lib/shipping/calculator.ts` — `buildPickupOption()`, `getPickupOnlyCalculation()`

---

## 3) Decision rules (current)

These rules are implemented in:
- `lib/shipping/calculator.ts`

### Freight required if:

- **Any dumpster gate is in the cart** → Freight
- Else, embeds-only cart:
  - Compute decision weight (product weight + small packaging buffer)
  - **If decision weight > 150 lb** → Freight
  - Otherwise → Parcel

### Why the “buffer” exists
The freight/parcel cutoff uses a small buffer so we don’t route borderline-heavy embed orders into parcel, then get nonsense rates or surcharges.

---

## 4) What the customer must enter

### Always collected (all shipments)
Collected in `components/checkout/CheckoutForm.tsx`:
- Name
- Email
- Phone
- Shipping address (street/city/state/zip/country)
- Optional: company, billing address, special instructions

### Freight-only fields (shown only when Freight is required)
Stored under `customerInfo.freight`:
- `deliveryType`: `commercial` | `residential`
- `liftgateRequired`: boolean

Why: these two toggles commonly swing freight cost materially and are simple enough for customers.

---

## 5) Freight pricing (flat-rate tiers)

Freight pricing is defined in:
- `lib/shipping/freightPricing.ts`

### Origin
- Origin ZIP: **84663**

### Zones (state-based v1)
- **Zone1_local**: UT, ID, WY, CO, NV, AZ, NM
- **Zone2_west**: CA, OR, WA
- **Zone4_east**: ME, NH, VT, MA, RI, CT, NY, NJ, PA, DE, MD, DC, VA, WV, NC, SC, GA, FL
- **Zone3_central**: everything else (default)

To update zones, edit the state sets in `lib/shipping/freightPricing.ts`.

### Gate tiers (by width in feet)
Used when a cart contains at least one `dumpster-gate`:
- **GateTierA**: up to 4 ft
- **GateTierB**: >4–6 ft
- **GateTierC**: >6–8 ft
- **GateTierD**: >8 ft (covers 8–10 ft and above)

Tier selection uses the **max gate width** across gate items in the cart.

### Embed freight tiers (by shipment weight in pounds)
Used when embeds-only cart is >150 lb:
- **EmbedFreightTier1**: 151–300 lb
- **EmbedFreightTier2**: 301–600 lb
- **EmbedFreightTier3**: 601–1000 lb
- **EmbedFreightTier4**: 1001–1500 lb (and above)

### Add-ons (flat fees)
- Residential fee: **$95**
- Liftgate fee: **$85**

### Placeholder base rate table (USD)
These are intentionally placeholders. Calibrate after real shipments.

```yaml
freightPricing:
  originZip: "84663"
  addons:
    residentialFeeUsd: 95
    liftgateFeeUsd: 85
  zones:
    Zone1_local:
      gate: { GateTierA: 220, GateTierB: 260, GateTierC: 320, GateTierD: 390 }
      embeds: { EmbedFreightTier1: 180, EmbedFreightTier2: 240, EmbedFreightTier3: 310, EmbedFreightTier4: 380 }
    Zone2_west:
      gate: { GateTierA: 280, GateTierB: 330, GateTierC: 400, GateTierD: 490 }
      embeds: { EmbedFreightTier1: 230, EmbedFreightTier2: 300, EmbedFreightTier3: 380, EmbedFreightTier4: 470 }
    Zone3_central:
      gate: { GateTierA: 320, GateTierB: 380, GateTierC: 460, GateTierD: 560 }
      embeds: { EmbedFreightTier1: 260, EmbedFreightTier2: 340, EmbedFreightTier3: 430, EmbedFreightTier4: 540 }
    Zone4_east:
      gate: { GateTierA: 390, GateTierB: 460, GateTierC: 560, GateTierD: 690 }
      embeds: { EmbedFreightTier1: 310, EmbedFreightTier2: 410, EmbedFreightTier3: 520, EmbedFreightTier4: 650 }
```

---

## 6) Parcel (Shippo) behavior

Parcel rates are fetched through Shippo in:
- `lib/shipping/providers/shippo.ts`

Rate flow:
- Checkout calls `POST /api/shipping/calculate`
- Server calls `calculateShippingLive()` in `lib/shipping/calculator.ts`
- If **Shippo is configured** and **freight is not required**, we send Shippo:
  - ship-from address (from env vars)
  - ship-to address
  - a single parcel with estimated dimensions + weight (`lib/shipping/packaging.ts`)
- If Shippo fails/unavailable, we fall back to heuristic parcel pricing (standard/expedited) in `lib/shipping/calculator.ts`.

### Important limitation (known)
Shippo is currently sent **one parcel** for the whole cart. For embed plates, a more accurate next step is:
- auto-split into multiple boxes (e.g., max 70 lb per box), then send Shippo multiple parcels.

---

## 6) Stripe + persistence (what’s stored and where)

### Where shipping options are set
Stripe Checkout Session is created in:
- `app/api/checkout/session/route.ts`

It sends Stripe a `shipping_rate_data.metadata` blob containing:
- standard fields: `method`, `provider`, `providerRateId`, `carrier`, `service`
- freight fields (when freight option is selected): zone/tier/base/add-ons + customer freight toggles

### Where the final order is created
Stripe webhook:
- `app/api/stripe/webhook/route.ts`

Behavior:
- merges Stripe’s final shipping address into `Order.customerInfo`
- retrieves the selected Stripe shipping rate metadata
- persists freight tier context into `Order.customerInfo.freight` (zone/tier/base/add-ons) for ops visibility

---

## 8) How to update shipping later (safe checklist)

### Updating freight prices
Edit:
- `lib/shipping/freightPricing.ts`
  - `FREIGHT_ADDONS_USD`
  - `FREIGHT_RATE_TABLE_USD`

Recommended process:
- Pick 10–20 past shipments
- For each: record actual broker/carrier invoice totals
- Adjust the matrix to maintain margin on worst-case lanes
- Re-test in Preview (Stripe test mode)

### Updating the embed freight threshold (150 lb)
Edit:
- `requiresFreightBusiness()` in `lib/shipping/calculator.ts`

If you change the threshold, also update this document.

### Updating zones
Edit:
- the state sets in `lib/shipping/freightPricing.ts`

### Adding new freight add-ons later
Common next add-ons:
- limited access / job site
- appointment required
- inside delivery

Add fields to:
- `components/checkout/CheckoutForm.tsx` (`customerInfo.freight`)
- `app/checkout/page.tsx` (send to shipping calculate endpoint)
- `lib/shipping/freightPricing.ts` (pricing logic + metadata)
- `app/api/checkout/session/route.ts` (metadata)
- `app/api/stripe/webhook/route.ts` (persist to order)

---

## 9) Troubleshooting

### “Parcel rates are wrong”
Most common causes:
- missing/incorrect ship-from env vars (see `SHIP_FROM_*`)
- unrealistic parcel dimensions/weight (see `lib/shipping/packaging.ts`)
- trying to parcel-quote something that should be freight (confirm cart is below 150 lb and has no gates)

### “Freight price seems wrong”
Check:
- customer selected Residential / Liftgate flags correctly
- `address.state` is a valid 2-letter code (zone mapping is state-based)
- the selected tier (gate width / embed weight tier) matches expectations

