import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog | Yeti Welding',
  description:
    'News, tips, and project insights from Yeti Welding — custom fabrication and structural steel in Utah.',
  openGraph: {
    title: 'Blog | Yeti Welding',
    description:
      'News, tips, and project insights from Yeti Welding — custom fabrication and structural steel in Utah.',
    url: 'https://yetiwelding.com/blog',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://yetiwelding.com/feed.xml',
    },
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
