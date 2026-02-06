'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DumpsterGateConfigurator from '@/components/dumpster-gates/DumpsterGateConfigurator';

export default function DumpsterGatesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Configurator Section */}
      <section id="configurator" className="w-full pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none">
              Steel Dumpster Gate
            </h1>
            <p className="text-white/75 text-lg mt-4">
              Built to spec. Fabricated in Utah. Ready to install.
            </p>
          </div>
          <DumpsterGateConfigurator />
        </div>
      </section>

      {/* What's Included Section */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Fully welded steel frame</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Hinges installed</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Latch hardware included</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Shop drawings available on request</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/80">Fabricated by Yeti Welding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Notes Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-6">Installation Notes</h2>
          <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
            <p className="text-white/80 mb-4">
              These gates are intended for steel or masonry dumpster enclosures.
            </p>
            <p className="text-white/80">
              Concrete embeds and anchors not included unless specified.
            </p>
            <a
              href="#"
              className="inline-block mt-4 text-red-500 hover:text-red-400 text-sm transition-colors"
            >
              Download install guidelines (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-white text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can you make custom sizes?</h3>
              <p className="text-white/80">
                Yes, we can fabricate custom sizes. Please contact us for a quote on non-standard dimensions.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Do you ship or local pickup only?</h3>
              <p className="text-white/80">
                We offer both shipping and local pickup. Shipping costs will be calculated at checkout.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">What's the lead time?</h3>
              <p className="text-white/80">
                Standard lead time is 2-3 weeks. Powder coat adds 3-5 business days. Galvanized finishes may require extended lead time.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Are these code compliant?</h3>
              <p className="text-white/80">
                Yes, our gates are fabricated to meet standard building codes. For specific code requirements, please contact us.
              </p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-2">Can I mount to CMU?</h3>
              <p className="text-white/80">
                Yes, these gates can be mounted to CMU (concrete masonry units). Proper anchors and installation methods should be used.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}






