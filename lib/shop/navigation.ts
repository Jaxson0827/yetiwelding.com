import { ShopNavItem } from './types';

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
              icon: '/projects/photo28.jpg',
            },
            {
              label: '2-FT Edging',
              description: 'Flexible Lengths for Straight or Curved Designs',
              href: '/shop/products/edging-2ft',
              icon: '/projects/photo29.jpg',
            },
            {
              label: '2-FT Drain',
              description: 'Seamless Drainage for Healthy Gardens',
              href: '/shop/products/edging-drain',
              icon: '/projects/photo30.jpg',
            },
            {
              label: '2-FT Bridge',
              description: 'Bridge Gaps with Ease and Style',
              href: '/shop/products/edging-bridge',
              icon: '/projects/photo31.jpg',
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
              icon: '/garden_boxes/garden_box_hero.png',
            },
            {
              label: 'Tree Rings',
              description: 'Modular tree ring kits',
              href: '/shop/tree-rings',
              icon: '/projects/photo33.jpg',
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
              icon: '/projects/photo29.jpg',
            },
            {
              label: '>1-FT Edging',
              description: 'Precision Pieces for Perfect Lengths',
              href: '/shop/products/edging-short',
              icon: '/projects/photo34.jpg',
            },
            {
              label: 'Start/Finish',
              description: 'Polished Ends for a Professional Touch',
              href: '/shop/products/edging-start-finish',
              icon: '/projects/photo35.jpg',
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
            { label: '12×12×24', description: 'Compact tapered', href: '/shop/products/planter-12-24', icon: '/projects/photo30.jpg' },
            { label: '15×15×30', description: 'Standard tapered', href: '/shop/products/planter-15-30', icon: '/projects/photo30.jpg' },
            { label: '18×18×36', description: 'Large tapered', href: '/shop/products/planter-18-36', icon: '/projects/photo30.jpg' },
          ],
        },
        {
          label: 'Rectangular Planters',
          items: [
            { label: '32×14×30', description: 'Tall rectangular', href: '/shop/products/planter-rect-32', icon: '/projects/photo30.jpg' },
            { label: '14×46×14', description: 'Wide rectangular', href: '/shop/products/planter-rect-46', icon: '/projects/photo30.jpg' },
            { label: '18×18×18', description: 'Cube rectangular', href: '/shop/products/planter-rect-18', icon: '/projects/photo30.jpg' },
          ],
        },
        {
          label: 'Tabletop Planters',
          items: [
            { label: '32×3.5×3.5', description: 'Long tabletop', href: '/shop/products/planter-tt-32', icon: '/projects/photo30.jpg' },
            { label: '12×3×3.5', description: 'Compact tabletop', href: '/shop/products/planter-tt-12', icon: '/projects/photo30.jpg' },
          ],
        },
        {
          label: 'Planter Accessories',
          items: [
            { label: 'Planter Risers', description: 'Elevate your planters', href: '/shop/products/planter-risers', icon: '/projects/photo30.jpg' },
            { label: 'Herb Markers', description: 'Label and identify your herbs', href: '/shop/products/herb-markers', icon: '/projects/photo30.jpg' },
            { label: 'Vegetable Markers', description: 'Organize and identify your garden', href: '/shop/products/veg-markers', icon: '/projects/photo30.jpg' },
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
              image: '/projects/photo32.jpg',
            },
            {
              label: 'Premium Address Sign',
              description: 'Elegant design for your home',
              href: '/shop/products/sign-premium',
              image: '/projects/photo36.jpg',
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
              image: '/projects/photo31.jpg',
            },
            {
              label: 'The Campfire',
              description: 'Intimate campfire experience',
              href: '/shop/products/firepit-campfire',
              image: '/projects/photo37.jpg',
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
              image: '/projects/photo38.jpg',
            },
            {
              label: 'Installation Video',
              description: "Watch how it's done",
              href: '/shop/installation#video',
              image: '/projects/photo39.jpg',
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
              icon: '/projects/photo40.jpg',
            },
            {
              label: 'What is COR-TEN Steel?',
              description: 'Learn about our premium material',
              href: '/shop/about-steel',
              icon: '/projects/photo41.jpg',
            },
            {
              label: 'Yeti Data Sheets',
              description: 'Technical specifications and details',
              href: '/shop/about-steel#data',
              icon: '/projects/photo42.jpg',
            },
            {
              label: 'Yeti Pro',
              description: 'Business pricing and benefits',
              href: '/shop/about-steel#pro',
              icon: '/projects/photo43.jpg',
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
              icon: '/homepage/featuredproject_night.jpg',
            },
            {
              label: 'Contact Us',
              description: 'Get in touch with our team',
              href: '/contact',
              icon: '/projects/photo44.jpg',
            },
          ],
        },
      ],
    },
  },
];
