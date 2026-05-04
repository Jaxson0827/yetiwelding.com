// Shop microsite domain model. Visual-only for now (no cart/server wiring).

export type CategorySlug =
  | 'landscape-edging'
  | 'edging-accessories'
  | 'planters'
  | 'fire-pits'
  | 'the-sign'
  | 'tree-rings'
  | 'raised-beds';

export interface ShopCategory {
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  badge?: string;
  priceFrom: string;
  productCount: number;
  productCountLabel: string; // e.g. "8 products" or "2 variants"
  heroImage: string;
  thumbImage: string;
}

export interface VariantOption {
  id: string;
  label: string;
  sublabel?: string;
  thumbImage?: string;
  priceDelta?: number;
}

export interface VariantGroup {
  id: string;
  label: string; // ALL CAPS section header
  columns?: 2 | 3;
  options: VariantOption[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface FeatureBullet {
  text: string;
  appliesTo?: string[]; // option ids that enable this feature; if undefined, always available
}

export interface VariantCallout {
  // map of option id -> highlighted callout copy
  [optionId: string]: string;
}

export interface ShopProduct {
  slug: string;
  name: string;
  subtitle: string;
  category: CategorySlug;
  basePrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  variantGroups: VariantGroup[];
  features: FeatureBullet[];
  specs: ProductSpec[];
  description: string;
  installation?: string;
  aboutCorTen?: string;
  sealing?: string;
  productionTime?: string;
  variantCallouts?: VariantCallout;
  relatedSlugs?: string[];
}

export interface Review {
  title: string;
  body: string;
  authorName: string;
  authorReviewCount: number;
  timeAgo: string;
  stars: number; // 1-5
  hasPhotos?: boolean;
  photoCount?: number;
  customerPhotoReview?: boolean;
  photos?: string[];
}

export interface MegaMenuItem {
  label: string;
  description: string;
  href: string;
  icon?: string;
  image?: string;
}

export interface MegaMenuColumn {
  label?: string; // optional all-caps section header
  items: MegaMenuItem[];
}

export interface MegaMenu {
  variant: 'columns' | 'image-cards';
  columns: MegaMenuColumn[];
}

export interface ShopNavItem {
  label: string;
  href: string; // category page
  megaMenu?: MegaMenu;
}

// Map of variant group id -> selected option id.
export type SelectionMap = Record<string, string>;
