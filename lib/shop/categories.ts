import { ShopCategory } from './types';
import {
  CAT_LANDSCAPE_EDGING,
  CAT_EDGING_ACCESSORIES,
  CAT_PLANTERS,
  CAT_FIRE_PITS,
  CAT_THE_SIGN,
  CAT_TREE_RINGS,
  CAT_RAISED_BEDS,
} from './images';

// Category copy taken verbatim from the Edge Right reference site as starter content.
// Replace with Yeti-specific products and photography when available.
export const shopCategories: ShopCategory[] = [
  {
    slug: 'landscape-edging',
    name: 'Landscape Edging',
    shortDescription:
      'Professional-grade edging solutions for pristine garden borders',
    longDescription:
      "Yeti landscape edging for lawn and garden is strong, durable, and attractive. Made of beefy COR-TEN marine-grade steel, it's sleek and attractive, looking even better over time as it ages to a nice, rustic, patina that complements a variety of aesthetic styles and designs. It can be used as lawn edging, edging for pathways, as a firepit edge border, and is perfect as a garden edging product as well.",
    badge: 'Most Popular',
    priceFrom: 'From $4/ft',
    productCount: 8,
    productCountLabel: '8 products',
    heroImage: CAT_LANDSCAPE_EDGING,
    thumbImage: CAT_LANDSCAPE_EDGING,
  },
  {
    slug: 'edging-accessories',
    name: 'Edging Accessories',
    shortDescription:
      'Complete your edging project with professional accessories',
    longDescription:
      "Refine your landscape with Yeti's Edging Connector Clips. This essential collection, compatible with our COR-TEN metal edging, includes a variety of connectors to streamline your installation. Designed for effortless fitting and lasting elegance, these accessories evolve aesthetically over time, adding a rustic touch to your garden's charm.",
    priceFrom: 'From $11',
    productCount: 10,
    productCountLabel: '10 products',
    heroImage: CAT_EDGING_ACCESSORIES,
    thumbImage: CAT_EDGING_ACCESSORIES,
  },
  {
    slug: 'planters',
    name: 'Planters',
    shortDescription: 'Stylish containers for any space',
    longDescription:
      'Premium COR-TEN steel planters that develop a beautiful weathered patina over time. Available in tapered, rectangular, and tabletop sizes for indoor and outdoor use.',
    priceFrom: 'From $35',
    productCount: 9,
    productCountLabel: '9 products',
    heroImage: CAT_PLANTERS,
    thumbImage: CAT_PLANTERS,
  },
  {
    slug: 'fire-pits',
    name: 'Fire Pits',
    shortDescription: 'Create cozy outdoor gatherings',
    longDescription:
      'Heavy-duty steel fire pits designed for years of use. Choose between the intimate Campfire and the statement-piece Bonfire.',
    priceFrom: 'From $290',
    productCount: 2,
    productCountLabel: '2 variants',
    heroImage: CAT_FIRE_PITS,
    thumbImage: CAT_FIRE_PITS,
  },
  {
    slug: 'the-sign',
    name: 'The Sign',
    shortDescription: "The sign that says \"You've arrived\"",
    longDescription:
      'Premium COR-TEN steel address signs built to last. Personalize with your address numbers, optional teeth for ground installation, and integrated lighting.',
    priceFrom: 'From $135',
    productCount: 8,
    productCountLabel: '8 variants',
    heroImage: CAT_THE_SIGN,
    thumbImage: CAT_THE_SIGN,
  },
  {
    slug: 'tree-rings',
    name: 'Tree Rings',
    shortDescription: 'Protect and beautify your trees',
    longDescription:
      'Modular COR-TEN steel tree rings that protect roots, contain mulch, and add a sculptural element to your landscape.',
    priceFrom: 'From $120',
    productCount: 6,
    productCountLabel: '6 variants',
    heroImage: CAT_TREE_RINGS,
    thumbImage: CAT_TREE_RINGS,
  },
  {
    slug: 'raised-beds',
    name: 'Raised Beds',
    shortDescription: 'Durable garden beds for growing',
    longDescription:
      'Bolt-together steel raised garden beds. Multiple sizes and depths to fit any growing footprint, from compact urban gardens to full backyard setups.',
    priceFrom: 'From $100',
    productCount: 6,
    productCountLabel: '6 variants',
    heroImage: CAT_RAISED_BEDS,
    thumbImage: CAT_RAISED_BEDS,
  },
];

export function getCategoryBySlug(slug: string): ShopCategory | undefined {
  return shopCategories.find((c) => c.slug === slug);
}
