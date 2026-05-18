import React from 'react';

export const ServiceIcons = {
  Gates: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  ),
  Railing: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 6v12M21 6v12M3 18h18M8 6v12M13 6v12M18 6v12" />
    </svg>
  ),
  Monument: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L8 8H4l4 4-2 6h12l-2-6 4-4h-4L12 2zM9 20h6" />
    </svg>
  ),
  StructuralSteel: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ShadeStructures: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
    </svg>
  ),
  Ornamental: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  href: string;
  pricingHint?: string;
  estimatedTimeline?: string;
  image?: string;
  relatedServices?: string[];
}

export const services: Service[] = [
  {
    id: 'gates-enclosures',
    name: 'Custom Gates & Enclosures',
    shortDescription: 'Commercial dumpster gates, entry gates, and site enclosures built to last.',
    description: 'From commercial dumpster enclosures to custom property entry gates, we fabricate access control solutions engineered for long-term performance. Every gate is designed for your site conditions — including wind load, traffic frequency, hardware compatibility, and security requirements. We work from drawings or build from scratch.',
    features: [
      'Commercial dumpster and utility enclosures',
      'Single and double-leaf entry gates',
      'Automated gate operator preparation',
      'Powder coat and hot-dip galvanized finish options',
      'Heavy-gauge steel for high-traffic applications',
    ],
    icon: ServiceIcons.Gates,
    href: '/services#gates-enclosures',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2–3 weeks',
    image: '/projects/photo35.jpg',
    relatedServices: ['railing-systems', 'structural-steel'],
  },
  {
    id: 'railing-systems',
    name: 'Architectural Railing Systems',
    shortDescription: 'Interior and exterior railing for stairs, balconies, and commercial handrails.',
    description: 'We fabricate and install architectural railing systems for residential and commercial projects alike. From sweeping interior staircases to exterior balcony rail and ADA-compliant commercial handrail, every system is engineered to code, built to last, and finished to your spec. We work closely with GCs, architects, and homeowners from design through installation.',
    features: [
      'Interior and exterior stair railing',
      'Balcony and deck railing systems',
      'ADA-compliant commercial handrail',
      'Cable, glass, and solid infill options',
      'Custom post spacing and profile design',
    ],
    icon: ServiceIcons.Railing,
    href: '/services#railing-systems',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2–4 weeks',
    image: '/projects/photo40.jpg',
    relatedServices: ['gates-enclosures', 'ornamental-work'],
  },
  {
    id: 'monument-structures',
    name: 'Monument & Landmark Structures',
    shortDescription: 'Entrance arches, signage structures, and feature installations that make a statement.',
    description: 'Our highest-profile work — monumental metal structures that become defining features of a property or development. The Firefly Entrance Arch demonstrates what this looks like at full scale: 46,500 CNC-laser-cut holes, 3/16" Corten plate, 400 labor hours, hidden HSS structural core. We bring the same engineering discipline and creative ambition to every landmark project regardless of size.',
    features: [
      'Development and campus entrance arches',
      'Branded signage and wayfinding structures',
      'CNC laser-cut pattern work in any material',
      'Corten, stainless, and painted steel options',
      'Full structural engineering and code compliance',
    ],
    icon: ServiceIcons.Monument,
    href: '/services#monument-structures',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '4–8 weeks (scale-dependent)',
    image: '/projects/firefly-arch/gallery-01.JPG',
    relatedServices: ['structural-steel', 'gates-enclosures'],
  },
  {
    id: 'structural-steel',
    name: 'Structural Steel Fabrication',
    shortDescription: 'Beams, columns, embeds, and commercial framing components built to spec.',
    description: 'Commercial and industrial structural steel fabricated to your drawings and delivered ready for erection. We hold Clark County (Nevada) and DFCM (Utah) certifications, which means our shop work meets the code requirements for state and municipality projects. Whether it\'s a single custom embed plate or a full structural package, we bring the same rigor to every job.',
    features: [
      'Wide flange beams, HSS columns, and base plates',
      'Embed plates and connection hardware',
      'Clark County and DFCM certified shop',
      'Works from stamped engineer drawings',
      'Commercial and industrial scale capacity',
    ],
    icon: ServiceIcons.StructuralSteel,
    href: '/services#structural-steel',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2–6 weeks (project-dependent)',
    image: '/projects/photo38.jpg',
    relatedServices: ['monument-structures', 'gates-enclosures'],
  },
  {
    id: 'shade-structures',
    name: 'Shade Structures & Pergolas',
    shortDescription: 'Custom-engineered shade solutions for residential and commercial applications.',
    description: 'We design and fabricate shade structures and pergolas built to handle real wind loads and real Utah weather — not the flat-pack hardware store version. From residential backyard pergolas to large commercial shade canopies, every structure is engineered, welded in our shop, and installed by our crew.',
    features: [
      'Residential pergolas and patio covers',
      'Commercial parking and amenity shade canopies',
      'Wind and snow load engineering',
      'Powder coat in any color',
      'Fabric, polycarbonate, and open-frame options',
    ],
    icon: ServiceIcons.ShadeStructures,
    href: '/services#shade-structures',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2–4 weeks',
    image: '/projects/photo44.jpg',
    relatedServices: ['structural-steel', 'monument-structures'],
  },
  {
    id: 'ornamental-work',
    name: 'Ornamental & Decorative Work',
    shortDescription: 'Custom furniture, art pieces, decorative panels, and one-of-a-kind fabrication.',
    description: 'The category that doesn\'t fit a box. Custom metal furniture, interior art installations, decorative wall panels, fire features, and bespoke pieces of any description. If you have a concept — a sketch, a reference image, or just an idea — we can translate it into fabricated metal. This is where the shop\'s craftsmanship shows at its most expressive.',
    features: [
      'Custom metal furniture and fixtures',
      'Interior and exterior art installations',
      'Decorative wall panels and screens',
      'Fire features and water elements',
      'Works from client sketches or reference images',
    ],
    icon: ServiceIcons.Ornamental,
    href: '/services#ornamental-work',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2–3 weeks',
    image: '/projects/photo45.jpg',
    relatedServices: ['railing-systems', 'monument-structures'],
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id);
}

export function getRelatedServices(serviceId: string): Service[] {
  const service = getServiceById(serviceId);
  if (!service || !service.relatedServices) return [];
  return service.relatedServices
    .map(id => getServiceById(id))
    .filter((s): s is Service => s !== undefined);
}
