'use client';

import React, { useState } from 'react';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  freight?: {
    deliveryType: 'commercial' | 'residential';
    liftgateRequired: boolean;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  specialInstructions?: string;
  useBillingAddress: boolean;
}

interface CheckoutFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
  isSubmitting?: boolean;
  onAddressChange?: (address: CustomerInfo['shippingAddress']) => void;
  onFreightChange?: (freight: NonNullable<CustomerInfo['freight']>) => void;
  freightRequired?: boolean;
  requireShippingAddress?: boolean;
}

export default function CheckoutForm({
  onSubmit,
  isSubmitting = false,
  onAddressChange,
  onFreightChange,
  freightRequired = false,
  requireShippingAddress = true,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    },
    freight: {
      deliveryType: 'commercial',
      liftgateRequired: false,
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    },
    specialInstructions: '',
    useBillingAddress: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo | string, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo | string, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    const ship = formData.shippingAddress;
    const anyShipProvided = !!(ship.street || ship.city || ship.state || ship.zip);

    if (requireShippingAddress) {
      if (!ship.street.trim()) newErrors['shippingAddress.street'] = 'Street address is required';
      if (!ship.city.trim()) newErrors['shippingAddress.city'] = 'City is required';
      if (!ship.state.trim()) newErrors['shippingAddress.state'] = 'State is required';
      if (!ship.zip.trim()) {
        newErrors['shippingAddress.zip'] = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(ship.zip)) {
        newErrors['shippingAddress.zip'] = 'Invalid ZIP code format';
      }
    } else if (anyShipProvided) {
      // Quote mode: shipping is optional, but if provided, require state+zip for estimation.
      if (!!ship.state.trim() !== !!ship.zip.trim()) {
        newErrors['shippingAddress.zip'] = 'Enter both state and ZIP for a shipping estimate (or leave blank)';
      } else if (ship.zip.trim() && !/^\d{5}(-\d{4})?$/.test(ship.zip)) {
        newErrors['shippingAddress.zip'] = 'Invalid ZIP code format';
      }
    }

    if (freightRequired) {
      const dt = formData.freight?.deliveryType;
      if (dt !== 'commercial' && dt !== 'residential') {
        newErrors['freight.deliveryType'] = 'Delivery type is required';
      }
    }

    if (formData.useBillingAddress) {
      if (!formData.billingAddress?.street.trim()) newErrors['billingAddress.street'] = 'Billing street address is required';
      if (!formData.billingAddress?.city.trim()) newErrors['billingAddress.city'] = 'Billing city is required';
      if (!formData.billingAddress?.state.trim()) newErrors['billingAddress.state'] = 'Billing state is required';
      if (!formData.billingAddress?.zip.trim()) {
        newErrors['billingAddress.zip'] = 'Billing ZIP code is required';
      } else if (formData.billingAddress.zip && !/^\d{5}(-\d{4})?$/.test(formData.billingAddress.zip)) {
        newErrors['billingAddress.zip'] = 'Invalid billing ZIP code format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const updated = {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof CustomerInfo] as any),
            [child]: value,
          },
        };
        
        // Trigger shipping calculation when shipping address changes
        if (parent === 'shippingAddress' && onAddressChange) {
          onAddressChange(updated.shippingAddress);
        }

        if (parent === 'freight' && onFreightChange && updated.freight) {
          onFreightChange(updated.freight);
        }
        
        return updated;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className="text-white text-xl font-bold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
              placeholder="Company Name"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-white text-xl font-bold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.shippingAddress.street}
              onChange={(e) => updateField('shippingAddress.street', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
              placeholder="123 Main St"
            />
            {errors['shippingAddress.street'] && <p className="text-red-400 text-sm mt-1">{errors['shippingAddress.street']}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.city}
                onChange={(e) => updateField('shippingAddress.city', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                placeholder="City"
              />
              {errors['shippingAddress.city'] && <p className="text-red-400 text-sm mt-1">{errors['shippingAddress.city']}</p>}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.state}
                onChange={(e) => updateField('shippingAddress.state', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                placeholder="State"
              />
              {errors['shippingAddress.state'] && <p className="text-red-400 text-sm mt-1">{errors['shippingAddress.state']}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.zip}
                onChange={(e) => updateField('shippingAddress.zip', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                placeholder="12345"
              />
              {errors['shippingAddress.zip'] && <p className="text-red-400 text-sm mt-1">{errors['shippingAddress.zip']}</p>}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.shippingAddress.country}
                onChange={(e) => updateField('shippingAddress.country', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                placeholder="United States"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Freight details (only when freight is required) */}
      {freightRequired && (
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Freight Delivery Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Delivery Type *
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="commercial"
                    checked={formData.freight?.deliveryType === 'commercial'}
                    onChange={() => updateField('freight.deliveryType', 'commercial')}
                    className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 focus:ring-[#DC143C]"
                  />
                  <div className="ml-3">
                    <div className="text-white font-medium">Commercial</div>
                    <div className="text-white/60 text-sm">Business address (dock/forklift access)</div>
                  </div>
                </label>
                <label className="flex items-center p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="residential"
                    checked={formData.freight?.deliveryType === 'residential'}
                    onChange={() => updateField('freight.deliveryType', 'residential')}
                    className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 focus:ring-[#DC143C]"
                  />
                  <div className="ml-3">
                    <div className="text-white font-medium">Residential</div>
                    <div className="text-white/60 text-sm">Home delivery (often requires extra fees)</div>
                  </div>
                </label>
              </div>
              {errors['freight.deliveryType'] && (
                <p className="text-red-400 text-sm mt-1">{errors['freight.deliveryType']}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="liftgateRequired"
                checked={!!formData.freight?.liftgateRequired}
                onChange={(e) => updateField('freight.liftgateRequired', e.target.checked)}
                className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 rounded focus:ring-[#DC143C]"
              />
              <label htmlFor="liftgateRequired" className="ml-2 text-white/80 text-sm">
                Liftgate required at delivery
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Billing Address */}
      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useBillingAddress"
            checked={formData.useBillingAddress}
            onChange={(e) => updateField('useBillingAddress', e.target.checked)}
            className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 rounded focus:ring-[#DC143C]"
          />
          <label htmlFor="useBillingAddress" className="ml-2 text-white/80 text-sm">
            Use different billing address
          </label>
        </div>

        {formData.useBillingAddress && (
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4">Billing Address</h3>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.billingAddress?.street || ''}
                onChange={(e) => updateField('billingAddress.street', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                placeholder="123 Main St"
              />
              {errors['billingAddress.street'] && <p className="text-red-400 text-sm mt-1">{errors['billingAddress.street']}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.billingAddress?.city || ''}
                  onChange={(e) => updateField('billingAddress.city', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                  placeholder="City"
                />
                {errors['billingAddress.city'] && <p className="text-red-400 text-sm mt-1">{errors['billingAddress.city']}</p>}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.billingAddress?.state || ''}
                  onChange={(e) => updateField('billingAddress.state', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                  placeholder="State"
                />
                {errors['billingAddress.state'] && <p className="text-red-400 text-sm mt-1">{errors['billingAddress.state']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.billingAddress?.zip || ''}
                  onChange={(e) => updateField('billingAddress.zip', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                  placeholder="12345"
                />
                {errors['billingAddress.zip'] && <p className="text-red-400 text-sm mt-1">{errors['billingAddress.zip']}</p>}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.billingAddress?.country || 'United States'}
                  onChange={(e) => updateField('billingAddress.country', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C]"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          value={formData.specialInstructions}
          onChange={(e) => updateField('specialInstructions', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] resize-none"
          placeholder="Any special instructions or notes for your order..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isSubmitting
            ? 'bg-white/10 text-white/50 cursor-not-allowed'
            : 'bg-[#DC143C] hover:bg-[#B01030] text-white'
        }`}
      >
        {isSubmitting ? 'Processing Order...' : 'Place Order'}
      </button>
    </form>
  );
}

