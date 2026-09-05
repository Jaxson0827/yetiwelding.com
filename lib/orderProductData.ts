const base = 'https://yetiwelding.com';

export interface OrderProductMeta {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  url: string;
  ogImage: string;
}

export const orderProducts: OrderProductMeta[] = [
  {
    id: 'dumpster-gates',
    name: 'Dumpster Gates',
    slug: 'dumpster-gates',
    shortDescription:
      'Custom steel dumpster enclosure gates. Standard or custom sizes, multiple finishes.',
    description:
      'Order custom dumpster gates for steel or masonry enclosures. Yeti Welding fabricates dumpster gates in Utah. Configure size, style, finish, and mounting online.',
    keywords: [
      'dumpster gates',
      'yeti welding dumpster gates',
      'steel dumpster enclosure gates',
      'custom dumpster gates utah',
    ],
    url: `${base}/order/dumpster-gates`,
    ogImage: '/dumpstergate/dumpster_gate_hero.png',
  },
  {
    id: 'steel-embeds',
    name: 'Steel Plate Embeds',
    slug: 'steel-embeds',
    shortDescription:
      'Custom steel embed plates with optional stud configurations. Specify dimensions, material, finish, and stud layout.',
    description:
      'Order custom steel embed plates from Yeti Welding. Specify dimensions, material, finish, and stud layout. Configure and order online. Utah-based fabrication.',
    keywords: [
      'steel embed plates',
      'yeti welding steel embeds',
      'custom steel embeds',
      'steel plate embeds utah',
    ],
    url: `${base}/order/steel-embeds`,
    ogImage: '/og/yeti-og.jpg',
  },
  {
    id: 'pergolas',
    name: 'Custom Pergolas',
    slug: 'pergolas',
    shortDescription:
      'Custom steel shade structure kits. Standard sizes, dimensions, height, color, and roof design. Freight delivery available.',
    description:
      'Order custom pergolas from Yeti Welding. Steel shade structure kits in standard sizes. Choose dimensions, height, color, and roof design. Freight delivery available. Utah.',
    keywords: [
      'custom pergolas',
      'yeti welding pergolas',
      'steel pergolas',
      'shade structure kits utah',
    ],
    url: `${base}/order/pergolas`,
    ogImage: '/og/yeti-og.jpg',
  },
  {
    id: 'garden-boxes',
    name: 'Custom Garden Boxes',
    slug: 'garden-boxes',
    shortDescription:
      'Bolt-together steel raised garden beds. Design your size, finish, and add-ons. Ships parcel most of the time.',
    description:
      'Order custom steel garden boxes from Yeti Welding. Bolt-together raised garden beds. Design your size, finish, and add-ons. Ships parcel for most sizes. Made in Utah.',
    keywords: [
      'garden boxes',
      'yeti welding garden boxes',
      'steel raised garden beds',
      'custom garden boxes utah',
    ],
    url: `${base}/order/garden-boxes`,
    ogImage: '/og/yeti-og.jpg',
  },
];

export function getOrderProductBySlug(slug: string): OrderProductMeta | undefined {
  return orderProducts.find((p) => p.slug === slug);
}
