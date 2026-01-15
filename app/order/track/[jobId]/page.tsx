'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderDetails from '@/components/order/OrderDetails';
import PaymentInfo from '@/components/order/PaymentInfo';
import ShippingInfo from '@/components/order/ShippingInfo';
import { motion } from 'framer-motion';
import Link from 'next/link';

type OrderStatus = 'pending' | 'in_review' | 'in_production' | 'ready' | 'shipped' | 'delivered';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending Review',
  in_review: 'In Review',
  in_production: 'In Production',
  ready: 'Ready for Pickup',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_production: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

interface Order {
  jobId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items?: any[];
  steelEmbeds?: any[];
  dumpsterGates?: any[];
  customerInfo?: any;
  orderTotal?: number;
  subtotal?: number;
  shippingCost?: number;
  shippingMethod?: string;
  taxAmount?: number;
  taxRate?: number;
  isTaxExempt?: boolean;
  paymentIntentId?: string;
  paymentStatus?: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  notes?: string[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchOrder = async () => {
    if (!jobId) return;

    try {
      // Try unified API first, fallback to legacy API
      let response = await fetch(`/api/orders/${jobId}`);
      if (!response.ok) {
        response = await fetch(`/api/steel-embeds/order-status?jobId=${jobId}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
        setError(null);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      console.error('Order fetch error:', err);
      setError('Failed to load order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [jobId]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || !jobId || loading) return;

    const interval = setInterval(() => {
      fetchOrder();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, jobId, loading]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#DC143C] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading order status...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-32">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">{error || 'Order not found'}</p>
            <Link href="/" className="text-[#DC143C] hover:text-[#B01030]">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const statusSteps: OrderStatus[] = ['pending', 'in_review', 'in_production', 'ready', 'shipped', 'delivered'];
  const currentStatusIndex = statusSteps.indexOf(order.status);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="w-full py-20 px-4 pt-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight">
                  Order Tracking
                </h1>
                <p className="text-white/60 font-mono">Job ID: {order.jobId}</p>
              </div>
              
              {/* Auto-refresh Toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 rounded focus:ring-[#DC143C]"
                  />
                  <span className="text-white/60 text-sm">Auto-refresh</span>
                </label>
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchOrder();
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-block px-6 py-3 rounded-lg border-2 ${STATUS_COLORS[order.status]}`}>
              <span className="font-bold text-lg">{STATUS_LABELS[order.status]}</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Status Timeline & Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Timeline */}
                <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Order Status Timeline</h2>
                  <div className="space-y-4">
                    {statusSteps.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      
                      return (
                        <div key={status} className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                            isCompleted
                              ? isCurrent
                                ? 'bg-[#DC143C] text-white'
                                : 'bg-green-500 text-white'
                              : 'bg-white/10 text-white/40'
                          }`}>
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <div className="flex-1 pt-2">
                            <p className={`font-semibold ${
                              isCurrent ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/40'
                            }`}>
                              {STATUS_LABELS[status]}
                            </p>
                            {isCurrent && (
                              <p className="text-white/60 text-sm mt-1">
                                Current status • Updated {formatDate(order.updatedAt)}
                              </p>
                            )}
                            {isCompleted && !isCurrent && index < statusSteps.length - 1 && (
                              <p className="text-white/40 text-xs mt-1">Completed</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details */}
                <OrderDetails
                  items={order.items}
                  steelEmbeds={order.steelEmbeds}
                  dumpsterGates={order.dumpsterGates}
                  subtotal={order.subtotal}
                  shippingCost={order.shippingCost}
                  taxAmount={order.taxAmount}
                  orderTotal={order.orderTotal}
                />

                {/* Order Notes */}
                {order.notes && order.notes.length > 0 && (
                  <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                    <h3 className="text-white text-xl font-bold mb-4">Order Notes</h3>
                    <div className="space-y-3">
                      {order.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment & Shipping Info */}
              <div className="lg:col-span-1 space-y-6">
                <PaymentInfo
                  paymentStatus={order.paymentStatus}
                  paymentIntentId={order.paymentIntentId}
                  orderTotal={order.orderTotal}
                />

                <ShippingInfo
                  customerInfo={order.customerInfo}
                  shippingMethod={order.shippingMethod}
                  shippingCost={order.shippingCost}
                  trackingNumber={order.trackingNumber}
                  estimatedDeliveryDate={order.estimatedDeliveryDate}
                />

                {/* Order Dates */}
                <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                  <h3 className="text-white text-xl font-bold mb-4">Order Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-white/60 mb-1">Order Date</p>
                      <p className="text-white">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">Last Updated</p>
                      <p className="text-white">{formatDate(order.updatedAt)}</p>
                    </div>
                    {order.estimatedDeliveryDate && (
                      <div>
                        <p className="text-white/60 mb-1">Estimated Delivery</p>
                        <p className="text-white font-semibold">
                          {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Downloads */}
                {(order.steelEmbeds && order.steelEmbeds.length > 0) && (
                  <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                    <h3 className="text-white text-xl font-bold mb-4">Order Documents</h3>
                    <div className="space-y-3">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/orders/${jobId}/documents?type=shop-packet`);
                            const data = await response.json();
                            if (data.success && data.pdfUrl) {
                              window.open(data.pdfUrl, '_blank');
                            } else {
                              alert('Document not available');
                            }
                          } catch (error) {
                            console.error('Document download error:', error);
                            alert('Failed to download document');
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        Download Shop Packet
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/orders/${jobId}/documents?type=quote`);
                            const data = await response.json();
                            if (data.success && data.pdfUrl) {
                              window.open(data.pdfUrl, '_blank');
                            } else {
                              alert('Document not available');
                            }
                          } catch (error) {
                            console.error('Document download error:', error);
                            alert('Failed to download document');
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        Download Quote
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full text-center px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold hover:bg-[#B01030] transition-colors"
                  >
                    Place New Order
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full text-center px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
