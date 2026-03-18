'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ServicesPreview from '@/components/ServicesPreview';
import { services } from '@/lib/servicesData';

const ServiceModal = dynamic(() => import('@/components/ServiceModal'));

export default function HomeServicesPreview() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <>
      <ServicesPreview onSelect={(serviceId) => setSelectedService(serviceId)} />
      <ServiceModal
        service={services.find((service) => service.id === selectedService) || null}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
