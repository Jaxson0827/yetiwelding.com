'use client';

import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

const shopLinks: FooterLink[] = [
  { label: 'Landscape Edging', href: '/shop/landscape-edging' },
  { label: 'Edging Accessories', href: '/shop/edging-accessories' },
  { label: 'Planters', href: '/shop/planters' },
  { label: 'Fire Pits', href: '/shop/fire-pits' },
  { label: 'Tree Rings', href: '/shop/tree-rings' },
  { label: 'Raised Beds', href: '/shop/raised-beds' },
  { label: 'The Sign', href: '/shop/the-sign' },
];

const supportLinks: FooterLink[] = [
  { label: 'Installation Guide', href: '/shop/installation' },
  { label: 'FAQ', href: '/shop/faq' },
  { label: 'What is COR-TEN Steel?', href: '/shop/about-steel' },
  { label: 'Contact Us', href: '/contact' },
];

const yetiLinks: FooterLink[] = [
  { label: 'About Yeti Welding', href: '/about' },
  { label: 'Custom Fabrication', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
];

export default function ShopFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-14 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link
              href="/shop"
              className="block text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              Yeti Steel Goods
            </Link>
            <p className="mt-3 text-sm text-white/60">
              Premium COR-TEN steel goods for the landscape — built to last,
              designed to age beautifully.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-accent-red hover:text-accent-red-light"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to yetiwelding.com
            </Link>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Yeti Welding" links={yetiLinks} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center">
          <p>© 2026 Yeti Welding. Steel Goods.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white">
              Terms
            </Link>
            <Link href="/accessibility" className="hover:text-white">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
