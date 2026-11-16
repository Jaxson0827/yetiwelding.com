/** True when every item in the cart is a dumpster gate (they use pickup / local delivery, not carriers). */
export function isGateOnlyCart(items: Array<{ productType?: string }>): boolean {
  return items.length > 0 && items.every((it) => it?.productType === 'dumpster-gate');
}
