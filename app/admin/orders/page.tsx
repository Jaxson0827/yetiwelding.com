'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type AdminOrder = {
  id: string;
  jobId: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  subtotal: number | null;
  shipping: number | null;
  tax: number | null;
  total: number | null;
  createdAt: string;
  updatedAt: string;
  shippingMethod?: string | null;
  shippingCarrier?: string | null;
  shippingService?: string | null;
  shippingQuoteId?: string | null;
  trackingNumber?: string | null;
  itemsCount: number;
};

const STATUS_OPTIONS = [
  'pending',
  'pending_payment',
  'needs_review',
  'in_review',
  'in_production',
  'ready',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [adminKey, setAdminKey] = useState('');
  const [q, setQ] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => orders.find((o) => o.id === selectedId) || null, [orders, selectedId]);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editTracking, setEditTracking] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Keep key across reloads (local-only).
    try {
      const existing = window.sessionStorage.getItem('admin-api-key') || '';
      if (existing) setAdminKey(existing);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    setEditStatus(selected.status || '');
    setEditTracking(selected.trackingNumber || '');
  }, [selected]);

  const fetchOrders = async () => {
    if (!adminKey) {
      setError('Enter your admin key first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders?q=${encodeURIComponent(q)}`, {
        headers: { 'x-admin-key': adminKey },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load orders');
      }
      setOrders(data.orders || []);
      if ((data.orders || []).length > 0 && !selectedId) {
        setSelectedId(data.orders[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const saveSelected = async () => {
    if (!selected) return;
    if (!adminKey) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(selected.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          status: editStatus,
          trackingNumber: editTracking,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update order');
      await fetchOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const onSaveKey = () => {
    try {
      window.sessionStorage.setItem('admin-api-key', adminKey);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">Admin Orders</h1>

          <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Admin key</label>
                <input
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  onBlur={onSaveKey}
                  placeholder="ADMIN_API_KEY"
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Search</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="jobId, email, payment intent…"
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="w-full bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
                >
                  {loading ? 'Loading…' : 'Load orders'}
                </button>
              </div>
            </div>
            {error && <p className="text-red-300 mt-4">{error}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Orders</h2>
              {orders.length === 0 ? (
                <p className="text-white/60 text-sm">No orders loaded.</p>
              ) : (
                <div className="space-y-2">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedId === o.id ? 'border-[#DC143C] bg-white/10' : 'border-white/10 bg-black/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-white font-mono">{o.jobId}</div>
                          <div className="text-white/60 text-sm">{o.customerEmail}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/80 text-sm">
                            {o.status} • {o.paymentStatus}
                          </div>
                          <div className="text-white font-semibold">${(o.total ?? 0).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-white/50 text-xs">
                        Items: {o.itemsCount} • {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1 bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Update</h2>
              {!selected ? (
                <p className="text-white/60 text-sm">Select an order.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-mono">{selected.jobId}</p>
                    <p className="text-white/60 text-sm">{selected.customerEmail}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                      <div className="text-white/50">Subtotal</div>
                      <div className="text-white">${(selected.subtotal ?? 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                      <div className="text-white/50">Total</div>
                      <div className="text-white font-semibold">${(selected.total ?? 0).toFixed(2)}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Tracking number</label>
                    <input
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="(optional)"
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <button
                    onClick={saveSelected}
                    disabled={saving}
                    className="w-full bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>

                  <div className="text-white/50 text-xs pt-2 border-t border-white/10">
                    Tip: Set `ADMIN_API_KEY` in Vercel (Production + Preview). Keep it long and secret.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

