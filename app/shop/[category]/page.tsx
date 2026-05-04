import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { shopCategories, getCategoryBySlug } from '@/lib/shop/categories';
import { getProductsByCategory } from '@/lib/shop/products';
import CollectionHero from '@/components/shop/category/CollectionHero';
import ProductGrid from '@/components/shop/category/ProductGrid';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return shopCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Yeti Steel Goods | Yeti Welding`,
    description: category.longDescription,
    alternates: {
      canonical: `https://yetiwelding.com/shop/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <>
      <CollectionHero category={category} />
      <section className="container mx-auto max-w-7xl py-8 md:py-12">
        <ProductGrid products={products} />
      </section>
    </>
  );
}
