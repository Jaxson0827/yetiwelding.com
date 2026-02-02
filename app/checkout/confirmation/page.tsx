'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');
  const paymentId = searchParams.get('paymentId');
  const checkoutId = searchParams.get('checkoutId');
  const token = searchParams.get('token');
  const [orderData, setOrderData] = useState<any>(null);
  const [resolvedJobId, setResolvedJobId] = useState<string | null>(jobId);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);

  useEffect(() => {
    // Legacy path: if jobId present, keep current behavior.
    if (jobId) {
      setResolvedJobId(jobId);
      if (token) {
        setTrackingUrl(`/order/track/${encodeURIComponent(jobId)}?token=${encodeURIComponent(token)}`);
      }
      return;
    }
    // New Checkout Session path: poll by checkoutId until webhook creates order.
    if (!checkoutId) {
      router.push('/');
      return;
    }

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/by-checkout?checkoutId=${encodeURIComponent(checkoutId)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) return;
        if (cancelled) return;

        if (data?.status === 'ready' && data?.order?.jobId) {
          setResolvedJobId(data.order.jobId);
          const token = data.order.trackingToken;
          if (token) {
            setTrackingUrl(`/order/track/${encodeURIComponent(data.order.jobId)}?token=${encodeURIComponent(token)}`);
          } else {
            setTrackingUrl(`/order/track/${encodeURIComponent(data.order.jobId)}`);
          }
          return;
        }
      } catch {
        // ignore; we'll retry
      }
      if (!cancelled) {
        setTimeout(poll, 1500);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [jobId, checkoutId, router]);

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-[#DC143C]/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#DC143C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">
              Order Confirmed!
            </h1>

            <p className="text-white/80 text-lg mb-8">
              Thank you for your order. We've received it and will begin processing shortly.
            </p>

            {resolvedJobId && (
              <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 mb-8">
                <h2 className="text-white text-xl font-semibold mb-2">Order Details</h2>
                <p className="text-white/70 mb-1">
                  <span className="font-medium">Job ID:</span>{' '}
                  <span className="text-[#DC143C] font-mono">{resolvedJobId}</span>
                </p>
                {paymentId && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-200 font-semibold mb-1">✓ Payment Confirmed</p>
                    <p className="text-green-200/80 text-sm">
                      Payment ID: <span className="font-mono">{paymentId}</span>
                    </p>
                  </div>
                )}
                <p className="text-white/60 text-sm mt-4">
                  Please save this Job ID for your records. You can use it to track your order status.
                </p>
              </div>
            )}
            {!resolvedJobId && checkoutId && (
              <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 mb-8">
                <p className="text-white/70">
                  Finalizing your order… this usually takes a few seconds.
                </p>
              </div>
            )}

            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-white text-lg font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#DC143C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You'll receive an email confirmation shortly with order details</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#DC143C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Our team will review your order and contact you if any clarification is needed</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#DC143C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Standard lead time is 2-3 weeks. Rush orders may be available upon request</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#DC143C] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You can track your order status using your Job ID</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={trackingUrl || `/order/track/${resolvedJobId || ''}`}
                className="inline-block bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Track Order
              </Link>
              <Link
                href="/"
                className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black">
        <Header />
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-white/60">Loading...</p>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

