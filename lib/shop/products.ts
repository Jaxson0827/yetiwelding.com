import { ShopProduct } from './types';
import {
  productGallery,
  PROD_EDGING_2FT,
  PROD_EDGING_4FT,
  PROD_EDGING_DRAIN,
  PROD_EDGING_BRIDGE,
  PROD_EDGING_SHORT,
  PROD_EDGING_START_FINISH,
  PROD_FIREPIT_BONFIRE,
  PROD_FIREPIT_CAMPFIRE,
  PROD_SIGN_MODERN,
  PROD_SIGN_PREMIUM,
  PROD_PLANTER_GENERIC,
  VAR_EDGING_H4,
  VAR_EDGING_H6,
  VAR_EDGING_H8,
  VAR_EDGING_H14,
  VAR_EDGING_BEND_STRAIGHT,
  VAR_EDGING_BEND_45,
  VAR_EDGING_BEND_90,
  VAR_FIREPIT_CAMPFIRE,
  VAR_FIREPIT_BONFIRE,
} from './images';

const edgingDescription =
  "Yeti landscape edging is built to last. Unlike other brands, our edging has teeth that slice through dirt with ease when hammered into the ground. The deep barrier keeps grass from sneaking under and infiltrating your flower beds, giving you more time to enjoy your weekends.";

const installationCopy =
  "For best results run along your installation line with an edger to provide a guide when inserting. Insert the border and pound in with a hammer. In order to avoid damage to the metal use a wood block rather than hitting the metal directly. Install as deep as you wish; most grass rhizomes stay in the top 2 inches of soil. Use caution where you install — above-ground edging can be a tripping hazard.";

const aboutCorTen =
  "This product uses 100% A606-T4 weather steel, also known as COR-TEN. Cor-Ten is known for its high tensile strength and unique weathering ability. Cor-Ten forms a protective rust coating that regenerates when continuously subject to the weather.";

const sealing =
  "If you wish to protect the metal surface from rusting, we recommend two products: Floetrol by Owatrol, or EVERBRITE. Before applying either product, be sure to thoroughly clean and dry the surface.";

export const shopProducts: ShopProduct[] = [
  {
    slug: 'edging-2ft',
    name: 'The Edging | 2-FT Long',
    subtitle: 'Flexible Lengths for Straight or Curved Designs',
    category: 'landscape-edging',
    basePrice: 19,
    rating: 4.8,
    reviewCount: 185,
    images: productGallery(PROD_EDGING_2FT),
    variantGroups: [
      {
        id: 'height',
        label: 'What are you edging?',
        columns: 2,
        options: [
          { id: 'h6', label: '6 inch', sublabel: 'Hammer-in edging', thumbImage: VAR_EDGING_H6 },
          { id: 'h8', label: '8 inch', sublabel: 'Unlevel ground', thumbImage: VAR_EDGING_H8, priceDelta: 4 },
          { id: 'h14', label: '14 inch', sublabel: 'Raised beds', thumbImage: VAR_EDGING_H14, priceDelta: 12 },
          { id: 'h4', label: '4 inch', sublabel: 'Surface edging', thumbImage: VAR_EDGING_H4, priceDelta: -3 },
        ],
      },
      {
        id: 'bend',
        label: 'Bend Radius',
        columns: 3,
        options: [
          { id: 'straight', label: 'Straight', sublabel: '0° angle / linear edge', thumbImage: VAR_EDGING_BEND_STRAIGHT },
          { id: 'r45', label: '45°', sublabel: 'Gentle curve', thumbImage: VAR_EDGING_BEND_45, priceDelta: 2 },
          { id: 'r90', label: '90°', sublabel: 'Sharp curve', thumbImage: VAR_EDGING_BEND_90, priceDelta: 3 },
        ],
      },
    ],
    features: [
      { text: 'Rounded top edge for safety' },
      { text: 'Installs with a hammer – no digging' },
      { text: 'Prevents mulch, gravel & roots from spreading' },
      { text: 'Handles slopes & uneven ground', appliesTo: ['h8', 'h14'] },
      { text: 'Tall enough for raised beds or dramatic borders', appliesTo: ['h14'] },
      { text: 'Weather-resistant steel construction' },
      { text: 'Perfect for straight edges and borders' },
      { text: 'Easy to install around obstacles' },
    ],
    specs: [
      { label: 'Country of Origin', value: 'United States' },
      { label: 'Product Weight', value: '6.5 lbs' },
      { label: 'Length', value: '24 in' },
      { label: 'Heights Available', value: '4, 6, 8, 14 in' },
      { label: 'Thickness', value: '14 Gauge' },
      { label: 'Material', value: 'A606-T4 COR-TEN Steel' },
    ],
    description: edgingDescription,
    installation: installationCopy,
    aboutCorTen,
    sealing,
    variantCallouts: {
      h4: 'Subtle, low-profile separation between turf and beds. Ideal where you want a clean line without a visible barrier.',
      h6: "Our most popular pick! Great for most mulch beds and lawns – deep enough to keep mulch, rocks, and roots contained.",
      h8: 'Built for slopes and uneven ground. The extra inches let you ride elevation changes without leaving gaps under the edging.',
      h14: 'Designed for raised beds and dramatic borders. Keeps soil contained while creating a sculptural edge that ages beautifully.',
    },
    relatedSlugs: ['edging-4ft', 'edging-drain', 'edging-bridge', 'edging-short'],
  },
  {
    slug: 'firepit-bonfire',
    name: 'The Bonfire',
    subtitle: 'Statement-piece outdoor fire pit',
    category: 'fire-pits',
    basePrice: 590,
    rating: 4.9,
    reviewCount: 84,
    images: productGallery(PROD_FIREPIT_BONFIRE),
    variantGroups: [
      {
        id: 'size',
        label: 'Choose your size',
        columns: 2,
        options: [
          {
            id: 'campfire',
            label: 'Campfire',
            sublabel: 'Intimate gatherings · 29.5" × 32.5" × 15.5"',
            thumbImage: VAR_FIREPIT_CAMPFIRE,
            priceDelta: -300,
          },
          {
            id: 'bonfire',
            label: 'Bonfire',
            sublabel: 'Statement piece · 40" × 37" × 21"',
            thumbImage: VAR_FIREPIT_BONFIRE,
          },
        ],
      },
    ],
    features: [
      { text: 'Heavy-gauge steel construction' },
      { text: 'Drains rainwater through bottom' },
      { text: 'Develops a beautiful weathered patina' },
      { text: 'Ships in a single box for easy handling', appliesTo: ['campfire'] },
      { text: 'Compact design for smaller patios', appliesTo: ['campfire'] },
      { text: 'Hosts large gatherings with ease', appliesTo: ['bonfire'] },
    ],
    specs: [
      { label: 'Country of Origin', value: 'United States' },
      { label: 'Material', value: '11-gauge A606-T4 COR-TEN Steel' },
      { label: 'Drainage', value: 'Bottom drain holes' },
      { label: 'Production Time', value: '1-2 weeks' },
    ],
    description:
      'A heavy-duty steel fire pit designed for years of outdoor use. The Bonfire is the statement-piece centerpiece for big backyards and family gatherings.',
    productionTime: '1-2 weeks',
    variantCallouts: {
      campfire:
        'Perfect for smaller patios and intimate gatherings of 2-6 people. The compact design delivers all the features of our larger model in a space-saving size. Ships in a single box for easy handling.',
      bonfire:
        'The full-size show-stopper. Designed for groups of 8-12 around a generous fire bowl. Ships freight in a single crate.',
    },
    relatedSlugs: ['firepit-campfire'],
  },
];

// Stub products referenced from navigation (so links don't 404).
const stubProducts: ShopProduct[] = [
  {
    slug: 'edging-4ft',
    name: 'The Edging | 4-FT Long',
    subtitle: "The Foundation of Your Garden's Edge",
    category: 'landscape-edging',
    basePrice: 35,
    rating: 4.9,
    reviewCount: 312,
    images: productGallery(PROD_EDGING_4FT),
    variantGroups: [],
    features: [{ text: 'Most popular length' }, { text: '14-gauge weathering steel' }],
    specs: [
      { label: 'Length', value: '48 in' },
      { label: 'Material', value: 'A606-T4 COR-TEN Steel' },
    ],
    description: edgingDescription,
    installation: installationCopy,
    aboutCorTen,
    sealing,
    relatedSlugs: ['edging-2ft', 'edging-drain'],
  },
  {
    slug: 'edging-drain',
    name: 'The Edging | 2-FT Drain',
    subtitle: 'Seamless Drainage for Healthy Gardens',
    category: 'landscape-edging',
    basePrice: 24,
    rating: 4.7,
    reviewCount: 41,
    images: productGallery(PROD_EDGING_DRAIN),
    variantGroups: [],
    features: [{ text: 'Built-in drainage cutouts' }],
    specs: [{ label: 'Length', value: '24 in' }],
    description: edgingDescription,
    relatedSlugs: ['edging-2ft', 'edging-4ft'],
  },
  {
    slug: 'edging-bridge',
    name: 'The Edging | 2-FT Bridge',
    subtitle: 'Bridge Gaps with Ease and Style',
    category: 'landscape-edging',
    basePrice: 22,
    rating: 4.7,
    reviewCount: 28,
    images: productGallery(PROD_EDGING_BRIDGE),
    variantGroups: [],
    features: [{ text: 'Bridges gaps for utility crossings' }],
    specs: [{ label: 'Length', value: '24 in' }],
    description: edgingDescription,
    relatedSlugs: ['edging-2ft'],
  },
  {
    slug: 'edging-short',
    name: 'The Edging | >1-FT',
    subtitle: 'Precision pieces for perfect lengths',
    category: 'landscape-edging',
    basePrice: 11,
    rating: 4.8,
    reviewCount: 19,
    images: productGallery(PROD_EDGING_SHORT),
    variantGroups: [],
    features: [{ text: 'Trim-to-fit short pieces' }],
    specs: [{ label: 'Length', value: '12 in' }],
    description: edgingDescription,
    relatedSlugs: ['edging-2ft'],
  },
  {
    slug: 'edging-start-finish',
    name: 'Start / Finish Caps',
    subtitle: 'Polished Ends for a Professional Touch',
    category: 'edging-accessories',
    basePrice: 15,
    rating: 4.9,
    reviewCount: 53,
    images: productGallery(PROD_EDGING_START_FINISH),
    variantGroups: [],
    features: [{ text: 'Clean, finished line ends' }],
    specs: [{ label: 'Material', value: 'COR-TEN Steel' }],
    description: 'Polished end caps for landscape edging.',
    relatedSlugs: ['edging-2ft'],
  },
  {
    slug: 'firepit-campfire',
    name: 'The Campfire',
    subtitle: 'Intimate campfire experience',
    category: 'fire-pits',
    basePrice: 290,
    rating: 4.9,
    reviewCount: 62,
    images: productGallery(PROD_FIREPIT_CAMPFIRE),
    variantGroups: [],
    features: [{ text: 'Compact for small patios' }],
    specs: [{ label: 'Size', value: '29.5" × 32.5" × 15.5"' }],
    description: 'Intimate campfire-sized steel fire pit for small gatherings.',
    relatedSlugs: ['firepit-bonfire'],
  },
  {
    slug: 'sign-modern',
    name: 'Modern Address Sign',
    subtitle: 'Personalized COR-TEN steel address sign',
    category: 'the-sign',
    basePrice: 135,
    rating: 4.9,
    reviewCount: 211,
    images: productGallery(PROD_SIGN_MODERN),
    variantGroups: [],
    features: [{ text: 'Personalized house numbers' }],
    specs: [{ label: 'Material', value: 'COR-TEN Steel' }],
    description: 'A premium personalized COR-TEN steel address sign.',
    relatedSlugs: ['sign-premium'],
  },
  {
    slug: 'sign-premium',
    name: 'Premium Address Sign',
    subtitle: 'Elegant design for your home',
    category: 'the-sign',
    basePrice: 185,
    rating: 4.9,
    reviewCount: 92,
    images: productGallery(PROD_SIGN_PREMIUM),
    variantGroups: [],
    features: [{ text: 'Premium design with optional lighting' }],
    specs: [{ label: 'Material', value: 'COR-TEN Steel' }],
    description: 'Premium address sign with elegant design and optional lighting.',
    relatedSlugs: ['sign-modern'],
  },
];

const planterSlugs = [
  ['planter-12-24', '12×12×24', 'Compact tapered planter', 79],
  ['planter-15-30', '15×15×30', 'Standard tapered planter', 119],
  ['planter-18-36', '18×18×36', 'Large tapered planter', 169],
  ['planter-rect-32', '32×14×30', 'Tall rectangular planter', 199],
  ['planter-rect-46', '14×46×14', 'Wide rectangular planter', 219],
  ['planter-rect-18', '18×18×18', 'Cube rectangular planter', 149],
  ['planter-tt-32', '32×3.5×3.5', 'Long tabletop planter', 89],
  ['planter-tt-12', '12×3×3.5', 'Compact tabletop planter', 49],
  ['planter-risers', 'Planter Risers', 'Elevate your planters', 35],
  ['herb-markers', 'Herb Markers', 'Label and identify your herbs', 19],
  ['veg-markers', 'Vegetable Markers', 'Identify your garden', 19],
] as const;

const planterProducts: ShopProduct[] = planterSlugs.map(
  ([slug, name, subtitle, basePrice]) => ({
    slug,
    name: String(name),
    subtitle: String(subtitle),
    category: 'planters',
    basePrice: Number(basePrice),
    rating: 4.8,
    reviewCount: 42,
    images: productGallery(PROD_PLANTER_GENERIC),
    variantGroups: [],
    features: [{ text: 'Premium COR-TEN steel construction' }],
    specs: [{ label: 'Material', value: 'COR-TEN Steel' }],
    description: 'Premium COR-TEN steel planter that develops a beautiful patina.',
    relatedSlugs: [],
  }),
);

export const allShopProducts: ShopProduct[] = [
  ...shopProducts,
  ...stubProducts,
  ...planterProducts,
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return allShopProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): ShopProduct[] {
  return allShopProducts.filter((p) => p.category === slug);
}
