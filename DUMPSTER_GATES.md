# Dumpster gates: online ordering

How the dumpster gate page, checkout, pickup and delivery work, and the switches you control.

## Turning online sales on and off

Two Vercel environment variables (Production, and Preview if you want to test there):

| Variable | Value | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_QUOTE_ONLY_MODE` | `true` | Everything is quote-only unless listed below (current setting). |
| `NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS` | `dumpster-gate` | Dumpster gates show a price and "Add to cart". Everything else stays quote-only. |

- **Leave `NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS` unset** and the redesigned page runs in quote mode: no price, "Request a quote" sends the configuration to the contact form.
- **Set it to `dumpster-gate`** once the pricing in `lib/dumpsterGates/pricing.ts` is real. Redeploy after changing it (`NEXT_PUBLIC_*` values are baked in at build time).
- The server enforces the same switch, so a stale cart can't pay for a product that isn't on sale.

## Pricing (to do before turning sales on)

`lib/dumpsterGates/pricing.ts` → `priceGate(config)` is the single source of truth. The page, cart, Stripe line items and order records all call it, so the price shown is the price charged.

**The current formula is a placeholder.** It ignores height, slope and hardware ($145/ft of width + $150 + finish + $400 posts). Replace it with a takeoff-based formula before turning sales on.

Inputs available on `config`: `enclosureLengthFt`, `leftHeightFt`, `rightHeightFt`, `blockWidthIn`, `bottomGapIn`, `finish`, `powderCoatColor`, `mounting`, `quantity`. Gate height is `getGateHeightFt(config)` in `lib/dumpsterGates/display.ts`.

Also waiting on shop input: the **leaf width formula** (gaps and post deductions). The drawing hides the leaf-width dimension until it's real. See `printValues.gateWidth` in `components/dumpster-gates/DumpsterGateConfigurator.tsx`.

## What can't be bought online (goes to a quote instead)

`getGateQuoteReasons()` in `lib/dumpsterGates/display.ts`:
- gate height over 8' or under 5'
- left/right wall heights more than 3" apart
- powder coat colors other than black

The same check runs on the server when checkout starts.

## Pickup and free delivery

- Gate-only carts never use carrier shipping (Shippo/freight). Customers choose:
  - **Free pickup** at 1680 W 1600 S, Springville, UT 84663
  - **Free delivery** if their ZIP is in `lib/delivery/zoneZips.ts` (about a 3-hour drive)
- The checkout page checks the ZIP as they type. The server checks it again before creating the Stripe session. The webhook checks the final address the customer confirmed on Stripe's page and marks the order `needs_review` if it's outside the zone.
- **Tax:** pickup orders are taxed at the shop's location (the Stripe Customer's shipping address is set to the shop). Delivery orders are taxed at the delivery address.

### Changing the delivery area

- **Add or remove one ZIP:** edit `lib/delivery/zoneZips.ts` and redeploy.
- **Regenerate the whole list** (different radius): see `scripts/delivery-zone/README.md`.

## Terms of sale

- The gate terms are the "Custom Dumpster Gates" section of `/terms-of-service` (`#custom-dumpster-gates`).
- Customers must tick the terms box at checkout. The order stores `customerInfo.termsAcceptance` (version, time, IP).
- If you change that section, bump `GATE_TERMS_VERSION` in `lib/dumpsterGates/terms.ts`.
- The terms were drafted without a lawyer. Have one read them before launch.

## Launch checklist

1. Put real pricing in `priceGate()` and check it against 5–10 past jobs.
2. Stripe Dashboard → Tax: confirm Stripe Tax is active, with your Utah registration and origin address.
3. Make sure the Stripe webhook endpoint points at `https://yetiwelding.com/api/stripe/webhook`.
4. On a Vercel Preview with Stripe **test** keys, set `NEXT_PUBLIC_ONLINE_CHECKOUT_PRODUCTS=dumpster-gate` and run:
   - pickup order with card 4242 4242 4242 4242
   - delivery order to an in-zone ZIP (84604)
   - delivery order where you change the address on Stripe's page to an out-of-zone ZIP (e.g. 84790): should show `needs_review`
   - declined card 4000 0000 0000 0002
   - a gate needing a quote (6" slope): should not reach checkout
   - check both emails and `/admin/orders`
5. Set the variable in Production, redeploy, place one real order on your own card, and refund it.
