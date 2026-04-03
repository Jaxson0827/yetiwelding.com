import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogPostNotFound() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-20 md:py-28 text-center">
          <p className="text-accent-red font-semibold uppercase tracking-widest text-sm mb-4">Blog</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Post not found</h1>
          <p className="text-white/70 mb-10 leading-relaxed">
            This post does not exist or may have been moved. Try the blog index or head back home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex justify-center items-center px-6 py-3 bg-accent-red text-white font-semibold uppercase tracking-wide text-sm rounded-sm hover:bg-accent-red-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red"
            >
              Back to blog
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center items-center px-6 py-3 border-2 border-white/25 text-white font-semibold uppercase tracking-wide text-sm rounded-sm hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Home
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
