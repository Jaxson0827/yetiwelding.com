// Re-export services data from centralized location for homepage compatibility
import React from 'react';
import { services as fullServices, ServiceIcons } from './servicesData';

// Simplified Service interface for homepage preview
export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  icon: React.ReactNode;
  href: string;
  image?: string;
}

// Export icons for use in homepage
export { ServiceIcons };

// Export simplified services array for homepage
export const services: Service[] = fullServices.map(service => ({
  id: service.id,
  name: service.name,
  shortDescription: service.shortDescription,
  icon: service.icon,
  href: service.href,
  image: service.image,
}));

