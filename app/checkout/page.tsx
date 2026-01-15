'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm, { CustomerInfo } from '@/components/checkout/CheckoutForm';
import OrderReview from '@/components/checkout/OrderReview';
import PaymentForm from '@/components/checkout/PaymentForm';
import StripeProvider from '@/components/checkout/StripeProvider';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import { ShippingOption, ShippingMethod } from '@/lib/shipping/calculator';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateTax } from '@/lib/tax/calculator';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'quote'>('online');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>('standard');
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);
  const [isTaxExempt, setIsTaxExempt] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Calculate shipping when address is available
  const calculateShippingCost = useCallback(async (address: CustomerInfo['shippingAddress']) => {
    if (!address.zip || !address.state || address.zip.length < 5) {
      setShippingOptions([]);
      setShippingCost(0);
      return;
    }

    setIsCalculatingShipping(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          address,
          preferredMethod: selectedShippingMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShippingOptions(data.options || []);
        if (data.selectedMethod) {
          setSelectedShippingMethod(data.selectedMethod);
          const selectedOption = data.options?.find(
            (opt: ShippingOption) => opt.method === data.selectedMethod
          );
          setShippingCost(selectedOption?.cost || 0);
        }
      } else {
        setShippingOptions([]);
        setShippingCost(0);
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      setShippingOptions([]);
      setShippingCost(0);
    } finally {
      setIsCalculatingShipping(false);
    }
  }, [items, selectedShippingMethod]);

  const handleShippingMethodChange = (method: ShippingMethod) => {
    setSelectedShippingMethod(method);
    const option = shippingOptions.find(opt => opt.method === method);
    setShippingCost(option?.cost || 0);
  };

  const handleCustomerInfoSubmit = async (info: CustomerInfo) => {
    setCustomerInfo(info);
    
    // Check if order has custom fabrication items
    const hasCustomFabrication = items.some(item => item.isCustomFabrication);
    
    // For custom fabrication, default to quote, otherwise show payment
    if (hasCustomFabrication && paymentMethod === 'quote') {
      // Skip payment, go directly to order submission
      await handleOrderSubmission(info, null);
    } else {
      setShowPayment(true);
      setError(null);
    }
  };

  const handleOrderSubmission = async (info: CustomerInfo, paymentId: string | null) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const subtotal = getTotalPrice();
      const total = subtotal + shippingCost + taxAmount;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo: info,
          orderTotal: total,
          subtotal,
          shippingCost,
          shippingMethod: selectedShippingMethod,
          taxAmount,
          taxRate,
          isTaxExempt,
          paymentIntentId: paymentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process order');
      }

      // Clear cart and redirect to confirmation
      clearCart();
      const params = new URLSearchParams({
        jobId: data.jobId || 'pending',
      });
      if (paymentId) {
        params.set('paymentId', paymentId);
      }
      router.push(`/checkout/confirmation?${params.toString()}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your order');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!customerInfo) {
      setError('Customer information is missing');
      return;
    }

    setPaymentIntentId(paymentIntentId);
    await handleOrderSubmission(customerInfo, paymentIntentId);
  };

  // Store address for shipping/tax calculation (debounced)
  const [addressForShipping, setAddressForShipping] = useState<CustomerInfo['shippingAddress'] | null>(null);

  // Calculate tax cost function
  const calculateTaxCost = useCallback((address: CustomerInfo['shippingAddress']) => {
    setIsCalculatingTax(true);
    try {
      const subtotal = getTotalPrice();
      const hasCustomFabrication = items.some(item => item.isCustomFabrication);
      const taxCalculation = calculateTax(
        subtotal,
        address,
        isTaxExempt,
        hasCustomFabrication
      );

      setTaxRate(taxCalculation.taxRate);
      setTaxAmount(taxCalculation.taxAmount);
    } catch (error) {
      console.error('Tax calculation error:', error);
      setTaxRate(0);
      setTaxAmount(0);
    } finally {
      setIsCalculatingTax(false);
    }
  }, [getTotalPrice, items, isTaxExempt]);

  // Calculate shipping when address changes (debounced)
  useEffect(() => {
    if (!addressForShipping?.zip || addressForShipping.zip.length < 5) {
      setShippingOptions([]);
      setShippingCost(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      calculateShippingCost(addressForShipping);
      // Also calculate tax when address changes
      calculateTaxCost(addressForShipping);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [addressForShipping, calculateShippingCost, calculateTaxCost]);

  const handleAddressChange = (address: CustomerInfo['shippingAddress']) => {
    setAddressForShipping(address);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">
              Checkout
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form & Payment */}
              <div className="lg:col-span-2 space-y-6">
                {!showPayment ? (
                  <>
                    {/* Payment Method Selection */}
                    {items.some(item => item.isCustomFabrication) && (
                      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 mb-6">
                        <h3 className="text-white text-lg font-semibold mb-4">Payment Method</h3>
                        <div className="space-y-3">
                          <label className="flex items-center p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="online"
                              checked={paymentMethod === 'online'}
                              onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'quote')}
                              className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 focus:ring-[#DC143C]"
                            />
                            <div className="ml-3">
                              <div className="text-white font-medium">Pay Online</div>
                              <div className="text-white/60 text-sm">Secure payment via Stripe</div>
                            </div>
                          </label>
                          <label className="flex items-center p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="quote"
                              checked={paymentMethod === 'quote'}
                              onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'quote')}
                              className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 focus:ring-[#DC143C]"
                            />
                            <div className="ml-3">
                              <div className="text-white font-medium">Request Quote</div>
                              <div className="text-white/60 text-sm">We'll send you a quote for custom fabrication</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                      <CheckoutForm 
                        onSubmit={handleCustomerInfoSubmit} 
                        isSubmitting={isSubmitting}
                        onAddressChange={handleAddressChange}
                      />
                    </div>

                    {/* Shipping Method Selector */}
                    {shippingOptions.length > 0 && (
                      <ShippingMethodSelector
                        options={shippingOptions}
                        selectedMethod={selectedShippingMethod}
                        onMethodChange={handleShippingMethodChange}
                        isLoading={isCalculatingShipping}
                      />
                    )}

                    {/* Tax Exempt Checkbox */}
                    {addressForShipping?.state && (
                      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="taxExempt"
                            checked={isTaxExempt}
                            onChange={(e) => {
                              setIsTaxExempt(e.target.checked);
                              if (addressForShipping) {
                                calculateTaxCost(addressForShipping);
                              }
                            }}
                            className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 rounded focus:ring-[#DC143C]"
                          />
                          <label htmlFor="taxExempt" className="ml-2 text-white/80 text-sm">
                            I have a valid tax exemption certificate
                          </label>
                        </div>
                        {taxRate > 0 && !isTaxExempt && addressForShipping && (
                          <p className="text-white/60 text-xs mt-2">
                            Sales tax ({addressForShipping.state}: {(taxRate * 100).toFixed(2)}%): ${taxAmount.toFixed(2)}
                          </p>
                        )}
                        {isTaxExempt && (
                          <p className="text-green-200 text-xs mt-2">
                            ✓ Tax exempt - no sales tax will be charged
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <StripeProvider>
                    <PaymentForm
                      amount={getTotalPrice() + shippingCost + taxAmount}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      isProcessing={isSubmitting}
                    />
                  </StripeProvider>
                )}
              </div>

              {/* Order Review */}
              <div className="lg:col-span-1">
                <OrderReview 
                  items={items} 
                  subtotal={getTotalPrice()}
                  shippingCost={shippingCost}
                  taxAmount={taxAmount}
                  total={getTotalPrice() + shippingCost + taxAmount}
                />
                {showPayment && customerInfo && (
                  <div className="mt-4 bg-white/5 border-2 border-white/20 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Customer Information</h4>
                    <p className="text-white/70 text-sm">{customerInfo.name}</p>
                    <p className="text-white/70 text-sm">{customerInfo.email}</p>
                    <button
                      onClick={() => setShowPayment(false)}
                      className="mt-3 text-white/60 hover:text-white text-sm transition-colors"
                    >
                      ← Edit Information
                    </button>
                  </div>
                )}
                <Link
                  href="/cart"
                  className="block mt-4 text-center text-white/60 hover:text-white transition-colors text-sm"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

