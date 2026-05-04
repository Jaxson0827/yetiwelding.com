import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { allShopProducts, getProductBySlug } from '@/lib/shop/products';
import ProductDetail from '@/components/shop/product/ProductDetail';
import RelatedProducts from '@/components/shop/product/RelatedProducts';
import ProductDescription from '@/components/shop/product/ProductDescription';
import CustomerReviews from '@/components/shop/product/CustomerReviews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allShopProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Yeti Steel Goods`,
    description: product.subtitle,
    alternates: {
      canonical: `https://yetiwelding.com/shop/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = (product.relatedSlugs ?? [])
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProducts products={related} />
      <ProductDescription product={product} />
      <CustomerReviews product={product} />
    </>
  );
}
