import React from 'react';

// Service icons as SVG components
export const ServiceIcons = {
  CustomFabrication: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  StructuralWelding: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  OrnamentalWork: (
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
    id: 'custom-fabrication',
    name: 'Custom Fabrication',
    shortDescription: 'Tailored metal fabrication solutions designed to your exact specifications.',
    description: 'Our custom fabrication service brings your unique vision to life. We work with a wide range of metals and materials to create one-of-a-kind pieces that meet your exact requirements. From concept to completion, our experienced team ensures precision and quality in every project.',
    features: [
      'Precision cutting and shaping',
      'Custom design consultation',
      'Wide range of materials',
      'Quality craftsmanship',
      'On-time delivery'
    ],
    icon: ServiceIcons.CustomFabrication,
    href: '/services#custom-fabrication',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2-4 weeks (varies by complexity)',
    image: '/services/custom-fabrication.jpg',
    relatedServices: ['structural-welding', 'ornamental-work'],
  },
  {
    id: 'structural-welding',
    name: 'Structural Welding',
    shortDescription: 'Professional structural welding for buildings, bridges, and heavy-duty applications.',
    description: 'We specialize in structural welding for commercial and industrial projects. Our certified welders have extensive experience with steel structures, ensuring strength, durability, and code compliance. From skyscrapers to bridges, we deliver reliable structural solutions.',
    features: [
      'Certified welders',
      'Code-compliant work',
      'Heavy-duty applications',
      'Commercial & industrial',
      'Quality assurance'
    ],
    icon: ServiceIcons.StructuralWelding,
    href: '/services#structural-welding',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2-6 weeks (project dependent)',
    image: '/services/structural-welding.jpg',
    relatedServices: ['custom-fabrication'],
  },
  {
    id: 'ornamental-work',
    name: 'Ornamental Work',
    shortDescription: 'Beautiful decorative metalwork that combines artistry with functionality.',
    description: 'Transform your space with our ornamental metalwork services. We create stunning decorative pieces including gates, railings, fences, and custom art installations. Our team combines traditional craftsmanship with modern techniques to deliver breathtaking results.',
    features: [
      'Custom designs',
      'Gates and railings',
      'Decorative elements',
      'Artistic installations',
      'Finishing options'
    ],
    icon: ServiceIcons.OrnamentalWork,
    href: '/services#ornamental-work',
    pricingHint: 'Project-based pricing',
    estimatedTimeline: '2-3 weeks',
    image: '/services/ornamental-work.jpg',
    relatedServices: ['custom-fabrication'],
  },
];

// Helper function to get service by ID
export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id);
}

// Helper function to get related services
export function getRelatedServices(serviceId: string): Service[] {
  const service = getServiceById(serviceId);
  if (!service || !service.relatedServices) return [];
  
  return service.relatedServices
    .map(id => getServiceById(id))
    .filter((s): s is Service => s !== undefined);
}





