'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { formatDimension } from '@/lib/dumpsterGates/validation';
import { getFinishLabel, getGateHeightFt, getGateQuoteReasons } from '@/lib/dumpsterGates/display';
import { GATE_TERMS_URL, GATE_TERMS_VERSION } from '@/lib/dumpsterGates/terms';
import { isZipInDeliveryZone, normalizeZip, SHOP_ADDRESS_ONE_LINE } from '@/lib/delivery/zone';
import { archivo, b612 } from '@/lib/fonts';

type Fulfillment = 'pickup' | 'local_delivery';

function usd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function newCheckoutId(): string {
  const c = typeof window !== 'undefined' ? window.crypto : undefined;
  if (c?.randomUUID) return c.randomUUID();
  const bytes = new Uint8Array(16);
  c?.getRandomValues(bytes);
  return `chk_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

const inputCls =
  'w-full border bg-black/40 px-3.5 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus-visible:border-accent-red focus-visible:ring-1 focus-visible:ring-accent-red';

function Field({
  label,
  error,
  hint,
  children,
  id,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string }) => React.ReactNode;
  id?: string;
}) {
  const autoId = useId();
  const fid = id || autoId;
  return (
    <div>
      <label htmlFor={fid} className="mb-1.5 block text-sm font-medium text-white">
        {label}
      </label>
      {children({
        id: fid,
        'aria-invalid': !!error,
        'aria-describedby': error ? `${fid}-err` : hint ? `${fid}-hint` : undefined,
        className: `${inputCls} ${error ? 'border-accent-red' : 'border-gate-rule'}`,
      })}
      {error ? (
        <p id={`${fid}-err`} className="mt-1.5 text-xs text-[#ff6b81]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="mt-1.5 text-xs text-gate-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center border border-white/70 font-drafting text-[13px] font-bold text-white"
      >
        {n}
      </span>
      <span className="font-display text-lg font-bold text-white [font-stretch:112%]">{children}</span>
    </h2>
  );
}

export default function GateCheckout() {
  const { items, removeItem } = useCart();

  const [checkoutId, setCheckoutId] = useState('');
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('checkoutId');
    const existing = window.sessionStorage.getItem('yeti-checkout-id');
    const id = fromUrl || existing || newCheckoutId();
    window.sessionStorage.setItem('yeti-checkout-id', id);
    setCheckoutId(id);
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup');
  const [zip, setZip] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('UT');
  const [siteNotes, setSiteNotes] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      items.map((it) => {
        const cfg = it.configuration as DumpsterGateConfig;
        const bd = priceGate(cfg);
        return { item: it, cfg, total: bd.totalPrice, unit: bd.unitPrice, quote: getGateQuoteReasons(cfg) };
      }),
    [items]
  );
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const needsQuote = lines.some((l) => l.quote.length > 0);

  const zip5 = normalizeZip(zip);
  const zipStatus: 'empty' | 'partial' | 'in' | 'out' =
    !zip.trim() ? 'empty' : !zip5 ? 'partial' : isZipInDeliveryZone(zip5) ? 'in' : 'out';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter an email we can send your drawing to.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number.';
    if (fulfillment === 'local_delivery') {
      if (!zip5) e.zip = 'Enter a 5-digit ZIP.';
      else if (!isZipInDeliveryZone(zip5)) e.zip = "We don't deliver there yet. Choose pickup or call us.";
      if (!street.trim()) e.street = 'Enter the street address.';
      if (!city.trim()) e.city = 'Enter the city.';
      if (!state.trim()) e.state = 'Enter the state.';
    }
    if (!terms) e.terms = 'Accept the terms to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate() || needsQuote || !checkoutId) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId,
          items,
          selectedShippingMethod: fulfillment,
          termsAccepted: terms,
          termsVersion: GATE_TERMS_VERSION,
          customerInfo: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company.trim() || undefined,
            siteNotes: siteNotes.trim() || undefined,
            shippingAddress:
              fulfillment === 'local_delivery'
                ? { street: street.trim(), city: city.trim(), state: state.trim(), zip: zip5, country: 'US' }
                : undefined,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout could not start. Try again, or call us.');
      window.location.href = data.url;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Checkout could not start. Try again, or call us.');
      setSubmitting(false);
    }
  };

  return (
    <main className={`${archivo.variable} ${b612.variable} min-h-screen bg-black`}>
      <Header showCart />
      <div className="container mx-auto max-w-6xl px-4 pb-24 pt-28 sm:pt-36">
        <h1 className="font-display text-4xl font-extrabold text-white [font-stretch:112%] sm:text-5xl">Checkout</h1>
        <p className="mt-3 max-w-xl text-white/70">
          Your details and pickup or delivery here. You&apos;ll pay on the next page, which is run by Stripe.
        </p>

        <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="space-y-10">
            {/* 1. Contact */}
            <section className="border border-gate-rule bg-gate-plate p-5 sm:p-6">
              <SectionTitle n={1}>Your contact details</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  {(p) => <input {...p} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />}
                </Field>
                <Field label="Company (optional)">
                  {(p) => (
                    <input {...p} autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
                  )}
                </Field>
                <Field label="Email" error={errors.email} hint="We send your drawing here.">
                  {(p) => (
                    <input {...p} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  )}
                </Field>
                <Field label="Phone" error={errors.phone} hint="We call to set up pickup or delivery.">
                  {(p) => (
                    <input {...p} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  )}
                </Field>
              </div>
            </section>

            {/* 2. Pickup or delivery */}
            <section className="border border-gate-rule bg-gate-plate p-5 sm:p-6">
              <SectionTitle n={2}>Pickup or delivery</SectionTitle>
              <div role="radiogroup" aria-label="Pickup or delivery" className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ['pickup', 'Free pickup', `At our shop, ${SHOP_ADDRESS_ONE_LINE}. We call when it's ready.`],
                    ['local_delivery', 'Free delivery', 'Within about a 3-hour drive of the shop. We call to schedule.'],
                  ] as Array<[Fulfillment, string, string]>
                ).map(([value, label, note]) => {
                  const checked = fulfillment === value;
                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer flex-col gap-1 border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-accent-red ${
                        checked ? 'border-white bg-white/[0.06]' : 'border-gate-rule hover:border-white/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value={value}
                        checked={checked}
                        onChange={() => setFulfillment(value)}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-2 text-[15px] font-semibold text-white">
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 border ${checked ? 'border-accent-red bg-accent-red' : 'border-white/50'}`}
                        />
                        {label}
                      </span>
                      <span className="pl-5 text-xs leading-relaxed text-gate-mute">{note}</span>
                    </label>
                  );
                })}
              </div>

              {fulfillment === 'local_delivery' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <Field label="Delivery ZIP" error={errors.zip}>
                      {(p) => (
                        <input
                          {...p}
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={10}
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className={`${p.className} font-drafting`}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="flex items-end sm:col-span-4" aria-live="polite">
                    {!errors.zip && zipStatus === 'in' && (
                      <p className="pb-3 text-sm text-white">
                        <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-[#3ecf8e]" />
                        We deliver to {zip5}, free.
                      </p>
                    )}
                    {!errors.zip && zipStatus === 'out' && (
                      <p className="pb-3 text-sm text-white">
                        <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-accent-red" />
                        {zip5} is outside our delivery area. Choose pickup, or call{' '}
                        <a href="tel:+18019958906" className="underline underline-offset-4">
                          801-995-8906
                        </a>
                        .
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-6">
                    <Field label="Street address" error={errors.street}>
                      {(p) => (
                        <input {...p} autoComplete="address-line1" value={street} onChange={(e) => setStreet(e.target.value)} />
                      )}
                    </Field>
                  </div>
                  <div className="sm:col-span-4">
                    <Field label="City" error={errors.city}>
                      {(p) => (
                        <input {...p} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
                      )}
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="State" error={errors.state}>
                      {(p) => (
                        <input {...p} autoComplete="address-level1" value={state} onChange={(e) => setState(e.target.value)} />
                      )}
                    </Field>
                  </div>
                  <div className="sm:col-span-6">
                    <Field label="Site notes (optional)" hint="Gate codes, which side of the building, who to call on site.">
                      {(p) => (
                        <textarea
                          {...p}
                          rows={3}
                          maxLength={1000}
                          value={siteNotes}
                          onChange={(e) => setSiteNotes(e.target.value)}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              )}

              {fulfillment === 'pickup' && (
                <div className="mt-6">
                  <Field label="Notes (optional)" hint="Anything we should know about your order or pickup.">
                    {(p) => (
                      <textarea {...p} rows={2} maxLength={1000} value={siteNotes} onChange={(e) => setSiteNotes(e.target.value)} />
                    )}
                  </Field>
                </div>
              )}
            </section>

            {/* 3. Terms */}
            <section className="border border-gate-rule bg-gate-plate p-5 sm:p-6">
              <SectionTitle n={3}>Before you pay</SectionTitle>
              <ul className="space-y-2 text-sm leading-relaxed text-white/80">
                <li>We email you a shop drawing with your dimensions. Fabrication starts when you approve it.</li>
                <li>You can cancel for a full refund any time before you approve the drawing.</li>
                <li>After that, your gate is built to your measurements and can&apos;t be returned.</li>
                <li>Installation, concrete and anchors aren&apos;t included.</li>
              </ul>
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  aria-invalid={!!errors.terms}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#DC143C]"
                />
                <span className="text-sm text-white">
                  I agree to the{' '}
                  <Link href={GATE_TERMS_URL} target="_blank" className="underline decoration-accent-red underline-offset-4">
                    terms of sale for custom gates
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && <p className="mt-1.5 pl-8 text-xs text-[#ff6b81]">{errors.terms}</p>}
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section aria-labelledby="order-heading" className="border border-gate-rule bg-gate-plate">
              <div className="p-5 sm:p-6">
                <h2 id="order-heading" className="font-display text-xl font-extrabold text-white [font-stretch:115%]">
                  Your order
                </h2>
                <ul className="mt-4 divide-y divide-gate-rule border-y border-gate-rule">
                  {lines.map(({ item, cfg, total, quote }) => (
                    <li key={item.id} className="py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {cfg.quantity > 1 ? `${cfg.quantity} × ` : ''}Dumpster gate
                          </p>
                          <p className="mt-0.5 font-drafting text-xs text-gate-mute">
                            {formatDimension(cfg.enclosureLengthFt)} enclosure, {formatDimension(getGateHeightFt(cfg))} tall
                          </p>
                          <p className="text-xs text-gate-mute">
                            {getFinishLabel(cfg)}, {cfg.mounting === 'with-posts' ? 'posts included' : 'gate only'}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums text-white">{usd(total)}</p>
                      </div>
                      {quote.length > 0 && <p className="mt-2 text-xs text-[#ff6b81]">{quote[0]} Remove it and request a quote.</p>}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="mt-1.5 text-xs text-gate-mute underline underline-offset-4 hover:text-white"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gate-mute">Subtotal</dt>
                    <dd className="tabular-nums text-white">{usd(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gate-mute">{fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
                    <dd className="text-white">Free</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gate-mute">Sales tax</dt>
                    <dd className="text-white/70">Added on the payment page</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-gate-rule pt-3">
                    <dt className="font-semibold text-white">Total before tax</dt>
                    <dd className="font-display text-2xl font-extrabold tabular-nums text-white [font-stretch:110%]">
                      {usd(subtotal)}
                    </dd>
                  </div>
                </dl>

                {serverError && (
                  <p role="alert" className="mt-4 border-l-2 border-accent-red pl-3 text-sm text-white">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || needsQuote || lines.length === 0}
                  className="mt-5 w-full bg-accent-red px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50"
                >
                  {submitting ? 'Opening secure payment…' : 'Continue to payment'}
                </button>
                <p className="mt-2 text-center text-xs text-gate-mute">Secure card payment by Stripe.</p>
              </div>
            </section>
            <p className="mt-4 text-sm text-gate-mute">
              Need to change something?{' '}
              <Link href="/order/dumpster-gates" className="text-white underline underline-offset-4">
                Back to the configurator
              </Link>
            </p>
          </aside>
        </form>
      </div>
      <Footer />
    </main>
  );
}
