'use client';

import { useMemo, useState } from 'react';
import { ShopProduct, SelectionMap } from '@/lib/shop/types';
import ProductGallery from './ProductGallery';
import PurchasePanel from './PurchasePanel';
import VariantSelector from './VariantSelector';
import QuantityStepper from './QuantityStepper';
import AddToCartButton from './AddToCartButton';
import TradeBanner from './TradeBanner';
import FeaturesAccordion from './FeaturesAccordion';
import SpecsAccordion from './SpecsAccordion';

export default function ProductDetail({ product }: { product: ShopProduct }) {
  const [selection, setSelection] = useState<SelectionMap>(() => {
    const init: SelectionMap = {};
    for (const g of product.variantGroups) {
      if (g.options.length > 0) init[g.id] = g.options[0].id;
    }
    return init;
  });
  const [quantity, setQuantity] = useState(1);

  const unitPrice = useMemo(() => {
    let price = product.basePrice;
    for (const g of product.variantGroups) {
      const selectedId = selection[g.id];
      const opt = g.options.find((o) => o.id === selectedId);
      if (opt?.priceDelta) price += opt.priceDelta;
    }
    return price;
  }, [product, selection]);

  const totalPrice = unitPrice * quantity;

  const handleVariantChange = (groupId: string, optionId: string) => {
    setSelection((prev) => ({ ...prev, [groupId]: optionId }));
  };

  return (
    <article className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Purchase panel */}
        <div className="lg:col-span-5">
          <PurchasePanel product={product} computedPrice={unitPrice}>
            {/* Variants */}
            {product.variantGroups.length > 0 && (
              <VariantSelector
                groups={product.variantGroups}
                selection={selection}
                onChange={handleVariantChange}
              />
            )}

            {/* Quantity + CTA */}
            <div className="flex items-stretch gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <AddToCartButton totalPrice={totalPrice} productName={product.name} />
            </div>

            {/* Trade banner */}
            <TradeBanner />

            {product.productionTime && (
              <p className="text-[11px] text-white/55">
                Production time: {product.productionTime}
              </p>
            )}

            {/* Accordions */}
            <div>
              <FeaturesAccordion product={product} selection={selection} />
              <SpecsAccordion specs={product.specs} />
            </div>
          </PurchasePanel>
        </div>
      </div>
    </article>
  );
}
