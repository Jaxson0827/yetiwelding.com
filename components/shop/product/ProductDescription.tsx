'use client';

import { ShopProduct } from '@/lib/shop/types';

export default function ProductDescription({ product }: { product: ShopProduct }) {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl space-y-5 text-[15px] leading-relaxed text-white/75">
        <p>{product.description}</p>
        {product.installation && (
          <p>
            <strong className="text-white">Installation:</strong>{' '}
            {product.installation}
          </p>
        )}
        {product.aboutCorTen && (
          <p>
            <strong className="text-white">About Cor-Ten Steel:</strong>{' '}
            {product.aboutCorTen}
          </p>
        )}
        {product.sealing && (
          <p>
            <strong className="text-white">
              Sealing Yeti Steel to Prevent Rust:
            </strong>{' '}
            {product.sealing}
          </p>
        )}
      </div>
    </section>
  );
}
