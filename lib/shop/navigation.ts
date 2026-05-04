import { ShopNavItem } from './types';
import {
  PROD_EDGING_2FT,
  PROD_EDGING_4FT,
  PROD_EDGING_DRAIN,
  PROD_EDGING_BRIDGE,
  PROD_EDGING_SHORT,
  PROD_EDGING_START_FINISH,
  PROD_PLANTER_GENERIC,
  CAT_EDGING_ACCESSORIES,
  CAT_RAISED_BEDS,
  CAT_TREE_RINGS,
  NAV_FAQ,
  NAV_ABOUT_STEEL,
  NAV_DATA_SHEETS,
  NAV_PRO_PROGRAM,
  NAV_ABOUT_US,
  NAV_CONTACT,
  NAVCARD_SIGN_MODERN,
  NAVCARD_SIGN_PREMIUM,
  NAVCARD_FIREPIT_BONFIRE,
  NAVCARD_FIREPIT_CAMPFIRE,
  NAVCARD_INSTALLATION_GUIDE,
  NAVCARD_INSTALLATION_VIDEO,
} from './images';

// Mega-menu structure mirrors Edge Right's information architecture. Adapt
// items as products are mapped to Yeti's actual lineup.
export const shopNavItems: ShopNavItem[] = [
  {
    label: 'Edging',
    href: '/shop/landscape-edging',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          label: 'Landscape Edging',
          items: [
            {
              label: '4-FT Edging',
              description: "The Foundation of Your Garden's Edge",
              href: '/shop/products/edging-4ft',
              icon: PROD_EDGING_4FT,
            },
            {
              label: '2-FT Edging',
              description: 'Flexible Lengths for Straight or Curved Designs',
              href: '/shop/products/edging-2ft',
              icon: PROD_EDGING_2FT,
            },
            {
              label: '2-FT Drain',
              description: 'Seamless Drainage for Healthy Gardens',
              href: '/shop/products/edging-drain',
              icon: PROD_EDGING_DRAIN,
            },
            {
              label: '2-FT Bridge',
              description: 'Bridge Gaps with Ease and Style',
              href: '/shop/products/edging-bridge',
              icon: PROD_EDGING_BRIDGE,
            },
          ],
        },
        {
          label: 'Edging Kits',
          items: [
            {
              label: 'Raised Beds',
              description: 'Bolt-together steel raised beds',
              href: '/shop/raised-beds',
              icon: CAT_RAISED_BEDS,
            },
            {
              label: 'Tree Rings',
              description: 'Modular tree ring kits',
              href: '/shop/tree-rings',
              icon: CAT_TREE_RINGS,
            },
          ],
        },
        {
          label: 'Edging Accessories',
          items: [
            {
              label: 'Edging Accessories',
              description: 'Connect and Secure Your Edging',
              href: '/shop/edging-accessories',
              icon: CAT_EDGING_ACCESSORIES,
            },
            {
              label: '>1-FT Edging',
              description: 'Precision Pieces for Perfect Lengths',
              href: '/shop/products/edging-short',
              icon: PROD_EDGING_SHORT,
            },
            {
              label: 'Start/Finish',
              description: 'Polished Ends for a Professional Touch',
              href: '/shop/products/edging-start-finish',
              icon: PROD_EDGING_START_FINISH,
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Planters',
    href: '/shop/planters',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          label: 'Tapered Planters',
          items: [
            { label: '12×12×24', description: 'Compact tapered', href: '/shop/products/planter-12-24', icon: PROD_PLANTER_GENERIC },
            { label: '15×15×30', description: 'Standard tapered', href: '/shop/products/planter-15-30', icon: PROD_PLANTER_GENERIC },
            { label: '18×18×36', description: 'Large tapered', href: '/shop/products/planter-18-36', icon: PROD_PLANTER_GENERIC },
          ],
        },
        {
          label: 'Rectangular Planters',
          items: [
            { label: '32×14×30', description: 'Tall rectangular', href: '/shop/products/planter-rect-32', icon: PROD_PLANTER_GENERIC },
            { label: '14×46×14', description: 'Wide rectangular', href: '/shop/products/planter-rect-46', icon: PROD_PLANTER_GENERIC },
            { label: '18×18×18', description: 'Cube rectangular', href: '/shop/products/planter-rect-18', icon: PROD_PLANTER_GENERIC },
          ],
        },
        {
          label: 'Tabletop Planters',
          items: [
            { label: '32×3.5×3.5', description: 'Long tabletop', href: '/shop/products/planter-tt-32', icon: PROD_PLANTER_GENERIC },
            { label: '12×3×3.5', description: 'Compact tabletop', href: '/shop/products/planter-tt-12', icon: PROD_PLANTER_GENERIC },
          ],
        },
        {
          label: 'Planter Accessories',
          items: [
            { label: 'Planter Risers', description: 'Elevate your planters', href: '/shop/products/planter-risers', icon: PROD_PLANTER_GENERIC },
            { label: 'Herb Markers', description: 'Label and identify your herbs', href: '/shop/products/herb-markers', icon: PROD_PLANTER_GENERIC },
            { label: 'Vegetable Markers', description: 'Organize and identify your garden', href: '/shop/products/veg-markers', icon: PROD_PLANTER_GENERIC },
          ],
        },
      ],
    },
  },
  {
    label: 'The Sign',
    href: '/shop/the-sign',
    megaMenu: {
      variant: 'image-cards',
      columns: [
        {
          items: [
            {
              label: 'Modern Address Sign',
              description: 'Personalized COR-TEN steel address sign',
              href: '/shop/products/sign-modern',
              image: NAVCARD_SIGN_MODERN,
            },
            {
              label: 'Premium Address Sign',
              description: 'Elegant design for your home',
              href: '/shop/products/sign-premium',
              image: NAVCARD_SIGN_PREMIUM,
            },
          ],
        },
      ],
    },
  },
  {
    label: 'The Firepit',
    href: '/shop/fire-pits',
    megaMenu: {
      variant: 'image-cards',
      columns: [
        {
          items: [
            {
              label: 'The Bonfire',
              description: 'Large gathering fire pit',
              href: '/shop/products/firepit-bonfire',
              image: NAVCARD_FIREPIT_BONFIRE,
            },
            {
              label: 'The Campfire',
              description: 'Intimate campfire experience',
              href: '/shop/products/firepit-campfire',
              image: NAVCARD_FIREPIT_CAMPFIRE,
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Installation',
    href: '/shop/installation',
    megaMenu: {
      variant: 'image-cards',
      columns: [
        {
          label: 'Installation Guides',
          items: [
            {
              label: 'Installation Guide',
              description: 'Step-by-step instructions',
              href: '/shop/installation',
              image: NAVCARD_INSTALLATION_GUIDE,
            },
            {
              label: 'Installation Video',
              description: "Watch how it's done",
              href: '/shop/installation#video',
              image: NAVCARD_INSTALLATION_VIDEO,
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Learn',
    href: '/shop/about-steel',
    megaMenu: {
      variant: 'columns',
      columns: [
        {
          label: 'Support',
          items: [
            {
              label: 'Frequently Asked Questions',
              description: 'Find answers to common questions',
              href: '/shop/faq',
              icon: NAV_FAQ,
            },
            {
              label: 'What is COR-TEN Steel?',
              description: 'Learn about our premium material',
              href: '/shop/about-steel',
              icon: NAV_ABOUT_STEEL,
            },
            {
              label: 'Yeti Data Sheets',
              description: 'Technical specifications and details',
              href: '/shop/about-steel#data',
              icon: NAV_DATA_SHEETS,
            },
            {
              label: 'Yeti Pro',
              description: 'Business pricing and benefits',
              href: '/shop/about-steel#pro',
              icon: NAV_PRO_PROGRAM,
            },
          ],
        },
        {
          label: 'Company',
          items: [
            {
              label: 'About Us',
              description: 'Our story and mission',
              href: '/about',
              icon: NAV_ABOUT_US,
            },
            {
              label: 'Contact Us',
              description: 'Get in touch with our team',
              href: '/contact',
              icon: NAV_CONTACT,
            },
          ],
        },
      ],
    },
  },
];
