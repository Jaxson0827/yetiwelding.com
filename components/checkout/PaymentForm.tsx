'use client';

import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
}

export default function PaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'usd',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
        onPaymentError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, onPaymentError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment form validation failed');
        setIsLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onPaymentError(confirmError.message || 'Payment failed');
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      } else {
        setError('Payment processing incomplete');
        onPaymentError('Payment processing incomplete');
        setIsLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onPaymentError(errorMessage);
      setIsLoading(false);
    }
  };

  if (isLoading && !clientSecret) {
    return (
      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC143C]"></div>
          <span className="ml-3 text-white/80">Loading payment form...</span>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-6">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
        <h3 className="text-white text-xl font-bold mb-4">Payment Information</h3>
        <div className="text-white/60 text-sm mb-4">
          Secure payment powered by Stripe
        </div>
        
        {clientSecret && (
          <div className="mt-4">
            <PaymentElement
              options={{
                layout: 'tabs',
              }}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !elements || isLoading || isProcessing}
          className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-colors ${
            !stripe || !elements || isLoading || isProcessing
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-[#DC143C] hover:bg-[#B01030] text-white'
          }`}
        >
          {isLoading || isProcessing
            ? 'Processing Payment...'
            : `Pay $${amount.toFixed(2)}`}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-white/60 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </form>
  );
}

