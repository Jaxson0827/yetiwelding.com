'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderPage() {
  const products = [
    {
      title: 'Dumpster Gates',
      description: 'Custom dumpster enclosure gates in standard or custom sizes. Choose your dimensions, style, finish, and mounting options.',
      href: '/order/dumpster-gates',
      cta: 'Configure Gate',
    },
    {
      title: 'Steel Plate Embeds',
      description: 'Custom steel embed plates with optional stud configurations. Specify dimensions, material, finish, and stud layout.',
      href: '/order/steel-embeds',
      cta: 'Configure Embed',
    },
    {
      title: 'Custom Pergolas',
      description: 'Shade structure kits in standard sizes. Choose dimensions, height, color, and roof design. Freight delivery available.',
      href: '/order/pergolas',
      cta: 'Design Pergola',
    },
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight">
              Order Custom Fabrication
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Configure your project below. We&apos;ll review each order before fabrication and contact you if we have any questions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 border-2 border-white/20 rounded-lg p-8 hover:border-[#DC143C]/50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                  {product.title}
                </h2>
                <p className="text-white/70 mb-6">{product.description}</p>
                <Link
                  href={product.href}
                  className="inline-block bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {product.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
